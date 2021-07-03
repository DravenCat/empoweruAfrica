import React, { Component } from 'react'; 
import './postContent.css';
import Post from '../../components/post/post';
import PostReply from '../../components/postReply/postReply';
import Utils from '../../../utils';

const createCommentURL = '/community/createComment'; 
const getPostContentURL = '/community/getPostContent'; 

export default class postContent extends Component{

    activateMakeComment = ()=> {
        let deactivator = document.querySelector("#makecomment_deactivator");
        let activator = document.querySelector("#makecomment_activator");
        let makeCommentArea = document.querySelector(".postContent_makeComment");
        activator.style.display = "none";
        deactivator.style.display = "block";
        makeCommentArea.style.display = "block";
    }

    deactivateMakeComment = ()=> {
        let deactivator = document.querySelector("#makecomment_deactivator");
        let activator = document.querySelector("#makecomment_activator");
        let makeCommentArea = document.querySelector(".postContent_makeComment");
        activator.style.display = "block";
        deactivator.style.display = "none";
        makeCommentArea.style.display = "none";
    }

    state = {
        postContent: null,
        error: null
    }

    async getPostContent(postId) {
        let postContent = {
            "author": "test", 
            "id": "Pla0JdAos3pVoiVI1neP95YHT8F6hkKH3h4uq7KgRceo=",
                "post": {
                    "post_time": Math.round(Date.now() / 1000),
                    "title": "My Title",
                    "content": "This is the full post content.",
                },
                "comments": [
                {
                    "id": "asdaasdfbdkfa",
                    "author":  "test2", 
                    "body": {
                        "post_time": 168273691,
                        "content": "This is my reply"
                    },
                    "comments": [
                        {
                            "reply_to": "reply_id",
                            "id": "Caaaaaa",
                            "author": "test",
                            "body":{
                                "post_time": 198274923,
                                "content": "This is my reply to reply"
                            }
                        }, 
                    ]
                }, 
            ]
        }

        let res;
        let url = `${getPostContentURL}?post_id=${postId}`; 
        try {
            res = await fetch(
                url,
                {
                    method: 'GET'
                }
            )
        }
        catch (err) {
            console.error(err); 
            this.setState({
                error: 'Internet Failure: Failed to connect to server.'
            })
            return;
        }
        let body; 
        try {
            body = await res.json();
        }
        catch (err) {
            console.error(err); 
            return; 
        }

        if (!res.ok) {
            this.setState({error: body.message}); 
            return; 
        }
        postContent = body; 

        let users = [postContent.author];
        for (const comment of postContent.comments) {

            if (users.indexOf(comment.author) === -1) {
                users.push(comment.author)
            }

            for (const subcomment of comment.comments) {
                if (users.indexOf(subcomment.author) === -1) {
                    users.push(subcomment.author)
                }
            }
        }

        let usersAbstract = await Utils.getUsersAbstract(users); 

        postContent.author = usersAbstract[postContent.author]; 
        postContent.post.comment_count = 0;
        for (const comment of postContent.comments) {
            comment.author = usersAbstract[comment.author]; 
            comment.comment_count = 0; 
            for (const subcomment of comment.comments) {
                subcomment.author = usersAbstract[subcomment.author]; 
                comment.comment_count ++; 
            }
            postContent.post.comment_count += comment.comment_count;
        }
        this.setState({postContent, postId}); 
        
    }

    submitComment= async () => {
        let res;
        let replyInput = document.getElementById('reply-input');
        if (replyInput.value.length === 0) {
            return; 
        }
        try {
            res = await fetch(
                createCommentURL,
                {
                    method: 'POST',
                    body: JSON.stringify({
                        reply_to: this.state.postId,
                        body: replyInput.value
                    }),
                    headers: {
                        'content-type': 'application/json'
                    }
                }
            )
        }
        catch (err) {
            console.error(err); 
            this.setState({
                error: 'Internet Failure: Failed to connect to server.'
            })
            return;
        }
        let body; 
        try {
            body = await res.json();
        }
        catch (err) {
            console.error(err); 
            return; 
        }

        if (!res.ok) {
            this.setState({error: body.message}); 
            return; 
        }
        window.location.reload(); 
    }

    componentDidMount() {
        const postId = this.props.match.params.postId; 
        this.getPostContent(postId); 
    }

    render() {
        const postContent = this.state.postContent; 
        if (postContent === null) {
            return(<></>); 
        }
        let replies = postContent.comments.map(comment => <PostReply reply={comment} key={comment.id}/>)
        const mainPost = {
            author: postContent.author,
            post: postContent.post
        }
        return (
            <div className="post-content">

                <div>
                    <h3 className="warningMsg">{this.state.error}</h3>
                </div>

                <div className="post-content-column">
                    <div className="postContent_post">
                        <Post post={mainPost} in_post="true"/>
                    </div>
                    <div>
                        <button onClick={this.activateMakeComment} id="makecomment_activator">Make Comment</button>
                        <button onClick={this.deactivateMakeComment} id="makecomment_deactivator">Cancel</button>
                    </div>
                    <div  className="postContent_makeComment">
                        <textarea id="reply-input"></textarea>
                        <button id="makecomment_submit" onClick={this.submitComment}>Submit</button>
                    </div>
                    <div>

                    </div>
                    
                    <div>
                        {replies}
                    </div>
                </div>

                <div>

                </div>

            </div>
        )
    }
}