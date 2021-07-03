import React, { Component } from 'react'; 
import './post.css';
import profile from '../../../resource/icons/profile.png'
import share from '../../../resource/icons/share.png'



export default class post extends Component{

    copyURL = ()=> {
        var inputc = document.body.appendChild(document.createElement("input"));
        inputc.value = window.location.href;
        inputc.focus();
        inputc.select();
        document.execCommand('copy');
        inputc.parentNode.removeChild(inputc);
        alert("URL Copied.");
    }

    render() {
        return (
            <div className="post">
                <a className="inner" href="community/post_content">
                    {/* post user image */}
                    <img src={profile}/>
                    {/* post user name */}
                    <span>{this.props.post.userName}</span>
                    {/* post title */}
                    <h3>{this.props.post.title}</h3>
                    {/* post content */}
                    <p>{this.props.post.content}</p>
                </a>

                <div className="post_footer">
                    <div>
                        {/* the number of comments of this post */}
                        <span className="post_button">Comments {this.props.post.commentNumber}</span>  
                    </div>
                    
                    <div>
                        {/* post share link */}
                        <a href="#" className="share" onClick={this.copyURL}>
                            <a href="#" id="share_text">Share</a>
                        </a>
                    </div>
                </div>

            </div>
        )
    }
}