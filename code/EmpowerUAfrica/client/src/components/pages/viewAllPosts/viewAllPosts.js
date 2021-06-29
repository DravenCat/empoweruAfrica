import React, { Component } from 'react'; 
import './viewAllPosts.css';
import Post from '../../components/post/post';

export default class community extends Component{

    render() {

        const postInfo = [
            {
                title: "title1",
                content: "content1",
                commentNumber: 20
            },
            {
                title: "title2",
                content: "content2",
                commentNumber: 30
            },
            {
                title: "title3",
                content: "content3",
                commentNumber: 40
            }
        ]

        return (
            <div className="viewAllPosts">
                &nbsp;
                <div className="title">
                    <h2>My Posts</h2>
                </div>

                <div className="postsection">
                    <Post post={postInfo[0]} />
                    <Post post={postInfo[1]} />
                    <Post post={postInfo[2]} />
                </div>
            </div>
        )
    }
}