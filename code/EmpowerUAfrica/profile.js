const express = require('express'); 
const fs = require('fs').promises; 

const db = require('./db'); 
const utils = require('./utils');
const validation = require('./validation');

const router = express.Router(); 

router.get('/getProfile', async (req, res) => {

    let username = req.body.username; 
    let type = await db.getUserType(username);

    if(type !== null){
        res.json({
            username, 
            type,
            profile: await db.getProfileByUsername(username, type)
        });
    }else{
        res.status(404).json({message: "User does not exist"});
    }

});

router.get('/getProfilePic', async (req, res) => {
    let username = req.body.username; 
    let type = await db.getUserType(username);

    if(type !== null){
        let pfp_type = (await db.getProfileByUsername(username, type)).pfp_type;

        if(pfp_type === 1){
            res.json({url: "../client/public/profilepics/" + username + ".jpg"});
        }else if(pfp_type === 2){
            res.json({url:"../client/public/profilepics/" + username + ".png"});
        }else{
            res.json({url:"../client/public/profilepics/default_profile_pic.jpg"});
        }

    }else{
        res.status(404).json({message: "User does not exist"});
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
    let type = await db.getUserType(username);
    if(type !== null){

        await db.updateProfile(username, updates, type);

        res.status(200).json({message: "Success"});

    }else{
        res.status(404).json({message: "User does not exist"});
    }

    
    
}); 

router.post('/updateProfilePic', async (req, res) => {



}); 

module.exports = router;