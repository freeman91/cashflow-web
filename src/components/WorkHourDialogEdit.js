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

import WorkHour from '../service/WorkHourService';
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

const defaultState = {
  open: false,
  value: {
    amount: null,
    source: '',
    date: new Date(),
  },
};

class WorkHourDialogEdit extends Component {
  state = { ...defaultState };

  componentWillReceiveProps(newProps) {
    const { open, value } = newProps;
    if (open) {
      this.setState({
        value: {
          id: value.id,
          amount: value.amount,
          source: value.source,
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

  handleGroupSelect = (event) => {
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
    Income.getSources(this.props.user.auth_token).then((result) => {
      this.setState({
        sources: result.income_sources,
        isLoaded: true,
      });
    });
  }

  handleSubmit = () => {
    const { value } = this.state;
    const { user, handleClose, get_workHours, get_dash_data } = this.props;
    if (isNaN(value.amount) || value.source === '') {
      console.error('[ERROR]: Invalid data in input field');
    } else {
      WorkHour.edit(
        {
          id: value.id,
          amount: Number(value.amount),
          source: value.source,
          date: value.date,
        },
        user.auth_token
      ).then(() => {
        this.setState({
          open: false,
          value: { ...defaultState },
        });
        get_dash_data();
        get_workHours();
        handleClose();
      });
    }
  };

  handleDelete = () => {
    WorkHour._delete(this.state.value.id, this.props.user.auth_token).then(
      () => {
        this.props.get_workHours();
        this.props.get_dash_data();
        this.props.handleClose();
      }
    );
  };

  render() {
    const { open, classes, handleClose } = this.props;
    const { sources, isLoaded, value } = this.state;
    if (!isLoaded) return null;

    return (
      <Dialog
        onClose={handleClose}
        aria-labelledby="work-hour-dialog"
        open={open}
      >
        <DialogTitle id="work-hour-dialog-title">Edit Work Hour</DialogTitle>
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
              onChange={this.handleGroupSelect}
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

export default withStyles(styles)(WorkHourDialogEdit);
