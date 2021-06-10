import React, { Component } from 'react'; 
import "./setting_email.css"


export default class setting_email extends Component {

  render() {
    return(
      <div className="setting-cp">
        <h2 className="ce-sidenav-title">Account Setting</h2>
        <div className="ce-sidenav">
            <a id="changepassword" href="/setting_password">Change Password</a>
            <a id="changeemail" href="/setting_email">Change Email</a>
        </div>
        <div class="change-email-section">
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
                    
              <div className="ce-button">
                <br/>
                <button id="ce-button">
                  Confirm
                </button>
              </div>
            </div>
        </div>
    )
  }
}