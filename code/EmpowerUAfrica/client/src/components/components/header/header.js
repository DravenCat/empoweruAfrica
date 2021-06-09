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

            <a href="/notifications">
                <img src={bell} height='40px' width='40px'/>
            </a>

            
            <a href="/chat">
                <img src={chat} height='40px' width='40px'/>
            </a>
            

            <a href="/profile">
                <img src={profile} height='40px' width='40px'/>
            </a>


        </div>
    )
  }
}