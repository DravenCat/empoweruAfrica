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
            <nav className="navbar">

                <div className="navbar-brand">
                    <a id="home" href="/">
                        EmpowerU Africa
                    </a>
                </div>

                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;

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

                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;

                <div className="navbar-notifications">
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
                    <a id ="navbar-profile" href="/signup">
                        <img src={profile} alt="profile" height='40px' width='40px'/>
                    </a>
                </div>
            </nav>
        )
    }
} 





