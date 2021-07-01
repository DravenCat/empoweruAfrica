import React, { Component } from 'react'; 
import './postReply.css';
import profile from '../../../resource/icons/profile.png'



export default class post extends Component{
    render() {
        return (
            <div className="post">
                <a className="inner" href="community/post_content">
                    <img src={profile}/>
                    <p>{this.props.postReply.content}</p>
                </a>
            </div>
        )
    }
}