import React, { Component } from 'react'; 
import './signin.css';



export default class signin extends Component {

  render() {
    return(
        <div className="signin-page">
            <nav className="signin-navbar">
                <div className="signin-navbar-brand">
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    <a id="signin-home" href="/">
                        EmpowerU Africa
                    </a>
                </div>
            </nav>
            <div className="signin-field">
                <h2 className="signin-title">
                    Sign in
                </h2> 
                <div className="direct-signup">
                    <span>
                        No acount?
                    </span>
                    <a id="signup" href="signup">
                        &nbsp;Sign up
                    </a>
                </div>
                <div className="signin-form-field">
                <div>
                    <div>
                        Username/Email
                    </div>
                        <input type="text" id="signin-username-input"/>
                </div>
                <br/>
                <div>
                    <div>
                        Password
                    </div>
                        <input type="password" id="signin-password-input"/>
                    </div>
                </div>
                    
                <div className="signin-button">
                    <button id="signin-button">
                        Login
                    </button>
                </div>
            </div>
        </div>
    )
  }
} 

