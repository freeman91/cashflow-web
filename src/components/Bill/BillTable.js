import React, { Component } from 'react';
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Col,
  Table,
  Row,
  UncontrolledTooltip,
} from 'reactstrap';

import formatter from '../../helpers/currency';
import { renderDate } from '../../helpers/render-date';
import { getMonth } from '../../helpers/month-names';
import EditModal from '../Expense/EditModal';
import Month from '../../service/MonthService';

const defaultValue = {
  isLoaded: false,
  open: false,
  value: {
    amount: 0,
    id: 0,
    vendor: '',
    description: '',
    group: '',
    bill: true,
    date: new Date(),
  },
};

class BillTable extends Component {
  state = { ...defaultValue };

  componentDidMount() {
    this.getBills(this.props.week, this.props.year);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.reload) {
      this.getBills(nextProps.week, nextProps.year).then(() => {
        this.props.stopReload();
      });
    }
  }

  getBills = async (week, year) => {
    Month.getBills(this.props.user.auth_token, week, year).then((result) => {
      if (result) {
        this.setState({
          bills: result.bills,
          isLoaded: true,
        });
      }
    });
  };

  handleClick = (bill) => {
    this.setState({
      open: true,
      value: {
        id: bill[0],
        amount: bill[1],
        group: bill[2],
        vendor: bill[3],
        description: bill[4],
        bill: bill[5],
        date: bill[6],
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
    const { user, week, getData } = this.props;
    const { bills, isLoaded, open, value } = this.state;
    if (!isLoaded) return null;

    var billsData = [];
    bills.map((bill) => {
      billsData.push([
        bill.id,
        bill.amount,
        bill.group,
        bill.vendor,
        bill.description,
        bill.bill,
        bill.date,
      ]);
      return null;
    });

    const billTotal = bills.reduce((total, bill) => {
      return total + bill.amount;
    }, 0);
    return (
      <>
        <Card>
          <CardHeader>
            <Row>
              <Col xs="6">
                <CardTitle className="card-title" tag="h2">
                  {getMonth(week) + ' Bills'}
                </CardTitle>
              </Col>
              <Col xs="6">
                <h3>{'Total: ' + formatter.format(billTotal)}</h3>
              </Col>
            </Row>
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
                  {billsData.map((bill, idx) => {
                    return (
                      <tr key={`bill-item ${idx}`}>
                        <td>{renderDate(bill[6])}</td>
                        <td>{formatter.format(bill[1])}</td>
                        <td>{bill[2]}</td>
                        <td>{bill[3].substring(0, 10)}</td>
                        <td className="td-actions text-right">
                          <Button
                            color="link"
                            id={`bill-table-tooltip_${idx}`}
                            title=""
                            type="button"
                            onClick={() => this.handleClick(bill)}
                          >
                            <i className="tim-icons icon-pencil" />
                          </Button>
                          <UncontrolledTooltip
                            delay={0}
                            target={`bill-table-tooltip_${idx}`}
                            placement="right"
                          >
                            Edit Bill
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
          getExpenses={this.getBills}
          getData={getData}
        />
      </>
    );
  }
}

export default BillTable;
