const express = require('express'); 

const db = require('./db'); 
const utils = require('./utils');
const validation = require('./validation');
const admin = require('./admin'); 

const router = express.Router(); 


/* 
    Endpoint for when the user wants to create an deliverable
    Request parameters:
        name: String
        description: String
        moduleId: String
*/
router.post('/createDeliverable', async (req, res) => {
    let token = req.cookies.token; 
    let username = token === undefined? null: await db.getUsernameByToken(token); 
    let moduleId = req.moduleId;

    if (username === null) {
        // The user havn't logged in, or the token has expired. 
        res.status(403).json({
            message: 'You have to sign in before making a deliverable. '
        });
        return;
    }

    if(!admin.isAdmin(username)){
        res.status(403).json({
            message: 'You have to be an admin to do this. '
        });
        return;
    }

    const name = req.body.name;
    const description  = req.body.description; 
    const timestamp = utils.timestamp(); 
    const deliverableId = 'D' + utils.URLSafe(utils.hash(title + timestamp.toString())); 

    let errCode = 0; 
    if ((errCode = validation.validateDeliverableName(name)) !== 0
        || (errCode = validation.validateDeliverableDesc(description)) !== 0) {
        res.status(400).json({
            message: validation.errMsgs[errCode]
        }); 
        return; 
    }

    if(getModule(moduleId) === null){
        res.status(404).json({
            message: 'Module not found'
        });
    }

    await db.createDeliverable(name, description, deliverableId, timestamp, moduleId); 
    res.json({
        message: 'Success'
    });
}); 




module.exports = router;