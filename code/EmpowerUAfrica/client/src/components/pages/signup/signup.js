import React, { Component } from 'react'; 
import './signup.css';



export default class signin extends Component {
  render() {
    return(
        <div className="signup-page">
            <nav className="signup-navbar">
                <div className="signup-navbar-brand">
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    <a id="signup-home" href="/">
                        EmpowerU Africa
                    </a>
                </div>
            </nav>
            <div className="signup-field">
                <h2 className="signup-title">
                    Sign up
                </h2> 
                <div className="direct-signin">
                    <span>
                        Have an acount?
                    </span>
                    <a id="signin" href="signin">
                        &nbsp;Sign in
                    </a>
                </div>
                <div className="signup-form-field">
                    <div>
                        <div>
                            Username
                        </div>
                            <input type="text" id="signin-username-input"/>
                    </div>
                    <div>
                        <div>
                            Email
                        </div>
                            <input type="text" id="signin-email-input"/>
                    </div>
                    <div>
                        <div>
                            Confirm Email
                        </div>
                            <input type="text" id="signin-cemail-input"/>
                    </div>
                    <div>
                        <div>
                            Password
                        </div>
                            <input type="password" id="signin-password-input"/>
                    </div>
                    <div>
                        <div>
                            Confirm password
                        </div>
                            <input type="password" id="signin-cpassword-input"/>
                    </div>
                </div>
        
                <div className="signup-button">
                    <button id="signup-button">
                        Create Account
                    </button>
                </div>
            </div>
        </div>
    )
  }
}