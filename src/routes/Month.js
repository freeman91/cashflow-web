import React, { Component } from 'react';
import { isEqual } from 'lodash';

// reactstrap components
import { Col, Row } from 'reactstrap';

import MonthService from '../service/MonthService';
import formatter from '../helpers/currency';
import Loader from '../components/Loader';
import BillTable from '../components/Bill/BillTable';
import StatsTable from '../components/Month/StatsTable';
import month from '../helpers/month-names';

class Month extends Component {
  state = {
    isLoaded: false,
    reloadBillState: false,
  };

  getMonthData = async () => {
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
      .catch((error) => console.error(error));
  };

  componentDidMount() {
    if (isEqual(this.props.user, {})) {
      this.props.history.push('/');
    } else {
      this.getMonthData();
    }
  }

  reloadBills = () => {
    this.setState({
      reloadBillState: true,
    });
  };

  prepareTableData = () => {
    const { netincome, expTotal, incTotal, wkhrTotal } = this.state;
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
          `week-${week}`,
        ]);
      });

    monthStatsArr.push([
      null,
      formatter.format(netincome),
      formatter.format(expTotal),
      formatter.format(incTotal),
      wkhrTotal,
      formatter.format(wkhrTotal !== 0 ? incTotal / wkhrTotal : 0),
      'month-stats-totals',
    ]);
    return monthStatsArr;
  };

  render() {
    const { isLoaded, cwdate, reloadBillState } = this.state;
    if (!isLoaded) return <Loader />;

    const monthTableData = this.prepareTableData();

    const { user } = this.props;
    return (
      <>
        <div className="content">
          <Row>
            <Col xs="8">
              <StatsTable
                data={monthTableData}
                month={month[cwdate.month - 1]}
              />
            </Col>
          </Row>
          <Row>
            <Col xs="5">
              <BillTable
                user={user}
                reload={reloadBillState}
                month={month[cwdate.month - 1]}
                getData={this.getMonthData}
              />
            </Col>
          </Row>
        </div>
      </>
    );
  }
}

export default Month;
