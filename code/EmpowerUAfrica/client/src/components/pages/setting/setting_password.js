import React, { Component } from 'react'; 
import "./setting_password.css"


export default class setting_password extends Component {

  render() {
    return(
      <div className="setting-cp">
        <h2 className="cp-sidenav-title">Account Setting</h2>
        <div className="cp-sidenav">
            <a id="changepassword" href="//setting_password">Change Password</a>
            <a id="changeemail" href="/setting_email">Change Email</a>
        </div>
        <div class="change-passowrd-section">
          <h2>Change Password</h2><br/>
          <div className="cp-form-field">
            <div>
              <div>
                New Password
              </div>
                <input type="text" id="change-password-input"/><br/><br/>
              </div>
              <div>
                <div>
                  Confrim Password
                </div>
                  <input type="text" id="cchange-password-input"/>
                </div>
              </div>
                    
              <div className="cp-button">
                <br/>
                <button id="cp-button">
                  Confirm
                </button>
              </div>
            </div>
        </div>
    )
  }
}