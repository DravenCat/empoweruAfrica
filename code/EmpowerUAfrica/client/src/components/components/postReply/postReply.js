import React, { Component, useImperativeHandle } from 'react'; 
import './postReply.css';
import profile from '../../../resource/icons/profile.png'
import { UserAbstract, UserAbstractSmall } from '../userAbstract/userAbstract';
import Utils from '../../../utils';



export class Reply extends Component{
    render() {
        let reply = this.props.reply;
        let subReplies = reply.comments.map(
            comment => <ReplyToReply reply={comment}/>
        ); 
        return (
            <div className="post-reply">
                <div className="reply-content-block">
                    <UserAbstract user={reply.authorAbstract}/>
                    <p>{reply.content}</p>
                    <div className="post-time">
                        <p>Posted at: {Utils.timeStampToTime(reply.post_time)}</p>
                    </div>
                </div>
                <div className="subreplies-block">
                    {subReplies}
                </div>
            </div>
        )
    }
}
export class ReplyToReply extends Component {
    render() {
        let reply = this.props.reply;
        return(
            <div className="reply-to-reply">
                <div style={{display: "inline-flex"}}>
                    <UserAbstractSmall user={reply.authorAbstract}/ >
                    <p>: {reply.content}</p>
                </div>
                <br />
                <div className="post-time">
                    <span>Posted at: {Utils.timeStampToTime(reply.post_time)}</span>
                </div>
            </div>
        );
    }
}