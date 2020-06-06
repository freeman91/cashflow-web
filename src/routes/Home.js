import React, { Component } from "react";
import Header from "../components/Header";
import LoginForm from "../components/auth/LoginForm";

class Home extends Component {
  handleSuccessfulAuth = this.handleSuccessfulAuth.bind(this);

  handleSuccessfulAuth(data) {
    this.props.handleLogin(data);
    this.props.history.push("/dashboard");
  }

  render() {
    return (
      <>
        <Header />
        <LoginForm handleSuccessfulAuth={this.handleSuccessfulAuth} />
      </>
    );
  }
}

export default Home;
