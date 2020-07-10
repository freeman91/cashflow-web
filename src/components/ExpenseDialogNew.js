import React, { Component } from 'react';
import DatePicker from 'react-datepicker';
import { isEqual } from 'lodash';
import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  Input,
  InputAdornment,
  TextField,
  Typography,
  MenuItem,
  withStyles,
} from '@material-ui/core';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';

import Expense from '../service/ExpenseService';

const styles = (theme) => ({
  dialog: {
    margin: theme.spacing(1),
  },
  form: {
    width: '100%',
  },
  date: {
    margin: theme.spacing(2),
    width: '150%',
  },
  button: {
    opacity: 0.7,
  },
});

const defaultState = {
  open: false,
  value: {
    amount: null,
    group: '',
    vendor: '',
    bill: false,
    description: '',
    date: new Date(),
  },
};

class ExpenseDialogNew extends Component {
  state = { ...defaultState };

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

  handleCheckbox = () => {
    this.setState({
      value: {
        ...this.state.value,
        bill: !this.state.value.bill,
      },
    });
  };

  handleDateChange = (date) => {
    this.setState({
      value: { ...this.state.value, date: date },
    });
  };

  async get_expense_groups() {
    Expense.getGroups(this.props.user.auth_token).then((result) => {
      this.setState({
        groups: result.expense_groups,
        isLoaded: true,
      });
    });
  }

  handleSubmit = () => {
    const { value } = this.state;
    const { user, reload_expenses, get_data, handleClose } = this.props;
    if (isNaN(value.amount) || value.group === '') {
      console.error('[ERROR]: Invalid data in input field');
    } else {
      Expense.create(
        {
          amount: Number(value.amount),
          group: value.group,
          vendor: value.vendor,
          description: value.description,
          bill: value.bill,
          date: value.date,
        },
        user.auth_token
      ).then((result) => {
        if (result.status === 201) {
          this.setState({ ...defaultState });
          if (reload_expenses) reload_expenses();
          if (get_data) get_data();
          handleClose();
        }
      });
    }
  };

  render() {
    const { open, classes, handleClose } = this.props;
    const { groups, isLoaded, value } = this.state;
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
              required={true}
              startAdornment={
                <InputAdornment position="start">
                  <AttachMoneyIcon />
                </InputAdornment>
              }
            />
            <TextField
              id="group"
              select
              label="group"
              value={value.group}
              onChange={this.handleGroupSelect}
              fullWidth
              required={true}
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
            <Checkbox
              id="bill"
              onChange={this.handleCheckbox}
              checked={value.bill}
              className={classes.dialog}
            />
            <Typography variant="body1">bill?</Typography>
            <DatePicker
              id="date"
              className={classes.date}
              placeholderText="date"
              selected={value.date}
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
