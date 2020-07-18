import React, { Component } from 'react';
import { isEqual } from 'lodash';
import {
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Col,
  Row,
  Table,
} from 'reactstrap';

import formatter from '../helpers/currency';
import ExpenseTable from '../components/Expense/ExpenseTableWeek';
import IncomeTable from '../components/Income/IncomeTableWeek';
import WorkHourTable from '../components/WorkHour/WorkHourTableWeek';
import Loader from '../components/Loader';
import WeekService from '../service/WeekService';

class Week extends Component {
  state = {
    isLoaded: false,
  };

  getWeekData = async () => {
    WeekService.getData(this.props.user.auth_token)
      .then((response) => {
        this.setState({
          cwdate: response.cwdate,
          netincome: response.netincome,
          expTotal: response.expTotal,
          incTotal: response.incTotal,
          wkhrTotal: response.wkhrTotal,
          expenses: response.expenses,
          incomes: response.incomes,
          workHours: response.work_hours,
          isLoaded: true,
        });
      })
      .catch((error) => console.error(error));
  };

  componentDidMount() {
    if (isEqual(this.props.user, {})) {
      this.props.history.push('/');
    } else {
      this.getWeekData();
    }
  }

  prepareExpenses = () => {
    var expensesData = [];
    this.state.expenses.map((exp) => {
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
    return expensesData;
  };

  prepareIncomes = () => {
    var incomesData = [];
    this.state.incomes.map((inc) => {
      incomesData.push([
        inc.id,
        inc.amount,
        inc.source,
        inc.description,
        inc.date,
      ]);
      return null;
    });
    return incomesData;
  };

  prepareWorkHours = () => {
    var workHourData = [];
    this.state.workHours.map((wh) => {
      workHourData.push([wh.id, wh.amount, wh.source, wh.date]);
      return null;
    });
    return workHourData;
  };

  render() {
    const {
      netincome,
      expTotal,
      incTotal,
      wkhrTotal,
      cwdate,
      isLoaded,
    } = this.state;
    if (!isLoaded) return <Loader />;
    const expenseTableData = this.prepareExpenses();
    const incomeTableData = this.prepareIncomes();
    const workHourTableData = this.prepareWorkHours();
    const weekTableData = [
      formatter.format(netincome),
      formatter.format(expTotal),
      formatter.format(incTotal),
      wkhrTotal,
      formatter.format(wkhrTotal === 0 ? 0 : incTotal / wkhrTotal),
    ];
    console.log(weekTableData);

    const { user } = this.props;
    return (
      <>
        <div className="content">
          <Row>
            <Col xs="2"></Col>
            <Col xs="8">
              <Card>
                <CardHeader>
                  <CardTitle className="card-title" tag="h2">
                    {`Week ${cwdate.week} breakdown`}
                  </CardTitle>
                </CardHeader>
                <CardBody className="card-body">
                  <div className="table-full-width table-responsive">
                    <Table>
                      <thead className="text-primary">
                        <tr>
                          <th>net income</th>
                          <th>expense total</th>
                          <th>income total</th>
                          <th>hours worked</th>
                          <th>hourly wage</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          {weekTableData.map((row, idx) => {
                            return (
                              <td className="td-price" key={`week-data-${idx}`}>
                                {row}
                              </td>
                            );
                          })}
                        </tr>
                      </tbody>
                    </Table>
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col xs="2"></Col>
          </Row>
          <Row>
            <Col xs="4">
              <ExpenseTable
                user={user}
                data={expenseTableData}
                getData={this.getWeekData}
              />
            </Col>
            <Col xs="4">
              <IncomeTable
                user={user}
                data={incomeTableData}
                getData={this.getWeekData}
              />
            </Col>
            <Col xs="4">
              <WorkHourTable
                user={user}
                data={workHourTableData}
                getData={this.getWeekData}
              />
            </Col>
          </Row>
        </div>
      </>
      //
      //         <div className={classes.root}>
      //           <Grid
      //             container
      //             spacing={2}
      //             direction="row"
      //             justify="center"
      //             alignItems="flex-start"
      //           >
      //             {/* WEEK STATS */}
      //             <Grid item xs={8} key="week-stats">
      //               <CashFlowTable
      //                 dataTextSize="h5"
      //                 headers={[
      //                   'net income',
      //                   'expense total',
      //                   'income total',
      //                   'work hours',
      //                   'hourly wage',
      //                 ]}
      //                 rows={[
      //                   [
      //                     formatter.format(netincome),
      //                     formatter.format(expTotal),
      //                     formatter.format(incTotal),
      //                     wkhrTotal,
      //                     formatter.format(wkhrTotal ? incTotal / wkhrTotal : 0),
      //                     'week-stats-key',
      //                   ],
      //                 ]}
      //               />
      //             </Grid>
      //             </Grid>
      //           </Grid>
      //         </div>
    );
  }
}

export default Week;
