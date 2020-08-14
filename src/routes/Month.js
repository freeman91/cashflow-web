import React, { Component } from 'react';
import { isEqual } from 'lodash';
import DatePicker from 'react-datepicker';
import { Card, Col, InputGroup, Row } from 'reactstrap';

import 'react-datepicker/dist/react-datepicker.css';
import '../assets/css/cashflow-styles.css';

import MonthService from '../service/MonthService';
import formatter from '../helpers/currency';
import Loader from '../components/Loader';
import BillTable from '../components/Bill/BillTable';
import StatsTable from '../components/Month/StatsTable';
import { month } from '../helpers/month-names';
import '../helpers/Date';

const cardDatePicker = {
  padding: '0.5rem',
  margin: '0',
  width: '100%',
};

class Month extends Component {
  state = {
    isLoaded: false,
    reloadBillState: false,
    date: new Date(),
  };

  componentDidMount() {
    if (isEqual(this.props.user, {})) {
      this.props.history.push('/');
    } else {
      this.getMonthData(
        this.state.date.getWeek(),
        this.state.date.getFullYear()
      );
    }
  }

  getMonthData = async (week, year) => {
    MonthService.getData(this.props.user.auth_token, week, year)
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

  handleChange = (nextDate) => {
    const prevDate = this.state.date;
    if (prevDate.getWeek() !== nextDate.getWeek()) {
      this.setState({
        date: nextDate,
      });
      this.getMonthData(nextDate.getWeek(), nextDate.getFullYear()).then(() => {
        this.setState({
          reloadBillState: true,
        });
      });
    }
  };

  stopReload = () => {
    this.setState({
      reloadBillState: false,
    });
  };

  render() {
    const { isLoaded, cwdate, reloadBillState, date } = this.state;
    if (!isLoaded) return <Loader />;

    const monthTableData = this.prepareTableData();

    const { user } = this.props;
    return (
      <>
        <div className="content">
          <Row>
            <Col xs="2">
              <Card style={cardDatePicker}>
                <InputGroup style={{ margin: 'auto' }}>
                  <DatePicker
                    selected={date}
                    onChange={this.handleChange}
                    showWeekNumbers
                  />
                </InputGroup>
              </Card>
            </Col>
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
                week={date.getWeek()}
                year={date.getFullYear()}
                getData={this.getMonthData}
                stopReload={this.stopReload}
              />
            </Col>
          </Row>
        </div>
      </>
    );
  }
}

export default Month;
