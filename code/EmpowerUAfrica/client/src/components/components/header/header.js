import React, { Component } from 'react'; 
import './header.css'

export default class header extends Component {
  componentDidMount() {
    document.title = "EmpowerU Africa";
  }
  render() {
    return(
        <div>
            <a id="home" href="/">
                EmpowerU Africa
            </a>

            <a id="community" href="/community">
                Community
            </a>

            <a id="assignment" href="/assignment">
                Assignment
            </a>

            <a id="learn" href="/learn">
                Start to Learn
            </a>

            <a id="calendar" href="/calendar">
                Calendar
            </a>

            {/* This is temporary, replace with bell icon */}
            <a id="notifications" href="/notifications">
                Notifications
            </a>

            {/* This is temporary, replace with chat icon */}
            <a id="chat" href="/chat">
                Chat
            </a>

            {/* This is temporary, replace with bell icon */}
            <a id="profile" href="/profile">
                Profile
            </a>

        </div>
    )
  }
}