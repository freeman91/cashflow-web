import React, { Component } from 'react';

// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  Input,
  InputGroup,
} from 'reactstrap';

import Session from '../../service/SessionService';

const card = {
  padding: '2em',
};
const cardTitle = {
  textAlign: 'center',
};

class LoginForm extends Component {
  state = {
    email: '',
    password: '',
    loginErrors: '',
  };

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  handleSubmit = async (event) => {
    const { email, password } = this.state;
    Session.create(email, password)
      .then((response) => {
        if (response.data.email) {
          this.props.handleSuccessfulAuth(response.data);
        }
      })
      .catch((error) => {
        console.error('login error', error);
      });
    event.preventDefault();
  };

  render() {
    return (
      <Card style={card}>
        <CardHeader>
          <CardTitle style={cardTitle}>
            <h3>LOGIN</h3>
          </CardTitle>
        </CardHeader>
        <InputGroup>
          <Input
            autoComplete="on"
            id="login-email"
            name="email"
            type="email"
            value={this.state.email}
            onChange={this.handleChange}
          />
        </InputGroup>
        <InputGroup>
          <Input
            autoComplete="on"
            id="login-password"
            name="password"
            type="password"
            value={this.state.password}
            onChange={this.handleChange}
          />
        </InputGroup>

        <Button color="primary" type="submit" onClick={this.handleSubmit}>
          Submit
        </Button>
      </Card>
    );
  }
}

export default LoginForm;
