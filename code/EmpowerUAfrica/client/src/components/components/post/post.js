import React, { Component } from 'react'; 
import './post.css';
import profile from '../../../resource/icons/profile.png'
import share from '../../../resource/icons/share.png'
import { UserAbstract } from '../userAbstract/userAbstract';
import Utils from '../../../utils';



export default class post extends Component{

    copyURL = ()=> {
        var inputc = document.body.appendChild(document.createElement("input"));
        inputc.value = `/community/post/${this.props.post.id}`;
        inputc.focus();
        inputc.select();
        document.execCommand('copy');
        inputc.parentNode.removeChild(inputc);
        alert("URL Copied.");
    }

    render() {
        let post = this.props.post;
        let author = this.props.post.authorInfo;  
        let in_post = this.props.in_post; 
        if (post === undefined) {
            return (<h2>Error: No Post Data</h2>); 
        }

        return (
            <div className="post">
                <UserAbstract user={author}></UserAbstract>
                {
                    in_post? 
                    <>
                        <h3>{post.title}</h3>
                        <p>{post.abbriv || post.content}</p>
                    </>:
                    <>
                        <a className="inner" href={`community/post/${this.props.post.id}`}>
                        <h3>{post.title}</h3>
                        <p>{post.abbriv || post.content}</p>
                        </a>
                    </>
                }
                

                <div className="post_footer">
                    <div>
                        <span className="post_button">Comments {post.comment_count}</span>  
                    </div>

                    <p>Post at: {Utils.timeStampToTime(post.post_time)}</p>
                    
                    <div>
                        {/* post share link */}
                        <a href="#" className="share" onClick={this.copyURL}>
                            <span id="share_text">Share</span>
                        </a>
                    </div>
                </div>

            </div>
        )
    }
}