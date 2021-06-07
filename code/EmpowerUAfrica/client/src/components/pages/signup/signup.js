import React, { Component } from 'react'; 
import './signup.css';



export default class signin extends Component {
  render() {
    return(
    <div className="signup-field">
        <div className="signup-title">
            Sign up
        </div> 
        <div className="direct-signin">
            <span>
                Already have an acount?
            </span>
            <a id="signin" href="signin">
                Sig in
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
                <input type="text" id="username-input"/>
            </div>
        </div>
        <div className="signup-button">
            <button>
                Sign up
            </button>
        </div>
    </div>
    )
  }
}