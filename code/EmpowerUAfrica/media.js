const express = require('express');

const express = require('express'); 
const fs = require('fs').promises; 

const db = require('./db'); 

const utils = require('./utils');
const validation = require('./validation');
const admin = require('./admin'); 

const router = express.Router(); 


/* 
    Endpoint to create a media
    Request parameters:
        token: String
        moduleId: String
        name: String
        description: String
        url: String
*/
router.post('/createMedia', async (req, res) => {

    const timestamp = utils.timestamp(); 
    const name = req.name;
    const description = req.description;
    const moduleId = req.moduleId;
    const mediaId = utils.URLSafe(utils.hash(name + timestamp.toString())); 
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

    await db.createVideo(mediaId, name, description, url, timestamp) ;
    await db.addContentIntoModule(media, mediaId, moduleId);
    res.json({
        message: 'Success'
    });
}); 

module.exports = router; 