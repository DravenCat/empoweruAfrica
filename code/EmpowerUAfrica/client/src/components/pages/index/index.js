import React, { Component } from 'react'; 
import { Redirect } from "react-router-dom";


export default class index extends Component {
  state = { redirect: null };

  componentDidMount() {
    document.title = "EmpowerU Africa";
  }

  handleClick() {
    this.setState({ redirect: "/signup" });
  }

  render() {
    if (this.state.redirect) {
    return <Redirect to={this.state.redirect} />
  }
    return(
    <div>
      <h1>
        This is the main page. 
      </h1>
      <button type="button" onClick={() => this.handleClick()}>
        Sign up 
      </button>
    </div>
    )
  }
}
