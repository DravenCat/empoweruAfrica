const express = require('express'); 
const db = require('./db'); 
const utils = require('./utils')

const router = express.Router(); 

let tokenToUsrname = {}

router.post('/signup', async (req, res) => {
    console.log('[account]: signup request recieved. ');
    let username = req.body.username; 
    let email = req.body.email; 
    let password = utils.hash( req.body.password );
    let type = parseInt( req.body.type ); 

    if (type !== 0 && type !== 1 && type !== 2) {
        res.status(400).json({
            "message": "type should be an integer in the range [0, 2]"
        }); 
        return;
    }

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
                "message": "Duplicated email or username"
            });
            return;
        }
    }

    let token = utils.getToken();
    tokenToUsrname[token] = username;
    res.cookie('token', token, 
    {
        httpOnly: true
    }).status(200).end();
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
        res.status(500).end();
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
    tokenToUsrname[token] = username; 
    res.status(200).end();
    console.log(tokenToUsrname);
    
});


module.exports = router; 