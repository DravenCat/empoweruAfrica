import React, { Component } from 'react'; 
import './community.css';
import Post from '../../components/post/post';
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
        let url = `${getPostsURL}?page_number=${page}&post_per_page=${postPerPage}&filters={}`; 
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
        let posts; 

        posts = await res.json();
        console.log(posts);

        if (!res.ok) {
            this.setState({error: posts.message}); 
            return; 
        }
        
        let users = [];
        // Filter unique usernames. 
        for (const post of posts) {
            if (users.indexOf(post.author) === -1) {
                users.push(post.author); 
            }
        }
        let usersAbstract = {};
        if (users.length !== 0) {
            usersAbstract = await Utils.getUsersAbstract(users); 
        } 
        
        for (const post of posts) {
            post.authorInfo = usersAbstract[post.author]; 
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
                    return <Post post={postObj} key={postObj.post_id}/>
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