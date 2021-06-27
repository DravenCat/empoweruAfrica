import React, { Component } from 'react'; 
import './community.css';
import Post from '../../components/post/post';

export default class community extends Component{

    render() {
        return (
            <div className="community">

                <div className="grid1">

                </div>

                <div className="grid2">

                    <div className="grid2-topbar">
                        <h2>Community</h2>
                        <a id="direct-makepost">Make Post</a>
                    </div>

                    <div className="grid2-postsection">
                        <Post/>
                        <Post/>
                        <Post/>
                    </div>

                </div>

                <div className="grid3">

                </div>

            </div>
        )
    }
}