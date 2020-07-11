import React, { Component } from 'react';
import { isEqual } from 'lodash';
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
import IncomeModalEdit from './IncomeModalEdit';
import Dashboard from '../service/DashboardService';

const defaultValue = {
  isLoaded: false,
  open: false,
  value: {
    amount: 0,
    id: 0,
    source: '',
    description: '',
    date: new Date(),
  },
};
class IncomeTable extends Component {
  state = { ...defaultValue };

  componentDidMount() {
    if (isEqual(this.props.user, {})) {
      this.props.history.push('/');
    } else {
      this.get_incomes();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.reload) {
      this.get_incomes().then(() => {
        this.props.stopReload();
      });
    }
  }

  get_incomes = async () => {
    Dashboard.getIncomes(this.props.user.auth_token).then((result) => {
      if (result) {
        this.setState({
          incomes: result.incomes,
          isLoaded: true,
        });
      }
    });
  };

  handleClick = (income) => {
    this.setState({
      open: true,
      value: {
        id: income[0],
        amount: income[1],
        source: income[2],
        description: income[3],
        date: income[4],
      },
    });
  };

  handleClose = () => {
    this.setState({
      open: false,
    });
  };

  handleCollapse = () => {
    this.setState({
      collapse: !this.state.collapse,
    });
  };

  render() {
    const { user, get_data } = this.props;
    const { incomes, isLoaded, open, value } = this.state;
    if (!isLoaded) return null;

    var incomesData = [];
    incomes.map((income) => {
      incomesData.push([
        income.id,
        income.amount,
        income.source,
        income.description,
        income.date,
      ]);
      return null;
    });

    return (
      <>
        <Card>
          <CardHeader>
            <CardTitle className="card-title" tag="h2">
              Recent Incomes
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
                  </tr>
                </thead>
                <tbody>
                  {incomesData.map((income, idx) => {
                    return (
                      <tr key={`income-item ${idx}`}>
                        <td>
                          {new Date(income[4] + ' 12:00').getMonth() +
                            1 +
                            '/' +
                            new Date(income[4] + ' 12:00').getDate()}
                        </td>
                        <td>{formatter.format(income[1])}</td>
                        <td>{income[2]}</td>
                        <td className="td-actions text-right">
                          <Button
                            color="link"
                            id="income-table-tooltip"
                            title=""
                            type="button"
                            onClick={() => this.handleClick(income)}
                          >
                            <i className="tim-icons icon-pencil" />
                          </Button>
                          <UncontrolledTooltip
                            delay={0}
                            target="income-table-tooltip"
                            placement="right"
                          >
                            Edit Income
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
        <IncomeModalEdit
          open={open}
          handleClose={this.handleClose}
          user={user}
          value={value}
          get_incomes={this.get_incomes}
          get_data={get_data}
        />
      </>
    );
  }
}

export default IncomeTable;
