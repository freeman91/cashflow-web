import React, { Component } from 'react';
import {
  Box,
  Paper,
  withStyles,
  Button,
  Typography,
  FormControl,
  InputLabel,
  Input,
} from '@material-ui/core';

import Session from '../../service/SessionService';

const styles = (theme) => ({
  margin: {
    margin: theme.spacing(2),
  },
  padding: {
    padding: theme.spacing(1),
  },
  loginBox: {
    position: 'absolute',
    width: '50%',
    top: '40%',
    left: '25%',
    align: 'center',
    opacity: 0.7,
  },
  form: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  formControl: {
    margin: theme.spacing(1),
    flex: '0 0 100%',
  },
  formComponent: {
    marginRight: theme.spacing(2),
  },
  button: {
    marginTop: '15px',
    marginRight: theme.spacing(2),
  },
  subButton: {
    marginRight: theme.spacing(2),
    fontSize: 12,
  },
});

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
    const { classes } = this.props;
    return (
      <Box className={classes.loginBox}>
        <Paper elevation={3} className={classes.padding}>
          <form className={classes.form}>
            <Typography
              variant="h3"
              gutterBottom
              style={{
                wordWrap: 'break-word',
                fontSize: '18px',
                textAlign: 'center',
                width: '100%',
              }}
            >
              LOGIN
            </Typography>
            <FormControl className={classes.formControl}>
              <InputLabel htmlFor="email">Email</InputLabel>
              <Input
                autoComplete="on"
                id="login-email"
                name="email"
                type="email"
                className={classes.formComponent}
                value={this.state.email}
                onChange={this.handleChange}
              />
            </FormControl>
            <FormControl className={classes.formControl}>
              <InputLabel htmlFor="password">Password</InputLabel>
              <Input
                autoComplete="on"
                id="login-password"
                name="password"
                className={classes.formComponent}
                value={this.state.password}
                onChange={this.handleChange}
                type="password"
              />
            </FormControl>
            <FormControl className={classes.formControl}>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                className={classes.subButton}
                onClick={this.handleSubmit}
              >
                Submit
              </Button>
            </FormControl>
          </form>
        </Paper>
      </Box>
    );
  }
}

export default withStyles(styles)(LoginForm);
