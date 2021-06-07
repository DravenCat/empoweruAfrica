const express = require('express'); 
const crypto = require('crypto'); 
const db = require('./db'); 
const utils = require('./utils')

const router = express.Router(); 

let tokenToUsrname = {

}

router.post('/signup', async (req, res) => {
    
    let username = req.body.username; 
    let email = req.body.email; 
    let password = utils.hash( req.body.password );
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

    let token = crypto.randomBytes(30).toString('hex');
    res.cookie('token', token, 
    {
        httpOnly: true
    });
    res.status(200).end();
    tokenToUsrname[token] = username;
    
});

router.post('/signin', async (req, res) => {
    let id = req.body.id; 
    let password = utils.hash( req.body.password ); 

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

    res.cookie('token', crypto.randomBytes(30).toString('hex'), 
    {
        httpOnly: true
    })
    res.status(200).end();
    
});


module.exports = router; 