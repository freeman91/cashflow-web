import React, { Component } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';
import { isEqual } from 'lodash';
import {
  Card,
  Paper,
  TableContainer,
  Table,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  Typography,
  withStyles,
} from '@material-ui/core';
import formatter from '../helpers/currency_formatter';

const API_HOST = 'http://localhost:3001';

const styles = (theme) => ({
  card: {
    textAlign: 'center',
  },
  cardTitle: {
    margin: '10px',
    fontWeight: 'bold',
    textAlign: 'center',
    width: '50%',
    float: 'left',
  },
  createButton: {
    margin: '10px',
    marginRight: '25px',
    float: 'center',
  },
  dialog: {
    margin: theme.spacing(1),
  },
  th: {
    fontWeight: 'bold',
  },
});

class CashFlowTable extends Component {
  state = {
    isLoaded: false,
    open: false,
    value: { group: '', date: new Date() },
  };

  async get_expenses() {
    axios
      .get(API_HOST + '/dashboard/expenses', {
        headers: { Authorization: this.props.user.auth_token },
      })
      .then((response) => {
        this.setState({
          expenses: response.data.expenses,
          isLoaded: true,
        });
      })
      .catch((error) => console.log(error));
  }

  handleClick = (expense) => {
    this.setState({
      open: true,
      value: {
        id: expense[0],
        amount: expense[1],
        group: expense[2],
        company: expense[3],
        description: expense[4],
        date: expense[5],
      },
    });
  };

  componentDidMount() {
    if (isEqual(this.props.user, {})) {
      this.props.history.push('/');
    } else {
      this.get_expenses();
    }
  }

  render() {
    const { classes } = this.props;
    const { expenses, isLoaded } = this.state;
    if (!isLoaded) return null;

    var expensesData = [];
    expenses.map((exp) => {
      expensesData.push([
        exp.id,
        exp.amount,
        exp.group,
        exp.vendor,
        exp.description,
        exp.date,
      ]);
      return null;
    });

    return (
      <>
        <Card className={classes.card} variant="outlined">
          <TableContainer component={Paper}>
            <Typography className={classes.cardTitle} variant="h5" gutterBottom>
              Expenses
            </Typography>
            <Table>
              <TableHead>
                <TableRow>
                  {['date', 'amount', 'group', 'vendor'].map((header) => {
                    return (
                      <TableCell key={`${header}-header`}>
                        <Typography className={classes.th} variant="subtitle2">
                          {header}
                        </Typography>
                      </TableCell>
                    );
                  })}
                </TableRow>
              </TableHead>
              <TableBody>
                {expensesData.map((expense, idx) => {
                  return (
                    <TableRow
                      key={`${expense[0]}-data`}
                      hover
                      onClick={() => this.handleClick(expense)}
                    >
                      <TableCell key={`date-${idx}`}>
                        <Typography variant="subtitle1">
                          {new Date(expense[5] + ' 12:00').getMonth() +
                            1 +
                            '/' +
                            new Date(expense[5] + ' 12:00').getDate()}
                        </Typography>
                      </TableCell>
                      <TableCell key={`amount-${idx}`}>
                        <Typography variant="subtitle1">
                          {formatter.format(expense[1])}
                        </Typography>
                      </TableCell>
                      <TableCell key={`group-${idx}`}>
                        <Typography variant="subtitle1">
                          {expense[2]}
                        </Typography>
                      </TableCell>
                      <TableCell key={`vendor-${idx}`}>
                        <Typography variant="subtitle1">
                          {expense[3]}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      </>
    );
  }
}

export default withStyles(styles)(CashFlowTable);
