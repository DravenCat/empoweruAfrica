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
        total_points: String
        moduleId: String
        dueDate: int
*/
router.post('/createDeliverable', async (req, res) => {
    let token = req.cookies.token; 
    let username = token === undefined? null: await db.getUsernameByToken(token); 
    let moduleId = req.body.moduleId;
    let total_points = req.body.total_points;

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


    const dueDate = req.body.dueDate;

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

    if(searchModuleById(moduleId) === null){
        res.status(404).json({
            message: 'Module not found'
        });
    }

    await db.createDeliverable(deliverableId, name, description, total_points, timestamp, dueDate); 
    await db.addContentIntoModule("deliverable", deliverableId, moduleId);
    res.json({
        message: 'Success'
    });
}); 



/* 
    Endpoint for when the user wants to create an deliverable
    Request parameters:
        deliverableId: String
        name: String
        description: String
        total_points: String
        newDueDate: int
        moduleId: String
*/
router.post('/editDeliverable', async (req, res) => {
    let token = req.cookies.token; 
    let username = token === undefined? null: await db.getUsernameByToken(token); 
    let deliverableId = req.body.deliverableId;
    let moduleId = req.body.moduleId;
    let name = req.body.name;
    let newDueDate = req.body.newDueDate;
    let description = req.body.description;
    let total_points = req.body.total_points;


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

    const timestamp = utils.timestamp(); 
    if(timestamp - newDueDate <= 0){
        res.status(400).json({
            message: 'Your new due date is in the past!'
        });
    }

    await db.editDeliverable(deliverableId, name, total_points, description);
    await db.setDeliverableDue(deliverableId, newDueDate);
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
    let moduleId = req.body.moduleId;
    let deliverableId = req.body.deliverableId;

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


/* 
    Endpoint for when the user wants to create a submission
    Request parameters:
        deliverableId: String
        courseName: String
        content: String
        media: File
        
*/
router.post('/createSubmission', async (req, res) => {
    let token = req.cookies.token; 
    let username = token === undefined? null: await db.getUsernameByToken(token); 
    let courseName = req.body.courseName;
    let deliverableId = req.body.deliverableId;
    

    if (username === null) {
        // The user havn't logged in, or the token has expired. 
        res.status(403).json({
            message: 'You have to sign in before making a deliverable. '
        });
        return;
    }

    const isEnrolled = await db.checkEnrollment(courseName, username);
    if(!isEnrolled){
        // The user is not an enrolled in this course. 
        res.status(403).json({
            mesage: 'You are not an enrolled in this course. '
        });
        return;
    }

    let submissionFile = "None";
    if (req.files && Object.keys(req.files).length !== 0) {
        submissionFile = req.files[Object.keys(req.files)[0]]; 
        let extensionNames = [null, '.pdf', '.txt'];
        let extension = submissionFile.name.slice(-3) === 'png'? 2: 1;
        let path = 'client/public/files/users/' + username + extensionNames[extension];
        try {
            await submissionFile.mv(path); 
        }
        catch (err) {
            console.error(err); 
            res.status(500).json({
                message: 'Error when moving the file onto server. '
            });
            return; 
        }
    }


    const content  = req.body.content; 
    const timestamp = utils.timestamp(); 
    const submissionId = utils.URLSafe(utils.hash(name + timestamp.toString())); 


    await db.createSubmission(username, deliverableId, submissionId, content, submissionFile, timestamp); 
    res.json({
        message: 'Success'
    });
}); 


module.exports = router;