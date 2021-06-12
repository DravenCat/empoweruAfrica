import React, { Component } from 'react'; 
import { Redirect } from 'react-router-dom';
import "./setting_email.css"


export default class setting_email extends Component {


  emailMinLen = 0; // But it has to pass the RE validation
  emailMaxLen = 255; 
  emailValidationRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

  state = {
    error: null
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

  sendUpdateRequest = async () => {
    let email = document.getElementById('change-email-input').value; 
    let cemail = document.getElementById('cchange-email-input').value; 
    if (!this.validateEmail(email, cemail)) {
      return;
    }

    let res;
    try {
      res = await fetch(
        '/account/updateCredentials', {
          method: 'POST',
          headers: {
            'content-type': 'application/json'
          },
          body: JSON.stringify({
            type: 'email', 
            'new': email
          })
        }
      );
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
      alert('Email updated successfully'); 
      window.location.reload(); 
      return; 
    }
    if (res.status === 403) {
      alert(body.message); 
      localStorage.setItem('signedIn', false); 
      localStorage.setItem('username', null); 
      window.location.replace("/signin");
    }
    this.setState({error: body.message});

  }

  render() {
    if (localStorage.getItem('signedIn') !== 'true') {
      return (
        <Redirect to="/signin" />
      )
    }

    let errorMsg = this.state.error === null ?
      "": 
      this.state.error; 
    // THIS IS NOT GOOD. WE NEED A SETTINGS PAGE
    return(
      <div className="setting-cp">
        <h2 className="ce-sidenav-title">Account Setting</h2>
        <div className="ce-sidenav">
            <a id="changepassword" href="/setting_password">Change Password</a>
            <a id="changeemail" href="/setting_email">Change Email</a>
        </div>
        <div className="change-email-section">
          <h2>Change Email&nbsp;&nbsp;&nbsp;</h2><br/>
          <div className="ce-form-field">
            <div>
              <div>
                New Email&nbsp;&nbsp;&nbsp;
              </div>
                <input type="text" id="change-email-input"/><br/><br/>
              </div>
              <div>
                <div>
                  Confrim Email&nbsp;&nbsp;&nbsp;
                </div>
                  <input type="text" id="cchange-email-input"/>
                </div>
              </div>
                
              <p className="warningMsg">{errorMsg}</p>

              <div className="ce-button">
                <br/>
                <button id="ce-button" onClick={this.sendUpdateRequest}>
                  Confirm
                </button>
              </div>
            </div>
        </div>
    )
  }
}