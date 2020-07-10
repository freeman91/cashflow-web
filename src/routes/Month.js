import React, { Component } from 'react';
import { isEqual } from 'lodash';
import { Grid, withStyles } from '@material-ui/core';

import MonthService from '../service/MonthService';
import formatter from '../helpers/currency';
import NavBar from '../components/NavBar';
import Loader from '../components/Loader';
import BillsTable from '../components/BillsTable';
import CashFlowTable from '../components/CashFlowTable';
import month from '../helpers/month_name';

const styles = (theme) => ({
  root: {
    flexGrow: 1,
    margin: '10px',
  },
});

class Month extends Component {
  state = {
    isLoaded: false,
    reloadBillState: false,
  };

  get_month_data = async () => {
    MonthService.getData(this.props.user.auth_token)
      .then((response) => {
        this.setState({
          cwdate: response.cwdate,
          monthStats: response.monthStats,
          netincome: response.netincome,
          expTotal: response.expTotal,
          incTotal: response.incTotal,
          wkhrTotal: response.wkhrTotal,
          isLoaded: true,
        });
      })
      .catch((error) => console.log(error));
  };

  componentDidMount() {
    if (isEqual(this.props.user, {})) {
      this.props.history.push('/');
    } else {
      this.get_month_data();
    }
  }

  reload_bills = () => {
    this.setState({
      reloadBillState: true,
    });
  };

  stop_reload_bills = () => {
    this.setState({
      reloadBillState: false,
    });
  };

  render() {
    const {
      isLoaded,
      cwdate,
      netincome,
      expTotal,
      incTotal,
      wkhrTotal,
      reloadBillState,
    } = this.state;
    if (!isLoaded) return <Loader />;

    const monthStats = JSON.parse(this.state.monthStats);
    const monthStatsArr = [];
    Object.keys(monthStats)
      .sort()
      .forEach(function (week) {
        monthStatsArr.push([
          week,
          formatter.format(monthStats[week].net),
          formatter.format(monthStats[week].expense),
          formatter.format(monthStats[week].income),
          monthStats[week].work_hours,
          formatter.format(monthStats[week].wage),
          `week-${week}-key`,
        ]);
      });

    monthStatsArr.push([
      null,
      formatter.format(netincome),
      formatter.format(expTotal),
      formatter.format(incTotal),
      wkhrTotal,
      formatter.format(incTotal / wkhrTotal),
      'month-stats-key',
    ]);

    const { user, history, classes } = this.props;
    return (
      <>
        <NavBar
          title={month[cwdate.month - 1] + ' ' + cwdate.year}
          user={user}
          history={history}
          reload_expenses={this.reload_bills}
          get_data={this.get_month_data}
        />
        <div className={classes.root}>
          <Grid
            container
            spacing={2}
            direction="row"
            justify="center"
            alignItems="flex-start"
          >
            {/* MONTH STATS */}
            <Grid item xs={8} key="month-stats">
              <CashFlowTable
                dataTextSize="subtitle1"
                headers={[
                  'week',
                  'net income',
                  'expense total',
                  'income total',
                  'work hours',
                  'hourly wage',
                ]}
                rows={monthStatsArr}
              />
            </Grid>

            {/* BILLS */}
            <Grid item xs={6} key="bills">
              <BillsTable
                user={user}
                reload={reloadBillState}
                stop_reload={this.stop_reload_bills}
                month={month[cwdate.month - 1]}
                get_data={this.get_month_data}
              />
            </Grid>
          </Grid>
        </div>
      </>
    );
  }
}

export default withStyles(styles)(Month);
