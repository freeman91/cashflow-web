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

import formatter from '../../helpers/currency';
import { renderDate } from '../../helpers/render-date';
import EditModal from './EditModal';
import Dashboard from '../../service/DashboardService';

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
    this.getIncomes();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.reload) {
      this.getIncomes().then(() => {
        this.props.stopReload();
      });
    }
  }

  getIncomes = async () => {
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
    const { user, getData } = this.props;
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
              Incomes
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
                        <td>{renderDate(income[4])}</td>
                        <td>{formatter.format(income[1])}</td>
                        <td>{income[2]}</td>
                        <td className="td-actions text-right">
                          <Button
                            color="link"
                            id={`income-table-tooltip-${idx}`}
                            title=""
                            type="button"
                            onClick={() => this.handleClick(income)}
                          >
                            <i className="tim-icons icon-pencil" />
                          </Button>
                          <UncontrolledTooltip
                            delay={0}
                            target={`income-table-tooltip-${idx}`}
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
        <EditModal
          open={open}
          handleClose={this.handleClose}
          user={user}
          value={value}
          getIncomes={this.getIncomes}
          getData={getData}
        />
      </>
    );
  }
}

export default IncomeTable;
