import React, { Component } from "react";
import axios from "axios";
import { isEqual } from "lodash";
import { Grid, withStyles } from "@material-ui/core";
import NavBar from "../components/NavBar";
import Loader from "../components/Loader";
import CashFlowTable from "../components/CashFlowTable";

const API_HOST = "http://localhost:3001";

const styles = (theme) => ({
  root: {
    flexGrow: 1,
    margin: "10px",
  },
});

class Settings extends Component {
  state = {
    isLoaded: false,
  };

  async get_settings_data() {
    axios
      .get(API_HOST + "/settings/data", {
        headers: { Authorization: this.props.user.auth_token },
      })
      .then((response) => {
        this.setState({
          expense_groups: response.data.expense_groups,
          income_sources: response.data.income_sources,
          asset_sources: response.data.property_sources,
          liability_groups: response.data.debt_groups,
          isLoaded: true,
        });
      })
      .catch((error) => console.log(error));
  }

  componentDidMount() {
    if (isEqual(this.props.user, {})) {
      this.props.history.push("/");
    } else {
      this.get_settings_data();
    }
  }

  render() {
    const {
      isLoaded,
      expense_groups,
      income_sources,
      liability_groups,
      asset_sources,
    } = this.state;
    if (!isLoaded) return <Loader />;

    const expGroupData = [];
    expense_groups.map((group) => {
      expGroupData.push([group.name, group.id]);
      return null;
    });

    const incSourceData = [];
    income_sources.map((source) => {
      incSourceData.push([source.name, source.id]);
      return null;
    });

    const liabGroupData = [];
    liability_groups.map((group) => {
      liabGroupData.push([group.name, group.id]);
      return null;
    });

    const propSourceData = [];
    asset_sources.map((source) => {
      propSourceData.push([source.name, source.id]);
      return null;
    });

    const { user, history, classes } = this.props;
    return (
      <>
        <NavBar title={"Settings"} user={user.email} history={history} />
        <div className={classes.root}>
          <Grid
            container
            spacing={2}
            direction="row"
            justify="center"
            alignItems="flex-start"
          >
            <Grid item xs={3} key="expense-groups">
              <CashFlowTable
                title="Expense Groups"
                dataTextSize="subtitle2"
                rows={expGroupData}
              />
            </Grid>
            <Grid item xs={3} key="income-sources">
              <CashFlowTable
                title="Income Sources"
                dataTextSize="subtitle2"
                rows={incSourceData}
              />
            </Grid>
            <Grid item xs={3} key="liability-groups">
              <CashFlowTable
                title="Liability Groups"
                dataTextSize="subtitle2"
                rows={liabGroupData}
              />
            </Grid>
            <Grid item xs={3} key="property-sources">
              <CashFlowTable
                title="Property Groups"
                dataTextSize="subtitle2"
                rows={propSourceData}
              />
            </Grid>
          </Grid>
        </div>
      </>
    );
  }
}

export default withStyles(styles)(Settings);
