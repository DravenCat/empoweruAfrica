const express = require('express'); 
const db = require('./db'); 
const utils = require('./utils')

const router = express.Router(); 

// The endpoint for when the user is signing up
router.post('/signup', async (req, res) => {
    console.log('[account]: signup request recieved. ');
    let username = req.body.username; 
    let email = req.body.email; 
    let password = utils.hash( req.body.password );
    let type = parseInt( req.body.type ); 

    // checking if the user is signing up with types 0, 1, or 2
    if (type !== 0 && type !== 1 && type !== 2) {
        res.status(400).json({
            "message": "Type should be an integer in the range [0, 2]"
        }); 
        return;
    }

    // creates the new account in the database
    try {
        await db.createNewAccount(
            username,
            email,
            password, 
            type
        ); 
    }
    catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            res.status(409).json({
                "message": "Username or email already exists."
            });
            return;
        }
    }

    // gets a token
    let token = utils.getToken();
    await db.addToken(token, username); 
    res.cookie('token', token, 
    {
        httpOnly: true
    }).status(200).json({"message": "success"});
});


// The endpoint for when the user is signing in
router.post('/signin', async (req, res) => {
    let id = req.body.id; 
    let password = utils.hash( req.body.password ); 

    let idtype; 
    if (id.indexOf('@') !== -1) {
        // id is an email
        idtype = 'email'; 
    }
    else {
        idtype = 'username';
    }

    let credentialsValid ; 
    try {
        // checking if the user's credentials are valid
        credentialsValid = await db.credentialsMatch(idtype, id, password);
        if (credentialsValid === null) {
            res.status(404).json({
                "message": "Username or email not found."
            });
            return; 
        }
    }
    catch (err) {
        console.warn(err);
        res.status(500).json({
            "message": "Unknown Error"
        });
        return; 
    }

    // if the user's credentials are invalid
    if (!credentialsValid) {
        // return a status of 403 with invaid credentials message
        res.status(403).json(
            {"message": "Email and password does not match. "}
        );
        return; 
    }

    let username = idtype === 'email' ? await db.usernameForEmail(id): id; 

    // gets a token
    let token = utils.getToken();
    res.cookie('token', token, 
    {
        httpOnly: true
    })

    // adds a token for the user in the database
    await db.addToken(token, username);
    res.status(200).json({
        "message": "Sign in success.", 
        "username": username
    });
    
});


// The endpoint for when the user is signing out
router.post('/signout', async (req, res) => {
    let token = req.cookies.token;

    // Remove token from tokenToUsername
    if (token !== undefined) {
        await db.delToken(token);
    }
    
    res.clearCookie('token').json({"message": "success"});
});


// The endpoint for when the user is updating credentials
router.post('/updateCredentials', async (req, res) => {
    let type = req.body.type;
    let newCredential = req.body.new;
    let token = req.cookies.token; 
    let username = token === undefined ? null: await db.getUsernameByToken(token); 

    // The user is not signed in, or the token is not valid.
    if (username === null) {
        res.status(403).clearCookie('token').json({
            "message": "You have to sign in before updating your email or password."
        });
        return; 
    }

    // type field is invalid
    if (type !== 'email' && type !== 'password') {
        res.status(400).json({
            "message": "The 'type' field is expected to be either 'email' or 'password'. "
        }); 
        return; 
    }
    if (type === 'password') {
        newCredential = utils.hash(newCredential); 
    }

    await db.updateCredentials(type, username, newCredential);
    res.status(200).json({"message": "success"});
});


module.exports = router; 