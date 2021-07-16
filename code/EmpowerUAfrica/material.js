const express = require('express');

const express = require('express'); 
const fs = require('fs').promises; 

const db = require('./db'); 

const utils = require('./utils');
const validation = require('./validation');
const admin = require('./admin'); 

const router = express.Router(); 


/* 
    Endpoint to create a reading
    Request parameters:
        token: String
        moduleId: String
        name: String
        description: String
        tag: file
*/
router.post('/createReading', async (req, res) => {

    const timestamp = utils.timestamp(); 
    const name = req.name;
    const description = req.description;
    const moduleId = req.moduleId;
    const readingId = utils.URLSafe(utils.hash(name + timestamp.toString())); 


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
            mesage: 'You have to sign in before you can modify course content. '
        });
        return;
    }

    const isInstructor = await db.checkIsInstructor(moduleId, username);
    if(!isInstructor){
        // The user is not an instructor for this course. 
        res.status(403).json({
            mesage: 'You are not an instructor for this course. '
        });
        return;
    }


    if(db.getModule(moduleId) === null){
        res.status(400).json({
            mesage: 'Module does not exist. '
        });
        return;
    }

    let newReading = req.files[Object.keys(req.files)[0]]; 
    let extensionNames = [null, '.pdf', '.txt'];
    let extension = newReading.name.slice(-3) === 'png'? 2: 1;
    let path = 'client/public/files/users/' + username + extensionNames[extension];
    try {
        await newReading.mv(path); 
    }
    catch (err) {
        console.error(err); 
        res.status(500).json({
            message: 'Error when moving the file onto server. '
        });
        return; 
    }
    await db.createReading(readingId, name, description, path, timestamp) ;
    await db.addContentIntoModule(reading, readingId, moduleId);
    res.json({
        message: 'Success'
    });
}); 

module.exports = router; 