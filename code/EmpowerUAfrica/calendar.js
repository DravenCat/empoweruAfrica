const express = require('express'); 

const db = require('./db'); 
const utils = require('./utils');
const validation = require('./validation');
const admin = require('./admin'); 

const router = express.Router(); 

/* 
    Endpoint for when the user wants to get all important dates
    Request parameters:
        courseName: String
*/
router.get('/getImportantDates', async (req, res) => {

    let token = req.cookies.token; 
    let username = token === undefined? null: await db.getUsernameByToken(token); 
    let courseName = req.body.courseName;


    if (username === null) {
        // The user havn't logged in, or the token has expired. 
        res.status(403).json({
            message: 'You have to sign in before making a deliverable. '
        });
        return;
    }


    const isInstructor = await db.checkIsInstructorFromCourse(courseName, username);
    if(!isInstructor){
        // The user is not an instructor for this course. 
        res.status(403).json({
            mesage: 'You are not an instructor for this course. '
        });
        return;
    }
    
    
    let deliverables = await db.getUserDeliverables(username);
    let dates = {dates: []};

    for (let i = 0; i < deliverables.length; i++) {
        dates["dates"].push(deliverables[i].due);
    }

    res.status(200).json({dates});
});

module.exports = router;