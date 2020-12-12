import React, { Component } from "react";
import { createBrowserHistory } from "history";
import { Router, Route, Switch, Redirect } from "react-router-dom";
import { Provider } from "react-redux";
import { createStore } from "redux";

import { Reducer } from "./store";
import Login from "./routes/Login";
import UserLayout from "./layouts/User";
import "./assets/css/cashflow-styles.css";

const store = createStore(Reducer);
const history = createBrowserHistory();

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router history={history}>
          <Switch>
            <Route path="/user" render={(props) => <UserLayout {...props} />} />
            <Route path="/" render={(props) => <Login {...props} />} />
            <Redirect from="/" to="/auth/" />
          </Switch>
        </Router>
      </Provider>
    );
  }
}

export default App;
