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
        dueDate: int
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

    const isInstructor = await db.checkIsInstructor(moduleId, username);
    if(!isInstructor){
        // The user is not an instructor for this course. 
        res.status(403).json({
            mesage: 'You are not an instructor for this course. '
        });
        return;
    }

    const name = req.body.name;
    const description  = req.body.description; 
    const timestamp = utils.timestamp(); 
    const deliverableId = 'D' + utils.URLSafe(utils.hash(name + timestamp.toString())); 


    const dueDate = req.dueDate;

    let errCode = 0;

    if(timestamp - dueDate <= 0){
        res.status(400).json({
            message: 'Your due date is in the past!'
        });
    }

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

    await db.createDeliverable(deliverableId, name, description, timestamp, dueDate, moduleId); 
    res.json({
        message: 'Success'
    });
}); 



/* 
    Endpoint for when the user wants to create an deliverable
    Request parameters:
        deliverableId: String
        moduleId: String
*/
router.post('/deleteDeliverable', async (req, res) => {
    let token = req.cookies.token; 
    let username = token === undefined? null: await db.getUsernameByToken(token); 
    let moduleId = req.moduleId;
    let deliverableId = req.deliverableId;

    if (username === null) {
        // The user havn't logged in, or the token has expired. 
        res.status(403).json({
            message: 'You have to sign in before making a deliverable. '
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

    const deliverable = await db.searchDeliverableById(deliverableId);

    if(deliverable === null){
        res.status(404).json({
            message: 'Deliverable not found'
        });
    }

    await db.deleteDeliverable(deliverableId);
    res.json({
        message: 'Success'
    });

}); 




module.exports = router;