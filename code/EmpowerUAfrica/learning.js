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


module.exports = router; 