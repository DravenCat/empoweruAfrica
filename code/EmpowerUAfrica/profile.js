const express = require('express'); 
const fs = require('fs/promises'); 

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
            profile: await db.getProfileByUsername(username)
        });
    }else{
        res.status(404).json({message: "User does not exist"});
    }

});

router.get('/getProfilePic', async (req, res) => {
    let username = req.body.username; 
    let type = await db.getUserType(username);

    if(type !== null){
        let pfp_type = (await db.getProfileByUsername(username)).pfp_type;

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

    let username = req.body.username; 
    let type = await db.getUserType(username);
    if(type !== null){

        await db.updateProfile(
            req.body.username,
            req.body.name,
            req.body.gender,
            req.body.birthdate,
            req.body.phone_number,
            req.body.industry,
            req.body.pfp_type,
            req.body.description);

        res.status(200).json({message: "Success"});

    }else{
        res.status(404).json({message: "User does not exist"});
    }

    
    
}); 

router.post('/updateProfilePic', async (req, res) => {



}); 

module.exports = router;