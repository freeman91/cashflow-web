import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Loader from 'react-loader-spinner';
import MoneyIcon from '@material-ui/icons/Money';
import {
  // Box,
  Container,
  Grid,
  makeStyles,
  Typography,
  Card,
  CardContent,
  Avatar,
} from '@material-ui/core';

import Page from '../../components/Page';
import ExpenseTable from '../../components/Expense/Table';
import IncomeTable from '../../components/Income/Table';
import WorkHourTable from '../../components/WorkHour/Table';
import Dashboard90Day from '../../components/90DayComponent';
import PercentIncome from '../../components/PercentIncome';
import DashboardService from '../../service/DashboardService';
import { numberToCurrency } from '../../helpers/currency';
import {
  updateExpenses,
  updateIncomes,
  updateWorkHours,
  updateDashboardData,
} from '../../store';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    backgroundColor: theme.palette.colors[0],
    height: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3),
  },
  card: {
    backgroundColor: `${theme.palette.colors[1]}`,
    color: `${theme.palette.white}`,
  },
  loader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  avatar: {
    backgroundColor: theme.palette.colors[3],
    height: 56,
    width: 56,
  },
  differenceValue: {
    marginRight: theme.spacing(1),
  },
  cell: {
    borderBottom: `1px solid ${theme.palette.gray}`,
  },
}));

const DashboardView = ({
  user,
  updateExpenses,
  updateIncomes,
  updateWorkHours,
  updateDashboardData,
}) => {
  const classes = useStyles();
  const [isLoaded, setIsLoaded] = useState(false);
  const [expenseSum, setExpenseSum] = useState(0);
  const [incomeSum, setIncomeSum] = useState(0);
  const [workHourSum, setWorkHourSum] = useState(0);

  const date = new Date();

  useEffect(() => {
    function getDashData() {
      Promise.all([
        DashboardService.getExpenseSum(user.auth_token),
        DashboardService.getIncomeSum(user.auth_token),
        DashboardService.getWorkHourSum(user.auth_token),
        DashboardService.getExpenses(user.auth_token),
        DashboardService.getIncomes(user.auth_token),
        DashboardService.getWorkHours(user.auth_token),
      ]).then((result) => {
        if (result[0]) {
          setExpenseSum(result[0].expense_sum);
          setIncomeSum(result[1].income_sum);
          setWorkHourSum(result[2].work_hour_sum);
          updateExpenses({ list: result[3].expenses });
          updateIncomes({ list: result[4].incomes });
          updateWorkHours({ list: result[5].workHours });
          setIsLoaded(true);
        }
      });
    }
    if (user.auth_token) getDashData();
  }, [user.auth_token, updateExpenses, updateIncomes, updateWorkHours]);

  if (!isLoaded)
    return (
      <Page className={classes.root} title='Dashboard'>
        <div className={classes.loader}>
          <Loader type='Oval' color='#00BFFF' height={100} width={100} />
        </div>
      </Page>
    );

  return (
    <Page className={classes.root} title='Dashboard'>
      <Container maxWidth={false}>
        <Grid container spacing={3}>
          <Grid item xl={4} lg={4} sm={6} xs={12}>
            <Card className={classes.card}>
              <CardContent>
                <Grid container justify='space-between' spacing={3}>
                  <Grid item>
                    <Typography color='textSecondary' gutterBottom variant='h4'>
                      Today is
                    </Typography>
                    <Typography color='textPrimary' variant='h2'>
                      {`${date.toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}`}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xl={4} lg={4} sm={6} xs={12}>
            <Card className={classes.card}>
              <CardContent>
                <Grid container justify='space-between' spacing={3}>
                  <Grid item>
                    <Typography color='textSecondary' gutterBottom variant='h4'>
                      Net Income YTD
                    </Typography>
                    <Typography color='textPrimary' variant='h2'>
                      {numberToCurrency.format(incomeSum - expenseSum)}
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Avatar className={classes.avatar}>
                      <MoneyIcon />
                    </Avatar>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xl={4} lg={4} sm={6} xs={12}>
            <Card className={classes.card}>
              <CardContent>
                <Grid container justify='space-between' spacing={3}>
                  <Grid item>
                    <Typography color='textSecondary' gutterBottom variant='h4'>
                      Pay Rate YTD
                    </Typography>
                    <Typography color='textPrimary' variant='h2'>
                      {`${numberToCurrency.format(
                        workHourSum === 0 ? 0 : incomeSum / workHourSum
                      )} per hour`}
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Avatar className={classes.avatar}>
                      <MoneyIcon />
                    </Avatar>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xl={6} lg={12} sm={12} xs={12}>
            <Dashboard90Day />
          </Grid>
          <Grid item xl={6} lg={12} sm={12} xs={12}>
            <PercentIncome />
          </Grid>
          <Grid item xl={4} lg={4} md={6} xs={12}>
            <ExpenseTable
              title='Recent Expenses'
              update={() =>
                Promise.all([
                  DashboardService.getExpenses(user.auth_token),
                  DashboardService.getExpenseSum(user.auth_token),
                  DashboardService.getData(user.auth_token),
                ]).then((result) => {
                  if (result[0]) {
                    updateExpenses({ list: result[0].expenses });
                    setExpenseSum(result[1].expense_sum);
                    updateDashboardData({
                      groupedExpenses: result[2].data,
                      expenseSum: result[2].expense_sum,
                      incomeSum: result[2].income_sum,
                      workHourSum: result[2].work_hour_sum,
                    });
                  }
                })
              }
            />
          </Grid>
          <Grid item xl={4} lg={4} md={6} xs={12}>
            <Card className={classes.card}>
              <IncomeTable
                title='Recent Incomes'
                update={() =>
                  Promise.all([
                    DashboardService.getIncomes(user.auth_token),
                    DashboardService.getIncomeSum(user.auth_token),
                    DashboardService.getData(user.auth_token),
                  ]).then((result) => {
                    if (result[0]) {
                      updateIncomes({ list: result[0].incomes });
                      setIncomeSum(result[1].income_sum);
                      updateDashboardData({
                        groupedExpenses: result[2].data,
                        expenseSum: result[2].expense_sum,
                        incomeSum: result[2].income_sum,
                        workHourSum: result[2].work_hour_sum,
                      });
                    }
                  })
                }
              />
            </Card>
          </Grid>
          <Grid item xl={4} lg={4} md={6} xs={12}>
            <Card className={classes.card}>
              <WorkHourTable
                title='Recent Work Hours'
                update={() =>
                  Promise.all([
                    DashboardService.getWorkHours(user.auth_token),
                    DashboardService.getWorkHourSum(user.auth_token),
                    DashboardService.getData(user.auth_token),
                  ]).then((result) => {
                    if (result[0]) {
                      updateWorkHours({ list: result[0].workHours });
                      setWorkHourSum(result[1].work_hour_sum);
                      updateDashboardData({
                        groupedExpenses: result[2].data,
                        expenseSum: result[2].expense_sum,
                        incomeSum: result[2].income_sum,
                        workHourSum: result[2].work_hour_sum,
                      });
                    }
                  })
                }
              />
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
};

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      updateExpenses,
      updateIncomes,
      updateWorkHours,
      updateDashboardData,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(DashboardView);
