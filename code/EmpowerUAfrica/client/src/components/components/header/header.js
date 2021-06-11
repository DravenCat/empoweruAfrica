import React, { Component } from 'react'; 
import './header.css'
import chat from '../../../resource/icons/chat.png'
import bell from '../../../resource/icons/bell.png'
import profile from '../../../resource/icons/profile.png'

export default class header extends Component {

    componentDidMount() {
        document.title = "EmpowerU Africa";
    }

    render() {
        let username = localStorage.getItem('username');
        let greeting = localStorage.getItem('loggedIn') === 'true' ? 
            <p><a href="/signin">Sign in</a><br />No account? <a href="/signup">sign up</a></p> :
            <p>Welcome back! {username} </p>; 

        return(
            <div className="navbar">
            <div className="nav-wrapper">

                <div className="navbar-brand">
                    <a id="home" href="/">
                        EmpowerU Africa
                    </a>
                </div>

                <div className="navbar-links">
                    <div className="navbar-community">
                        <a id="community" href="/community">
                            Community
                        </a>
                    </div>

                    <div className="navbar-assignment">
                        <a id="assignment" href="/assignment">
                            Assignment
                        </a>
                    </div>

                    <div className="navbar-learn">
                        <a id="learn" href="/learn">
                            Start to Learn
                        </a>
                    </div>
                    
                    <div className="navbar-calendar">
                        <a id="calendar" href="/calendar">
                            Calendar
                        </a>
                    </div>
                </div>
                
                <div className="navbar-icons">
                    <div className="navbar-notification">
                        <a id="navbar-notification" href="/notifications">
                            <img src={bell} alt="bell" height='40px' width='40px'/>
                        </a>
                    </div>
            
                    <div className="navbar-chat">
                        <a id = "navbar-chat" href="/chat">
                            <img src={chat} alt="chat" height='40px' width='40px'/>
                        </a>
                    </div>

                    <div className="navbar-profile">
                        <div id ="navbar-profile" href="/signup">
                            <div className="profile-dropdown">
                                <img src={profile} alt="profile" height='40px' width='40px' className="dropbtn"/>
                                <div className="profile-dropdown-content">
                                    <a href="/profile" id="account-profile">Profile</a>
                                    <a href="/chat" id="account-chat">Chat</a>
                                    <a href="/notification" id="account-notification">Notification</a>
                                    <a href="/viewallmyposts" id="account-viewallmyposts">View All My Posts</a>
                                    <a href="/setting_password" id="account-setting">Setting</a>
                                    <a href="/logout" id="account-logout">Logout</a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>{greeting}</div>
                    </div>
                </div>
            </div>
        )
    }
} 






