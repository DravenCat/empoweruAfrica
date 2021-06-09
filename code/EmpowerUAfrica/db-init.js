const readFile = require('fs').promises.readFile; 
const mysql = require('mysql2/promise'); 
const objHasFields = require('./utils').objHasFields; 

const credentialFilePath = './MySQLCredentials.json';

const port = '3306'; 
const database = 'EmpowerUAfricaDB'; 
const tableStructures = {
    Login: `
    CREATE TABLE Login (
        username    VARCHAR(31) NOT NULL UNIQUE,
        password    TEXT NOT NULL,
        email    VARCHAR(255) NOT NULL UNIQUE,
        first_name    TEXT NOT NULL,
        last_name    TEXT,
        type    INTEGER NOT NULL,
        PRIMARY KEY(username)
    )
    `
}


const getConnectionInfo = async () => {

    let connectionInfo = {
        host: '',
        user: '',
        password: '',
        database,
        port
    }

    // Read MySQLCredentials.json
    let fileContent; 
    try {
        fileContent = await readFile(credentialFilePath);
    }
    catch (err) {
        // File does not exist.
        if (err.code === 'ENOENT') {
            console.error(`${credentialFilePath} not found. Please create it as said in README.md. `);
            process.exit();
        }
    }

    // Parse file content
    let credentialObj; 
    try {
        credentialObj = JSON.parse(fileContent); 
    }
    catch (err) {
        // File content cannot be parsed by JSON
        if (err instanceof SyntaxError) {
            console.error(`${credentialFilePath} is not in correct JSON form. Please edit it as said in README.md`);
            process.exit();
        }
    }

    if (!objHasFields(credentialObj, ['host', 'user', 'password'])) {
        console.error(`${credentialFilePath} does not contain required infoemation. Please fill it in as said in README.md`); 
        process.exit();
    }

    Object.assign(connectionInfo, credentialObj); 
    return connectionInfo; 
}

const getConnection = async (connectionInfo) => {
    let connection;
    try {
        connection = await mysql.createConnection(connectionInfo); 
    }
    catch (err) {
        // MySQL server unavalible
        if (err.code === 'ECONNREFUSED') {
            console.error(`Failed to connect to MySQL database. Please make sure you have installed MySQL and your MySQL server is running properly. `); 
            process.exit(); 
        }
        // No database named ${database}
        else if (err.code === 'ER_BAD_DB_ERROR') {
            connection = createDatabase(connectionInfo, database);
        }
        else {
            throw error;
        }
    }
    return connection; 
}

const createDatabase = async (connectionInfo, newDatabase ) => {
    // Make a clone of connectionInfo, remove the database field. 
    connectionInfo = Object.assign({}, connectionInfo); 
    delete connectionInfo.database; 

    // Create new database
    console.log(`Creating database ${newDatabase}`);
    let connection = await mysql.createConnection(connectionInfo); 
    await connection.execute(`CREATE DATABASE ${newDatabase}`); 

    // Switch to new database
    await connection.changeUser({database: newDatabase}); 
    console.log(`Switched to database ${newDatabase}`); 

    return connection; 
}

const checkTables = async (connection) => {
    let result = await connection.execute(`SHOW TABLES FROM ${database}`); 
    let tables = result[0].map((row) => {return Object.values(row)[0]});
    
    for (table in tableStructures) {
        if (tables.indexOf(table) === -1) {
            console.log(`Creating Table ${table}`);
            await connection.execute(tableStructures[table]);
        }
    }
}
const init = async () => {
    const connectionInfo = await getConnectionInfo(); 
    const connection = await getConnection(connectionInfo); 
    await checkTables(connection);

    return connection; 
}

module.exports = init; 