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

import { numberToCurrency } from '../../helpers/currency';
import { dateToStringShort } from '../../helpers/date-helper';
import EditModal from './EditModal';

const defaultState = {
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

class ExpenseTableWeek extends Component {
  state = { ...defaultState };

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
    const { user, data, getData } = this.props;
    const { open, value } = this.state;

    return (
      <>
        <Card>
          <CardHeader>
            <CardTitle className='card-title' tag='h2'>
              {`Expenses`}
            </CardTitle>
          </CardHeader>
          <CardBody className='card-body'>
            <div className='table-full-width table-responsive'>
              <Table>
                <thead className='text-primary'>
                  <tr>
                    <th>date</th>
                    <th>amount</th>
                    <th>group</th>
                    <th>vendor</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((expense, idx) => {
                    return (
                      <tr key={`expense-record-${expense[0]}`}>
                        <td>{dateToStringShort(expense[6])}</td>
                        <td>{numberToCurrency.format(expense[1])}</td>
                        <td>{expense[2]}</td>
                        <td>{expense[3].substring(0, 10)}</td>
                        <td className='td-actions text-right'>
                          <Button
                            color='link'
                            id={`week-expense-table-tooltip-${idx}`}
                            title=''
                            type='button'
                            onClick={() => this.handleClick(expense)}
                          >
                            <i className='tim-icons icon-pencil' />
                          </Button>
                          <UncontrolledTooltip
                            delay={0}
                            target={`week-expense-table-tooltip-${idx}`}
                            placement='right'
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
        <EditModal
          open={open}
          handleClose={this.handleClose}
          user={user}
          value={value}
          getData={getData}
        />
      </>
    );
  }
}

export default ExpenseTableWeek;
