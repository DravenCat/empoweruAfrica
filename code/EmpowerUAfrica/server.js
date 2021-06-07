'use strict'; 
const Express = require('express');
const Utils = require('./utils');
const db = require('./db');
const crypto = require('crypto'); 


const PORT = 5000; 

const app = Express(); 

/*
    '/api/signup': ['email', 'password'] means that
    route '/api/signup' is expecting the request body to have fields
    'email' and 'password'. 

    If a route is not present here, it means the route does not specify
    which fields are expected. 
*/
const expectedFields = {
    '/api/signup': ['username', 'email', 'password', 'type', 'firstname'], 
    "/api/signin": ['id', 'password'],
    '/api/testcreate': ['username', 'password']
};

// parse the request body as json. 
app.use(Express.json());

// checks whether the expected fields are present in the request body
app.use((req, res, next) => {
    // If the required field is not specified
    if (!(req.path in expectedFields)) {
        next();
        return;
    }
    
    if (! Utils.objHasFields(req.body, expectedFields[req.path])) {
        res.status(400).json(
            {"message": `Bad request: expecting fields [${expectedFields[req.path].join(', ')}] in request body.`}
        );
        return;
    }
    next();
}); 

app.get("/", (req, res) => {
    res.send('Hello World!');
});

// Sign up request handler
app.post("/api/signup", async (req, res) => {
    
    let username = req.body.username; 
    let email = req.body.email; 
    let password = req.body.password;
    let type = req.body.type;
    let firstname = req.body.firstname; 
    let lastname = req.body.lastname;
    
    if (lastname === undefined) {
        lastname = null; 
    }

    try {
        await db.createNewAccount(
            username,
            email,
            password, 
            type,
            firstname, 
            lastname
        ); 
    }
    catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            res.status(409).json({
                "message": "Duplicated email or username"
            })
        }
    }
    res.status(200).end();
    
});


app.post("/api/signin", async (req, res) => {
    let id = req.body.id; 
    let password = req.body.password; 

    let credentialsValid ; 

    try {
        credentialsValid = await db.credentialsMatch('email', id, password);
    }
    catch (err) {
        console.warn(err);
    }

    if (!credentialsValid) {
        res.status(403).json(
            {"message": "Email and password does not match. "}
        );
        return; 
    }
    res.status(200).end();
})

app.listen(PORT, () => console.log(`Server started on port ${PORT}`)); 