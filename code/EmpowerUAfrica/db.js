const mysql = require('mysql2/promise'); 
const fs = require('fs');


const port = '3306';
const host = 'localhost';
const database = 'EmpowerUAfricaDB';
let connection;

// Read MySQL cridentials
fs.readFile("./MySQLCredentials.json", async (err, data) => {
    if (err) {
        throw err;
    }
    let obj = JSON.parse(data); 
    user = obj.user; 
    password = obj.password; 

    // Establish connection to MySQL
    connection = await mysql.createConnection({
        host, 
        user,
        password, 
        port,
        database
    });
    console.log(`Connected to MySQL ${user}@${host}, database ${database}`);
});


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
    }

}; 


module.exports = db; 