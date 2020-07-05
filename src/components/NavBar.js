import React, { Component } from 'react';
import MobileLeftMenuSlider from '@material-ui/core/Drawer';
import {
  Button,
  AppBar,
  Toolbar,
  ListItem,
  IconButton,
  ListItemText,
  ListItemIcon,
  Divider,
  List,
  Typography,
  Box,
  withStyles,
} from '@material-ui/core';
import {
  CalendarToday,
  Dashboard,
  DateRange,
  ArrowBack,
  Settings,
  TrendingUp,
  ViewDay,
} from '@material-ui/icons';

import ExpenseDialogNew from './ExpenseDialogNew.js';
import Session from '../service/SessionService';

const styles = (theme) => ({
  box: {
    marginBottom: '20px',
  },
  divLeft: {
    marginLeft: 'auto',
    display: 'inline',
  },
  username: {
    display: 'inline',
    color: '#a9bf7f',
  },
  createButton: {
    margin: '10px',
    marginRight: '25px',
    float: 'center',
    opacity: 0.7,
  },
  logoutButton: {
    opacity: 0.7,
    marginLeft: '15px',
    display: 'inline',
  },
});

class NavBar extends Component {
  state = {
    left: false,
    open: false,
  };

  toggleSlider = (slider, open) => () => {
    this.setState({
      ...this.state,
      [slider]: open,
    });
  };

  handleCreateClick = () => {
    this.setState({
      open: true,
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
      open: false,
    });
  };

  sideList = (slider) => (
    <Box
      style={{
        width: 250,
        height: '100%',
        color: '#a9bf7f',
      }}
      component="div"
      onClick={this.toggleSlider(slider, false)}
    >
      <Divider />
      <List>
        <ListItem button onClick={() => this.props.history.push('/dashboard')}>
          <ListItemIcon>
            <Dashboard />
          </ListItemIcon>
          <ListItemText primary={'Dashboard'} />
        </ListItem>
        <ListItem button onClick={() => this.props.history.push('/week')}>
          <ListItemIcon>
            <DateRange />
          </ListItemIcon>
          <ListItemText primary={'Week'} />
        </ListItem>
        <ListItem button onClick={() => this.props.history.push('/month')}>
          <ListItemIcon>
            <CalendarToday />
          </ListItemIcon>
          <ListItemText primary={'Month'} />
        </ListItem>
        <ListItem button onClick={() => this.props.history.push('/year')}>
          <ListItemIcon>
            <ViewDay />
          </ListItemIcon>
          <ListItemText primary={'Year'} />
        </ListItem>
        <ListItem button onClick={() => this.props.history.push('/networth')}>
          <ListItemIcon>
            <TrendingUp />
          </ListItemIcon>
          <ListItemText primary={'Net Worth'} />
        </ListItem>
        <ListItem button onClick={() => this.props.history.push('/settings')}>
          <ListItemIcon>
            <Settings />
          </ListItemIcon>
          <ListItemText primary={'Settings'} />
        </ListItem>
      </List>
    </Box>
  );

  render() {
    const { classes } = this.props;
    const { title, user, get_dash_data, reload_expenses } = this.props;

    return (
      <>
        <Box className={classes.box} component="nav">
          <AppBar position="static" style={{ background: '#222' }}>
            <Toolbar>
              <IconButton onClick={this.toggleSlider('left', true)}>
                <ArrowBack style={{ color: 'grey' }} />
              </IconButton>
              <Typography variant="h5" style={{ color: 'grey' }}>
                {title}
              </Typography>
              <Button
                className={classes.createButton}
                variant="contained"
                color="primary"
                onClick={this.handleCreateClick}
              >
                New Expense
              </Button>
              <div className={classes.divLeft}>
                <Typography className={classes.username} variant="h6">
                  {user.email}
                </Typography>
                <Button
                  variant="contained"
                  onClick={() => this.handleLogoutClick()}
                  className={classes.logoutButton}
                >
                  Logout
                </Button>
              </div>
              <MobileLeftMenuSlider
                anchor="left"
                open={this.state.left}
                onClose={this.toggleSlider('left', false)}
              >
                {this.sideList('left')}
              </MobileLeftMenuSlider>
            </Toolbar>
          </AppBar>
          <ExpenseDialogNew
            user={user}
            open={this.state.open}
            handleClose={this.handleClose}
            get_dash_data={get_dash_data}
            reload_expenses={reload_expenses}
          />
        </Box>
      </>
    );
  }
}

export default withStyles(styles)(NavBar);
