import React, { Component } from 'react';
import { isEqual } from 'lodash';
import {
  Legend,
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

const prepareChartData = (expenses, incomes, workHours) => {
  let ret = [];
  for (let i = 0; i < expenses.length; i++) {
    ret.push({
      week: Math.round(expenses[i].week),
      expense: Math.round(expenses[i].amount),
      income: Math.round(incomes[i].amount),
      workHour: Math.round(workHours[i].amount),
    });
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
    console.log(chartData);
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
                    <BarChart
                      height="500"
                      width="700"
                      data={chartData}
                      margin={{ top: 15, right: 30, left: 20, bottom: 5 }}
                    >
                      <XAxis dataKey="week" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar type="monotone" dataKey="expense" fill="#8884d8" />
                      <Bar type="monotone" dataKey="income" fill="#82ca9d" />
                      <Bar type="monotone" dataKey="workHour" fill="#ff6600" />
                    </BarChart>
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
