const fs = require('fs').promises; 
const mysql = require('mysql2/promise'); 
const stringFormat = require('string-format');

const objHasFields = require('./utils').objHasFields; 
const config = require('./config');

const credentialFilePath = './db/credentials.json';
const tableStructDirPath = './db/Tables/';
const eventDirPath = './db/Events/';

const port = '3306'; 
const database = 'EmpowerUAfricaDB'; 

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
        fileContent = await fs.readFile(credentialFilePath);
    }
    catch (err) {
        // File does not exist.
        if (err.code === 'ENOENT') {
            console.error(`[db-init]: ${credentialFilePath} not found. Please create it as said in README.md. `);
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
            console.error(`[db-init]: ${credentialFilePath} is not in correct JSON form. Please edit it as said in README.md`);
            process.exit();
        }
    }

    if (!objHasFields(credentialObj, ['host', 'user', 'password'])) {
        console.error(`[db-init]: ${credentialFilePath} does not contain required infoemation. Please fill it in as said in README.md`); 
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
            console.error(`[db-init]: Failed to connect to MySQL database. Please make sure you have installed MySQL and your MySQL server is running properly. `); 
            process.exit(); 
        }
        // No database named ${database}
        else if (err.code === 'ER_BAD_DB_ERROR') {
            connection = createDatabase(connectionInfo, database);
        }
        else {
            throw err;
        }
    }
    return connection; 
}

const createDatabase = async (connectionInfo, newDatabase ) => {
    // Make a clone of connectionInfo, remove the database field. 
    connectionInfo = Object.assign({}, connectionInfo); 
    delete connectionInfo.database; 

    // Create new database
    console.log(`[db-init]: Creating database ${newDatabase}`);
    let connection = await mysql.createConnection(connectionInfo); 
    await connection.execute(`CREATE DATABASE ${newDatabase}`); 

    // Switch to new database
    await connection.changeUser({database: newDatabase}); 
    console.log(`[db-init]: Switched to database ${newDatabase}`); 

    return connection; 
}

const checkTables = async (connection) => {
    let result = await connection.execute(`SHOW TABLES FROM ${database}`); 
    let tables = result[0].map((row) => {return Object.values(row)[0]});

    // Search for all .sql files under tableStructDir
    let allFiles = await fs.readdir(tableStructDirPath);
    let tableStructs = {}; 
    for (let file of allFiles) {
        let len = file.length; 
        if (len > 4 && file.slice(len - 4, len) === '.sql') {
            tableStructs[file.slice(0, len - 4)] = null;
        }
    }

    // Traverse through all .sql files, if the table does not exist, create it.
    for (let tableName in tableStructs) {
        // If the table is not present
        if (tables.indexOf(tableName) === -1) {
            let tableStruct = await fs.readFile(tableStructDirPath + tableName + '.sql');
            await connection.execute(tableStruct.toString()); 
            console.log(`[db-init]: Table ${tableName} created. `);
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