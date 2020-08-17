import React, { Component } from 'react';
import { createBrowserHistory } from 'history';
import { Router, Route, Switch, Redirect } from 'react-router-dom';

import Home from './routes/Home';
import UserLayout from './layouts/User';

const hist = createBrowserHistory();

class App extends Component {
  state = {
    user: {},
    loggedIn: false,
  };

  handleLogin = (data) => {
    this.setState({
      loggedIn: true,
      user: data,
    });
  };

  render() {
    return (
      <>
        <Router history={hist}>
          <Switch>
            <Route
              path="/user"
              render={(props) => (
                <UserLayout {...props} user={this.state.user} />
              )}
            />
            <Route
              path="/"
              render={(props) => (
                <Home
                  {...props}
                  user={this.state.user}
                  handleLogin={this.handleLogin}
                />
              )}
            />
            <Redirect from="/" to="/auth/" />
          </Switch>
        </Router>
      </>
    );
  }
}

export default App;
