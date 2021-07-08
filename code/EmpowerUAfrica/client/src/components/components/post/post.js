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
        let author = this.props.post.authorAbstract;  
        let in_post = this.props.in_post; 
        console.log(post); 
        if (post === undefined) {
            return (<h2>Error: No Post Data</h2>); 
        }

        return (
            <div className="post">
                <div className="post-user-abstract">
                    <UserAbstract user={author}></UserAbstract>
                </div>
                
                <div className="post-abstract">
                {
                    in_post? 
                    <>
                        <h2>{post.title}</h2>
                        <p>{post.abbriv || post.content}</p>
                    </>:
                    <>
                        <a className="link-to-post" href={`community/post/${post.id}`}>
                        <h2>{post.title}</h2>
                        <p>{post.abbriv || post.content}</p>
                        </a>
                    </>
                }
                </div>

                <div className="post-footer">
                    <div>
                        <img src="/icons/chat.png" alt="comments" className="post-icon"></img>
                        <span>{post.comment_count}</span>  
                    </div>

                    <div>
                        {/* post share link */}
                        <img src="/icons/share.png" alt="share" className="post-icon share-icon" onClick={this.copyURL}></img>
                    </div>

                    <div>
                        <span>Posted at: {Utils.timeStampToTime(post.post_time)}</span>
                    </div>

                </div>

            </div>
        )
    }
}