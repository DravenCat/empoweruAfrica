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

    render() {
        let username = localStorage.getItem('username');
        let greeting = localStorage.getItem('signedIn') === 'true' ? 
            <span>Welcome {username}</span>: 
            <span><a href="/signin" id="greeting-signin">Sign in</a></span>; 

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
                                <img src={bell} alt="bell" height='30px' width='30px'/>
                                <span id="navbar-notification-text">Notification</span>
                            </a>
                        </div>
                
                        <div className="navbar-chat">
                            <a id = "navbar-chat" href="/chat">
                                <img src={chat} alt="chat" height='30px' width='30px'/>
                                <span id="navbar-chat-text">Chat</span>
                            </a>
                        </div>

                        <div className="navbar-profile">
                            <div id ="navbar-profile" href="/signup">
                                <div className="profile-dropdown">
                                    <img src={profile} alt="profile" height='30px' width='30px' className="dropbtn"/>
                                    <span id="navbar-profile-text">Account</span>
                                    <div className="profile-dropdown-content">
                                        <a href="/profile" id="account-profile">Profile</a>
                                        <a href="/viewallmyposts" id="account-viewallmyposts">View My Posts</a>
                                        <a href="/setting_password" id="account-setting">Setting</a>
                                        <button onClick={this.signOut} id="account-logout">Logout</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div id="greeting">
                            {greeting}
                        </div>

                    </div>

                </div>
            </div>
        )
    }
} 






