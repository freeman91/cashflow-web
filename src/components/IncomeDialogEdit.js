import React, { Component } from 'react';
import DatePicker from 'react-datepicker';
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

import Income from '../service/IncomeService';
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

class IncomeDialogEdit extends Component {
  state = {
    open: false,
    value: { source: '', date: new Date() },
    isLoaded: false,
  };

  componentWillReceiveProps(newProps) {
    const { open, value } = newProps;
    if (open) {
      this.setState({
        value: {
          id: value.id,
          amount: value.amount,
          source: value.source,
          description: value.description,
          date: getDate(value.date),
        },
      });
      this.get_income_sources();
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

  handleSourceSelect = (event) => {
    this.setState({
      value: {
        ...this.state.value,
        source: event.target.value,
      },
    });
  };

  handleDateChange = (date) => {
    this.setState({
      value: { ...this.state.value, date: date },
    });
  };

  async get_income_sources() {
    Income.getSources(this.props.user.auth_token).then((response) => {
      this.setState({
        sources: response.income_sources,
        isLoaded: true,
      });
    });
  }

  handleSubmit = () => {
    const { value } = this.state;
    const { user, handleClose, get_incomes, get_data } = this.props;
    if (isNaN(value.amount) || value.group === '') {
      console.error('[ERROR]: Invalid data in input field');
    } else {
      Income.edit(
        {
          id: value.id,
          amount: Number(value.amount),
          source: value.source,
          description: value.description,
          date: value.date,
        },
        user.auth_token
      ).then((res) => {
        this.setState({
          open: false,
          value: {
            amount: null,
            source: '',
            description: '',
            date: new Date(),
          },
        });
        get_data();
        get_incomes();
        handleClose();
      });
    }
  };

  handleDelete = () => {
    Income._delete(this.state.value.id, this.props.user.auth_token).then(() => {
      this.props.get_incomes();
      this.props.get_data();
      this.props.handleClose();
    });
  };

  render() {
    const { open, classes, handleClose } = this.props;
    const { sources, isLoaded, value } = this.state;
    if (!isLoaded) return null;

    return (
      <Dialog
        onClose={handleClose}
        aria-labelledby="income-dialog-edit"
        open={open}
      >
        <DialogTitle id="income-dialog-edit-title">Edit Income</DialogTitle>
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
              id="source"
              select
              label="source"
              value={value.source}
              onChange={this.handleSourceSelect}
              fullWidth
              className={classes.dialog}
              required={true}
            >
              {sources.sort().map((source) => (
                <MenuItem key={source} value={source}>
                  {source}
                </MenuItem>
              ))}
            </TextField>
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

export default withStyles(styles)(IncomeDialogEdit);
