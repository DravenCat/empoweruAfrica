import React, { Component, useImperativeHandle } from 'react'; 
import './postReply.css';
import profile from '../../../resource/icons/profile.png'
import { UserAbstract } from '../userAbstract/userAbstract';
import Utils from '../../../utils';



export default class post extends Component{
    render() {
        let reply = this.props.reply;
                return (
            <div className="post">
                <UserAbstract user={reply.author}/>
                <p>{reply.body.content}</p>
                <p style={{"text-align": "right"}}>Post at: {Utils.timeStampToTime(reply.body.post_time)}</p>
            </div>
        )
    }
}