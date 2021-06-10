import React, { Component } from 'react'; 


export default class index extends Component {
  componentDidMount() {
    document.title = "EmpowerU Africa";
  }
  render() {
    return(
    <h1>
      This is the index page. 
    </h1>
    )
  }
}