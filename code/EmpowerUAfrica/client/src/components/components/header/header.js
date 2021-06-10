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
        return(
            <div className="navbar">


                <span className="navbar-brand">
                    <a id="home" href="/">
                        EmpowerU Africa
                    </a>
                </span>


                <span className="navbar-community">
                    <a id="community" href="/community">
                        Community
                    </a>
                </span>

                <span className="navbar-assignment">
                    <a id="assignment" href="/assignment">
                        Assignment
                    </a>
                </span>

                <span className="navbar-learn">
                    <a id="learn" href="/learn">
                        Start to Learn
                    </a>
                </span>
                
                <span className="navbar-calendar">
                    <a id="calendar" href="/calendar">
                        Calendar
                    </a>
                </span>

                <span className="navbar-notifications">
                    <a id="navbar-notification" href="/notifications">
                        <img src={bell} alt="bell" height='40px' width='40px'/>
                    </a>
                </span>
        
                <span className="navbar-chat">
                    <a id = "navbar-chat" href="/chat">
                        <img src={chat} alt="chat" height='40px' width='40px'/>
                    </a>
                </span>

                <span className="navbar-profile">
                    <a id ="navbar-profile" href="/signup">
                        <div class="profile-dropdown">
                            <img src={profile} alt="profile" height='40px' width='40px' className="dropbtn"/>
                            <div class="profile-dropdown-content">
                                <a href="/profile" id="account-profile">Profile</a>
                                <a href="/chat" id="account-chat">Chat</a>
                                <a href="/notification" id="account-notification">Notification</a>
                                <a href="/viewallmyposts" id="account-viewallmyposts">View All My Posts</a>
                                <a href="/setting" id="account-setting">Setting</a>
                                <a href="/logout" id="account-logout">Logout</a>
                            </div>
                        </div>
                    </a>
                </span>
            </div>
        )
    }
} 






