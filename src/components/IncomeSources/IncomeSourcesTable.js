import React, { Component } from 'react';
import { isEqual } from 'lodash';
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

import EditModal from './EditModal';
import NewModal from './NewModal';
import Loader from '../../components/Loader';
import IncomeSource from '../../service/IncomeSourceService';

const defaultState = {
  isLoaded: false,
  sources: [],
  dialogs: {
    newOpen: false,
    editOpen: false,
  },
  value: {
    id: '',
    source: '',
    description: '',
  },
};

class IncomeSourcesTable extends Component {
  state = { ...defaultState };

  componentDidMount() {
    if (isEqual(this.props.user, {})) {
      return;
    }
    this.getSources();
  }

  getSources = () => {
    IncomeSource.getSources(this.props.user.auth_token).then((result) => {
      this.setState({
        sources: result.income_sources,
        isLoaded: true,
      });
    });
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

  handleClick = (source) => {
    this.setState({
      dialogs: {
        editOpen: true,
      },
      value: {
        id: source.id,
        name: source.name,
        description: source.description,
      },
    });
  };

  render() {
    const { isLoaded } = this.state;
    const { user } = this.props;
    if (!isLoaded) return <Loader />;
    return (
      <>
        <Card>
          <CardHeader>
            <Row>
              <Col xs="12">
                <CardTitle className="card-title" tag="h2">
                  Income Sources
                </CardTitle>
              </Col>
            </Row>
            <Row>
              <Col xs="12">
                <Button
                  block
                  size="sm"
                  color="primary"
                  onClick={() => {
                    this.handleOpen('newOpen');
                  }}
                >
                  New Income Source
                </Button>
              </Col>
            </Row>
          </CardHeader>
          <CardBody className="card-body">
            <div className="table-full-width table-responsive">
              <Table>
                <thead className="text-primary">
                  <tr>
                    <th>name</th>
                    <th>description</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.sources.map((source, i) => {
                    return (
                      <tr key={`source-${i}`}>
                        <td>{source.name}</td>
                        <td className="td-actions text-right">
                          <Button
                            color="link"
                            id={`source-table-tooltip-${i}`}
                            title=""
                            type="button"
                            onClick={() => this.handleClick(source)}
                          >
                            <i className="tim-icons icon-pencil" />
                          </Button>
                          <UncontrolledTooltip
                            delay={0}
                            target={`source-table-tooltip-${i}`}
                            placement="right"
                          >
                            Edit Group
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
          getData={this.getSources}
        />
        <EditModal
          user={user}
          open={this.state.dialogs.editOpen}
          handleClose={() => {
            this.handleClose('editOpen');
          }}
          getData={this.getSources}
          value={this.state.value}
        />
      </>
    );
  }
}

export default IncomeSourcesTable;
