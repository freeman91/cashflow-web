import React, { Component } from 'react';
import { isEqual } from 'lodash';
import DatePicker from 'react-datepicker';
import {
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Col,
  Container,
  InputGroup,
  Row,
  Table,
} from 'reactstrap';

import 'react-datepicker/dist/react-datepicker.css';

import { numberToCurrency } from '../helpers/currency';
import Loader from '../components/Loader';
import YearService from '../service/YearService';
import { cardDatePickerRules } from '../helpers/css';

class Year extends Component {
  state = {
    isLoaded: false,
    date: new Date(),
  };

  componentDidMount() {
    if (isEqual(this.props.user, {})) {
      this.props.history.push('/');
    } else {
      this.getYearData(this.state.date.getFullYear());
    }
  }

  async getYearData(year) {
    YearService.getData(this.props.user.auth_token, year)
      .then((response) => {
        this.setState({
          yearStats: response.yearStats,
          netincome: response.netincome,
          expTotal: response.expTotal,
          incTotal: response.incTotal,
          wkhrTotal: response.wkhrTotal,
          isLoaded: true,
        });
      })
      .catch((error) => console.error(error));
  }

  prepareTableData = () => {
    const { netincome, expTotal, incTotal, wkhrTotal } = this.state;
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
            numberToCurrency.format(yearStats[month].net),
            numberToCurrency.format(yearStats[month].expense),
            numberToCurrency.format(yearStats[month].income),
            yearStats[month].work_hours,
            numberToCurrency.format(yearStats[month].wage),
            `month-${month}`,
          ]);
        }
      });

    yearStatsArr.push([
      null,
      numberToCurrency.format(netincome),
      numberToCurrency.format(expTotal),
      numberToCurrency.format(incTotal),
      wkhrTotal,
      numberToCurrency.format(incTotal / wkhrTotal),
      'year-stats-total',
    ]);
    return yearStatsArr;
  };

  handleChange = (nextDate) => {
    const prevDate = this.state.date;
    if (prevDate.getFullYear() !== nextDate.getFullYear()) {
      this.setState({
        date: nextDate,
        isLoaded: false,
      });
      this.getYearData(nextDate.getFullYear()).then(() => {
        this.setState({
          isLoaded: true,
        });
      });
    }
  };

  render() {
    const { isLoaded, date } = this.state;
    if (!isLoaded) return <Loader />;

    const yearTableData = this.prepareTableData();

    return (
      <>
        <div className='content'>
          <Container>
            <Row>
              <Col xs='2'>
                <Card style={cardDatePickerRules}>
                  <InputGroup style={{ margin: 'auto' }}>
                    <DatePicker
                      showYearPicker
                      selected={date}
                      onChange={this.handleChange}
                      dateFormat='yyyy'
                    />
                  </InputGroup>
                </Card>
              </Col>
              <Col xs='8'>
                <Card>
                  <CardHeader>
                    <CardTitle className='card-title' tag='h2'>
                      {date.getFullYear() + ' breakdown'}
                    </CardTitle>
                  </CardHeader>
                  <CardBody className='card-body'>
                    <div className='table-full-width table-responsive'>
                      <Table>
                        <thead className='text-primary'>
                          <tr>
                            <th>week</th>
                            <th>net income</th>
                            <th>expense total</th>
                            <th>income total</th>
                            <th>hours worked</th>
                            <th>hourly wage</th>
                          </tr>
                        </thead>
                        <tbody>
                          {yearTableData.map((row, idx) => {
                            return (
                              <tr key={`${row[row.length - 1]}`}>
                                {row.map((item, i) => {
                                  if (i !== row.length - 1) {
                                    return (
                                      <td
                                        className='td-price'
                                        key={`${row[row.length - 1]}-${i}`}
                                      >
                                        {item}
                                      </td>
                                    );
                                  } else return null;
                                })}
                              </tr>
                            );
                          })}
                        </tbody>
                      </Table>
                    </div>
                  </CardBody>
                </Card>
              </Col>
              <Col xs='2'></Col>
            </Row>
          </Container>
        </div>
      </>
    );
  }
}

export default Year;
