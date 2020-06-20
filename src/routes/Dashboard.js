import React, { Component } from 'react';
import axios from 'axios';
import { isEqual } from 'lodash';
import { Grid, withStyles } from '@material-ui/core';
import formatter from '../helpers/currency';
import NavBar from '../components/NavBar';
import Loader from '../components/Loader';
import CashFlowTable from '../components/CashFlowTable';
import CashFlowTableExpense from '../components/CashFlowTableExpense';

const API_HOST = 'http://localhost:3001';

const styles = (theme) => ({
  root: {
    flexGrow: 1,
    margin: '10px',
  },
});

class Dashboard extends Component {
  state = {
    isLoaded: false,
  };

  get_dash_data = this.get_dash_data.bind(this);

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

  async get_dash_data() {
    axios
      .get(API_HOST + '/dashboard/data', {
        headers: { Authorization: this.props.user.auth_token },
      })
      .then((response) => {
        this.setState({
          incomes: response.data.incomes,
          work_hours: response.data.work_hours,
          net_income_year: response.data.net_income_year,
          net_income_month: response.data.net_income_month,
          net_income_week: response.data.net_income_week,
          isLoaded: true,
        });
      })
      .catch((error) => console.log(error));
  }

  render() {
    const {
      isLoaded,
      incomes,
      work_hours,
      net_income_week,
      net_income_month,
      net_income_year,
    } = this.state;
    if (!isLoaded) return <Loader />;

    var incomesData = [];
    incomes.map((inc) => {
      var date = new Date(inc.date + ' 12:00');
      incomesData.push([
        date.getMonth() + 1 + '/' + date.getDate(),
        formatter.format(inc.amount),
        inc.source,
        inc.id,
      ]);
      return null;
    });

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
            <Grid item xs={5} key="last-5-expenses">
              <CashFlowTableExpense user={user} />
            </Grid>
            <Grid item xs={3} key="last-5-incomes">
              <CashFlowTable
                title="Recent Incomes"
                dataTextSize="subtitle1"
                headers={['date', 'amount', 'source']}
                rows={incomesData}
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
