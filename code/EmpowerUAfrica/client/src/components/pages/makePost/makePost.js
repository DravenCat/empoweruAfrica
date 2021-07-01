import React, { Component } from 'react'; 
import './makePost.css';

export default class community extends Component{

    render() {

        return (
            <div className="makePost">

                <div>

                </div>

                <div className="makePost_center">
                    <div className="makePost_title">
                        <h2>Title</h2>
                        <textarea></textarea>
                    </div>
                    <div className="makePost_content">
                        <h2>Content</h2>
                        <textarea></textarea>
                    </div>
                    <button id="createPost">Create Post</button>
                </div>

                <div>

                </div>

            </div>
        )
    }
}