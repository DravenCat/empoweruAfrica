import React, { Component } from 'react'; 
import './postContent.css';
import Post from '../../components/post/post';
import PostReply from '../../components/postReply/postReply';

export default class postContent extends Component{

    render() {
        return (
            <div className="post-content">

                <div>

                </div>

                <div className="post-content-column">
                    <div>
                        <a id="direct-makecomment">Make Comment</a>
                    </div>
                    <Post/>
                    <PostReply/>
                    <PostReply/>
                </div>

                <div>

                </div>

            </div>
        )
    }
}