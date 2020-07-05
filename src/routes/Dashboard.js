import React, { Component } from 'react';
import { isEqual } from 'lodash';
import { Grid, withStyles } from '@material-ui/core';

import formatter from '../helpers/currency';
import NavBar from '../components/NavBar';
import Loader from '../components/Loader';
import CashFlowTable from '../components/CashFlowTable';
import ExpenseTable from '../components/ExpenseTable';
import IncomeTable from '../components/IncomeTable';
import DashboardService from '../service/DashboardService';

const styles = (theme) => ({
  root: {
    flexGrow: 1,
    margin: '10px',
  },
});

class Dashboard extends Component {
  state = {
    isLoaded: false,
    reload_expense_state: false,
  };

  get_dash_data = this.get_dash_data.bind(this);
  reload_expenses = this.reload_expenses.bind(this);
  stop_reload_expenses = this.stop_reload_expenses.bind(this);
  reload_incomes = this.reload_incomes.bind(this);
  stop_reload_incomes = this.stop_reload_incomes.bind(this);

  layout = [
    { i: 'net-income-year', x: 3, y: 0, w: 3, h: 3 },
    { i: 'net-income-month', x: 6, y: 0, w: 3, h: 3 },
    { i: 'net-income-week', x: 0, y: 4, w: 3, h: 3 },
    { i: 'last-5-expenses', x: 0, y: 7, w: 4, h: 9 },
    { i: 'last-5-incomes', x: 4, y: 7, w: 4, h: 9 },
    { i: 'last-5-work-hours', x: 8, y: 7, w: 1, h: 9 },
  ];

  layouts = {
    lg: this.layout,
    md: this.layout,
    sm: this.layout,
    xs: this.layout,
    xxs: this.layout,
  };

  componentDidMount() {
    if (isEqual(this.props.user, {})) {
      this.props.history.push('/');
    } else {
      this.get_dash_data();
    }
  }

  get_dash_data() {
    DashboardService.getData(this.props.user.auth_token).then((result) => {
      this.setState({
        incomes: result.incomes,
        work_hours: result.work_hours,
        net_income_year: result.net_income_year,
        net_income_month: result.net_income_month,
        net_income_week: result.net_income_week,
        isLoaded: true,
      });
    });
  }

  reload_expenses() {
    this.setState({
      reload_expense_state: true,
    });
  }

  stop_reload_expenses() {
    this.setState({
      reload_expense_state: false,
    });
  }

  reload_incomes() {
    this.setState({
      reload_income_state: true,
    });
  }

  stop_reload_incomes() {
    this.setState({
      reload_income_state: false,
    });
  }
  reload_work_hours() {
    this.setState({
      reload_work_hour_state: true,
    });
  }

  stop_reload_work_hours() {
    this.setState({
      reload_work_hour_state: false,
    });
  }

  render() {
    const {
      isLoaded,
      work_hours,
      net_income_week,
      net_income_month,
      net_income_year,
      reload_expense_state,
      reload_income_state,
    } = this.state;
    if (!isLoaded) return <Loader />;

    var workHoursData = [];
    work_hours.map((wkhr) => {
      var date = new Date(wkhr.date + ' 12:00');
      workHoursData.push([
        date.getMonth() + 1 + '/' + date.getDate(),
        formatter.format(wkhr.amount),
        wkhr.source,
        wkhr.id,
      ]);
      return null;
    });

    const { classes, user, history } = this.props;
    return (
      <>
        <NavBar
          title={'Dashboard'}
          user={user}
          history={history}
          get_dash_data={this.get_dash_data}
          reload_expenses={this.reload_expenses}
          reload_incomes={this.reload_incomes}
          reload_work_hours={this.reload_work_hours}
        />
        <div className={classes.root}>
          <Grid
            container
            spacing={2}
            direction="row"
            justify="center"
            alignItems="flex-start"
          >
            <Grid item xs={9} key="net-incomes-grid-item">
              <CashFlowTable
                title="Net Income"
                dataTextSize="h5"
                headers={['week', 'month', 'year']}
                rows={[
                  [
                    formatter.format(net_income_week),
                    formatter.format(net_income_month),
                    formatter.format(net_income_year),
                    'dash-stats-key',
                  ],
                ]}
              />
            </Grid>
            <Grid item xs={4} key="last-5-expenses">
              <ExpenseTable
                user={user}
                reload={reload_expense_state}
                stop_reload={this.stop_reload_expenses}
                get_dash_data={this.get_dash_data}
              />
            </Grid>
            <Grid item xs={4} key="last-5-incomes">
              <IncomeTable
                user={user}
                reload={reload_income_state}
                stop_reload={this.stop_reload_incomes}
                get_dash_data={this.get_dash_data}
              />
            </Grid>
            <Grid item xs={3} key="last-5-work-hours">
              <CashFlowTable
                title="Recent Work Hours"
                dataTextSize="subtitle1"
                headers={['date', 'hours', 'source']}
                rows={workHoursData}
              />
            </Grid>
          </Grid>
        </div>
      </>
    );
  }
}

export default withStyles(styles)(Dashboard);
