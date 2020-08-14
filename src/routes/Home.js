import React, { Component } from 'react';
import { Col, Row } from 'reactstrap';

import Header from '../components/Header';
import LoginForm from '../components/auth/LoginForm';

const headerStyle = {
  height: '40vh',
};

class Home extends Component {
  handleSuccessfulAuth = (data) => {
    this.props.handleLogin(data);
    this.props.history.push('/user');
  };

  render() {
    return (
      <>
        <Row style={headerStyle}>
          <Header />
        </Row>
        <Row>
          <Col xs="3"></Col>
          <Col xs="6">
            <LoginForm handleSuccessfulAuth={this.handleSuccessfulAuth} />
          </Col>
          <Col xs="3"></Col>
        </Row>
      </>
    );
  }
}

export default Home;
