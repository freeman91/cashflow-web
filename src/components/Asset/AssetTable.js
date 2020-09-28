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

import { numberToCurrency } from '../../helpers/currency';
import { dateToStringShort, monthToString } from '../../helpers/date-helper';
import NewModal from './NewModal';
import EditModal from './EditModal';
import Loader from '../../components/Loader';
import Asset from '../../service/AssetService';

const defaultState = {
  isLoaded: false,
  dialogs: {
    newOpen: false,
    editOpen: false,
  },
  assets: [],
  value: {
    id: '',
    amount: 0,
    source: '',
    date: new Date(),
  },
};

class AssetTable extends Component {
  state = { ...defaultState };

  componentDidMount() {
    const { date } = this.props;
    this.getAssets(date[0] + 1, date[1]);
  }

  getAssets = (month, year) => {
    Asset.getFromMonth(month, year, this.props.user.auth_token).then(
      (response) => {
        this.setState({
          assets: response.properties,
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

  handleClick = (asset) => {
    this.setState({
      dialogs: {
        editOpen: true,
      },
      value: {
        id: asset[0],
        amount: asset[1],
        source: asset[2],
        description: asset[3],
        date: asset[4],
      },
    });
  };

  prepareTableData = () => {
    const assetsData = [];
    this.state.assets.map((asset) => {
      assetsData.push([
        asset.id,
        asset.amount,
        asset.source,
        asset.description,
        asset.date,
      ]);
      return null;
    });
    return assetsData;
  };

  render() {
    const { isLoaded } = this.state;
    const { user, date } = this.props;
    if (!isLoaded) return <Loader />;
    const assetsData = this.prepareTableData();
    return (
      <>
        <Card>
          <CardHeader>
            <Row>
              <Col xs='8'>
                <CardTitle className='card-title' tag='h2'>
                  {`${monthToString(date[0] + 1)}'s Assets`}
                </CardTitle>
              </Col>
              <Col xs='3'>
                <Button
                  size='sm'
                  color='primary'
                  onClick={() => {
                    this.handleOpen('newOpen');
                  }}
                >
                  New Asset
                </Button>
              </Col>
            </Row>
          </CardHeader>
          <CardBody className='card-body'>
            <div className='table-full-width table-responsive'>
              <Table>
                <thead className='text-primary'>
                  <tr>
                    <th>date</th>
                    <th>amount</th>
                    <th>source</th>
                  </tr>
                </thead>
                <tbody>
                  {assetsData.map((asset, i) => {
                    return (
                      <tr key={`asset-${i}`}>
                        <td>{dateToStringShort(asset[4])}</td>
                        <td>{numberToCurrency.format(asset[1])}</td>
                        <td>{asset[2]}</td>
                        <td>{asset[3].substring(0, 10)}</td>
                        <td className='td-actions text-right'>
                          <Button
                            color='link'
                            id={`asset-table-tooltip-${i}`}
                            title=''
                            type='button'
                            onClick={() => this.handleClick(asset)}
                          >
                            <i className='tim-icons icon-pencil' />
                          </Button>
                          <UncontrolledTooltip
                            delay={0}
                            target={`asset-table-tooltip-${i}`}
                            placement='right'
                          >
                            Edit Asset
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
            this.getAssets(new Date().getMonth() + 1, new Date().getFullYear())
          }
        />
        <EditModal
          user={user}
          open={this.state.dialogs.editOpen}
          handleClose={() => {
            this.handleClose('editOpen');
          }}
          getData={() =>
            this.getAssets(new Date().getMonth() + 1, new Date().getFullYear())
          }
          value={this.state.value}
        />
      </>
    );
  }
}

export default AssetTable;
