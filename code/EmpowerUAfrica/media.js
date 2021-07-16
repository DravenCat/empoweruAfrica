const express = require('express');

const express = require('express'); 
const fs = require('fs').promises; 

const db = require('./db'); 

const utils = require('./utils');
const validation = require('./validation');
const admin = require('./admin'); 

const router = express.Router(); 


/* 
    Endpoint to create a video
    Request parameters:
        token: String
        moduleId: String
        name: String
        description: String
        url: String
*/
router.post('/createVideo', async (req, res) => {

    const timestamp = utils.timestamp(); 
    const name = req.name;
    const description = req.description;
    const moduleId = req.moduleId;
    const videoId = utils.URLSafe(utils.hash(name + timestamp.toString())); 
    const url = req.url;

    let token = req.cookies.token;
    let username = token === undefined? null: await db.getUsernameByToken(token); 
    if (username === null) {
        // The user havn't logged in, or the token has expired. 
        res.status(403).json({
            mesage: 'You have to sign in before you can modify course content. '
        });
        return;
    }

    //TODO: Check if user is instructor of course

    if(db.getModule(moduleId) === null){
        res.status(400).json({
            mesage: 'Module does not exist. '
        });
        return;
    }

    await db.createVideo(videoId, name, description, url, timestamp) ;
    await db.addContentIntoModule(video, videoId, moduleId);
    res.json({
        message: 'Success'
    });
}); 


/* 
    Endpoint to create a video
    Request parameters:
        token: String
        videoId: String
        name: String
        description: String
        url: String
*/
router.post('/editVideo', async (req, res) => {

    const name = req.name;
    const description = req.description;
    const videoId = req.videoId;
    const url = req.url;

    let token = req.cookies.token;
    let username = token === undefined? null: await db.getUsernameByToken(token); 
    if (username === null) {
        // The user havn't logged in, or the token has expired. 
        res.status(403).json({
            mesage: 'You have to sign in before you can modify course content. '
        });
        return;
    }

    //TODO: Check if user is instructor of course

    // TODO: need a database function to get video to check if it exists
    // if(db.getModule(moduleId) === null){
    //     res.status(400).json({
    //         mesage: 'Module does not exist. '
    //     });
    //     return;
    // }

    await db.editVideo(videoId, name, description, url) ;
    res.json({
        message: 'Success'
    });
}); 

module.exports = router; 