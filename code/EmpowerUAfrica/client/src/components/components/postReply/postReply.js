import React, { Component } from 'react'; 
import './postReply.css';
import profile from '../../../resource/icons/profile.png'



export default class post extends Component{
    render() {
        return (
            <div className="post">
                <a className="inner" href="community/post_content">
                    {/* post reply user image */}
                    <img src={profile}/>
                    {/* post reply user name */}
                    <span>{this.props.postReply.userName}</span>
                    {/* post reply content */}
                    <p>{this.props.postReply.content}</p>
                </a>
            </div>
        )
    }
}