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
import IncomeModalEdit from './IncomeModalEdit';

const defaultState = {
  open: false,
  value: {
    amount: 0,
    id: 0,
    description: '',
    source: '',
    date: new Date(),
  },
};

class IncomeTableWeek extends Component {
  state = { ...defaultState };

  handleClick = (expense) => {
    this.setState({
      open: true,
      value: {
        id: expense[0],
        amount: expense[1],
        source: expense[2],
        description: expense[3],
        date: expense[4],
      },
    });
  };

  handleClose = () => {
    this.setState({
      open: false,
    });
  };

  render() {
    const { user, data, getData } = this.props;
    const { open, value } = this.state;

    return (
      <>
        <Card>
          <CardHeader>
            <CardTitle className="card-title" tag="h2">
              {`Incomes`}
            </CardTitle>
          </CardHeader>
          <CardBody className="card-body">
            <div className="table-full-width table-responsive">
              <Table>
                <thead className="text-primary">
                  <tr>
                    <th>date</th>
                    <th>amount</th>
                    <th>source</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((income, idx) => {
                    return (
                      <tr key={`income-record-${income[0]}`}>
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
                            id="week-income-table-tooltip"
                            title=""
                            type="button"
                            onClick={() => this.handleClick(income)}
                          >
                            <i className="tim-icons icon-pencil" />
                          </Button>
                          <UncontrolledTooltip
                            delay={0}
                            target="week-income-table-tooltip"
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
          get_data={getData}
        />
      </>
    );
  }
}

export default IncomeTableWeek;
