import React, { Component } from 'react';
import { isEqual } from 'lodash';

// reactstrap components
import {
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Col,
  Row,
  Table,
} from 'reactstrap';

import AssetTable from '../components/Asset/AssetTable';
import LiabilityTable from '../components/Liability/LiabilityTable';
import NetWorthService from '../service/NetWorthService';
import formatter from '../helpers/currency';
import Loader from '../components/Loader';
import month from '../helpers/month-names';

class NetWorth extends Component {
  state = {
    isLoaded: false,
  };

  componentDidMount() {
    if (isEqual(this.props.user, {})) {
      this.props.history.push('/');
    } else {
      this.getData();
    }
  }

  async getData() {
    NetWorthService.getData(this.props.user.auth_token)
      .then((response) => {
        this.setState({
          cwdate: response.cwdate,
          assets: response.properties,
          liabilities: response.debts,
          netWorthLast12: response.netWorthLast12,
          isLoaded: true,
        });
      })
      .catch((error) => console.error(error));
  }

  prepareTableData = () => {
    const { netWorthLast12 } = this.state;

    var months = [];
    var netWorthData = [];
    netWorthLast12.map((record) => {
      months.push(`${month[record[0] - 1]} ${record[1].toString().slice(-2)}`);
      netWorthData.push(formatter.format(record[2]));
      return null;
    });
    return [months.reverse(), netWorthData.reverse()];
  };

  render() {
    const { isLoaded } = this.state;
    if (!isLoaded) return <Loader />;

    const [months, netWorthData] = this.prepareTableData();

    //     const liabilitiesData = [];
    //     liabilities.map((liability) => {
    //       var date = new Date(liability.date + ' 12:00');
    //       liabilitiesData.push([
    //         date.getMonth() + 1 + '/' + date.getDate(),
    //         formatter.format(liability.amount),
    //         liability.group,
    //         liability.id,
    //       ]);
    //       return null;
    //     });

    const { user } = this.props;
    return (
      <>
        <div className="content">
          <Row>
            <Col xs="12">
              <Card>
                <CardHeader>
                  <CardTitle className="card-title" tag="h2">
                    Net Worth over the past 6 months
                  </CardTitle>
                </CardHeader>
                <CardBody className="card-body">
                  <div className="table-full-width table-responsive">
                    <Table>
                      <thead className="text-primary">
                        <tr>
                          {months.slice(5, 11).map((month) => {
                            return <th key={'header' + month}>{month}</th>;
                          })}
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          {netWorthData.slice(5, 11).map((row, idx) => {
                            return (
                              <td
                                className="td-price"
                                key={`${months[idx]}-net-worth`}
                              >
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
          </Row>
          <Row>
            <Col xs="1"></Col>
            <Col xs="5">
              <AssetTable user={user} />
            </Col>
            <Col xs="5">{/* <LiabilityTable /> */}</Col>
          </Row>
        </div>
      </>

      //             {/* ASSETS */}
      //             <Grid item xs={4} key="assets">
      //               <CashFlowTable
      //                 title="Assets"
      //                 dataTextSize="subtitle1"
      //                 headers={['date', 'amount', 'source']}
      //                 rows={assetsData}
      //               />
      //             </Grid>

      //             {/* LIABILITIES */}
      //             <Grid item xs={4} key="liabilities">
      //               <CashFlowTable
      //                 title="Liabilities"
      //                 dataTextSize="subtitle1"
      //                 headers={['date', 'amount', 'group']}
      //                 rows={liabilitiesData}
      //               />
      //             </Grid>
    );
  }
}

export default NetWorth;
