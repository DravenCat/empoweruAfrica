const express = require('express'); 
const fs = require('fs').promises; 

const db = require('./db'); 
const utils = require('./utils');
const validation = require('./validation');

const router = express.Router(); 

router.get('/getProfile', async (req, res) => {
    let username = req.query.username; 
    let abstract = await db.getUserAbstract(username);
    let profile; 
    if(abstract !== null){
        let {type, email} = abstract;
        profile = await db.getProfileByUsername(username);
        profile.tags = []; // TODO: call neo4j db func to get tags. 
        profile.email = email; 
        res.json({
            username, 
            type,
            profile
        });
    }else{
        res.status(404).json({message: "User does not exist"});
        return; 
    }

});


router.post('/updateProfile', async (req, res) => {
    let token = req.cookies.token; 
    let username = token === undefined? null: await db.getUsernameByToken(token); 

    if (username === null) {
        // The user havn't logged in, or the token has expired. 
        res.status(403).json({
            mesage: 'You have to sign in before you edit your profile. '
        });
        return;
    }
    let updates = req.body.updates; 
    let abstract = await db.getUserAbstract(username);
    if(abstract !== null){

        await db.updateProfile(username, updates);

        res.status(200).json({message: "Success"});

    }else{
        res.status(404).json({message: "User does not exist"});
    }

    
    
}); 

router.post('/addTag', async (req, res) =>{

    let token = req.cookies.token; 
    let username = token === undefined? null: await db.getUsernameByToken(token); 

    if (username === null) {
        // The user havn't logged in, or the token has expired. 
        res.status(403).json({
            mesage: 'You have to sign in before you edit your profile. '
        });
        return;
    }

    let hasTag = db.hasTag(username, req.tag);
    if(!hasTag){
        db.addTag(username, req.tag);
        res.status(200).json({message: "Success"});
    }else{
        res.status(405).json({message: "User already has tag"});
    }

});


router.post('/removeTag', async (req, res) =>{

    let token = req.cookies.token; 
    let username = token === undefined? null: await db.getUsernameByToken(token); 

    if (username === null) {
        // The user havn't logged in, or the token has expired. 
        res.status(403).json({
            mesage: 'You have to sign in before you edit your profile. '
        });
        return;
    }

    let hasTag = db.hasTag(username, req.tag);
    if(!hasTag){
        res.status(405).json({message: "User already does not have tag"});
    }else{
        db.deleteTag(username, req.tag);
        res.status(200).json({message: "Success"});
    }
});




router.post('/updateProfilePic', async (req, res) => {

    if (!req.files || Object.keys(req.files).length === 0) {
        // No file was given in the request
        res.status(400).json({
            message: 'No file found in the request body. '
        });
        return; 
    }

    let token = req.cookies.token;
    let username = token === undefined? null: await db.getUsernameByToken(token); 
    if (username === null) {
        // The user havn't logged in, or the token has expired. 
        res.status(403).json({
            mesage: 'You have to sign in before you change your profile picture. '
        });
        return;
    }

    let newImg = req.files[Object.keys(req.files)[0]]; 
    let extensionNames = [null, '.jpg', '.png'];
    let extension = newImg.name.slice(-3) === 'png'? 2: 1;
    try {
        await newImg.mv('client/public/profilepics/users/' + username + extensionNames[extension]); 
    }
    catch (err) {
        console.error(err); 
        res.status(500).json({
            message: 'Error when moving the file onto servser. '
        });
        return; 
    }
    await db.updateProfile(username, {pfp_type: extension}); 
    res.json({
        message: 'Success'
    });
}); 

module.exports = router;