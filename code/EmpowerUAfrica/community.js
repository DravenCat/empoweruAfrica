const express = require('express'); 

const db = require('./db'); 
const utils = require('./utils');

const router = express.Router(); 


router.post('/makePost', async (req, res) => {
    let token = req.cookies.token; 
    let username = token === undefined? null: await db.getUsernameByToken(token); 

    if (username === null) {
        // The user havn't logged in, or the token has expired. 
        res.status(403).json({
            mesage: 'You have to sign in before making a post. '
        });
        return;
    }

    const title = req.body.title;
    const content  = req.body.body; 
    const timestamp = utils.timestamp(); 
    const postId = utils.getPostId(username, title, timestamp); 

    await db.makePost(username, content, title, postId, time); 
    res.json({
        message: 'Success'
    });
}); 

module.exports = router;