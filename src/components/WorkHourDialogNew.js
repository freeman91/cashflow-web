import React, { Component } from 'react';
import DatePicker from 'react-datepicker';
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

import WorkHour from '../service/WorkHourService';
import Income from '../service/IncomeService';

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

class WorkHourDialogNew extends Component {
  state = { ...defaultState };

  componentWillReceiveProps(newProps) {
    const { user, history } = newProps;
    if (user) {
      if (isEqual(user, {})) {
        history.push('/');
      } else {
        this.get_income_sources();
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
    Income.getSources(this.props.user.auth_token).then((result) => {
      this.setState({
        sources: result.income_sources,
        isLoaded: true,
      });
    });
  }

  handleSubmit = () => {
    if (isNaN(this.state.value.amount) || this.state.value.source === '') {
      console.error('[ERROR]: Invalid data in input field');
    } else {
      WorkHour.create(
        {
          amount: Number(this.state.value.amount),
          source: this.state.value.source,
          date: this.state.value.date,
        },
        this.props.user.auth_token
      ).then((result) => {
        if (result.status === 201) {
          this.setState({
            open: false,
            value: {
              amount: null,
              source: '',
              date: new Date(),
            },
          });
          this.props.reload_workHours();
          this.props.get_dash_data();
          this.props.handleClose();
        }
      });
    }
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
        <DialogTitle id="work-hour-dialog-title">Enter Work Hours</DialogTitle>
        <DialogContent>
          <form className={classes.form}>
            <Input
              id="amount"
              placeholder="hours worked"
              inputProps={{ 'aria-label': 'amount' }}
              onChange={this.handleChange}
              fullWidth
              className={classes.dialog}
              required={true}
            />
            <TextField
              id="source"
              select
              label="source"
              value={value.source}
              onChange={this.handleSourceSelect}
              fullWidth
              required={true}
              className={classes.dialog}
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

export default withStyles(styles)(WorkHourDialogNew);
