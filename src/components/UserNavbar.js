import React from 'react';
import classNames from 'classnames';

// reactstrap components
import {
  Collapse,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  NavbarBrand,
  Navbar,
  Nav,
  Container,
} from 'reactstrap';

import Session from '../service/SessionService';

const defaultState = {
  collapseOpen: false,
  modalSearch: false,
  color: 'navbar-transparent',
};

class UserNavbar extends React.Component {
  state = { ...defaultState };

  componentDidMount() {
    window.addEventListener('resize', this.updateColor);
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.updateColor);
  }
  // function that adds color white/transparent to the navbar on resize (this is for the collapse)
  updateColor = () => {
    if (window.innerWidth < 993 && this.state.collapseOpen) {
      this.setState({
        color: 'bg-white',
      });
    } else {
      this.setState({
        color: 'navbar-transparent',
      });
    }
  };
  // this function opens and closes the collapse on small devices
  toggleCollapse = () => {
    if (this.state.collapseOpen) {
      this.setState({
        color: 'navbar-transparent',
      });
    } else {
      this.setState({
        color: 'bg-white',
      });
    }
    this.setState({
      collapseOpen: !this.state.collapseOpen,
    });
  };
  // this function is to open the Search modal
  toggleModalSearch = () => {
    this.setState({
      modalSearch: !this.state.modalSearch,
    });
  };

  async handleLogoutClick() {
    if (this.props.user.email) {
      Session._delete(this.props.user.auth_token);
    }
    this.props.history.push('/');
  }

  handleClose = () => {
    this.setState({
      ...defaultState,
    });
  };

  render() {
    const pathname = this.props.location.pathname.split('/');
    return (
      <>
        <Navbar
          className={classNames('navbar-absolute', this.state.color)}
          expand="lg"
        >
          <Container fluid>
            <div className="navbar-wrapper">
              <div
                className={classNames('navbar-toggle d-inline', {
                  toggled: this.props.sidebarOpened,
                })}
              >
                <button
                  className="navbar-toggler"
                  type="button"
                  onClick={this.props.toggleSidebar}
                >
                  <span className="navbar-toggler-bar bar1" />
                  <span className="navbar-toggler-bar bar2" />
                  <span className="navbar-toggler-bar bar3" />
                </button>
              </div>
              <NavbarBrand
                href="/user/dashboard"
                onClick={(e) => e.preventDefault()}
              >
                {pathname[pathname.length - 1]}
              </NavbarBrand>
            </div>
            <button
              aria-expanded={false}
              aria-label="Toggle navigation"
              className="navbar-toggler"
              data-target="#navigation"
              data-toggle="collapse"
              id="navigation"
              type="button"
              onClick={this.toggleCollapse}
            >
              <span className="navbar-toggler-bar navbar-kebab" />
              <span className="navbar-toggler-bar navbar-kebab" />
              <span className="navbar-toggler-bar navbar-kebab" />
            </button>
            <Collapse navbar isOpen={this.state.collapseOpen}>
              <Nav className="ml-auto" navbar>
                <UncontrolledDropdown nav>
                  <DropdownToggle
                    caret
                    color="default"
                    data-toggle="dropdown"
                    nav
                  >
                    <i className="tim-icons icon-single-02" />
                    <p className="d-lg-none">User</p>
                  </DropdownToggle>
                  <DropdownMenu className="dropdown-navbar" right tag="ul">
                    <DropdownItem className="nav-item">
                      Logged in as: {this.props.user.email}
                    </DropdownItem>
                    <DropdownItem
                      className="nav-item"
                      onClick={() => this.handleLogoutClick()}
                    >
                      Logout
                    </DropdownItem>
                  </DropdownMenu>
                </UncontrolledDropdown>
                <li className="separator d-lg-none" />
              </Nav>
            </Collapse>
          </Container>
        </Navbar>
      </>
    );
  }
}

export default UserNavbar;
