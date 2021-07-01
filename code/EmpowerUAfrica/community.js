const express = require('express'); 

const db = require('./db'); 
const utils = require('./utils');
const validation = require('./validation');

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
    const postId = 'P' + utils.hash(username + title + timestamp.toString()); 

    let errCode = 0; 
    if ((errCode = validation.validatePostTitle(title)) !== 0
        || (errCode = validation.validatePostBody(content)) !== 0) {
        res.status(400).json({
            message: validation.errMsgs[errCode]
        }); 
        return; 
    }

    await db.makePost(username, content, title, postId, timestamp); 
    res.json({
        message: 'Success'
    });
}); 

router.post('/makeComment', async (req, res) => {
    let token = req.cookies.token; 
    let username = token === undefined? null: await db.getUsernameByToken(token); 

    if (username === null) {
        // The user havn't logged in, or the token has expired. 
        res.status(403).json({
            mesage: 'You have to sign in before making a comment. '
        });
        return;
    }

    const content = req.body.body; 
    const timestamp = utils.timestamp();
    const replyId = 'C' + utils.hash(username + content.slice(0, 10) + timestamp.toString()); 
    const targetId = req.body.reply_to;
    let type; 
    switch (targetId[0]) {
        case 'P': type = 'post'; break; 
        case 'C': type = 'reply'; break; 
        default: 
            res.status(400).json({
                message: 'Invalid taget id. '
            });
            return; 
    }

    let errCode;
    if ((errCode = validation.validatePostBody(content)) !== 0) {
        res.status(400).json({
            message: validation.errMsgs[errCode]
        }); 
        return; 
    }

    await db.makeReply(username, content, replyId, targetId, timestamp, type);
    res.json({
        message: 'success'
    });
});

router.post('/followPost', async (req, res) => {
    let token = req.cookies.token; 
    let username = token === undefined? null: await db.getUsernameByToken(token); 

    if (username === null) {
        // The user havn't logged in, or the token has expired. 
        res.status(403).json({
            mesage: 'You have to sign in before making a comment. '
        });
        return;
    }

    const postId = req.body.id; 
    const follow = req.body.follow; 

    if (follow) {
        await db.followPost(username, postId); 
    }    
    else {
        await db.unfollowPost(username, postId);
    }

    res.json({
        message: 'success'
    });
});

module.exports = router;