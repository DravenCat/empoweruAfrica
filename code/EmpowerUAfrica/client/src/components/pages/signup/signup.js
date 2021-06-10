import React, { Component } from 'react'; 
import './signup.css';



export default class signin extends Component {

    entrepreneurClick = ()=> {
        document.getElementById("entrepreneur").style.background="rgb(34, 100, 243)";
        document.getElementById("entrepreneur").style.color="white";
        document.getElementById("company").style.background="white";
        document.getElementById("company").style.color="black";
        document.getElementById("investor").style.background="white";
        document.getElementById("investor").style.color="black";
    }

    companyClick = ()=> {
        document.getElementById("company").style.background="rgb(34, 100, 243)";
        document.getElementById("company").style.color="white";
        document.getElementById("entrepreneur").style.background="white";
        document.getElementById("entrepreneur").style.color="black";
        document.getElementById("investor").style.background="white";
        document.getElementById("investor").style.color="black";
    }

    investorClick = ()=> {
        document.getElementById("investor").style.background="rgb(34, 100, 243)";
        document.getElementById("investor").style.color="white";
        document.getElementById("company").style.background="white";
        document.getElementById("company").style.color="black";
        document.getElementById("entrepreneur").style.background="white";
        document.getElementById("entrepreneur").style.color="black";
    }

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
                                <input type="text" id="signup-username-input"/>
                        </div>
                        <br/>
                        <div>
                            <div>
                                Email
                            </div>
                                <input type="text" id="signup-email-input"/>
                        </div>
                        <br/>
                        <div>
                            <div>
                                Confirm Email
                            </div>
                                <input type="text" id="signup-cemail-input"/>
                        </div>
                        <br/>
                        <div>
                            <div>
                                Password
                            </div>
                                <input type="password" id="signup-password-input"/>
                        </div>
                        <br/>
                        <div>
                            <div>
                                Confirm password
                            </div>
                                <input type="password" id="signup-cpassword-input"/>
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