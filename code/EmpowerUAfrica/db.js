const init = require('./db-init'); 
const config = require('./config');

let MySQLConnection;
let Neo4jDriver; 

/*
    When executed, removes all rows in Tokens table that are expired. 
*/
const removeExpiredTokens = async () => {
    await MySQLConnection.execute("DELETE FROM Tokens WHERE expiration_time < NOW(); "); 
}

(async () => {
    let connections = await init(); 
    MySQLConnection = connections.MySQL; 
    Neo4jDriver = connections.Neo4j; 

    setInterval(removeExpiredTokens, 60 * 1000 * config.tokens.cleanExpiredTokenInterval); 
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
        await MySQLConnection.execute(sql, data); 
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
        let response = await MySQLConnection.execute(sql, data);

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
        let response = await MySQLConnection.execute(sql, data);

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
        await MySQLConnection.execute(sql, data);
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
        await MySQLConnection.execute(sql, data);
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
        await MySQLConnection.execute(sql, data);
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
        let response = await MySQLConnection.execute(sql, data); 
        if (response[0].length === 0) {
            return null;
        }
        return response[0][0].username; 
    }, 
    /*
        This method is only here for demonstrating how a neo4j query would work, 
        and should not be called
    */
   neo4jExample: async () => {
        let session = Neo4jDriver.wrappedSession(); 
        let query = "CREATE (a:Example {Name: $name})"; 
        let params = {"name": "myname"};
        let result;
        try {
            result = await session.run(query, params);
        }
        catch (err) {
            console.error(err);
        }
        session.close();
   },

    /*
        params:
            - username: String
        returns:
            - JSON: the user's entire profile
    */
   getProfileByUsername: async(username) =>{

   },

   
    /*
        params:
            - username: String
        returns:
            - int: the user's type as an int
    */
   getUserType: async(username) =>{

   },

   /*
        params:
            - username: String
            - name: String
            - gender: int
            - birthdate: date
            - phone_number: String
            - industry: String
            - pfp_type: int
            - description: String
    */

   updateProfile: async(username, name, gender, birthdate, phone_number, industry, pfp_type, description) =>{


   },


   updateProfilePic: async() =>{
       
   }

}; 

process.on('exit', () => {
    MySQLConnection.end(); 
    Neo4jDriver.close(); 
}); 
module.exports = db; 