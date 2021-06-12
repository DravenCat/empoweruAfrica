import React, { Component } from 'react'; 
import './signup.css';



export default class signin extends Component {

    // Consts
    emailMinLen = 0; // But it has to pass the RE validation
    emailMaxLen = 255; 
    passwordMinLen = 6; 
    passwordMaxLen = 255;
    userNameMinLen = 3; 
    userNameMaxLen = 31;
    userNameValidChars = ['-', '_'];
    emailValidationRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
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
        // document.getElementById("entrepreneur").style.background="rgb(34, 100, 243)";
        // document.getElementById("entrepreneur").style.color="white";
        // document.getElementById("company").style.background="white";
        // document.getElementById("company").style.color="black";
        // document.getElementById("investor").style.background="white";
        // document.getElementById("investor").style.color="black";
        this.setState({accountType: 0}); 
    }

    companyClick = ()=> {
        // document.getElementById("company").style.background="rgb(34, 100, 243)";
        // document.getElementById("company").style.color="white";
        // document.getElementById("entrepreneur").style.background="white";
        // document.getElementById("entrepreneur").style.color="black";
        // document.getElementById("investor").style.background="white";
        // document.getElementById("investor").style.color="black";
        this.setState({accountType: 1}); 
    }

    investorClick = ()=> {
        // document.getElementById("investor").style.background="rgb(34, 100, 243)";
        // document.getElementById("investor").style.color="white";
        // document.getElementById("company").style.background="white";
        // document.getElementById("company").style.color="black";
        // document.getElementById("entrepreneur").style.background="white";
        // document.getElementById("entrepreneur").style.color="black";
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
            this.setState({error: 'Two email entries does not match.'});
            return false; 
        }
        // Email too long or too short
        if (email.length > this.emailMaxLen || email.length < this.emailMinLen) {
            this.setState({error: `Emails should be between ${this.emailMinLen} and ${this.emailMaxLen} characters.`});
            return false; 
        }
        // Email not in correct form
        if (!(this.emailValidationRegex.test(email))) {
            this.setState({error: 'Email not in correct format. An \'@\' is expected. '})
            return false; 
        }

        return true; 
    }

    // Similiar to validateEmail, but with password. 
    validatePassword = (password, cpassword) => {
        // Two passwords do not match.
        if (password !== cpassword) {
            this.setState({error: 'Two password entries does not match.'});
            return false; 
        }
        // Password too long or too short. 
        if (password.length > this.passwordMaxLen || password.length < this.passwordMinLen) {
            this.setState({error: `Passwords should be between ${this.passwordMinLen} and ${this.passwordMaxLen} characters.`})
            return false; 
        }

        return true; 
    }

    validateUsername = (username) => {
        if (username.length > this.userNameMaxLen || username.length < this.userNameMinLen) {
            this.setState({error: `Username should be between ${this.userNameMinLen} and ${this.userNameMaxLen} characters.`}); 
            return false; 
        }
        for (let char of username) {
            if ( !(char >= 'a' && char <= 'z') && !(char >= 'A' && char <= 'Z') && !(char >= '0' && char <= '9') && !(char in this.userNameValidChars)) {
                this.setState({'error': `Username can only contain upper and lower case letters, digits and special symbols ${this.userNameValidChars.join(', ')}`});
                return false;
            }
        }
        this.setState({error: null});
        return true;
    }

    sendSignupRequest = async () => {
        let type = this.state.accountType;
        let username = document.getElementById('signup-username-input').value;
        let email = document.getElementById('signup-email-input').value;
        let cemail = document.getElementById('signup-cemail-input').value;
        let password = document.getElementById('signup-password-input').value;
        let cpassword = document.getElementById('signup-cpassword-input').value;

        // If any of the user entry is invalid. 
        if (!this.validateUsername(username)|| !this.validateEmail(email, cemail) || !this.validatePassword(password, cpassword)) {
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
            
            // return (
            //     // <Redirect to={this.state.redirect}/>
            // )
        }
        return(
            <div className="signup-page">

                <div className="signup-field">
                    <h2 className="signup-title">
                        Sign up as
                    </h2> 
                    {/* <button id="entrepreneur" onClick={this.entrepreneurClick}>Entrepreneur</button>
                    <button id="company" onClick={this.companyClick}>Company</button>
                    <button id="investor" onClick={this.investorClick}>Investor</button> */}
                    <div>
                        <button onClick={this.showMenu}>
                        Show menu
                        </button>
                        
                        {
                        this.state.showMenu
                            ? (
                            <div
                                className="menu"
                                ref={(element) => {
                                this.dropdownMenu = element;
                                }}
                            >
                                <button onClick={this.entrepreneurClick}>Entrepreneur</button>
                                <button onClick={this.companyClick}>Company</button>
                                <button onClick={this.investorClick}>Investor</button>
                            </div>
                            )
                            : (
                            null
                            )
                        }
                    </div>

                    

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
                    <a href="/sutype">
                    <button id="signup-button">
                        Create Account
                    </button>
                    </a>
                </div>
            </div>
    )
  }
}