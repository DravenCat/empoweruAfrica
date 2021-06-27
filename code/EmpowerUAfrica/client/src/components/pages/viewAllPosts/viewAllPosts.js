import React, { Component } from 'react'; 
import './viewAllPosts.css';
import Post from '../../components/post/post';

export default class community extends Component{

    render() {
        return (
            <div className="viewAllPosts">
                &nbsp;
                <div className="title">
                    <h2>My Posts</h2>
                </div>

                <div className="postsection">
                    <Post/>
                    <Post/>
                    <Post/>
                </div>
            </div>
        )
    }
}