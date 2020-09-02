import React, { Component } from 'react';
import { isEqual } from 'lodash';
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Col,
  Container,
  Table,
  Row,
} from 'reactstrap';

// import formatter from '../helpers/currency';
import Loader from '../components/Loader';
import ExpenseTable from '../components/Expense/ExpenseTableRecent';
import WorkHourTable from '../components/WorkHour/WorkHourTable';
import IncomeTable from '../components/Income/IncomeTable';
import DashboardService from '../service/DashboardService';
import ExpenseNewModal from '../components/Expense/NewModal';
import IncomeNewModal from '../components/Income/NewModal';
import WorkHourNewModal from '../components/WorkHour/NewModal';
import formatDateObject from '../helpers/format-date-object';
import formatter from '../helpers/currency';
import { renderDateMonthName } from '../helpers/render-date';

const defaultState = {
  isLoaded: false,
  expenses: [],
  incomeTotal: 0,
  workHourTotal: 0,
  dialogs: {
    expOpen: false,
    incOpen: false,
    whOpen: false,
    reload: {
      expense: false,
      income: false,
      workHour: false,
    },
  },
};

const getMonday = (d) => {
  d = new Date(d + ' 12:00:00');
  var day = d.getDay(),
    diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
  return new Date(d.setDate(diff));
};

const prepareChartData = (expenses) => {
  let expenseTotal = 0;
  const today = new Date();
  let chartData = [];
  for (let i = 0; i < expenses.length; i++) {
    if (expenses[i].length === 0) break;
    let currentDate = getMonday(expenses[i][expenses[i].length - 1][1]);
    for (let j = 0; j < 7; j++) {
      let expenseSum = 0;
      expenses[i].forEach((expense) => {
        if (expense[1] === formatDateObject(currentDate)) {
          expenseSum += expense[0];
        }
      });
      chartData.push({
        name: formatDateObject(currentDate),
        expense: Math.round(expenseSum * 100) / 100,
      });
      expenseTotal += expenseSum;
      currentDate.setDate(currentDate.getDate() + 1);
      if (currentDate > today) j = 10;
    }
  }
  return { chartData, expenseTotal };
};

class Dashboard extends Component {
  state = { ...defaultState };

  componentDidMount() {
    if (isEqual(this.props.user, {})) {
      this.props.history.push('/');
    } else {
      this.getDashData();
    }
  }

  getDashData = async (type) => {
    DashboardService.getData(this.props.user.auth_token).then((result) => {
      this.setState({
        expenses: result.expenses,
        incomeTotal: result.incomeTotal,
        workHourTotal: result.workHourTotal,
        isLoaded: true,
        reload: {
          ...defaultState.reload,
          [type]: true,
        },
      });
    });
  };

  handleCreateClickExpense = () => {
    this.setState({ dialogs: { ...defaultState.dialogs, expOpen: true } });
  };

  handleCreateClickIncome = () => {
    this.setState({ dialogs: { ...defaultState.dialogs, incOpen: true } });
  };

  handleCreateClickWorkHour = () => {
    this.setState({ dialogs: { ...defaultState.dialogs, whOpen: true } });
  };

  stopReload = () => {
    this.setState({
      reload: {
        ...defaultState.reload,
      },
    });
  };

  handleClose = () => {
    this.setState({
      dialogs: { ...defaultState.dialogs },
    });
  };

  render() {
    const { user } = this.props;
    const {
      isLoaded,
      reload,
      expenses,
      incomeTotal,
      workHourTotal,
    } = this.state;
    if (!isLoaded) return <Loader />;

    const { chartData, expenseTotal } = prepareChartData(expenses);
    return (
      <>
        <div className="content">
          <Container>
            <Row>
              <Col xs="2">
                <Card>
                  <CardHeader>
                    <CardTitle className="card-title" tag="h3">
                      Enter Data
                    </CardTitle>
                  </CardHeader>
                  <CardBody className="card-body">
                    <Container>
                      <Row>
                        <Button
                          block
                          size="sm"
                          color="primary"
                          onClick={this.handleCreateClickExpense}
                        >
                          New Expense
                        </Button>
                      </Row>
                      <Row>
                        <Button
                          block
                          size="sm"
                          color="primary"
                          onClick={this.handleCreateClickIncome}
                        >
                          New Income
                        </Button>
                      </Row>
                      <Row>
                        <Button
                          block
                          size="sm"
                          color="primary"
                          onClick={this.handleCreateClickWorkHour}
                        >
                          New Work Hour
                        </Button>
                      </Row>
                    </Container>
                  </CardBody>
                </Card>
                <Card>
                  <p />
                </Card>
              </Col>
              <Col xs="10">
                <Card>
                  <CardBody>
                    <Container>
                      <Row>
                        <Col xs="3">
                          <CardTitle className="card-title" tag="h3">
                            {`${renderDateMonthName(
                              chartData[0].name
                            )} - ${renderDateMonthName(
                              chartData[chartData.length - 1].name
                            )}`}
                          </CardTitle>
                          <Table style={{ marginTop: '4rem' }}>
                            <tbody>
                              <tr>
                                <th>Expenses</th>
                                <td>{formatter.format(expenseTotal)}</td>
                              </tr>
                              <tr>
                                <th>Incomes</th>
                                <td>{formatter.format(incomeTotal)}</td>
                              </tr>
                              <tr>
                                <th>Net Income</th>
                                <td>
                                  {formatter.format(incomeTotal - expenseTotal)}
                                </td>
                              </tr>
                              <tr>
                                <th>Work Hours</th>
                                <td>{workHourTotal}</td>
                              </tr>
                              <tr>
                                <th>Hourly Wage</th>
                                <td>
                                  {formatter.format(
                                    workHourTotal === 0
                                      ? 0
                                      : incomeTotal / workHourTotal
                                  )}
                                </td>
                              </tr>
                            </tbody>
                          </Table>
                        </Col>
                        <Col xs="9" style={{ height: '400px' }}>
                          <ResponsiveContainer minHeight="250" minWidth="250">
                            <BarChart
                              height="500"
                              width="700"
                              data={chartData}
                              margin={{
                                top: 15,
                                right: 30,
                                left: 20,
                                bottom: 5,
                              }}
                            >
                              <XAxis
                                dataKey="name"
                                tickFormatter={(date) => {
                                  return date.slice(5, 10).replace('-', '/');
                                }}
                              />
                              <YAxis />
                              <Tooltip
                                formatter={(value) => {
                                  return formatter.format(value);
                                }}
                              />
                              <Bar dataKey="expense" fill="#8884d8" />
                            </BarChart>
                          </ResponsiveContainer>
                        </Col>
                      </Row>
                    </Container>
                  </CardBody>
                </Card>
              </Col>
            </Row>
            <Row>
              <Col xs="5">
                <ExpenseTable
                  user={user}
                  reload={reload.expense}
                  getData={this.getDashData}
                  stopReload={this.stopReload}
                />
              </Col>
              <Col xs="4">
                <IncomeTable
                  user={user}
                  reload={reload.income}
                  getData={this.getDashData}
                  stopReload={this.stopReload}
                />
              </Col>
              <Col xs="3">
                <WorkHourTable
                  user={user}
                  reload={reload.workHour}
                  getData={this.getDashData}
                  stopReload={this.stopReload}
                />
              </Col>
            </Row>
          </Container>
        </div>
        <ExpenseNewModal
          user={user}
          open={this.state.dialogs.expOpen}
          handleClose={this.handleClose}
          getData={this.getDashData}
          reloadExpenses={this.reloadExpenses}
        />
        <IncomeNewModal
          user={user}
          open={this.state.dialogs.incOpen}
          handleClose={this.handleClose}
          getData={this.getDashData}
          reloadIncomes={this.reloadIncomes}
        />
        <WorkHourNewModal
          user={user}
          open={this.state.dialogs.whOpen}
          handleClose={this.handleClose}
          reloadWorkHours={this.reloadWorkHours}
          getData={this.getDashData}
        />
      </>
    );
  }
}

export default Dashboard;
