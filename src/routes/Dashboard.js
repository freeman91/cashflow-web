import React, { Component } from 'react';
import { isEqual } from 'lodash';
import { Grid, withStyles } from '@material-ui/core';

import formatter from '../helpers/currency';
import NavBar from '../components/NavBar';
import Loader from '../components/Loader';
import CashFlowTable from '../components/CashFlowTable';
import ExpenseTable from '../components/ExpenseTable';
import WorkHourTable from '../components/WorkHourTable';
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
    reload_income_state: false,
    reload_workHour_state: false,
  };

  componentDidMount() {
    if (isEqual(this.props.user, {})) {
      this.props.history.push('/');
    } else {
      this.get_dash_data();
    }
  }

  get_dash_data = async () => {
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
  };

  reload_expenses = () => {
    this.setState({
      reload_expense_state: true,
    });
  };

  stop_reload_expenses = () => {
    this.setState({
      reload_expense_state: false,
    });
  };

  reload_incomes = () => {
    this.setState({
      reload_income_state: true,
    });
  };

  stop_reload_incomes = () => {
    this.setState({
      reload_income_state: false,
    });
  };
  reload_workHours = () => {
    this.setState({
      reload_workHour_state: true,
    });
  };

  stop_reload_workHours = () => {
    this.setState({
      reload_workHour_state: false,
    });
  };

  render() {
    const {
      isLoaded,
      net_income_week,
      net_income_month,
      net_income_year,
      reload_expense_state,
      reload_income_state,
      reload_workHour_state,
    } = this.state;
    if (!isLoaded) return <Loader />;

    const { classes, user, history } = this.props;
    return (
      <>
        <NavBar
          title={'Dashboard'}
          user={user}
          history={history}
          get_data={this.get_dash_data}
          reload_expenses={this.reload_expenses}
          reload_incomes={this.reload_incomes}
          reload_workHours={this.reload_workHours}
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
                get_data={this.get_dash_data}
              />
            </Grid>
            <Grid item xs={4} key="last-5-incomes">
              <IncomeTable
                user={user}
                reload={reload_income_state}
                stop_reload={this.stop_reload_incomes}
                get_data={this.get_dash_data}
              />
            </Grid>
            <Grid item xs={3} key="last-5-work-hours">
              <WorkHourTable
                user={user}
                reload={reload_workHour_state}
                stop_reload={this.stop_reload_workHours}
              />
            </Grid>
          </Grid>
        </div>
      </>
    );
  }
}

export default withStyles(styles)(Dashboard);
