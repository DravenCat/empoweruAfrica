import React, { Component } from 'react'; 
import "./profile_edit.css"


export default class profile_edit extends Component {

    render() {

        return(
          <div className="edit-profile">
            
            <div className="edit-grid1">
            
            </div>

            <div className="edit-grid2">
              <div className="edit-grid2-photo">
            
              </div>

              <div className="edit-grid2-infoarea">

                <div className="edit-grid2-name">
                  <div>
                    <span>First Name:&nbsp;</span>
                    <input type="name" id="fname"></input>
                  </div>
                  <div>
                    <span>Last Name:&nbsp;</span>
                    <input type="name" id="lname"></input>
                  </div>
                </div>

                <div className="edit-grid2-title">
                  <span>Entrepreneur</span>
                </div>
              </div>

              <div className="edit-grid2-infoarea2">

                <div className="edit-grid2-age">
                  <div>
                    <span>Age:&nbsp;</span>
                    <input type="number" id="age"></input>
                  </div>
                </div>

                <div className="edit-grid2-location">
                  <div>
                    <span>Location:&nbsp;</span>
                    <input type="text" id="location"></input>
                  </div>
                </div>

                <div className="edit-grid2-email">
                  <div>
                    <span>Email:&nbsp;</span>
                    <input type="email" id="email"></input>
                  </div>
                </div>

                <div className="edit-grid2-phone">
                  <div>
                    <span>Phone:&nbsp;</span>
                    <input type="text" id="phone"></input>
                  </div>
                </div>

                <div className="edit-grid2-confirm">
                  <a id="edit-grid2-confirm">Confirm</a>
                </div>

              </div>

            </div>

            <div className="edit-grid3">
            
            </div>

            <div className="edit-grid4">

              <div className="edit-grid4-aboutme">
                <h1 className="edit-grid4-aboutme-header">About me</h1>
                <div className="edit-grid4-aboutme-text">
                  <div>
                    <textarea type="text" id="edit-aboutme"></textarea>
                  </div>
                </div>
              </div>

              <div className="edit-grid4-industry">
                <h1 className="edit-grid4-industry-header">Industry</h1>
                <div className="edit-grid4-industry-text">
                  <div>
                    <textarea type="text" id="edit-industry"></textarea>
                  </div>
                </div>
              </div>

              <div className="edit-grid4-tag">
                <h1 className="edit-grid4-tag-header">
                  Tag
                  <button id="tag-add">+</button>
                </h1>
                <div className="edit-grid4-tag-text">
                  <p className="edit-grid4-tag1">
                    <input type="text" id="edit-grid4-tag1"></input>
                  </p>
                  <p className="edit-grid4-tag2">
                    <input type="text" id="edit-grid4-tag2"></input>
                  </p>
                  <p className="edit-grid4-tag3">
                    <input type="text" id="edit-grid4-tag3"></input>
                  </p>
                </div>
              </div>

            </div>

            <div className="edit-grid5">
            
            </div>

          </div>
        )
      }
  
}