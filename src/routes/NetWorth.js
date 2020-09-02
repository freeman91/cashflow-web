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
import '../assets/css/cashflow-styles.css';

import AssetTable from '../components/Asset/AssetTable';
import LiabilityTable from '../components/Liability/LiabilityTable';
import NetWorthService from '../service/NetWorthService';
import formatter from '../helpers/currency';
import Loader from '../components/Loader';
import { month } from '../helpers/month-names';

const cardDatePicker = {
  padding: '0.5rem',
  margin: '0',
  width: '100%',
};

class NetWorth extends Component {
  state = {
    isLoaded: false,
    date: new Date(),
  };

  componentDidMount() {
    if (isEqual(this.props.user, {})) {
      this.props.history.push('/');
    } else {
      this.getData(this.state.date.getWeek(), this.state.date.getFullYear());
    }
  }

  async getData(week, year) {
    NetWorthService.getData(this.props.user.auth_token, week, year)
      .then((response) => {
        this.setState({
          assets: response.properties,
          liabilities: response.debts,
          netWorthLast12: response.netWorthLast12,
          isLoaded: true,
        });
      })
      .catch((error) => console.error(error));
  }

  prepareTableData = () => {
    const { netWorthLast12 } = this.state;
    var months = [];
    var netWorthData = [];
    netWorthLast12.map((record) => {
      months.push(`${month[record[0] - 1]} ${record[1].toString().slice(-2)}`);
      netWorthData.push(formatter.format(record[2]));
      return null;
    });
    return [months.reverse(), netWorthData.reverse()];
  };

  handleChange = (nextDate) => {
    const prevDate = this.state.date;
    if (prevDate.getMonth() !== nextDate.getMonth()) {
      this.setState({
        isLoaded: false,
        date: nextDate,
      });
      this.getData(nextDate.getWeek(), nextDate.getFullYear()).then(() => {
        this.setState({
          isLoaded: true,
        });
      });
    }
  };

  render() {
    const { isLoaded, date } = this.state;
    if (!isLoaded) return <Loader />;

    const [months, netWorthData] = this.prepareTableData();
    const { user } = this.props;
    return (
      <>
        <div className="content">
          <Container>
            <Row>
              <Col xs="2" style={{ marginBottom: '15px' }}>
                <Card style={cardDatePicker}>
                  <InputGroup style={{ margin: 'auto' }}>
                    <DatePicker
                      showMonthYearPicker
                      selected={date}
                      onChange={this.handleChange}
                    />
                  </InputGroup>
                </Card>
              </Col>
            </Row>
            <Row>
              <Col xs="12">
                <Card>
                  <CardHeader>
                    <CardTitle className="card-title" tag="h2">
                      Net Worth over the past 6 months
                    </CardTitle>
                  </CardHeader>
                  <CardBody className="card-body">
                    <div className="table-full-width table-responsive">
                      <Table>
                        <thead className="text-primary">
                          <tr>
                            {months.slice(6, 12).map((month) => {
                              return <th key={'header' + month}>{month}</th>;
                            })}
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            {netWorthData.slice(6, 12).map((row, idx) => {
                              return (
                                <td
                                  className="td-price"
                                  key={`${months[idx]}-net-worth`}
                                >
                                  {row}
                                </td>
                              );
                            })}
                          </tr>
                        </tbody>
                      </Table>
                    </div>
                  </CardBody>
                </Card>
              </Col>
            </Row>
            <Row>
              <Col xs="1"></Col>
              <Col xs="5">
                <AssetTable
                  user={user}
                  date={[date.getMonth(), date.getFullYear()]}
                />
              </Col>
              <Col xs="5">
                <LiabilityTable
                  user={user}
                  date={[date.getMonth(), date.getFullYear()]}
                />
              </Col>
            </Row>
          </Container>
        </div>
      </>
    );
  }
}

export default NetWorth;
