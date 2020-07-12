import React, { Component } from 'react';
import { Card, CardBody, CardHeader, CardTitle, Table } from 'reactstrap';

class MonthDataTable extends Component {
  render() {
    const { data } = this.props;

    return (
      <>
        <Card>
          <CardHeader>
            <CardTitle className="card-title" tag="h2">
              {this.props.month + ' breakdown'}
            </CardTitle>
          </CardHeader>
          <CardBody className="card-body">
            <div className="table-full-width table-responsive">
              <Table>
                <thead className="text-primary">
                  <tr>
                    <th>week</th>
                    <th>net income</th>
                    <th>expense total</th>
                    <th>income total</th>
                    <th>hours worked</th>
                    <th>hourly wage</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((row, idx) => {
                    return (
                      <tr key={`${row[row.length - 1]}`}>
                        {row.map((item, i) => {
                          if (i !== row.length - 1) {
                            return (
                              <td
                                className="td-price"
                                key={`${row[row.length - 1]}-${i}`}
                              >
                                {item}
                              </td>
                            );
                          } else return null;
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </div>
          </CardBody>
        </Card>
      </>
    );
  }
}

export default MonthDataTable;
