import React, { Component } from 'react';
import { isEqual } from 'lodash';
import {
  Legend,
  Line,
  LineChart,
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

const defaultState = {
  isLoaded: false,
  expenses: [],
  incomes: [],
  workHours: [],
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

const prepareChartData = (expenses, incomes, workHours) => {
  const today = new Date();
  let ret = [];
  for (let i = 0; i < expenses.length; i++) {
    let currentDate = getMonday(expenses[i][expenses[i].length - 1][1]);
    for (let j = 0; j < 7; j++) {
      // TODO: group expense[i] by date first, then find sun where group key = currentDate
      let expenseSum = 0;
      let incomeSum = 0;
      let workHourSum = 0;
      expenses[i].forEach((expense) => {
        if (expense[1] === formatDateObject(currentDate)) {
          expenseSum += expense[0];
        }
      });
      incomes[i].forEach((income) => {
        if (income[1] === formatDateObject(currentDate)) {
          incomeSum += income[0];
        }
      });
      workHours[i].forEach((workHour) => {
        if (workHour[1] === formatDateObject(currentDate)) {
          workHourSum += workHour[0];
        }
      });
      ret.push({
        date: formatDateObject(currentDate),
        expense: expenseSum,
        income: incomeSum,
        workHour: workHourSum,
      });
      currentDate.setDate(currentDate.getDate() + 1);
      if (currentDate > today) j = 10;
    }
  }
  return ret;
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
        netIncomeYear: result.net_income_year,
        NetIncomeMonth: result.net_income_month,
        expenses: result.expenses,
        incomes: result.incomes,
        workHours: result.workHours,
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
      // netIncomeYear,
      // netIncomeMonth,
      reload,
      expenses,
      incomes,
      workHours,
    } = this.state;
    if (!isLoaded) return <Loader />;

    const chartData = prepareChartData(expenses, incomes, workHours);
    return (
      <>
        <div className="content">
          <Row>
            <Col xs="2">
              <Card>
                <CardHeader>
                  <CardTitle className="card-title" tag="h3">
                    Enter Data
                  </CardTitle>
                </CardHeader>
                <CardBody className="card-body">
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
                </CardBody>
              </Card>
            </Col>
            <Col xs="10">
              <Card>
                <CardBody
                  style={{
                    flex: '1 1 auto',
                    overflowY: 'auto',
                    minHeight: '500px',
                    width: '100%',
                  }}
                >
                  <ResponsiveContainer minHeight="250" minWidth="250">
                    <LineChart
                      height="500"
                      width="700"
                      data={chartData}
                      margin={{ top: 15, right: 30, left: 20, bottom: 5 }}
                    >
                      <XAxis
                        dataKey="date"
                        tickFormatter={(date) => {
                          return date.slice(5, 10).replace('-', '/');
                        }}
                      />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        dot={false}
                        type="monotone"
                        dataKey="expense"
                        stroke="#8884d8"
                      />
                      <Line
                        dot={false}
                        type="monotone"
                        dataKey="income"
                        stroke="#82ca9d"
                      />
                      <Line
                        dot={false}
                        type="monotone"
                        dataKey="workHour"
                        stroke="#ff6600"
                      />
                    </LineChart>
                  </ResponsiveContainer>
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
