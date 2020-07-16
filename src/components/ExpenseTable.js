import React, { Component } from 'react';
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Table,
  UncontrolledTooltip,
} from 'reactstrap';

import formatter from '../helpers/currency';
import Loader from '../components/Loader';
import ExpenseModalEdit from './ExpenseModalEdit';
import Dashboard from '../service/DashboardService';

const defaultValue = {
  isLoaded: false,
  open: false,
  value: {
    amount: 0,
    id: 0,
    vendor: '',
    description: '',
    group: '',
    date: new Date(),
  },
};

class ExpenseTable extends Component {
  state = { ...defaultValue };

  componentDidMount() {
    this.get_expenses();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.reload) {
      this.get_expenses().then(() => {
        this.props.stopReload();
      });
    }
  }

  get_expenses = async () => {
    Dashboard.getExpenses(this.props.user.auth_token).then((result) => {
      if (result) {
        this.setState({
          expenses: result.expenses,
          isLoaded: true,
        });
      }
    });
  };

  handleClick = (expense) => {
    this.setState({
      open: true,
      value: {
        id: expense[0],
        amount: expense[1],
        group: expense[2],
        vendor: expense[3],
        description: expense[4],
        bill: expense[5],
        date: expense[6],
      },
    });
  };

  handleClose = () => {
    this.setState({
      open: false,
    });
  };

  render() {
    const { user, get_data } = this.props;
    const { expenses, isLoaded, open, value } = this.state;
    if (!isLoaded) return <Loader />;

    var expensesData = [];
    expenses.map((exp) => {
      expensesData.push([
        exp.id,
        exp.amount,
        exp.group,
        exp.vendor,
        exp.description,
        exp.bill,
        exp.date,
      ]);
      return null;
    });

    return (
      <>
        <Card>
          <CardHeader>
            <CardTitle className="card-title" tag="h2">
              Recent Expenses
            </CardTitle>
          </CardHeader>
          <CardBody className="card-body">
            <div className="table-full-width table-responsive">
              <Table>
                <thead className="text-primary">
                  <tr>
                    <th>date</th>
                    <th>amount</th>
                    <th>group</th>
                    <th>vendor</th>
                  </tr>
                </thead>
                <tbody>
                  {expensesData.map((expense, idx) => {
                    return (
                      <tr key={`expense-item ${idx}`}>
                        <td>
                          {new Date(expense[6] + ' 12:00').getMonth() +
                            1 +
                            '/' +
                            new Date(expense[6] + ' 12:00').getDate()}
                        </td>
                        <td>{formatter.format(expense[1])}</td>
                        <td>{expense[2]}</td>
                        <td>{expense[3].substring(0, 10)}</td>
                        <td className="td-actions text-right">
                          <Button
                            color="link"
                            id="expense-table-tooltip"
                            title=""
                            type="button"
                            onClick={() => this.handleClick(expense)}
                          >
                            <i className="tim-icons icon-pencil" />
                          </Button>
                          <UncontrolledTooltip
                            delay={0}
                            target="expense-table-tooltip"
                            placement="right"
                          >
                            Edit Expense
                          </UncontrolledTooltip>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </div>
          </CardBody>
        </Card>
        <ExpenseModalEdit
          open={open}
          handleClose={this.handleClose}
          user={user}
          value={value}
          get_expenses={this.get_expenses}
          get_data={get_data}
        />
      </>
    );
  }
}

export default ExpenseTable;
