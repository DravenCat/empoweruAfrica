import React, { Component } from 'react'; 
import './signin.css';



export default class signin extends Component {

    signinURL = '/account/signin';

    state = {
        error: null
    }

    sendSigninRequest = async () => {
        let id = document.getElementById('signin-username-input').value; 
        let password = document.getElementById('signin-password-input').value; 
        let res;

        try {
            res = await fetch(this.signinURL, {
                method: 'POST', 
                body: JSON.stringify({
                    id, 
                    password
                }), 
                headers: {
                    'content-type': 'application/json'
                }
            });
        }
        catch (err) {
            alert('Internet Failure');
            console.error(err);
            return; 
        }
        let body
        try{
            body = await res.json();
        }
        catch (err) {
            console.error(err);
            return;
        }

        // Sign in success
        if (res.ok) {
            localStorage.setItem('signedIn', true);
            localStorage.setItem('username', body.username); 
            window.location.replace('/');
            return; 
        }
        this.setState({error: body.message});
    }

  render() {

    let errMsg = this.state.error === null ? 
        "": 
        this.state.error; 
    return(
        <div className="signin-page">
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
                
                <p className="warningMsg">{errMsg}</p>

                <div className="signin-button">
                    <button id="signin-button" onClick={this.sendSigninRequest}>
                        Login
                    </button>
                </div>
            </div>
        </div>
    )
  }
} 

