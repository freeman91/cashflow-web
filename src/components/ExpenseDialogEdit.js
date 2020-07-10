import React, { Component } from 'react';
import DatePicker from 'react-datepicker';
import formatter_no$ from '../helpers/currency_no$';
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
  MenuItem,
  withStyles,
} from '@material-ui/core';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';

import Expense from '../service/ExpenseService';
import getDate from '../helpers/getDate';

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

const defaultValue = {
  open: false,
  value: {
    amount: null,
    group: '',
    description: '',
    bill: false,
    date: new Date(),
  },
  isLoaded: false,
};

class ExpenseDialogEdit extends Component {
  state = { ...defaultValue };

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
          bill: value.bill,
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

  handleCheckbox = () => {
    this.setState({
      value: {
        ...this.state.value,
        bill: !this.state.value.bill,
      },
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
    const { user, handleClose, get_expenses, get_data } = this.props;
    if (isNaN(value.amount) || value.group === '') {
      console.error('[ERROR]: Invalid data in input field');
    } else {
      Expense.edit(
        {
          id: value.id,
          amount: Number(value.amount),
          group: value.group,
          vendor: value.vendor,
          description: value.description,
          bill: value.bill,
          date: value.date,
        },
        user.auth_token
      ).then(() => {
        this.setState({ ...defaultValue });
        get_data();
        get_expenses();
        handleClose();
      });
    }
  };

  handleDelete = () => {
    Expense._delete(this.state.value.id, this.props.user.auth_token).then(
      () => {
        this.props.get_expenses();
        this.props.get_data();
        this.props.handleClose();
      }
    );
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
              className={classes.dialog}
              required={true}
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
            <Checkbox
              id="bill"
              onChange={this.handleCheckbox}
              checked={value.bill}
              className={classes.dialog}
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
