import React, { Component } from 'react'; 
import './signup.css';




export default class signin extends Component {
    signupURL = '/account/signup';

    // State


    constructor() {
        super();
        
        this.state = {
            showMenu: false,
            accountType: 0,
            error: null
        }
        
        this.showMenu = this.showMenu.bind(this);
        this.closeMenu = this.closeMenu.bind(this);
      }

    showMenu(event) {
        event.preventDefault();
        
        this.setState({ showMenu: true }, () => {
          document.addEventListener('click', this.closeMenu);
        });
      }
      
    closeMenu(event) {
        
        if (!this.dropdownMenu.contains(event.target)) {
          
          this.setState({ showMenu: false }, () => {
            document.removeEventListener('click', this.closeMenu);
          });  
          
        }
      }
    

    entrepreneurClick = ()=> {
        this.setState({accountType: 0}); 
    }

    companyClick = ()=> {
        this.setState({accountType: 1}); 
    }

    investorClick = ()=> {
        this.setState({accountType: 2});
    }

    sendSignupRequest = async () => {
        let type = this.state.accountType;
        let username = document.getElementById('signup-username-input').value;
        let email = document.getElementById('signup-email-input').value;
        let cemail = document.getElementById('signup-cemail-input').value;
        let password = document.getElementById('signup-password-input').value;
        let cpassword = document.getElementById('signup-cpassword-input').value;

        if (password !== cpassword) {
            this.setState({error: 'Two password entries does not match'});
            return; 
        }
        if (email !== cemail) {
            this.setState({error: 'Two email entries does not match'});
            return; 
        }

        let res; 
        // ajax
        try{
            res = await fetch(this.signupURL, {
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
            }); 
        }
        catch (err) {
            alert('Internet Failure'); 
            console.error(err);
            return;
        }

        let body; 
        try {
            body = await res.json();
        }
        catch (err) {
            console.error(err);
            return;
        }
        if (res.ok) {
            localStorage.setItem('signedIn', true);
            localStorage.setItem('username', username); 
            window.location.replace('/');
            return; 
        }
        this.setState({error: body.message});
    }

    render() {
        let errMsg = this.state.error === null ?
            "":
            this.state.error; 
        if (this.state.redirect !== undefined) {

        }
        return(
            <div className="signup-page">
                &nbsp;
                <div className="signup-field">

                    <div className="signup-left">
                        <p className="signup-left-title">Welcome to Our Community</p>
                        <p className="signup-left-text">To keep connected with us please sign up with 
                            your personal information by email and password
                        </p>
                        <p className="signup-left-text2">Or log into an account if you have one
                        </p>
                        <a id="direct-signin" href="/signin">Log into your account</a>
                    </div>

                    <div className="signup-midleft">

                    </div>

                    <div className="signup-midright">
                        <h2 className="signup-title">
                            Sign up 
                        </h2>   

                        <div class="account-type">
                            <div>
                                Account type
                            </div>
                            <select id="account-type">
                                <option>entrepreneur</option>
                                <option>Company</option>
                                <option>Investor</option>
                            </select>
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


                        <p className="errorMsg">{errMsg}</p>

                        <div className="signup-button">
                            <button id="signup-button" onClick={this.sendSignupRequest}>
                                Create Account
                            </button>
                        </div>
                    </div>

                    <div className="signup-right">

                    </div>
                    
                </div>
            </div>
        )
    }
}