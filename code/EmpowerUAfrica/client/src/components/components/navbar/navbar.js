import React, { Component } from 'react'; 
import './navbar.css'
import chat from '../../../resource/icons/chat.png'
import bell from '../../../resource/icons/bell.png'
import profile from '../../../resource/icons/profile.png'

export default class header extends Component {

    componentDidMount() {
        document.title = "EmpowerU Africa";
    }

    signOut = () => {
        fetch('/account/signout', 
        {   
            method: 'POST'
        }).then((res) => {
            if (res.status === 200) {
                localStorage.setItem('signedIn', false); 
                localStorage.setItem('username', null);
                window.location.reload(); 
            }
        })
    }
    viewMyProfile = () => {
        let url = ''
        if (localStorage.getItem('signedIn') !== 'true') {
            url = '/signin';
        }
        else {
            url = '/profile/' + localStorage.getItem('username');
        }
        window.location.replace(url);
    }

    render() {
        let username = localStorage.getItem('username');
        let greeting = localStorage.getItem('signedIn') === 'true' ? 
            <div id="greeting-signin"><div>Welcome</div><div>{username}</div></div>: 
            <div><a href="/signin" id="greeting-signin">Sign in</a></div>; 

        return(
            <div className="navbar">
                <div className="navbar-grid">

                    {/* Website brand EmpowerUAfrica */}
                    <div className="navbar-brand">
                        <a id="home" href="/">
                            EmpowerU Africa
                        </a>
                    </div>

                    {/* Website navbar text links */}
                    <div className="navbar-links">

                        {/* Website navbar community link*/}
                        <div className="navbar-community">
                            <a id="community" href="/community">
                                Community
                            </a>
                        </div>

                        {/* Website navbar assignment link*/}
                        <div className="navbar-assignment">
                            <a id="assignment" href="/assignment">
                                Assignment
                            </a>
                        </div>

                        {/* Website navbar learn link*/}
                        <div className="navbar-learn">
                            <a id="learn" href="/learn">
                                Start to Learn
                            </a>
                        </div>
                        
                        {/* Website navbar calendar link*/}
                        <div className="navbar-calendar">
                            <a id="calendar" href="/calendar">
                                Calendar
                            </a>
                        </div>

                    </div>
                    
                    {/* Website navbar icon links */}
                    <div className="navbar-icons">

                        {/* Website navbar notification link*/}
                        <div className="navbar-notification">
                            <a id="navbar-notification" href="/notifications">
                                <img src={bell} alt="bell" height='30px' width='30px'/>
                            </a>
                        </div>

                        {/* Website navbar chat link*/}
                        <div className="navbar-chat">
                            <a id = "navbar-chat" href="/chat">
                                <img src={chat} alt="chat" height='30px' width='30px'/>
                            </a>
                        </div>

                        {/* Website navbar account link*/}
                        <div className="navbar-profile">
                            <div id ="navbar-profile">
                                <div className="profile-dropdown">
                                    <img src={profile} alt="profile" height='30px' width='30px'/>
                                    <div className="profile-dropdown-content">

                                        {/* Website navbar profile link*/}
                                        <button onClick={this.viewMyProfile} id="account-profile">Profile</button>
                                        {/* Website navbar view all posts link*/}
                                        <a href="/view_all_posts" id="account-viewallmyposts">View My Posts</a>
                                        {/* Website navbar account setting link*/}

                                        <a href="/setting_password" id="account-setting">Setting</a>
                                        {/* Website navbar sign out link*/}
                                        <button onClick={this.signOut} id="account-logout">Logout</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Website navbar greeting message and sign in link*/}
                        <div id="greeting">
                            {greeting}
                        </div>

                    </div>

                </div>
            </div>
        )
    }
} 





