import React, { Component } from "react";
import { Col, Container, Row } from "reactstrap";

import ExpenseGroupsTable from "../components/ExpenseGroups/ExpenseGroupsTable";
import IncomeSourcesTable from "../components/IncomeSources/IncomeSourcesTable";
import LiabilityGroupsTable from "../components/LiabilityGroups/LiabilityGroupsTable";
import AssetSourcesTable from "../components/AssetSources/AssetSourcesTable";

class Settings extends Component {
  render() {
    const { user } = this.props;
    return (
      <>
        <div className="content">
          <Container>
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
          </Container>
        </div>
      </>
    );
  }
}

export default Settings;
