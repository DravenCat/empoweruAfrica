const express = require('express'); 

const db = require('./db'); 
const utils = require('./utils');
const validation = require('./validation');
const admin = require('./admin'); 

const router = express.Router(); 


/* 
    Endpoint for when the user wants to create a post
    Request parameters:
        body: String
        title: String
        token: String
*/
router.post('/createPost', async (req, res) => {
    let token = req.cookies.token; 
    let username = token === undefined? null: await db.getUsernameByToken(token); 

    if (username === null) {
        // The user havn't logged in, or the token has expired. 
        res.status(403).json({
            message: 'You have to sign in before making a post. '
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


/* 
    Endpoint for when the user wants to create a comment
    Request parameters:
        body: String
        reply_to: String
        token: String
*/
router.post('/createComment', async (req, res) => {
    let token = req.cookies.token; 
    let username = token === undefined? null: await db.getUsernameByToken(token); 

    if (username === null) {
        // The user havn't logged in, or the token has expired. 
        res.status(403).json({
            message: 'You have to sign in before making a comment. '
        });
        return;
    }

    const content = req.body.body; 
    const timestamp = utils.timestamp();
    const replyId = 'C' + utils.hash(username + content.slice(0, 10) + timestamp.toString()); 
    const targetId = req.body.reply_to;
    let type = utils.typeOfId(targetId); 
    if (type === null) {
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


/* 
    Endpoint for when the user wants to follow a post
    Request parameters:
        id: String
        follow: String
        token: String
*/
router.post('/followPost', async (req, res) => {
    let token = req.cookies.token; 
    let username = token === undefined? null: await db.getUsernameByToken(token); 

    if (username === null) {
        // The user havn't logged in, or the token has expired. 
        res.status(403).json({
            message: 'You have to sign in before making a comment. '
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


/* 
    Endpoint for when the user wants to delete a post or reply
    Request parameters:
        id: String
        token: String
*/
router.post('/deleteContent', async (req, res) => {
    let token = req.cookies.token; 
    let username = token === undefined? null: await db.getUsernameByToken(token); 

    if (username === null) {
        // The user havn't logged in, or the token has expired. 
        res.status(403).json({
            message: 'You have to sign in before deleting a post / comment. '
        });
        return;
    }
    const id = req.body.id;
    const type = utils.typeOfId(id); 
    if (type === null) {
        res.status(400).json({
            message: 'Invalid taget id. '
        });
        return; 
    }

    const author = await db.getAuthorOfContent(id, type); 
    if (author !== username && !admin.isAdmin(username)) {
        res.status(403).json({
            message: 'You do not have permission to delete this content. '
        });
        return; 
    }
    
    if (type === 'post') {
        await db.deletePost(id);
    }
    else if (type === 'reply') {
        await db.deleteReply(id)
    }

    res.json({
        message: 'success'
    });
});


/* 
    Endpoint for when the user wants to get all posts for a certain page
    Request parameters:
        pageNum: int
        postsPerPage: int
*/
router.post('/getPosts', async (req, res) => {
    let results;
    if(Number.isInteger(req.pageNum) && Number.isInteger(req.postsPerPage)){
        results = db.getPosts(req.pageNum, req.postsPerPage);
    }else{
        res.status(400).json({
            message: 'Inputs are not valid'
        });
    }
    if(results != null){
        res.status(200).send(results);
    }else{
        res.status(412).json({
            message: 'Requested number of posts exceeded total amount of posts'
        });
    }

});



/* 
    Endpoint for when the user wants to get all contents of a post and all comments for the post
    Request parameters:
        postId: String
*/
router.get('/getPostContent', async (req, res) => {
    let post = db.searchPostById(req.postId);
    let comments = db.getComments(req.postId);
    // check if the post exists
    if(post === null){
        res.status(404).json({
            message: 'Post not found'
        });
    }
    // returns the object containing the post contents and all comments
    res.status(200).json({
        id: req.postId,
        author: post.author,
        post: {
            post_time: post.timestamp,
            title: post.title,
            content: post.content
        },
        comments: comments
    });
}); 

module.exports = router;