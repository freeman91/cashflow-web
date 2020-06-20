import React, { Component } from 'react';
import DatePicker from 'react-datepicker';
import axios from 'axios';
import formatter_no$ from '../helpers/currency_no$';
import {
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  Input,
  InputAdornment,
  TextField,
  MenuItem,
  withStyles,
} from '@material-ui/core';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';

import getDate from '../helpers/getDate';

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

class ExpenseDialogEdit extends Component {
  state = {
    open: false,
    value: { group: '', date: new Date() },
    isLoaded: false,
  };

  componentWillReceiveProps(newProps) {
    const { open, value } = newProps;
    if (open) {
      this.setState({
        value: {
          id: value.id,
          amount: value.amount,
          group: value.group,
          vendor: value.vendor,
          description: value.description,
          date: getDate(value.date),
        },
      });
      this.get_expense_groups();
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
    const { value } = this.state;
    const { user, handleClose } = this.props;
    if (isNaN(value.amount) || value.group === '') {
      console.error('[ERROR]: Invalid data in input field');
    } else {
      this.editExpense(
        value.id,
        Number(value.amount),
        value.group,
        value.vendor,
        value.description,
        value.date,
        user
      ).then(() => {
        this.setState({
          open: false,
          value: {
            amount: null,
            group: '',
            description: '',
            date: new Date(),
          },
        });
        handleClose();
      });
    }
  };

  async editExpense(id, amount, group, vendor, description, date, user) {
    axios
      .put(API_HOST + '/expenses/update', {
        headers: { Authorization: user.auth_token },
        params: {
          id: id,
          amount: amount,
          group: group,
          vendor: vendor,
          date: date,
          description: description,
        },
      })
      .catch((error) => console.log(error));
  }

  handleDelete = () => {
    this.deleteExpense(this.props.user, this.state.value.id).then(() => {
      this.props.handleClose();
    });
  };

  async deleteExpense(user, id) {
    axios.delete(API_HOST + '/expenses', {
      headers: { Authorization: user.auth_token },
      params: {
        id: id,
      },
    });
  }

  componentDidMount() {}

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
        <DialogTitle id="expense-dialog-title">Edit Expense</DialogTitle>
        <DialogContent>
          <form className={classes.form}>
            <Input
              id="amount"
              placeholder="amount"
              inputProps={{ 'aria-label': 'amount' }}
              onChange={this.handleChange}
              fullWidth
              className={classes.dialog}
              defaultValue={formatter_no$.format(value.amount)}
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
              defaultValue={value.vendor}
            />
            <Input
              id="description"
              placeholder="description"
              inputProps={{ 'aria-label': 'description' }}
              onChange={this.handleChange}
              fullWidth
              className={classes.dialog}
              defaultValue={value.description}
            />
            <DatePicker
              id="date"
              className={classes.date}
              placeholderText="date"
              selected={value.date}
              onChange={this.handleDateChange}
              showWeekNumbers
            />
          </form>
          <DialogActions style={{ justify: 'center' }}>
            <Button
              className={classes.button}
              onClick={handleClose}
              color="default"
              variant="contained"
            >
              Cancel
            </Button>
            <Button
              className={classes.button}
              onClick={this.handleDelete}
              color="secondary"
              variant="contained"
            >
              Delete
            </Button>
            <Button
              className={classes.button}
              onClick={this.handleSubmit}
              color="primary"
              variant="contained"
            >
              Submit
            </Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
    );
  }
}

export default withStyles(styles)(ExpenseDialogEdit);
