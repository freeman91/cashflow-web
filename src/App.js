import React, { Component } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Home from "./routes/Home";
import Dashboard from "./routes/Dashboard";
import Week from "./routes/Week";
import Month from "./routes/Month";
import Year from "./routes/Year";
import NetWorth from "./routes/NetWorth";
import Settings from "./routes/Settings";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import "./App.css";

const DARK = createMuiTheme({
  palette: {
    type: "dark",
  },
});

class App extends Component {
  state = {
    user: {},
  };

  handleLogin = this.handleLogin.bind(this);

  componentDidMount() {}

  handleLogin(data) {
    this.setState({
      loggedIn: true,
      user: data,
    });
  }

  render() {
    return (
      <>
        <MuiThemeProvider theme={DARK}>
          <CssBaseline />
          <div className="app">
            <BrowserRouter>
              <Switch>
                <Route
                  exact
                  path={"/"}
                  render={(props) => (
                    <Home {...props} handleLogin={this.handleLogin} />
                  )}
                />
                <Route
                  exact
                  path={"/dashboard"}
                  render={(props) => (
                    <Dashboard {...props} user={this.state.user} />
                  )}
                />
                <Route
                  exact
                  path={"/week"}
                  render={(props) => <Week {...props} user={this.state.user} />}
                />
                <Route
                  exact
                  path={"/month"}
                  render={(props) => (
                    <Month {...props} user={this.state.user} />
                  )}
                />
                <Route
                  exact
                  path={"/year"}
                  render={(props) => <Year {...props} user={this.state.user} />}
                />
                <Route
                  exact
                  path={"/networth"}
                  render={(props) => (
                    <NetWorth {...props} user={this.state.user} />
                  )}
                />
                <Route
                  exact
                  path={"/settings"}
                  render={(props) => (
                    <Settings {...props} user={this.state.user} />
                  )}
                />
              </Switch>
            </BrowserRouter>
          </div>
        </MuiThemeProvider>
      </>
    );
  }
}

export default App;
