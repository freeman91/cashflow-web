import React, { Component } from 'react';
import { isEqual } from 'lodash';

// reactstrap components
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
        netIncomeWeek: result.net_income_week,
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
    const {
      isLoaded,
      // netIncomeYear,
      // netIncomeMonth,
      // netIncomeWeek,
      reload,
    } = this.state;
    if (!isLoaded) return <Loader />;

    const { user } = this.props;
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
                <div className="font-icon-detail">
                  <CardHeader>
                    <CardTitle className="card-title" tag="h1">
                      Chart Under Construction
                    </CardTitle>
                  </CardHeader>
                  <CardBody className="image"></CardBody>
                </div>
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
