import React, { Component } from 'react'; 
import './postReply.css';
import profile from '../../../resource/icons/profile.png'



export default class post extends Component{
    render() {
        return (
            <div className="post">
                <a className="inner" href="community/post_content">
                    <img src={profile}/>
                    <span>{this.props.reply.userName}</span>
                    <p>{this.props.reply.content}</p>
                </a>
            </div>
        )
    }
}