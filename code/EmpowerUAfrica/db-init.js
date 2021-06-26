/*
    This file is responsible for setting up database connections / drivers (MySQL, Neo4j)
    And creating required database & tables if they arn't present.
    Connection credentials and host info will be read from ./db/credentials.json
*/

const fs = require('fs').promises; 
const mysql = require('mysql2/promise'); 
const neo4j = require('neo4j-driver'); 

const objHasFields = require('./utils').objHasFields; 

const credentialFilePath = './db/credentials.json';
const tableStructDirPath = './db/Tables/';
const port = '3306'; 
const database = 'EmpowerUAfricaDB'; 

const getConnectionInfo = async () => {

    let connectionInfo = {
        MySQL: {
            host: '',
            user: '',
            password: '',
            database,
            port
        },
        Neo4j: {
            uri: '', 
            user: '', 
            password: ''
        }
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
        console.error(err); 
        process.exit(1);
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

    if (!objHasFields(credentialObj['MySQL'], ['host', 'user', 'password']) || 
        !objHasFields(credentialObj['Neo4j'], ['uri', 'user', 'password'])) {
        console.error(`[db-init]: ${credentialFilePath} does not contain required information. Please fill it in as said in README.md`); 
        process.exit();
    }

    Object.assign(connectionInfo.MySQL, credentialObj.MySQL); 
    Object.assign(connectionInfo.Neo4j, credentialObj.Neo4j); 
    return connectionInfo; 
}

const getMySQLConnection = async (connectionInfo) => {
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
            connection = createMySQLDatabase(connectionInfo, database);
        }
        else {
            throw err;
        }
    }
    console.log('[db-init]: Connected to MySQL Server.');
    return connection; 
}

const createMySQLDatabase = async (connectionInfo, newDatabase ) => {
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

const getNeo4jDriver = async (driverInfo) => {
    let driver; 
    const uri = driverInfo.uri; 
    const user = driverInfo.user; 
    const password = driverInfo.password; 

    try {
        driver = neo4j.driver(uri, neo4j.auth.basic(user, password)); 
        await driver.verifyConnectivity();
    }
    catch (err) {
        console.error('[db-init]: Error creating Neo4j driver with given credentials. ');
        console.error(err); 
        process.exit(1);
    }
    
    try {
        let session = driver.session(); 
        await session.run(`CREATE DATABASE ${database} IF NOT EXISTS`); 
        await session.close();
    }
    catch (err) {
        console.error(`[db-init]: Error creating Neo4j database ${database}.`); 
        console.error(err); 
        process.exit(1); 
    }
    // Session object from this method will be operating on ${database} database. 
    driver.wrappedSession = () => {return driver.session({database})};
    
    console.log('[db-init]: Connected to Neo4j Server.');
    return driver; 
}

const init = async () => {
    const connectionInfo = await getConnectionInfo(); 
    const MySQLPromise = getMySQLConnection(connectionInfo.MySQL);
    const Neo4jPromise = getNeo4jDriver(connectionInfo.Neo4j); 
    let MySQLConnection, Neo4jDriver;

    try {
        [MySQLConnection, Neo4jDriver] = await Promise.all([MySQLPromise, Neo4jPromise]); 
    }
    catch (err) {
        console.error(err); 
        process.exit(1); 
    }
    process.on('exit', () => {
        MySQLConnection.end(); 
        Neo4jDriver.close(); 
    }); 
    await checkTables(MySQLConnection);

    
    return {
        MySQL: MySQLConnection,
        Neo4j: Neo4jDriver
    }; 
}

module.exports = init; 