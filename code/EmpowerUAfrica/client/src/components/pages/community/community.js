import React, { Component } from 'react'; 
import './community.css';
import Post from '../../components/post/post';
import { UserAbstract } from '../../components/userAbstract/userAbstract';
import Utils from '../../../utils';

const getPostsURL = '/community/getPosts';
const getUsersAbstractURL = '/profile/getUsersAbstract'; 
const postPerPage = 20; 

export default class community extends Component{

    state = {
        page: null,
        maxPage: null,
        posts: null,
        error: null
    }

    async getPosts(page){
        let res;
        let url = `${getPostsURL}?post_per_page=${postPerPage}&page_number=${page}&filters={}`; 
        try {
            res = await fetch(
                url,
                {
                    method: 'GET'
                }
            ); 
        }
        catch (err) {
            console.error(err); 
            this.setState({
                error: 'Internet Failure: Failed to connect to server.'
            })
            return;
        }
        let body; 
        try {
            body = await res.json();
        }
        catch (err) {
            console.error(err); 
            return; 
        }

        if (!res.ok) {
            this.setState({error: body.message}); 
            return; 
        }
        
        let posts = [
            {
                author: "test", 
                id: 'Pla0JdAos3pVoiVI1neP95YHT8F6hkKH3h4uq7KgRceo=', 
                post: {
                    post_time: Math.round(Date.now() / 1000),
                    title: 'My Title',
                    abbriv: 'In this post, I...',
                    comment_count: 23
                }
            },
            {
                author: "test2", 
                id: 'Pla0JdAos3pVoiVI1neP95YHT8F6hkKH3h4uq7KgRceo=', 
                post: {
                    post_time: Math.round(Date.now() / 1000),
                    title: 'My Title',
                    abbriv: 'In this post, I...',
                    comment_count: 23
                }
            }
        ];
        posts = body; 
        let users = [];
        // Filter unique usernames. 
        for (const post of posts) {
            if (users.indexOf(post.author) === -1) {
                users.push(post.author); 
            }
        }
        let usersAbstract = await Utils.getUsersAbstract(users); 
        
        for (const post of posts) {
            post.author = usersAbstract[post.author]; 
        }
        this.setState({page, posts}); 
    }

    

    componentDidMount() {
        let page = this.props.match.page || 0;
        this.getPosts(page); 
    }

    render() {
        let posts = []; 
        if (this.state.posts !== null) {
            posts = this.state.posts.map(
                (postObj) => {
                    return <Post post={postObj} key={postObj.id}/>
                }
            )
        }
        return (
            <div className="community">

                <div className="grid1">

                </div>

                <div className="grid2">

                    <div className="grid2-topbar">
                        {/* Community page title */}
                        <h2>Welcome to the community</h2>
                        {/* make new post button */}

                        <a id="direct-makepost" href="/community/make_post">Make Post</a><br></br>
                        {/* search input text area */}
                        <input className="search_input" type="text" placeholder="search by title"></input>
                        {/* search button */}
                        <button className="search_button" id="post_search">Search</button>
                    </div>

                    <div className="grid2-postsection">
                        {/* container for all the posts */}
                        {posts}
                    </div>

                </div>

                <div className="grid3">

                </div>

            </div>
        )
    }
}