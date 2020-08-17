import React, { Component } from 'react';
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Col,
  Row,
  Table,
  UncontrolledTooltip,
} from 'reactstrap';

import formatter from '../../helpers/currency';
import { renderDate } from '../../helpers/render-date';
import NewModal from './NewModal';
import EditModal from './EditModal';
import Loader from '../../components/Loader';
import Liability from '../../service/LiabilityService';

const defaultState = {
  isLoaded: false,
  dialogs: {
    newOpen: false,
    editOpen: false,
  },
  liabilities: [],
  value: {
    id: '',
    amount: 0,
    group: '',
    date: new Date(),
  },
};

class LiabilityTable extends Component {
  state = { ...defaultState };

  componentDidMount() {
    const { date } = this.props;
    this.getLiabilities(date[0] + 1, date[1]);
  }

  getLiabilities = (month, year) => {
    Liability.getFromMonth(month, year, this.props.user.auth_token).then(
      (response) => {
        this.setState({
          liabilities: response.debts,
          isLoaded: true,
        });
      }
    );
  };

  handleOpen = (name) => {
    this.setState({
      dialogs: {
        ...this.state.dialogs,
        [name]: true,
      },
    });
  };

  handleClose = (name) => {
    this.setState({
      dialogs: {
        ...this.state.dialogs,
        [name]: false,
      },
      value: {
        ...defaultState.value,
      },
    });
  };

  handleClick = (liability) => {
    this.setState({
      dialogs: {
        editOpen: true,
      },
      value: {
        id: liability[0],
        amount: liability[1],
        group: liability[2],
        description: liability[3],
        date: liability[4],
      },
    });
  };

  prepareTableData = () => {
    const liabilitiesData = [];
    this.state.liabilities.map((liability) => {
      liabilitiesData.push([
        liability.id,
        liability.amount,
        liability.group,
        liability.description,
        liability.date,
      ]);
      return null;
    });
    return liabilitiesData;
  };

  render() {
    const { isLoaded } = this.state;
    const { user } = this.props;
    if (!isLoaded) return <Loader />;
    const liabilitiesData = this.prepareTableData();

    return (
      <>
        <Card>
          <CardHeader>
            <Row>
              <Col xs="8">
                <CardTitle className="card-title" tag="h2">
                  Liabilities
                </CardTitle>
              </Col>
              <Col xs="3">
                <Button
                  size="sm"
                  color="primary"
                  onClick={() => {
                    this.handleOpen('newOpen');
                  }}
                >
                  New Liability
                </Button>
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
                  </tr>
                </thead>
                <tbody>
                  {liabilitiesData.map((asset, i) => {
                    return (
                      <tr key={`asset-${i}`}>
                        <td>{renderDate(asset[4])}</td>
                        <td>{formatter.format(asset[1])}</td>
                        <td>{asset[2]}</td>
                        <td>{asset[3].substring(0, 10)}</td>
                        <td className="td-actions text-right">
                          <Button
                            color="link"
                            id={`liability-table-tooltip-${i}`}
                            title=""
                            type="button"
                            onClick={() => this.handleClick(asset)}
                          >
                            <i className="tim-icons icon-pencil" />
                          </Button>
                          <UncontrolledTooltip
                            delay={0}
                            target={`liability-table-tooltip-${i}`}
                            placement="right"
                          >
                            Edit Liability
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
        <NewModal
          user={user}
          open={this.state.dialogs.newOpen}
          handleClose={() => {
            this.handleClose('newOpen');
          }}
          getData={() =>
            this.getLiabilities(
              new Date().getMonth() + 1,
              new Date().getFullYear()
            )
          }
        />
        <EditModal
          user={user}
          open={this.state.dialogs.editOpen}
          handleClose={() => {
            this.handleClose('editOpen');
          }}
          getData={() =>
            this.getLiabilities(
              new Date().getMonth() + 1,
              new Date().getFullYear()
            )
          }
          value={this.state.value}
        />
      </>
    );
  }
}

export default LiabilityTable;
