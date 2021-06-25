import React, { Component } from 'react'; 
import Loading from '../../components/loading/loading'; 
import Tag from '../../components/tag/tag';
import "./profile.css"


export default class profile extends Component {

  userTypes = ['Individual', 'Company', 'Partner']; 

  state = {
    username: null,
    type: null,
    profile: null,
    error: null
  }
  getProfileData = (username) => {
    // Fake data
    let type = 0;
    let profile = {
      "name": "Bosco Njoku",
      "gender": "male",
      "birthday": "1970-01-01",
      "phone": "100 1111 1010",
      "industry": "Software Engineering",
      "description": "I am a male homo-sapiens, currently working as a programmer. I’m learning to start my own online short video platform",
      "tags": ["software engineering", "programmer", "streaming"]
    }
    type = 1;
    profile = {
      "name": "Bosco Network Co., Ltd.",
      "website": "bosco.io",
      "industry": "Entertainment",
      "description": "We are aiming to make short video entertainment more accessible than ever in Africa. ",
      "tags": ["entertainment", "short video", "streaming"]
    }
  //   type = 2;
  //   profile = {
  //     "name": "Adaora Din-Kariuki",
  //     "phone": "100 1111 1011",
  //     "industry": "Software Engineering",
  //     "description": "I am looking for startup companies to invest in. ",
  //     "tags": ["software engineering", "investor"]
  // }
  
    

    this.setState({
      username,
      type,
      profile
    })

  }

  componentDidMount() {
    let { username } = this.props.match.params; 
    this.getProfileData(username);
  }

  render() {
    if (this.state.username === null) {
      // If this.getProfileData havn't finish executing
      return(<Loading />);
    }

    if (this.state.error !== null) {
      // There is an error message
      return(<p className="warningMsg">{this.state.error}</p>);
    }
    
    let profile = this.state.profile;
    let tags = profile.tags.map((tag)=>{return <Tag tag={tag}/>});

    if (this.state.type === 0) {
      // Individual profile
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
                {/* profile fullname */}
                <b>{profile.name}</b>
              </div>
  
              <div className="grid2-title">
                {/* profile account type */}
                <span>{this.userTypes[this.state.type]}</span>
              </div>
            </div>
  
            {/* profile information */}
            <div className="grid2-infoarea2">
  
              {/* profile age */}
              <div className="grid2-birthday">
                <span>Birthday: {profile.birthday}</span>
              </div>
  
              {/* profile location
              <div className="grid2-location">
                <span>Location: Toronto, Canada</span>
              </div> */}
  
              {/* profile email */}
              <div className="grid2-email">
                <span>Email: example@mail.com</span>
              </div>
  
              {/* profile phone number */}
              <div className="grid2-phone">
                <span>Phone: {profile.phone}</span>
              </div>
  
              {/* direct to profile edit page */}
              <div className="grid2-edit">
                {
                  localStorage.getItem('username') === this.state.username?
                  <a id="grid2-edit" href="/edit-profile">Edit</a>:
                  <p></p>
                }
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
                  {profile.description}
                </span>
              </div>
            </div>
  
            <div className="grid4-industry">
              <h1 className="grid4-industry-header">Industry</h1>
              <div className="grid4-industry-text">
                {/* profile aboutme industry */}
                <span>
                  {profile.industry}
                </span>
              </div>
            </div>
  
            <div className="grid4-tag">
              <h1 className="grid4-tag-header">Tags</h1>
              <div className="grid4-tag-text">
                {/* profile tag section */}
                {tags}
              </div>
            </div>
  
          </div>
  
          {/* grid display column 5 */}
          <div className="grid5">
          
          </div>
  
        </div>
      )
    }
    if (this.state.type === 1) {
      // Company profile
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
                {/* profile fullname */}
                <b>{profile.name}</b>
              </div>
  
              <div className="grid2-title">
                {/* profile account type */}
                <span>{this.userTypes[this.state.type]}</span>
              </div>
            </div>
  
            {/* profile information */}
            <div className="grid2-infoarea2">
  
              {/* profile age */}
              <div className="grid2-birthday">
                <span>Website: {profile.website}</span>
              </div>
  
              {/* profile location
              <div className="grid2-location">
                <span>Location: Toronto, Canada</span>
              </div> */}
  
              {/* profile email */}
              <div className="grid2-email">
                <span>Email: example@mail.com</span>
              </div>
  
              {/* profile phone number */}
              <div className="grid2-phone">
                <span>Phone: {profile.phone}</span>
              </div>
  
              {/* direct to profile edit page */}
              <div className="grid2-edit">
                {
                  localStorage.getItem('username') === this.state.username?
                  <a id="grid2-edit" href="/edit-profile">Edit</a>:
                  <p></p>
                }
              </div>
  
            </div>
  
          </div>
  
          {/* grid display column 3 */}
          <div className="grid3">
          
          </div>
  
          {/* grid display column 4 */}
          <div className="grid4">
  
            <div className="grid4-aboutme">
              <h1 className="grid4-aboutme-header">About Us</h1>
              <div className="grid4-aboutme-text">
                {/* profile aboutme section */}
                <span>
                  {profile.description}
                </span>
              </div>
            </div>
  
            <div className="grid4-industry">
              <h1 className="grid4-industry-header">Industry</h1>
              <div className="grid4-industry-text">
                {/* profile aboutme industry */}
                <span>
                  {profile.industry}
                </span>
              </div>
            </div>
  
            <div className="grid4-tag">
              <h1 className="grid4-tag-header">Tags</h1>
              <div className="grid4-tag-text">
                {/* profile tag section */}
                {tags}
              </div>
            </div>
  
          </div>
  
          {/* grid display column 5 */}
          <div className="grid5">
          
          </div>
  
        </div>
      )
    }
    if (this.state.type === 2) {
      // Partner profile
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
                {/* profile fullname */}
                <b>{profile.name}</b>
              </div>
  
              <div className="grid2-title">
                {/* profile account type */}
                <span>{this.userTypes[this.state.type]}</span>
              </div>
            </div>
  
            {/* profile information */}
            <div className="grid2-infoarea2">
  
              {/* profile location
              <div className="grid2-location">
                <span>Location: Toronto, Canada</span>
              </div> */}
  
              {/* profile email */}
              <div className="grid2-email">
                <span>Email: example@mail.com</span>
              </div>
  
              {/* profile phone number */}
              <div className="grid2-phone">
                <span>Phone: {profile.phone}</span>
              </div>
  
              {/* direct to profile edit page */}
              <div className="grid2-edit">
                {
                  localStorage.getItem('username') === this.state.username?
                  <a id="grid2-edit" href="/edit-profile">Edit</a>:
                  <p></p>
                }
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
                  {profile.description}
                </span>
              </div>
            </div>
  
            <div className="grid4-industry">
              <h1 className="grid4-industry-header">Interested Industry</h1>
              <div className="grid4-industry-text">
                {/* profile aboutme industry */}
                <span>
                  {profile.industry}
                </span>
              </div>
            </div>
  
            <div className="grid4-tag">
              <h1 className="grid4-tag-header">Tags</h1>
              <div className="grid4-tag-text">
                {/* profile tag section */}
                {tags}
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

}