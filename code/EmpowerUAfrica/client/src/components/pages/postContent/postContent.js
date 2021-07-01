import React, { Component } from 'react'; 
import './postContent.css';
import Post from '../../components/post/post';
import PostReply from '../../components/postReply/postReply';

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


    render() {
        const postInfo = [
            {
                title: "title1",
                content: "content1",
                commentNumber: 20
            }
        ]

        const postReplyInfo = [
            {
                content: "replyContent1",
            },
            {
                content: "replyContent1",
            },
            {
                content: "replyContent1",
            }
        ]

        return (
            <div className="post-content">

                <div>

                </div>

                <div className="post-content-column">
                    <div className="postContent_post">
                        <Post post={postInfo[0]}/>
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
                    <PostReply postReply={postReplyInfo[0]} />
                    <PostReply postReply={postReplyInfo[1]} />
                    <PostReply postReply={postReplyInfo[2]} />
                </div>

                <div>

                </div>

            </div>
        )
    }
}