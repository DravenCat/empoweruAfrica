const express = require('express'); 
const db = require('./db'); 
const utils = require('./utils');
const validation = require('./validation');

const router = express.Router(); 


router.post('/signup', async (req, res) => {
    console.log('[account]: signup request recieved. ');
    let username = req.body.username; 
    let email = req.body.email; 
    let password = utils.hash( req.body.password );
    let type = parseInt( req.body.type ); 

    if (type !== 0 && type !== 1 && type !== 2) {
        res.status(400).json({
            "message": "Type should be an integer in the range [0, 2]"
        }); 
        return;
    }

    // Check whether all the entries are valid.
    let validationFuncs = [validation.validateUsername, validation.validateEmail, validation.validatePassword];
    let entries = [username, email,  req.body.password]; 
    for (let i = 0; i < entries.length; i++) {
        let errCode = validationFuncs[i](entries[i]); 
        if (errCode !== 0) {
            res.status(409).json({
                "message": validation.errMsgs[errCode]
            });
            return;
        }
    } 

    try {
        await db.createNewAccount(
            username,
            email,
            password, 
            type
        ); 
        await db.addUserProfile(username);
    }
    catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            // If email or username is duplicated. 
            let errMsg = '';
            let emailExists = (await db.usernameForEmail(email)) !== null; 
            if (emailExists) {
                errMsg = 'Email already exists. Try a new one. '
            }
            else {
                errMsg = 'Username already exists. Try a new one. '
            }
            res.status(409).json({
                "message": errMsg
            });
            return;
        }
    }

    let token = utils.getToken();
    await db.addToken(token, username); 
    res.cookie('token', token, 
    {
        httpOnly: true
    }).status(200).json({"message": "success"});
});

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

    if (!credentialsValid) {
        res.status(403).json(
            {"message": "Email and password does not match. "}
        );
        return; 
    }

    let username = idtype === 'email' ? await db.usernameForEmail(id): id; 

    let token = utils.getToken();
    res.cookie('token', token, 
    {
        httpOnly: true
    })
    await db.addToken(token, username);
    res.status(200).json({
        "message": "Sign in success.", 
        "username": username
    });
    
});

router.post('/signout', async (req, res) => {
    let token = req.cookies.token;

    // Remove token from tokenToUsername
    if (token !== undefined) {
        await db.delToken(token);
    }
    
    res.clearCookie('token').json({"message": "success"});
});

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

    // Validate newCredential
    let errCode
    if (type === 'password') {
        errCode = validation.validatePassword(newCredential); 
        
        // Hash password
        newCredential = utils.hash(newCredential); 
    }
    else {
        // Check whether the new email is used. 
        if ((await db.usernameForEmail(newCredential)) !== null) {
            res.status(409).json({
                "message": "Email already exists. Try a new one. "
            });
            return;
        }
        errCode = validation.validateEmail(newCredential); 
    }
    // Send error message if newCredential is invalid. 
    if (errCode !== 0) {
        res.status(400).json({
            "message": validation.errMsgs[errCode]
        });
        return; 
    }

    await db.updateCredentials(type, username, newCredential);
    res.status(200).json({"message": "success"});
});
module.exports = router; 