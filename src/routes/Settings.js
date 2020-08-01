import React, { Component } from 'react';
import { isEqual } from 'lodash';
import { Col, Row } from 'reactstrap';

import ExpenseGroupsTable from '../components/ExpenseGroups/ExpenseGroupsTable';
import IncomeSourcesTable from '../components/IncomeSources/IncomeSourcesTable';
import LiabilityGroupsTable from '../components/LiabilityGroups/LiabilityGroupsTable';
import AssetSourcesTable from '../components/AssetSources/AssetSourcesTable';

class Settings extends Component {
  componentDidMount() {
    if (isEqual(this.props.user, {})) {
      this.props.history.push('/');
    }
  }

  render() {
    const { user } = this.props;
    return (
      <>
        <div className="content">
          <Row>
            <Col xs="3">
              <ExpenseGroupsTable user={user} />
            </Col>
            <Col xs="3">
              <IncomeSourcesTable user={user} />
            </Col>
            <Col xs="3">
              <LiabilityGroupsTable user={user} />
            </Col>
            <Col xs="3">
              <AssetSourcesTable user={user} />
            </Col>
          </Row>
        </div>
      </>
    );
  }
}

export default Settings;
