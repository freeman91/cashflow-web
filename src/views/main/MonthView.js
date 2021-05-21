import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Loader from 'react-loader-spinner';
import { DatePicker } from '@material-ui/pickers';
import {
  Container,
  Grid,
  makeStyles,
  Typography,
  Card,
  CardContent,
} from '@material-ui/core';

import Page from '../../components/Page';
import ExpenseTable from '../../components/Expense/Table';
import IncomeTable from '../../components/Income/Table';
import WorkHourTable from '../../components/WorkHour/Table';
import ExpenseService from '../../service/ExpenseService';
import IncomeService from '../../service/IncomeService';
import WorkHourService from '../../service/WorkHourService';
import { updateExpenses, updateIncomes, updateWorkHours } from '../../store';
import { numberToCurrency, numberToCurrency_ } from '../../helpers/currency';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    backgroundColor: theme.palette.colors[0],
    height: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3),
  },
  loader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  card: {
    backgroundColor: `${theme.palette.colors[1]}`,
    color: `${theme.palette.white}`,
  },
  datePicker: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
}));

const MonthView = ({
  user,
  expenses,
  incomes,
  workHours,
  updateExpenses,
  updateIncomes,
  updateWorkHours,
}) => {
  const classes = useStyles();
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedDate, handleDateChange] = useState(new Date());

  useEffect(() => {
    function getMonthData() {
      Promise.all([
        ExpenseService.getMonthData(
          user.auth_token,
          selectedDate.getMonth() + 1,
          selectedDate.getFullYear()
        ),
        IncomeService.getMonthData(
          user.auth_token,
          selectedDate.getMonth() + 1,
          selectedDate.getFullYear()
        ),
        WorkHourService.getMonthData(
          user.auth_token,
          selectedDate.getMonth() + 1,
          selectedDate.getFullYear()
        ),
      ]).then((result) => {
        if (result[0]) {
          updateExpenses({ list: result[0].expenses });
          updateIncomes({ list: result[1].incomes });
          updateWorkHours({ list: result[2].work_hours });
          setIsLoaded(true);
        }
      });
    }
    getMonthData();
  }, [
    user.auth_token,
    selectedDate,
    updateExpenses,
    updateIncomes,
    updateWorkHours,
  ]);

  if (!isLoaded)
    return (
      <Page className={classes.root} title="Month">
        <div className={classes.loader}>
          <Loader type="Oval" color="#00BFFF" height={100} width={100} />
        </div>
      </Page>
    );

  const expenseSum = expenses.reduce((total, expense) => {
    return total + Number(expense.amount);
  }, 0);
  const incomeSum = incomes.reduce((total, income) => {
    return total + Number(income.amount);
  }, 0);
  const workHourSum = workHours.reduce((total, workHour) => {
    return total + Number(workHour.amount);
  }, 0);

  return (
    <Page className={classes.root} title="Month">
      <Container maxWidth={false}>
        {/* First Row */}
        <Grid container spacing={3}>
          <Grid item xl={2} lg={4} sm={6} xs={12}>
            <Card className={classes.card}>
              <CardContent>
                <DatePicker
                  variant="dialog"
                  inputVariant="outlined"
                  openTo="month"
                  views={['year', 'month']}
                  autoOk={true}
                  disableFuture={true}
                  value={selectedDate}
                  onChange={handleDateChange}
                  className={classes.datePicker}
                />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xl={2} lg={4} sm={6} xs={12}>
            <Card className={classes.card}>
              <CardContent>
                <Grid container justify="space-between" spacing={3}>
                  <Grid item>
                    <Typography color="textSecondary" gutterBottom variant="h4">
                      Net Income
                    </Typography>
                    <Typography color="textPrimary" variant="h2">
                      {numberToCurrency.format(incomeSum - expenseSum)}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xl={2} lg={4} sm={6} xs={12}>
            <Card className={classes.card}>
              <CardContent>
                <Grid container justify="space-between" spacing={3}>
                  <Grid item>
                    <Typography color="textSecondary" gutterBottom variant="h4">
                      Expense Total
                    </Typography>
                    <Typography color="textPrimary" variant="h2">
                      {numberToCurrency.format(expenseSum)}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xl={2} lg={4} sm={6} xs={12}>
            <Card className={classes.card}>
              <CardContent>
                <Grid container justify="space-between" spacing={3}>
                  <Grid item>
                    <Typography color="textSecondary" gutterBottom variant="h4">
                      Income Total
                    </Typography>
                    <Typography color="textPrimary" variant="h2">
                      {numberToCurrency.format(incomeSum)}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xl={2} lg={4} sm={6} xs={12}>
            <Card className={classes.card}>
              <CardContent>
                <Grid container justify="space-between" spacing={3}>
                  <Grid item>
                    <Typography color="textSecondary" gutterBottom variant="h4">
                      Total Work Hours
                    </Typography>
                    <Typography color="textPrimary" variant="h2">
                      {numberToCurrency_.format(workHourSum)}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xl={2} lg={4} sm={6} xs={12}>
            <Card className={classes.card}>
              <CardContent>
                <Grid container justify="space-between" spacing={3}>
                  <Grid item>
                    <Typography color="textSecondary" gutterBottom variant="h4">
                      Income per Work Hour
                    </Typography>
                    <Typography color="textPrimary" variant="h2">
                      {numberToCurrency.format(
                        workHourSum === 0 || incomeSum === 0
                          ? 0
                          : incomeSum / workHourSum
                      )}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xl={4} lg={4} md={6} xs={12}>
            <ExpenseTable
              title="Expenses"
              update={() =>
                ExpenseService.getMonthData(
                  user.auth_token,
                  selectedDate.getMonth() + 1,
                  selectedDate.getFullYear()
                ).then((result) => {
                  if (result) updateExpenses({ list: result.expenses });
                })
              }
            />
          </Grid>
          <Grid item xl={4} lg={4} md={6} xs={12}>
            <Card className={classes.card}>
              <IncomeTable
                title="Incomes"
                update={() =>
                  IncomeService.getMonthData(
                    user.auth_token,
                    selectedDate.getMonth() + 1,
                    selectedDate.getFullYear()
                  ).then((result) => {
                    if (result) updateIncomes({ list: result.incomes });
                  })
                }
              />
            </Card>
          </Grid>
          <Grid item xl={4} lg={4} md={6} xs={12}>
            <Card className={classes.card}>
              <WorkHourTable
                title="Work Hours"
                update={() =>
                  WorkHourService.getMonthData(
                    user.auth_token,
                    selectedDate.getMonth() + 1,
                    selectedDate.getFullYear()
                  ).then((result) => {
                    if (result) updateWorkHours({ list: result.work_hours });
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
    expenses: state.expenses.list,
    incomes: state.incomes.list,
    workHours: state.workHours.list,
  };
};

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      updateExpenses,
      updateIncomes,
      updateWorkHours,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(MonthView);
