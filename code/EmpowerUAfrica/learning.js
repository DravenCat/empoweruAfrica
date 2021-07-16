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
        instructor: courseContent.instructor,
        description: courseContent.description
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
        newDescription: String
        newInstructor: String
*/
router.post('/updateCourse', async (req, res) => {
    let token = req.cookies.token; 
    let username = token === undefined? null: await db.getUsernameByToken(token); 
    let courseName = req.courseName;
    let courseContent = await db.searchCourseByName(courseName);
    let description = req.newDescription;
    let instructor = req.newInstructor;

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

    let abstract = await db.getUserAbstract(instructor);
    if(abstract === null){
        res.status(404).json({message: "New instructor does not exist"});
        return; 
    }

    if(courseContent !== null){

        await db.editCourse(courseName, description, instructor);

        res.status(200).json({message: "Success"});

    }else{
        res.status(404).json({
            message: 'Course not found'
        });
    }
}); 

/* 
    Endpoint for when the user wants to create a module
    Request parameters:
        courseName: String
        moduleName: String
        token: String
*/
router.put('/createModule', async(req, res) => {
    let token = req.cookies.token; 
    let username = token === undefined? null: await db.getUsernameByToken(token); 
    const courseName = req.courseName;
    const moduleName = req.moduleName;
    const timestamp = utils.timestamp(); 
    const moduleId = 'M' + utils.URLSafe(utils.hash(moduleName + timestamp.toString())); 


    if (username === null) {
        // The user havn't logged in, or the token has expired. 
        res.status(403).json({
            message: 'You have to sign in before making a course. '
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


    // checks if course username exists
    let course = await db.searchCourseByName(courseName);
    if(course === null){
        res.status(404).json({message: "Course does not exist"});
        return; 
    }

    let errCode = 0; 

    if ((errCode = validation.validateCourseName(courseName)) !== 0
        || (errCode = validation.validateModuleName(moduleName)) !== 0) {
        res.status(400).json({
            message: validation.errMsgs[errCode]
        }); 
        return; 
    }

    await db.createModule(courseName, moduleId, moduleName); 
    res.json({
        message: 'Success'
    });
});

/* 
    Endpoint to update module information
    Request parameters:
        token: String
        moduleId: String
        newModuleName: String
*/
router.post('/editModule', async (req, res) => {
    let token = req.cookies.token; 
    let username = token === undefined? null: await db.getUsernameByToken(token); 
    let moduleId = req.moduleId;
    let module = await db.searchModuleById(moduleId);
    let moduleName = req.newModuleName;

    if (username === null) {
        // The user havn't logged in, or the token has expired. 
        res.status(403).json({
            mesage: 'You have to sign in before you edit your profile. '
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

    if(module !== null){
        await db.editModule(moduleId, moduleName);
        res.status(200).json({message: "Success"});
    }else{
        res.status(404).json({
            message: 'Module not found'
        });
    }
}); 

/* 
    Endpoint for when the user wants to delete a module
    Request parameters:
        moduleId: String
        token: String
*/
router.post('/deleteModule', async (req, res) => {
    let token = req.cookies.token; 
    let username = token === undefined? null: await db.getUsernameByToken(token); 
    let moduleId = req.moduleId;
    let module = await db.searchModuleById(moduleId);

    if (username === null) {
        // The user havn't logged in, or the token has expired. 
        res.status(403).json({
            message: 'You have to sign in before deleting course. '
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

    if(module === null){
        res.status(404).json({
            message: 'Module not found'
        });
    }

    await db.deleteModule(moduleId);

    res.json({
        message: 'success'
    });
});

/* 
    Endpoint for when the user wants to get content of the course
    Request parameters:
        courseName: String
        token: String
*/
router.get('/getCourseContent', async (req, res) => {
    let token = req.cookies.token; 
    let username = token === undefined? null: await db.getUsernameByToken(token); 
    let courseName = req.courseName;
    let courseContent = await db.searchCourseByName(courseName);
    let result;

    if (username === null) {
        // The user havn't logged in, or the token has expired. 
        res.status(403).json({
            message: 'You have to sign in before deleting course. '
        });
        return;
    }

    if(courseContent !== null){
        result.name = courseContent.name;
        result.instructor = courseContent.instructor;
        result.description = courseContent.description;
        result.module = await db.getAllModules(courseName);
        res.status(200).json(result);
    }else{
        res.status(404).json({
            message: 'Course not found'
        });
    }
});


/* 
    Endpoint for when the user wants to enroll in a course
    Request parameters:
        courseName: String
        token: String
*/
router.get('/enrollCourse', async (req, res) => {
    let token = req.cookies.token; 
    let username = token === undefined? null: await db.getUsernameByToken(token); 
    let courseName = req.courseName;

    if (username === null) {
        // The user havn't logged in, or the token has expired. 
        res.status(403).json({
            message: 'You have to sign in before enrolling in course. '
        });
        return;
    }

    await db.enrollCourse(courseName, username);
    res.json({
        message: 'success'
    });

});


/* 
    Endpoint for when the user wants to drop a course
    Request parameters:
        courseName: String
        token: String
*/
router.get('/dropCourse', async (req, res) => {
    let token = req.cookies.token; 
    let username = token === undefined? null: await db.getUsernameByToken(token); 
    let courseName = req.courseName;


    if (username === null) {
        // The user havn't logged in, or the token has expired. 
        res.status(403).json({
            message: 'You have to sign in before dropping course. '
        });
        return;
    }


    const isEnrolled = await db.checkEnrollment(username, courseName);

    if (!isEnrolled) {
        // The user havn't logged in, or the token has expired. 
        res.status(400).json({
            message: 'You are already not enrolled in the course! '
        });
        return;
    }

    await db.dropCourse(courseName, username);
    res.json({
        message: 'success'
    });

});




module.exports = router; 