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


module.exports = router; 