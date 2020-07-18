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

import formatter_no$ from '../../helpers/currency_no$';
import EditModal from './EditModal';

const defaultState = {
  open: false,
  value: {
    amount: 0,
    id: 0,
    source: '',
    date: new Date(),
  },
};

class WorkHourTableWeek extends Component {
  state = { ...defaultState };

  handleClick = (expense) => {
    this.setState({
      open: true,
      value: {
        id: expense[0],
        amount: expense[1],
        source: expense[2],
        date: expense[3],
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
              {`Work Hours`}
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
                  {data.map((workHour, idx) => {
                    return (
                      <tr key={`workHour-record-${workHour[0]}`}>
                        <td>
                          {new Date(workHour[3] + ' 12:00').getMonth() +
                            1 +
                            '/' +
                            new Date(workHour[3] + ' 12:00').getDate()}
                        </td>
                        <td>{formatter_no$.format(workHour[1])}</td>
                        <td>{workHour[2]}</td>
                        <td className="td-actions text-right">
                          <Button
                            color="link"
                            id="week-workHour-table-tooltip"
                            title=""
                            type="button"
                            onClick={() => this.handleClick(workHour)}
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
        <EditModal
          open={open}
          handleClose={this.handleClose}
          user={user}
          value={value}
          get_workHours={getData}
        />
      </>
    );
  }
}

export default WorkHourTableWeek;
