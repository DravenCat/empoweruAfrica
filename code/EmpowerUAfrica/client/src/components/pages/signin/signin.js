import React, { Component } from 'react'; 
import './signin.css';



export default class signin extends Component {
  render() {
    return(
    <div className="signin-field">

        <div className="signin-title">
            Sign in
        </div> 
        <div className="direct-signup">
            <span>
                No account?
            </span>
            <a id="signup" href="signup">
                Sign up
            </a>
        </div>
        <div className="form-field">
            <div>
                <div>
                    Username/Email
                </div>
                <input type="text" id="username-input"/>
            </div>
            <div>
                <div>
                    Password
                </div>
                <input type="text" id="password-input"/>
            </div>
        </div>
        <div className="signin-button">
            <button>
                Sign in
            </button>
        </div>
    </div>
    )
  }
}