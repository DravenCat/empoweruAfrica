import React, { Component } from 'react'; 
import './postContent.css';
import Post from '../../components/post/post';
import PostReply from '../../components/postReply/postReply';
import Utils from '../../../utils';

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
        postContent: null
    }

    async getPostContent(postId) {
        let postContent = {
            "author": "test", 
                "post": {
                    "post_time": Math.round(Date.now() / 1000),
                    "post_id": "ajsdnfsvjbzxkv",
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
        for (const comment of postContent.comments) {
            comment.author = usersAbstract[comment.author]; 
            for (const subcomment of comment.comments) {
                subcomment.author = usersAbstract[subcomment.author]; 
            }
        }
        this.setState({postContent, postId}); 
            
    }

    componentDidMount() {
        const postId = this.props.match.postId; 
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
        console.log(mainPost);
        return (
            <div className="post-content">

                <div>

                </div>

                <div className="post-content-column">
                    <div className="postContent_post">
                        <Post post={mainPost} />
                    </div>
                    <div>
                        <button onClick={this.activateMakeComment} id="makecomment_activator">Make Comment</button>
                        <button onClick={this.deactivateMakeComment} id="makecomment_deactivator">Cancel</button>
                    </div>
                    <div  className="postContent_makeComment">
                        <textarea></textarea>
                        <button id="makecomment_submit">Submit</button>
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