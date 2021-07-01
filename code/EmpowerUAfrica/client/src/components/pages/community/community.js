import React, { Component } from 'react'; 
import './community.css';
import Post from '../../components/post/post';

export default class community extends Component{

    render() {
        const postInfo = [
            {
                userName: "user1",
                title: "title1",
                content: "content1",
                commentNumber: 20,
            },
            {
                userName: "user2",
                title: "title2",
                content: "content2",
                commentNumber: 30,
            },
            {
                userName: "user3",
                title: "title3",
                content: "content3",
                commentNumber: 40,
            }
        ]

        return (
            <div className="community">

                <div className="grid1">

                </div>

                <div className="grid2">

                    <div className="grid2-topbar">
                        <h2>Community</h2>
                        <a id="direct-makepost" href="/community/make_post">Make Post</a><br></br>
                        <input className="search_input" type="text" placeholder="search by title"></input>
                        <button className="search_button" id="post_search">Search</button>
                    </div>

                    <div className="grid2-postsection">
                        <Post post={postInfo[0]} />
                        <Post post={postInfo[1]} />
                        <Post post={postInfo[2]} />
                    </div>

                </div>

                <div className="grid3">

                </div>

            </div>
        )
    }
}