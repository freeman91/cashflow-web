import React, { Component } from 'react';
import DatePicker from 'react-datepicker';
import axios from 'axios';
import { isEqual } from 'lodash';
import {
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  Input,
  TextField,
  MenuItem,
  withStyles,
} from '@material-ui/core';

const API_HOST = 'http://localhost:3001';

const styles = (theme) => ({
  dialog: {
    margin: theme.spacing(1),
  },
  form: {
    width: '100%',
  },
  date: {
    margin: theme.spacing(2),
    width: '300%',
  },
  button: {
    opacity: 0.7,
  },
});

class ExpenseDialogNew extends Component {
  state = {
    open: false,
    value: { group: '', date: new Date() },
    isLoaded: false,
  };

  componentWillReceiveProps(newProps) {
    const { user, history } = newProps;
    if (user) {
      if (isEqual(user, {})) {
        history.push('/');
      } else {
        this.get_expense_groups();
      }
    }
  }

  handleChange = (event) => {
    this.setState({
      value: {
        ...this.state.value,
        [event.target.id]: event.target.value,
      },
    });
  };

  handleGroupSelect = (event) => {
    this.setState({
      value: {
        ...this.state.value,
        group: event.target.value,
      },
    });
  };

  handleDateChange = (date) => {
    this.setState({
      value: { ...this.state.value, date: date },
    });
  };

  async get_expense_groups() {
    axios
      .get(API_HOST + '/expense_groups', {
        headers: { Authorization: this.props.user.auth_token },
      })
      .then((response) => {
        this.setState({
          groups: response.data.expense_groups,
          isLoaded: true,
        });
      })
      .catch((error) => console.log(error));
  }

  handleSubmit = () => {
    if (isNaN(this.state.value.amount) || this.state.value.group === '') {
      console.error('[ERROR]: Invalid data in input field');
    } else {
      this.createExpense(
        Number(this.state.value.amount),
        this.state.value.group,
        this.state.value.vendor,
        this.state.value.description,
        this.state.value.date,
        this.props.user
      );
      this.setState({
        open: false,
        value: {
          amount: null,
          group: '',
          description: '',
          date: new Date(),
        },
      });
      this.props.handleClose();
    }
  };

  async createExpense(amount, group, vendor, description, date, user) {
    axios
      .post(API_HOST + '/expenses', {
        headers: { Authorization: user.auth_token },
        params: {
          amount: amount,
          group: group,
          vendor: vendor,
          date: date,
          description: description,
        },
      })
      .then(() => {
        this.props.get_dash_data();
      })
      .catch((error) => console.log(error));
  }

  render() {
    const { open, classes, handleClose } = this.props;
    const { groups, isLoaded } = this.state;
    if (!isLoaded) return null;
    return (
      <Dialog
        onClose={handleClose}
        aria-labelledby="expense-dialog"
        open={open}
      >
        <DialogTitle id="expense-dialog-title">Create New Expense</DialogTitle>
        <DialogContent>
          <form className={classes.form}>
            <Input
              id="amount"
              placeholder="amount"
              inputProps={{ 'aria-label': 'amount' }}
              onChange={this.handleChange}
              fullWidth
              className={classes.dialog}
            />
            <TextField
              id="group"
              select
              label="group"
              value={this.state.value.group}
              onChange={this.handleGroupSelect}
              fullWidth
              className={classes.dialog}
            >
              {groups.sort().map((group) => (
                <MenuItem key={group} value={group}>
                  {group}
                </MenuItem>
              ))}
            </TextField>
            <Input
              id="vendor"
              placeholder="vendor"
              inputProps={{ 'aria-label': 'vendor' }}
              onChange={this.handleChange}
              fullWidth
              className={classes.dialog}
            />
            <Input
              id="description"
              placeholder="description"
              inputProps={{ 'aria-label': 'description' }}
              onChange={this.handleChange}
              fullWidth
              className={classes.dialog}
            />
            <DatePicker
              id="date"
              className={classes.date}
              placeholderText="date"
              selected={this.state.value.date}
              onChange={this.handleDateChange}
              showWeekNumbers
            />
          </form>
          <DialogActions>
            <Button
              onClick={handleClose}
              color="default"
              variant="contained"
              className={classes.button}
            >
              Cancel
            </Button>
            <Button
              onClick={this.handleSubmit}
              color="primary"
              variant="contained"
              className={classes.button}
            >
              Submit
            </Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
    );
  }
}

export default withStyles(styles)(ExpenseDialogNew);
