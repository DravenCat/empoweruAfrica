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
        courseName: String
*/
router.get('/getCourseContent', async (req, res) => {
    let courseName = req.query.course_name; 

    let courseContent = await db.searchCourseByName(courseName);

    // check if the course exists
    if(courseContent === null){
        res.status(404).json({
            message: 'Course not found'
        });
    }
    // returns the object containing the course contents and all comments
    res.status(200).json({
        name: courseName,
        author: courseContent.author,
        title: courseContent.Title,
        content: courseContent.Content,
    });
}); 


/* 
    Endpoint for when the user wants to create a course
    Request parameters:
        courseName: String
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


    if(!admin.isAdmin(username)){
        res.status(403).json({
            message: 'You have to be an admin to do this. '
        });
        return;
    }

    const courseName = req.courseName;
    const instructor  = req.instructor;
    const description = req.description;
    
    // checks if instructor username exists
    let abstract = await db.getUserAbstract(instructor);
    if(abstract === null){
        res.status(404).json({message: "Instructor does not exist"});
        return; 
    }

    let errCode = 0; 

    if ((errCode = validation.validateCourseName(courseName)) !== 0
        || (errCode = validation.validateCourseDesc(description)) !== 0) {
        res.status(400).json({
            message: validation.errMsgs[errCode]
        }); 
        return; 
    }

    await db.createCourse(courseName, instructor, description); 
    res.json({
        message: 'Success'
    });
}); 



/* 
    Endpoint for when the user wants to delete a course
    Request parameters:
        courseName: String
        token: String
*/
router.post('/deleteCourse', async (req, res) => {
    let token = req.cookies.token; 
    let username = token === undefined? null: await db.getUsernameByToken(token); 
    let courseContent = await db.searchCourseByName(req.courseName);

    if (username === null) {
        // The user havn't logged in, or the token has expired. 
        res.status(403).json({
            message: 'You have to sign in before deleting course. '
        });
        return;
    }

    if(!admin.isAdmin(username)){
        res.status(403).json({
            message: 'You have to be an admin to do this. '
        });
        return;
    }

    if(courseContent === null){
        res.status(404).json({
            message: 'Course not found'
        });
    }

    await db.deleteCourse(req.courseName);

    res.json({
        message: 'success'
    });
});


/* 
    Endpoint to update course information
    Request parameters:
        token: String
        courseName: String
        updates: Object
*/
router.post('/updateCourse', async (req, res) => {
    let token = req.cookies.token; 
    let username = token === undefined? null: await db.getUsernameByToken(token); 
    let courseName = req.courseName;
    let courseContent = await db.searchCourseByName(courseName);

    if (username === null) {
        // The user havn't logged in, or the token has expired. 
        res.status(403).json({
            mesage: 'You have to sign in before you edit your profile. '
        });
        return;
    }

    if(!admin.isAdmin(username)){
        res.status(403).json({
            message: 'You have to be an admin to do this. '
        });
        return;
    }

    let updates = req.body.updates; 

    if(courseContent !== null){

        await db.updateCourse(courseName, updates);

        res.status(200).json({message: "Success"});

    }else{
        res.status(404).json({
            message: 'Course not found'
        });
    }
}); 


module.exports = router; 