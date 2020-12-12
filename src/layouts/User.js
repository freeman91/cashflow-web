import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import PerfectScrollbar from "perfect-scrollbar";
import { connect } from "react-redux";

import Dashboard from "../routes/Dashboard";
import Week from "../routes/Week";
import Month from "../routes/Month";
import Year from "../routes/Year";
import NetWorth from "../routes/NetWorth";
import Settings from "../routes/Settings";

import Sidebar from "../components/Sidebar";
import TopBar from "../components/TopBar.js";
import "../assets/scss/black-dashboard-react.scss";

var ps;

const routes = [
  "/user/dashboard",
  "/user/week",
  "/user/month",
  "/user/year",
  "/user/net-worth",
  "/user/settings",
];

class User extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      backgroundColor: "blue",
      sidebarOpened:
        document.documentElement.className.indexOf("nav-open") !== -1,
    };
  }
  componentDidMount() {
    if (navigator.platform.indexOf("Win") > -1) {
      document.documentElement.className += " perfect-scrollbar-on";
      document.documentElement.classList.remove("perfect-scrollbar-off");
      ps = new PerfectScrollbar(this.refs.mainPanel, { suppressScrollX: true });
      let tables = document.querySelectorAll(".table-responsive");
      for (let i = 0; i < tables.length; i++) {
        ps = new PerfectScrollbar(tables[i]);
      }
    }
    if (!this.props.user.email) {
      this.props.history.push("/");
    }
  }
  componentWillUnmount() {
    if (navigator.platform.indexOf("Win") > -1) {
      ps.destroy();
      document.documentElement.className += " perfect-scrollbar-off";
      document.documentElement.classList.remove("perfect-scrollbar-on");
    }
  }
  componentDidUpdate(e) {
    if (e.history.action === "PUSH") {
      if (navigator.platform.indexOf("Win") > -1) {
        let tables = document.querySelectorAll(".table-responsive");
        for (let i = 0; i < tables.length; i++) {
          ps = new PerfectScrollbar(tables[i]);
        }
      }
      document.documentElement.scrollTop = 0;
      document.scrollingElement.scrollTop = 0;
      this.refs.mainPanel.scrollTop = 0;
    }
  }
  // this function opens and closes the sidebar on small devices
  toggleSidebar = () => {
    document.documentElement.classList.toggle("nav-open");
    this.setState({ sidebarOpened: !this.state.sidebarOpened });
  };
  getRoutes = () => {
    return routes.map((route) => {
      switch (this.props.location.pathname) {
        case "/user/dashboard":
          return (
            <Route
              path="/user/dashboard"
              key="dashboard"
              render={(props) => (
                <Dashboard {...props} user={this.props.user} />
              )}
            />
          );
        case "/user/week":
          return (
            <Route
              path="/user/week"
              key="week"
              render={(props) => <Week {...props} user={this.props.user} />}
            />
          );
        case "/user/month":
          return (
            <Route
              path="/user/month"
              key="month"
              render={(props) => <Month {...props} user={this.props.user} />}
            />
          );
        case "/user/year":
          return (
            <Route
              path="/user/year"
              key="year"
              render={(props) => <Year {...props} user={this.props.user} />}
            />
          );
        case "/user/net-worth":
          return (
            <Route
              path="/user/net-worth"
              key="net-worth"
              render={(props) => <NetWorth {...props} user={this.props.user} />}
            />
          );
        case "/user/settings":
          return (
            <Route
              path="/user/settings"
              key="settings"
              render={(props) => <Settings {...props} user={this.props.user} />}
            />
          );
        default:
          return null;
      }
    });
  };
  render() {
    return (
      <>
        <div className="wrapper">
          <Sidebar {...this.props} toggleSidebar={this.toggleSidebar} />
          <div
            className="main-panel"
            ref="mainPanel"
            data={this.state.backgroundColor}
          >
            <TopBar
              {...this.props}
              toggleSidebar={this.toggleSidebar}
              sidebarOpened={this.state.sidebarOpened}
            />
            <Switch>
              {this.getRoutes()}
              <Redirect from="*" to="/user/dashboard" />
            </Switch>
            {/* {
              this.props.location.pathname.indexOf('maps') !== -1 ? null : (
                <Footer fluid />
              )
            } */}
          </div>
        </div>
      </>
    );
  }
}

export default connect(
  (state) => ({
    user: state.user,
  }),
  null
)(User);
