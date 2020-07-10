import React, { Component } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import { isEqual } from 'lodash';
import {
  Button,
  Card,
  Collapse,
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
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import formatter from '../helpers/currency';
import ExpenseDialogEdit from './ExpenseDialogEdit';
import Month from '../service/MonthService';

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

class BillTable extends Component {
  state = {
    isLoaded: false,
    open: false,
    collapse: true,
    value: {
      amount: 0,
      id: 0,
      vendor: '',
      description: '',
      group: '',
      bill: true,
      date: new Date(),
    },
  };

  componentDidMount() {
    if (isEqual(this.props.user, {})) {
      this.props.history.push('/');
    } else {
      this.getBills();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.reload) {
      this.getBills().then(() => {
        this.props.stop_reload();
      });
    }
  }

  getBills = async () => {
    Month.getBills(this.props.user.auth_token).then((result) => {
      if (result) {
        this.setState({
          bills: result.bills,
          isLoaded: true,
        });
      }
    });
  };

  handleClick = (bill) => {
    this.setState({
      open: true,
      value: {
        id: bill[0],
        amount: bill[1],
        group: bill[2],
        vendor: bill[3],
        description: bill[4],
        bill: bill[5],
        date: bill[6],
      },
    });
  };

  handleClose = () => {
    this.setState({
      open: false,
    });
  };

  handleCollapse = () => {
    this.setState({
      collapse: !this.state.collapse,
    });
  };

  render() {
    const { classes, user, month, get_data } = this.props;
    const { bills, isLoaded, open, value, collapse } = this.state;
    if (!isLoaded) return null;

    var billsData = [];
    bills.map((bill) => {
      billsData.push([
        bill.id,
        bill.amount,
        bill.group,
        bill.vendor,
        bill.description,
        bill.bill,
        bill.date,
      ]);
      return null;
    });

    return (
      <>
        <Card className={classes.card} variant="outlined">
          <Typography className={classes.cardTitle} variant="h5" gutterBottom>
            {month + ' Bills'}
          </Typography>
          <Button onClick={this.handleCollapse}>
            {collapse ? <ExpandLess /> : <ExpandMore />}
          </Button>
          <TableContainer component={Paper}>
            <Collapse in={collapse} timeout="auto" unmountOnExit>
              <Table>
                <TableHead>
                  <TableRow>
                    {['date', 'amount', 'group', 'vendor'].map((header) => {
                      return (
                        <TableCell key={`${header}-header`}>
                          <Typography
                            className={classes.th}
                            variant="subtitle2"
                          >
                            {header}
                          </Typography>
                        </TableCell>
                      );
                    })}
                  </TableRow>
                </TableHead>

                <TableBody>
                  {billsData.map((bill, idx) => {
                    return (
                      <TableRow
                        key={`${bill[0]}-data`}
                        hover
                        onClick={() => this.handleClick(bill)}
                      >
                        <TableCell key={`date-${idx}`}>
                          <Typography variant="subtitle1">
                            {new Date(bill[6] + ' 12:00').getMonth() +
                              1 +
                              '/' +
                              new Date(bill[6] + ' 12:00').getDate()}
                          </Typography>
                        </TableCell>
                        <TableCell key={`amount-${idx}`}>
                          <Typography variant="subtitle1">
                            {formatter.format(bill[1])}
                          </Typography>
                        </TableCell>
                        <TableCell key={`group-${idx}`}>
                          <Typography variant="subtitle1">{bill[2]}</Typography>
                        </TableCell>
                        <TableCell key={`vendor-${idx}`}>
                          <Typography variant="subtitle1">
                            {bill[3].substring(0, 10)}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </Collapse>
          </TableContainer>
        </Card>
        <ExpenseDialogEdit
          open={open}
          handleClose={this.handleClose}
          user={user}
          value={value}
          get_expenses={this.getBills}
          get_data={get_data}
        />
      </>
    );
  }
}

export default withStyles(styles)(BillTable);
