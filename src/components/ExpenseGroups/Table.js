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

import EditModal from './EditModal';
import NewModal from './NewModal';
import Loader from '../../components/Loader';
import ExpenseGroup from '../../service/ExpenseGroupService';

const defaultState = {
  isLoaded: false,
  groups: [],
  dialogs: {
    newOpen: false,
    editOpen: false,
  },
  value: {
    id: '',
    amount: 0,
    group: '',
    description: '',
    date: new Date(),
  },
};

class ExpenseGroupsTable extends Component {
  state = { ...defaultState };

  componentDidMount() {
    this.getGroups();
  }

  getGroups = () => {
    ExpenseGroup.getGroups(this.props.user.auth_token).then((result) => {
      this.setState({
        groups: result.expense_groups,
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

  handleClick = (group) => {
    this.setState({
      dialogs: {
        editOpen: true,
      },
      value: {
        id: group.id,
        name: group.name,
        description: group.description,
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
                  Expense Groups
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
                  New Expense Group
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
                  {this.state.groups.map((group, i) => {
                    return (
                      <tr key={`group-${i}`}>
                        <td>{group.name}</td>
                        <td className="td-actions text-right">
                          <Button
                            color="link"
                            id={`group-table-tooltip-${i}`}
                            title=""
                            type="button"
                            onClick={() => this.handleClick(group)}
                          >
                            <i className="tim-icons icon-pencil" />
                          </Button>
                          <UncontrolledTooltip
                            delay={0}
                            target={`group-table-tooltip-${i}`}
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
          getData={this.getGroups}
        />
        <EditModal
          user={user}
          open={this.state.dialogs.editOpen}
          handleClose={() => {
            this.handleClose('editOpen');
          }}
          getData={this.getGroups}
          value={this.state.value}
        />
      </>
    );
  }
}

export default ExpenseGroupsTable;
