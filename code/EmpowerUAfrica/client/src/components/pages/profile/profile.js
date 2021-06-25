import React, { Component } from 'react'; 
import "./profile.css"


export default class profile extends Component {

    render() {

        return(
          <div className="profile">
            
            {/* grid display column 1 */}
            <div className="grid1">
            
            </div>

            {/* grid display column 2 */}
            <div className="grid2">

              {/* profile picture */}
              <div className="grid2-photo">
            
              </div>

              {/* profile information */}
              <div className="grid2-infoarea">

                <div className="grid2-name">
                  {/* profile firstname */}
                  <span>Firstname</span>
                  &nbsp;&nbsp;&nbsp;
                  {/* profile lastname */}
                  <span>Lastname</span>
                </div>

                <div className="grid2-title">
                  {/* profile account type */}
                  <span>Entrepreneur</span>
                </div>
              </div>

              {/* profile information */}
              <div className="grid2-infoarea2">

                {/* profile age */}
                <div className="grid2-birthday">
                  <span>Age: 18</span>
                </div>

                {/* profile location */}
                <div className="grid2-location">
                  <span>Location: Toronto, Canada</span>
                </div>

                {/* profile email */}
                <div className="grid2-email">
                  <span>Email: example@mail.com</span>
                </div>

                {/* profile phone number */}
                <div className="grid2-phone">
                  <span>Phone: +1 (070) 123-4567</span>
                </div>

                {/* direct to profile edit page */}
                <div className="grid2-edit">
                  <a id="grid2-edit" href="/edit-profile">Edit</a>
                </div>

              </div>

            </div>

            {/* grid display column 3 */}
            <div className="grid3">
            
            </div>

            {/* grid display column 4 */}
            <div className="grid4">

              <div className="grid4-aboutme">
                <h1 className="grid4-aboutme-header">About me</h1>
                <div className="grid4-aboutme-text">
                  {/* profile aboutme section */}
                  <span>
                    I'm Creative Director and UI/UX Designer from Sydney, Australia, working in web development and print media. 
                    I enjoy turning complex problems into simple, beautiful and intuitive designs.
                    My job is to build your website so that it is functional and user-friendly 
                    but at the same time attractive. Moreover, I add personal touch to your product and make sure that is eye-catching 
                    and easy to use. My aim is to bring across your message and identity in the most creative way. I created web design 
                    for many famous brand companies.
                  </span>
                </div>
              </div>

              <div className="grid4-industry">
                <h1 className="grid4-industry-header">Industry</h1>
                <div className="grid4-industry-text">
                  {/* profile aboutme industry */}
                  <span>
                    you haven't add any informaton here yet
                  </span>
                </div>
              </div>

              <div className="grid4-tag">
                <h1 className="grid4-tag-header">Tag</h1>
                <div className="grid4-tag-text">
                  {/* profile tag section */}
                  <p id="grid4-tag1">
                    you haven't add any tag here yet
                  </p>
                  <p id="grid4-tag2">
                    you haven't add any tag here yet
                  </p>
                  <p cid="grid4-tag3">
                    you haven't add any tag here yet
                  </p>
                </div>
              </div>

            </div>

            {/* grid display column 5 */}
            <div className="grid5">
            
            </div>

          </div>
        )
      }
  
}