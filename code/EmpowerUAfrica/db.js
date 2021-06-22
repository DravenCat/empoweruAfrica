const init = require('./db-init'); 
const config = require('./config');

let connection;


/*
    When executed, removes all rows in Tokens table that are expired. 
*/
const removeExpiredTokens = async () => {
    await connection.execute("DELETE FROM Tokens WHERE expiration_time < NOW(); "); 
}

(async () => {
    connection = await init();
    setInterval(removeExpiredTokens, 60 * 1000 * config.tokens.cleanExpiredTokenInterval); 
    console.log('[db]: connected to MySQL server');
})();

const db = {

    /*
        params:
            - username: String
            - email: String
            - password: String
            - type: int
            - firstname: String
            - lastname: String (optional, counld be undefined, if so don't put it into the table.)
        returns:
            nothing
        
        Creates a new account eneity in the account table.
    */
    createNewAccount: async (username, email, password, type) => {
        let sql = 'INSERT INTO Accounts(username, email, password, type)\
        VALUES(?, ?, ?, ?);'; 
        let data = [username, email, password, type]; 
        await connection.execute(sql, data); 
    }, 

    /*
        params:
            - idtype: "username" or "email", indicates the type of id.
            - id: String, could be an email or a username, depends on idtype. 
            - password: String
        
        returns:
            - true, if the credentials match
            - false o\w
            - null, if the username does not exist
    */
    credentialsMatch: async (idtype, id, password) => {
        let sql = `SELECT password FROM Accounts WHERE ${idtype} = ?`; 
        let data = [id]; 
        let response = await connection.execute(sql, data);

        if (response[0].length === 0) {
            return null;
        }
        let actualPasswd = response[0][0].password; 
        return actualPasswd === password; 
    },

    /*
        params:
            - email: String, the email to be searched for
        returns:
            - the username of user with email = email, if the user is found
            - null o\w 
    */
    usernameForEmail: async (email) => {
	    let sql = 'SELECT username FROM Accounts WHERE email = ?';
        let data = [email];
        let response = await connection.execute(sql, data);

        if (response[0].length === 0) {
            return null;
        }
        else {
            return response[0][0].username; 
        }
    }, 

    /*
        params:
            - type: String, either 'email' or 'password'
            - username: String, the user who requested the update
            - newCredential: String, the new email or password, depending on type
        returns:
            nothing
    */
    updateCredentials: async (type, username, newCredential) => {
        let sql = `UPDATE Accounts SET ${type} = ? WHERE username = ?`; 
        let data = [newCredential, username];
        await connection.execute(sql, data);
   },
   /*
        params:
            - token: String, the user's token 
            - username: String
            - expirationTime: Number, int
        returns:
            nothing
   */
    addToken: async (token, username) => {
        let sql = `INSERT INTO Tokens(token, username, expiration_time) \
        VALUES(?, ?, NOW() + INTERVAL ${config.tokens.tokenExpirationTime});`;
        console.log(sql);
        let data = [token, username]; 
        await connection.execute(sql, data);
    }, 
   
    /*
        params: 
            - token: String, the token to be deleted. 
        returns:
            nothing
    */
    delToken: async (token) => {
        let sql = 'DELETE FROM Tokens WHERE token=?'; 
        let data = [token]; 
        await connection.execute(sql, data);
    }, 

    /*
        params:
            - token: String, the token to be queried. 
        returns:
            - username: String, the username to corresponding to the token. 
            - null if the token is not found in the database, or has expired. 
    */
    getUsernameByToken: async (token) => {
        let sql = 'SELECT username FROM Tokens WHERE token = ? AND expiration_time > NOW()';
        let data = [token]; 
        let response = await connection.execute(sql, data); 
        if (response[0].length === 0) {
            return null;
        }
        return response[0][0].username; 
    }
}; 


module.exports = db; 