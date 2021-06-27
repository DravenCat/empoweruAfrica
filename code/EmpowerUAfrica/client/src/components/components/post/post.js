import React, { Component } from 'react'; 
import './post.css';
import profile from '../../../resource/icons/profile.png'



export default class post extends Component{
    render() {
        return (
            <div className="post">
                <a className="inner" href="community/post_content">
                    <img src={profile}/>
                    <h3>Title</h3>
                    <p>Post Content</p>
                    <span>Comments 20</span>
                    <span>Share</span>
                </a>
            </div>
        )
    }
}