import React, { Component } from 'react';
import { isEqual } from 'lodash';

import formatter from '../helpers/currency';
import Loader from '../components/Loader';
import WeekService from '../service/WeekService';

class Week extends Component {
  state = {
    isLoaded: false,
  };

  async get_week_data() {
    WeekService.getData(this.props.user.auth_token)
      .then((response) => {
        this.setState({
          cwdate: response.cwdate,
          netincome: response.netincome,
          expTotal: response.expTotal,
          incTotal: response.incTotal,
          wkhrTotal: response.wkhrTotal,
          expenses: response.expenses,
          incomes: response.incomes,
          work_hours: response.work_hours,
          isLoaded: true,
        });
      })
      .catch((error) => console.log(error));
  }

  componentDidMount() {
    if (isEqual(this.props.user, {})) {
      this.props.history.push('/');
    } else {
      this.get_week_data();
    }
  }

  render() {
    const {
      isLoaded,
      cwdate,
      netincome,
      expTotal,
      incTotal,
      wkhrTotal,
      expenses,
      incomes,
      work_hours,
    } = this.state;
    if (!isLoaded) return <Loader />;

    // var expensesData = [];
    // expenses.map((exp) => {
    //   var date = new Date(exp.date + ' 12:00');
    //   expensesData.push([
    //     date.getMonth() + 1 + '/' + date.getDate(),
    //     formatter.format(exp.amount),
    //     exp.group,
    //     exp.vendor,
    //     exp.id,
    //   ]);
    //   return null;
    // });

    // var incomesData = [];
    // incomes.map((inc) => {
    //   var date = new Date(inc.date + ' 12:00');
    //   incomesData.push([
    //     date.getMonth() + 1 + '/' + date.getDate(),
    //     formatter.format(inc.amount),
    //     inc.source,
    //     inc.id,
    //   ]);
    //   return null;
    // });

    // var workHoursData = [];
    // work_hours.map((wkhr) => {
    //   var date = new Date(wkhr.date + ' 12:00');
    //   workHoursData.push([
    //     date.getMonth() + 1 + '/' + date.getDate(),
    //     formatter.format(wkhr.amount),
    //     wkhr.source,
    //     wkhr.id,
    //   ]);
    //   return null;
    // });

    const { user, history, classes } = this.props;
    return (
      <></>
      //
      //         <div className={classes.root}>
      //           <Grid
      //             container
      //             spacing={2}
      //             direction="row"
      //             justify="center"
      //             alignItems="flex-start"
      //           >
      //             {/* WEEK STATS */}
      //             <Grid item xs={8} key="week-stats">
      //               <CashFlowTable
      //                 dataTextSize="h5"
      //                 headers={[
      //                   'net income',
      //                   'expense total',
      //                   'income total',
      //                   'work hours',
      //                   'hourly wage',
      //                 ]}
      //                 rows={[
      //                   [
      //                     formatter.format(netincome),
      //                     formatter.format(expTotal),
      //                     formatter.format(incTotal),
      //                     wkhrTotal,
      //                     formatter.format(wkhrTotal ? incTotal / wkhrTotal : 0),
      //                     'week-stats-key',
      //                   ],
      //                 ]}
      //               />
      //             </Grid>

      //             {/* EXPENSES */}
      //             <Grid item xs={6} key="expenses">
      //               <CashFlowTable
      //                 title="Expenses"
      //                 dataTextSize="subtitle1"
      //                 headers={['date', 'amount', 'group', 'vendor']}
      //                 rows={expensesData}
      //               />
      //             </Grid>

      //             {/* Incomes */}
      //             <Grid item xs={3} key="incomes">
      //               <CashFlowTable
      //                 title="Incomes"
      //                 dataTextSize="subtitle1"
      //                 headers={['date', 'amount', 'source']}
      //                 rows={incomesData}
      //               />
      //             </Grid>

      //             {/* WorkHours */}
      //             <Grid item xs={3} key="work-hours">
      //               <CashFlowTable
      //                 title="Recent Work Hours"
      //                 dataTextSize="subtitle1"
      //                 headers={['date', 'hours', 'source']}
      //                 rows={workHoursData}
      //               />
      //             </Grid>
      //           </Grid>
      //         </div>
    );
  }
}

export default Week;
