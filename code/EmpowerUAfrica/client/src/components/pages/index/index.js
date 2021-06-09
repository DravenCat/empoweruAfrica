import React, { Component } from 'react'; 
import "./index.css"
import wallup from '../../../resource/icons/wallup.png'


export default class index extends Component {

  componentDidMount() {
    document.title = "EmpowerU Africa";
  }

  render() {
    return(
    <div>
      <div className="title">
        <div className="title-image">
          <img src={wallup} alt="wallup" id="main-image"/>
        </div>
        <div className="title-text" id="main-text">
          Welcome to EmpowerU Africa
        </div>
      </div>
    </div>
    )
  }
}
