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
import { renderDate } from '../../helpers/render-date';
import EditModal from './EditModal';
import Dashboard from '../../service/DashboardService';

const defaultState = {
  isLoaded: false,
  open: false,
  collapse: true,
  value: {
    amount: 0,
    id: 0,
    source: '',
    date: new Date(),
  },
};

class WorkHourTable extends Component {
  state = { ...defaultState };

  componentDidMount() {
    this.getWorkHours();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.reload) {
      this.getWorkHours().then(() => {
        this.props.stopReload();
      });
    }
  }

  getWorkHours = async () => {
    Dashboard.getWorkHours(this.props.user.auth_token).then((result) => {
      if (result) {
        this.setState({
          workHours: result.workHours,
          isLoaded: true,
        });
      }
    });
  };

  handleClick = (workHour) => {
    this.setState({
      open: true,
      value: {
        id: workHour[0],
        amount: workHour[1],
        source: workHour[2],
        date: workHour[3],
      },
    });
  };

  handleClose = () => {
    this.setState({ ...defaultState });
  };

  handleCollapse = () => {
    this.setState({
      collapse: !this.state.collapse,
    });
  };

  render() {
    const { user } = this.props;
    const { workHours, isLoaded, open, value } = this.state;
    if (!isLoaded) return null;

    var workHoursData = [];
    workHours.map((exp) => {
      workHoursData.push([exp.id, exp.amount, exp.source, exp.date]);
      return null;
    });

    return (
      <>
        <Card>
          <CardHeader>
            <CardTitle className="card-title" tag="h2">
              Recent Work Hours
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
                  {workHoursData.map((workHour, idx) => {
                    return (
                      <tr key={`workHour-item ${idx}`}>
                        <td>{renderDate(workHour[3])}</td>
                        <td>{formatter_no$.format(workHour[1])}</td>
                        <td>{workHour[2]}</td>
                        <td className="td-actions text-right">
                          <Button
                            color="link"
                            id={`workHour-table-tooltip-${idx}`}
                            title=""
                            type="button"
                            onClick={() => this.handleClick(workHour)}
                          >
                            <i className="tim-icons icon-pencil" />
                          </Button>
                          <UncontrolledTooltip
                            delay={0}
                            target={`workHour-table-tooltip-${idx}`}
                            placement="right"
                          >
                            Edit Work Hour
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
          getWorkHours={this.getWorkHours}
        />
      </>
    );
  }
}

export default WorkHourTable;
