import React, { Component } from 'react'; 
import './post.css';
import profile from '../../../resource/icons/profile.png'



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
                    <img src={profile}/>
                    <h3>{this.props.post.title}</h3>
                    <p>{this.props.post.content}</p>
                </a>
                <span className="post_button">Comments {this.props.post.commentNumber}</span>
                <button className="post_button" id="post_share" onClick={this.copyURL}>Share</button>
            </div>
        )
    }
}