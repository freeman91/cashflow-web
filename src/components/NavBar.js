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
import IncomeDialogNew from './IncomeDialogNew.js';
import WorkHourDialogNew from './WorkHourDialogNew.js';
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

const defaultState = {
  left: false,
  dialogs: {
    expOpen: false,
    incOpen: false,
    whOpen: false,
  },
};

class NavBar extends Component {
  state = { ...defaultState };

  toggleSlider = (slider, open) => () => {
    this.setState({
      ...this.state,
      [slider]: open,
    });
  };

  handleCreateClickExpense = () => {
    this.setState({ dialogs: { ...defaultState.dialogs, expOpen: true } });
  };

  handleCreateClickIncome = () => {
    this.setState({ dialogs: { ...defaultState.dialogs, incOpen: true } });
  };

  handleCreateClickWorkHour = () => {
    this.setState({ dialogs: { ...defaultState.dialogs, whOpen: true } });
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
    const {
      title,
      user,
      get_data,
      reload_expenses,
      reload_incomes,
      reload_workHours,
    } = this.props;

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
                onClick={this.handleCreateClickExpense}
              >
                New Expense
              </Button>
              <Button
                className={classes.createButton}
                variant="contained"
                color="primary"
                onClick={this.handleCreateClickIncome}
              >
                New Income
              </Button>
              <Button
                className={classes.createButton}
                variant="contained"
                color="primary"
                onClick={this.handleCreateClickWorkHour}
              >
                New Work Hours
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
            open={this.state.dialogs.expOpen}
            handleClose={this.handleClose}
            get_data={get_data}
            reload_expenses={reload_expenses}
          />
          <IncomeDialogNew
            user={user}
            open={this.state.dialogs.incOpen}
            handleClose={this.handleClose}
            get_data={get_data}
            reload_incomes={reload_incomes}
          />
          <WorkHourDialogNew
            user={user}
            open={this.state.dialogs.whOpen}
            handleClose={this.handleClose}
            reload_workHours={reload_workHours}
            get_data={get_data}
          />
        </Box>
      </>
    );
  }
}

export default withStyles(styles)(NavBar);
