import React, { Component } from 'react'; 
import Loading from '../../components/loading/loading'; 
import Tag from '../../components/tag/tag';
import EditableText from '../../components/editableText/editableText';
import "./profile.css"


export default class profile extends Component {

  userTypes = ['Individual', 'Company', 'Partner']; 
  fields = [
    ['name', 'gender', 'birthdate', 'phone', 'industry', 'description'],
    ['name', 'phone', 'website', 'industry', 'description'],
    ['name', 'phone', 'industry', 'description']
  ];
  genders = ['Male', 'Female', 'other'];

  state = {
    username: null,
    type: null,
    profile: {},
    updatedProfile: {}, 
    error: null,
    edit: false
  }
  getProfileData = (username) => {
    // Fake data
    let type = 0;
    let profile = {
      "name": "Bosco Njoku",
      "gender": 0,
      "birthdate": "1970-01-01",
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
      profile,
      updatedProfile: JSON.parse(JSON.stringify(profile)) // deep copy 
    })

  }

  componentDidMount() {
    let { username } = this.props.match.params; 
    this.getProfileData(username);
  }

  enterEditMode = () => {
    this.setState({edit: true});
  }

  updateProfileData = () => {
    let updatedProfile = JSON.parse(JSON.stringify(this.state.updatedProfile));
    let updates = {};

    // List of profile fields for all three kinds of users. Not including tags
    let fields = this.fields; 

    for (let key of fields[this.state.type]) {
      let id = 'input-' + key;
      let val = document.getElementById(id).value; 
      if (key === 'gender') {
        val = parseInt(val);
      }
      updatedProfile[key] = val;
    }

    for (let key in updatedProfile) {
      
      if (updatedProfile[key] === this.state.profile[key]) {
        continue;
      }
      if (updatedProfile[key] instanceof Array && 
        updatedProfile[key].length === this.state.profile[key].length) {
        let equals = true; 
        for (let i = 0; i < updatedProfile[key].length; i++) {
          if (updatedProfile[key][i] !== this.state.profile[key][i]) {
            equals = false;
            break;
          }
        }
        if (equals) {
          continue; 
        }
      }
      updates[key] = updatedProfile[key];
    }

    console.log(updates);
  }

  discardChanges = () => {
    this.setState({
      updatedProfile: JSON.parse(JSON.stringify(this.state.profile)),
      edit: false
    })
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
    let updatedProfile = this.state.updatedProfile;
    let tags = profile.tags.map((tag)=>{return <Tag tag={tag} key={tag}/>});
    let type = this.state.type;

    return(
      <div className="profile">
        
        {/* grid display column 1 */}
        <div className="grid1">
        
        </div>

        {/* grid display column 2 */}
        <div className="grid2">

          {/* profile picture */}
          <div className="grid2-photo">
            {
              this.state.edit === true?
              <button className="change-photo">Change Profile Picture</button>:
              <></>
            }
          </div>

          {/* profile information */}
          <div className="grid2-infoarea">

            <div className="grid2-name">
              {/* profile fullname */}
              <b>
                {this.state.edit===true? 
                <>
                  <span>{this.state.type === 1? 'Company Name: ': 'Your Name: '}</span>
                  <input
                  id="input-name" 
                  defaultValue={updatedProfile.name}></input>
                </>:
                <span>{profile.name}</span>}
              </b>
            </div>

            <div className="grid2-title">
              {/* profile account type */}
              <span>{this.userTypes[this.state.type]}</span>
            </div>
          </div>

          {/* profile information */}
          <div className="grid2-infoarea2">

            {/* profile birthday */}
            { type === 0? 
            <div className="grid2-text">
              {
                this.state.edit === true?
                <>
                  <span>Birthday:</span>
                  <input type="date" defaultValue={updatedProfile.birthdate}
                  id="input-birthdate"/>
                </>:
                <span>Birthday: {profile.birthdate}</span>
              }
              {/* company website */}
            </div>:
            <></>
            }

              {
                type === 1?
                <div className="grid2-text">
                  <span>Website: </span>
                  {
                    this.state.edit === true? 
                    <input id="input-website" defaultValue={updatedProfile.website} />:
                    <span>{profile.website}</span>
                  }
                </div>
                :
                <></>
              }

            { type === 0?
            <div className="grid2-text">
              <span>Gender: </span>
              <select id='input-gender'>
                <option key="0" value="0">Male</option>
                <option key="1" value="1">Female</option>
                <option key="2" value="2">Other</option>
              </select>
            </div>:
            <></>
            }

            {/* profile email */}
            <div className="grid2-text">
              <span>Email: example@mail.com</span>
            </div>

            

            {/* profile phone number */}
            <div className="grid2-text">

              <span>Phone: </span>
            {
              this.state.edit === true?
              <input id="input-phone" defaultValue={updatedProfile.phone}/>:
              <span>{profile.phone}</span>
            }
            </div>

            {/* direct to profile edit page */}
            <div className="grid2-edit">
              {
                this.state.edit === true? 
                <>
                  <button className="grid2-btn" onClick={this.updateProfileData}>Confirm</button>
                  <button className="grid2-btn" id="discard-btn" onClick={this.discardChanges}>Discard</button>
                </>: 
                localStorage.getItem('username') === this.state.username?
                <button className="grid2-btn" onClick={this.enterEditMode}>Edit</button>:
                <></>
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
            <h1 className="grid4-aboutme-header">
              {type === 1?
                <span>About Us</span>:
                <span>About Me</span>
              }
            </h1>
            <div className="grid4-aboutme-text">
              {/* profile aboutme section */}
              {this.state.edit === true?
                <textarea 
                className="edit-textbox" 
                id="input-description" 
                defaultValue={updatedProfile.description} 
                />:
                <span>
                  {profile.description}
                </span>
              }
            </div>
          </div>

          <div className="grid4-industry">
            <h1 className="grid4-industry-header">
              Focused Industry
            </h1>
            <div className="grid4-industry-text">
              {/* profile aboutme industry */}
              {this.state.edit === true?
                <textarea 
                className="edit-textbox" 
                id="input-industry" 
                defaultValue={updatedProfile.industry} 
                />:
                <span>
                  {profile.industry}
                </span>
              }
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
    );
  }
}