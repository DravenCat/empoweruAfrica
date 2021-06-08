const mysql = require('mysql2/promise'); 
const fs = require('fs');

const init = require('./db-init'); 

let connection;
(async () => {
    connection = await init();
    console.log('connected to MySQL server');
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
    createNewAccount: async (username, email, password, type, firstname, lastname) => {
        let sql = 'INSERT INTO Login(username, email, password, type, first_name, last_name)\
        VALUES(?, ?, ?, ?, ?, ?);'; 
        let data = [username, email, password, type, firstname, lastname]; 
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
    */
    credentialsMatch: async (idtype, id, password) => {
        let sql = `SELECT password FROM Login WHERE ${idtype} = ?`; 
        let data = [id]; 

        let actualPasswd = (await connection.execute(sql, data))[0][0].password; 
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
	    let sql = 'SELECT username FROM Login WHERE email = ?';
        let data = [email];
        let username = (await connection.execute(sql, data))[0][0].username;
        if(username){
            return username;
        }else{
            return null;
        }
    }

}; 


module.exports = db; 