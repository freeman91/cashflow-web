import React, { Component } from 'react';
import axios from 'axios';
import { isEqual } from 'lodash';
import { Grid, withStyles } from '@material-ui/core';
import formatter from '../helpers/currency';
import NavBar from '../components/NavBar';
import Loader from '../components/Loader';
import CashFlowTable from '../components/CashFlowTable';

const API_HOST = 'http://localhost:3001';

const styles = (theme) => ({
  root: {
    flexGrow: 1,
    margin: '10px',
  },
});

class Year extends Component {
  state = {
    isLoaded: false,
  };

  async get_year_data() {
    axios
      .get(API_HOST + '/year/data', {
        headers: { Authorization: this.props.user.auth_token },
      })
      .then((response) => {
        this.setState({
          cwdate: response.data.cwdate,
          yearStats: response.data.yearStats,
          netincome: response.data.netincome,
          expTotal: response.data.expTotal,
          incTotal: response.data.incTotal,
          wkhrTotal: response.data.wkhrTotal,
          isLoaded: true,
        });
      })
      .catch((error) => console.log(error));
  }

  componentDidMount() {
    if (isEqual(this.props.user, {})) {
      this.props.history.push('/');
    } else {
      this.get_year_data();
    }
  }

  render() {
    const {
      cwdate,
      netincome,
      expTotal,
      incTotal,
      wkhrTotal,
      isLoaded,
    } = this.state;
    if (!isLoaded) return <Loader />;

    const yearStats = JSON.parse(this.state.yearStats);
    const yearStatsArr = [];
    Object.keys(yearStats)
      .sort(function (a, b) {
        return parseInt(a) - parseInt(b);
      })
      .forEach(function (month) {
        if (
          yearStats[month].expense !== 0 ||
          yearStats[month].income !== 0 ||
          yearStats[month].work_hours !== 0
        ) {
          yearStatsArr.push([
            month,
            formatter.format(yearStats[month].net),
            formatter.format(yearStats[month].expense),
            formatter.format(yearStats[month].income),
            yearStats[month].work_hours,
            formatter.format(yearStats[month].wage),
            `${month}-stats-key`,
          ]);
        }
      });

    yearStatsArr.push([
      null,
      formatter.format(netincome),
      formatter.format(expTotal),
      formatter.format(incTotal),
      wkhrTotal,
      formatter.format(incTotal / wkhrTotal),
      'year-stats-key',
    ]);

    const { user, history, classes } = this.props;
    return (
      <>
        <NavBar title={cwdate.year} user={user} history={history} />
        <div className={classes.root}>
          <Grid
            container
            spacing={2}
            direction="row"
            justify="center"
            alignItems="flex-start"
          >
            {/* YEAR STATS */}
            <Grid item xs={8} key="year-stats">
              <CashFlowTable
                dataTextSize="subtitle1"
                headers={[
                  'month',
                  'net income',
                  'expense total',
                  'income total',
                  'work hours',
                  'hourly wage',
                ]}
                rows={yearStatsArr}
              />
            </Grid>
          </Grid>
        </div>
      </>
    );
  }
}

export default withStyles(styles)(Year);