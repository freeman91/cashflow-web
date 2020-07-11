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
import ExpenseTable from '../components/ExpenseTable';
import WorkHourTable from '../components/WorkHourTable';
import IncomeTable from '../components/IncomeTable';
import DashboardService from '../service/DashboardService';
import ExpenseModalNew from '../components/ExpenseModalNew.js';
import IncomeModalNew from '../components/IncomeModalNew.js';
import WorkHourModalNew from '../components/WorkHourModalNew.js';

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
      this.get_dash_data();
    }
  }

  get_dash_data = async (type) => {
    DashboardService.getData(this.props.user.auth_token).then((result) => {
      this.setState({
        net_income_year: result.net_income_year,
        net_income_month: result.net_income_month,
        net_income_week: result.net_income_week,
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
    console.log(this.state);
    const {
      isLoaded,
      // net_income_week,
      // net_income_month,
      // net_income_year,
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
                get_data={this.get_dash_data}
                stopReload={this.stopReload}
              />
            </Col>
            <Col xs="4">
              <IncomeTable
                user={user}
                reload={reload.income}
                get_data={this.get_dash_data}
                stopReload={this.stopReload}
              />
            </Col>
            <Col xs="3">
              <WorkHourTable
                user={user}
                reload={reload.workHour}
                get_data={this.get_dash_data}
                stopReload={this.stopReload}
              />
            </Col>
          </Row>
        </div>
        <ExpenseModalNew
          user={user}
          open={this.state.dialogs.expOpen}
          handleClose={this.handleClose}
          get_data={this.get_dash_data}
          reload_expenses={this.reload_expenses}
        />
        <IncomeModalNew
          user={user}
          open={this.state.dialogs.incOpen}
          handleClose={this.handleClose}
          get_data={this.get_dash_data}
          reload_incomes={this.reload_incomes}
        />
        <WorkHourModalNew
          user={user}
          open={this.state.dialogs.whOpen}
          handleClose={this.handleClose}
          reload_workHours={this.reload_workHours}
          get_data={this.get_dash_data}
        />
      </>
    );
  }
}

export default Dashboard;
