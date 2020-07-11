/*eslint-disable*/
import React from 'react';
import { NavLink, Link } from 'react-router-dom';

// javascript plugin used to create scrollbars on windows
import PerfectScrollbar from 'perfect-scrollbar';

// reactstrap components
import { Nav, NavLink as ReactstrapNavLink } from 'reactstrap';

var ps;

class Sidebar extends React.Component {
  // verifies if routeName is the one active (in browser input)
  activeRoute = (routeName) => {
    return this.props.location.pathname.indexOf(routeName) > -1 ? 'active' : '';
  };
  componentDidMount() {
    if (navigator.platform.indexOf('Win') > -1) {
      ps = new PerfectScrollbar(this.refs.sidebar, {
        suppressScrollX: true,
        suppressScrollY: false,
      });
    }
  }
  componentWillUnmount() {
    if (navigator.platform.indexOf('Win') > -1) {
      ps.destroy();
    }
  }
  linkOnClick = () => {
    document.documentElement.classList.remove('nav-open');
  };
  render() {
    return (
      <div className="sidebar" data="blue">
        <div className="sidebar-wrapper" ref="sidebar">
          <Nav>
            <li
              className={this.activeRoute('dashboard')}
              key={'dashboard-nav-link'}
            >
              <NavLink
                to="/user/dashboard"
                className="nav-link"
                activeClassName="active"
                onClick={this.props.toggleSidebar}
              >
                <i className="tim-icons icon-chart-pie-36" />
                <p>Dashboard</p>
              </NavLink>
            </li>
            <li className={this.activeRoute('week')} key={'week-nav-link'}>
              <NavLink
                to="/user/week"
                className="nav-link"
                activeClassName="active"
                onClick={this.props.toggleSidebar}
              >
                <i className="tim-icons icon-calendar-60" />
                <p>Week</p>
              </NavLink>
            </li>
            <li className={this.activeRoute('month')} key={'month-nav-link'}>
              <NavLink
                to="/user/month"
                className="nav-link"
                activeClassName="active"
                onClick={this.props.toggleSidebar}
              >
                <i className="tim-icons icon-calendar-60" />
                <p>Month</p>
              </NavLink>
            </li>
            <li className={this.activeRoute('year')} key={'year-nav-link'}>
              <NavLink
                to="/user/year"
                className="nav-link"
                activeClassName="active"
                onClick={this.props.toggleSidebar}
              >
                <i className="tim-icons icon-calendar-60" />
                <p>Year</p>
              </NavLink>
            </li>
            <li
              className={this.activeRoute('net-worth')}
              key={'net-worth-nav-link'}
            >
              <NavLink
                to="/user/net-worth"
                className="nav-link"
                activeClassName="active"
                onClick={this.props.toggleSidebar}
              >
                <i className="tim-icons icon-money-coins" />
                <p>Net Worth</p>
              </NavLink>
            </li>
            <li
              className={this.activeRoute('settings')}
              key={'settings-nav-link'}
            >
              <NavLink
                to="/user/settings"
                className="nav-link"
                activeClassName="active"
                onClick={this.props.toggleSidebar}
              >
                <i className="tim-icons icon-settings-gear-63" />
                <p>Settings</p>
              </NavLink>
            </li>
          </Nav>
        </div>
      </div>
    );
  }
}

export default Sidebar;
