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
import IncomeDialogEdit from './IncomeDialogEdit';
import Dashboard from '../service/DashboardService';

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

class IncomeTable extends Component {
  state = {
    isLoaded: false,
    open: false,
    collapse: true,
    value: {
      amount: 0,
      id: 0,
      source: '',
      description: '',
      date: new Date(),
    },
  };

  get_incomes = this.get_incomes.bind(this);

  componentDidMount() {
    if (isEqual(this.props.user, {})) {
      this.props.history.push('/');
    } else {
      this.get_incomes();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.reload) {
      this.get_incomes().then(() => {
        this.props.stop_reload();
      });
    }
  }

  async get_incomes() {
    Dashboard.getIncomes(this.props.user.auth_token).then((result) => {
      if (result) {
        this.setState({
          incomes: result.incomes,
          isLoaded: true,
        });
      }
    });
  }

  handleClick = (income) => {
    this.setState({
      open: true,
      value: {
        id: income[0],
        amount: income[1],
        source: income[2],
        description: income[3],
        date: income[4],
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
    const { classes, user, get_dash_data } = this.props;
    const { incomes, isLoaded, open, value, collapse } = this.state;
    if (!isLoaded) return null;

    var incomesData = [];
    incomes.map((income) => {
      incomesData.push([
        income.id,
        income.amount,
        income.source,
        income.description,
        income.date,
      ]);
      return null;
    });

    return (
      <>
        <Card className={classes.card} variant="outlined">
          <Typography className={classes.cardTitle} variant="h5" gutterBottom>
            Recent Incomes
          </Typography>
          <Button onClick={this.handleCollapse}>
            {collapse ? <ExpandLess /> : <ExpandMore />}
          </Button>
          <TableContainer component={Paper}>
            <Collapse in={collapse} timeout="auto" unmountOnExit>
              <Table>
                <TableHead>
                  <TableRow>
                    {['date', 'amount', 'source'].map((header) => {
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
                  {incomesData.map((income, idx) => {
                    return (
                      <TableRow
                        key={`${income[0]}-data`}
                        hover
                        onClick={() => this.handleClick(income)}
                      >
                        <TableCell key={`date-${idx}`}>
                          <Typography variant="subtitle1">
                            {new Date(income[4] + ' 12:00').getMonth() +
                              1 +
                              '/' +
                              new Date(income[4] + ' 12:00').getDate()}
                          </Typography>
                        </TableCell>
                        <TableCell key={`amount-${idx}`}>
                          <Typography variant="subtitle1">
                            {formatter.format(income[1])}
                          </Typography>
                        </TableCell>
                        <TableCell key={`source-${idx}`}>
                          <Typography variant="subtitle1">
                            {income[2]}
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
        <IncomeDialogEdit
          open={open}
          handleClose={this.handleClose}
          user={user}
          value={value}
          get_incomes={this.get_incomes}
          get_dash_data={get_dash_data}
        />
      </>
    );
  }
}

export default withStyles(styles)(IncomeTable);
