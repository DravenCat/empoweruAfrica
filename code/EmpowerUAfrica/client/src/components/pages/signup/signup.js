import React, { Component } from 'react'; 
import { Redirect } from 'react-router-dom';
import './signup.css';



export default class signin extends Component {

    // Consts
    emailMinLen = 0; // But it has to pass the RE validation
    emailMaxLen = 255; 
    passwordMinLen = 6; 
    passwordMaxLen = 255;
    userNameMinLen = 3; 
    userNameMaxLen = 31;
    emailValidationRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    signupURL = '/account/signup';

    // State
    state = {
        accountType: 0
    }


    entrepreneurClick = ()=> {
        document.getElementById("entrepreneur").style.background="rgb(34, 100, 243)";
        document.getElementById("entrepreneur").style.color="white";
        document.getElementById("company").style.background="white";
        document.getElementById("company").style.color="black";
        document.getElementById("investor").style.background="white";
        document.getElementById("investor").style.color="black";
        this.setState({accountType: 0}); 
    }

    companyClick = ()=> {
        document.getElementById("company").style.background="rgb(34, 100, 243)";
        document.getElementById("company").style.color="white";
        document.getElementById("entrepreneur").style.background="white";
        document.getElementById("entrepreneur").style.color="black";
        document.getElementById("investor").style.background="white";
        document.getElementById("investor").style.color="black";
        this.setState({accountType: 1}); 
    }

    investorClick = ()=> {
        document.getElementById("investor").style.background="rgb(34, 100, 243)";
        document.getElementById("investor").style.color="white";
        document.getElementById("company").style.background="white";
        document.getElementById("company").style.color="black";
        document.getElementById("entrepreneur").style.background="white";
        document.getElementById("entrepreneur").style.color="black";
        this.setState({accountType: 2});
    }

    /*
        params: 
            - email: String, the email to be validated
            - cemail: String, the email user inputted in the 
            'confirm email' input. 
        returns:
            - true, if email is a valid email address and cemail === email
            - false, o\w
    */
    validateEmail = (email, cemail) => {
        // Two emails do not match
        if (email !== cemail) {
            return false; 
        }
        // Email too long or too short
        if (email.length > this.emailMaxLen || email.length < this.emailMinLen) {
            return false; 
        }
        // Email not in correct form
        if (!(this.emailValidationRegex.test(email))) {
            return false; 
        }

        return true; 
    }

    // Similiar to validateEmail, but with password. 
    validatePassword = (password, cpassword) => {
        // Two passwords do not match.
        if (password !== cpassword) {
            return false; 
        }
        // Password too long or too short. 
        if (password.length > this.passwordMaxLen || password.length < this.passwordMinLen) {
            return false; 
        }

        return true; 
    }

    validateUsername = (username) => {
        if (username.length > this.userNameMaxLen || username.length < this.userNameMinLen) {
            return false; 
        }
        return true;
    }

    sendSignupRequest = () => {
        let type = this.state.accountType;
        let username = document.getElementById('signup-username-input').value;
        let email = document.getElementById('signup-email-input').value;
        let cemail = document.getElementById('signup-cemail-input').value;
        let password = document.getElementById('signup-password-input').value;
        let cpassword = document.getElementById('signup-cpassword-input').value;

        // If any of the user entry is invalid. 
        if (!this.validateEmail(email, cemail) || !this.validatePassword(password, cpassword) || !this.validateUsername(username)) {
            return;
        }

        // ajax
        fetch(this.signupURL, {
            method: 'POST',
            body: JSON.stringify({
                username,
                email,
                password,
                type
            }),
            headers: {
                'content-type': 'application/json'
            }
        }).then((res) => {
            if (res.status === 200) {
                this.setState({redirect: '/'});
                return; 
            }
            console.log(res);
            console.log(res.json());
        })
    }

    render() {
        if (this.state.redirect !== undefined) {
            
            return (
                <Redirect to={this.state.redirect}/>
            )
        }
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
                        Sign up as
                    </h2> 
                    <button id="entrepreneur" onClick={this.entrepreneurClick}>Entrepreneur</button>
                    <button id="company" onClick={this.companyClick}>Company</button>
                    <button id="investor" onClick={this.investorClick}>Investor</button>
                    <span>Account<br/><br/></span>
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
                                <input 
                                type="text" 
                                id="signup-username-input" 
                                maxLength={this.userNameMaxLen}
                                />
                        </div>
                        <br/>
                        <div>
                            <div>
                                Email
                            </div>
                                <input 
                                type="email" 
                                id="signup-email-input" 
                                maxLength={this.emailMaxLen}
                                pattern={this.emailValidationRegex}
                                />
                        </div>
                        <br/>
                        <div>
                            <div>
                                Confirm Email
                            </div>
                                <input 
                                type="email" 
                                id="signup-cemail-input" 
                                maxLength={this.emailMaxLen}
                                pattern={this.emailValidationRegex}
                                />
                        </div>
                        <br/>
                        <div>
                            <div>
                                Password
                            </div>
                                <input 
                                type="password" 
                                id="signup-password-input" 
                                maxLength={this.passwordMaxLen}
                                />
                        </div>
                        <br/>
                        <div>
                            <div>
                                Confirm password
                            </div>
                                <input 
                                type="password" 
                                id="signup-cpassword-input" 
                                maxLength={this.passwordMaxLen}
                                />
                        </div>
                    </div>
            
                    <div className="signup-button">
                        <button id="signup-button" onClick={this.sendSignupRequest}>
                            Create Account
                        </button>
                    </div>
                </div>
            </div>
        )
    }
}