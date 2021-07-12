const express = require('express');

const express = require('express'); 
const fs = require('fs').promises; 

const db = require('./db'); 

const utils = require('./utils');
const validation = require('./validation');
const admin = require('./admin'); 

const router = express.Router(); 

/* 
    Endpoint to get all information of all courses
    Params: None
*/
router.get('/getCourses', async (req, res) => {

    let results = await db.getCourses();
    if(results != null){
        res.status(200).json(results);
    }else{
        res.status(500).json({
            message: 'Internal Server Error'
        });
    }

});

/* 
    Endpoint for when the user wants to get all contents of a course and all comments for the course
    Request parameters:
        courseId: String
*/
router.get('/getcourseContent', async (req, res) => {
    let courseId = req.query.course_id; 

    let courseContent = await db.searchcourseById(courseId);

    // check if the course exists
    if(courseContent === null){
        res.status(404).json({
            message: 'Course not found'
        });
    }
    // returns the object containing the course contents and all comments
    res.status(200).json({
        id: courseId,
        author: courseContent.author,
        title: courseContent.Title,
        content: courseContent.Content,
    });
}); 


/* 
    Endpoint for when the user wants to create a course
    Request parameters:
        name: String
        instructor: String
        description: String
        token: String
*/
router.course('/createCourse', async (req, res) => {
    let token = req.cookies.token; 
    let username = token === undefined? null: await db.getUsernameByToken(token); 

    if (username === null) {
        // The user havn't logged in, or the token has expired. 
        res.status(403).json({
            message: 'You have to sign in before making a course. '
        });
        return;
    }

    //TODO: Check if user is admin

    const name = req.body.title;
    const instructor  = req.body.body; 
    const description = utils.timestamp(); 
    const courseId = utils.URLSafe(utils.hash(username + title + timestamp.toString()));
    
    // checks if instructor username exists
    let abstract = await db.getUserAbstract(instructor);
    if(abstract == null){
        res.status(404).json({message: "User does not exist"});
        return; 
    }

    let errCode = 0; 

    // TODO: add the validate functions and error messages in validation and config after pulling
    if ((errCode = validation.validateCourseName(name)) !== 0
        || (errCode = validation.validateCourseDesc(description)) !== 0) {
        res.status(400).json({
            message: validation.errMsgs[errCode]
        }); 
        return; 
    }

    await db.createCourse(name, instructor, description, courseId); 
    res.json({
        message: 'Success'
    });
}); 



/* 
    Endpoint for when the user wants to delete a course
    Request parameters:
        courseId: String
        token: String
*/
router.post('/deleteCourse', async (req, res) => {
    let token = req.cookies.token; 
    let username = token === undefined? null: await db.getUsernameByToken(token); 

    if (username === null) {
        // The user havn't logged in, or the token has expired. 
        res.status(403).json({
            message: 'You have to sign in before deleting course. '
        });
        return;
    }

    //TODO: Check if user is admin


    await db.deleteCourse(req.courseId);

    res.json({
        message: 'success'
    });
});



module.exports = router; 