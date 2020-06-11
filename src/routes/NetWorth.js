import React, { Component } from "react";
import axios from "axios";
import { isEqual } from "lodash";
import { Grid, withStyles } from "@material-ui/core";
import formatter from "../helpers/currency_formatter";
import NavBar from "../components/NavBar";
import Loader from "../components/Loader";
import CashFlowTable from "../components/CashFlowTable";
import month from "../helpers/month_name";

const API_HOST = "http://localhost:3001";

const styles = (theme) => ({
  root: {
    flexGrow: 1,
    margin: "10px",
  },
});

class NetWorth extends Component {
  state = {
    isLoaded: false,
  };

  async get_networth_data() {
    axios
      .get(API_HOST + "/networth/data", {
        headers: { Authorization: this.props.user.auth_token },
      })
      .then((response) => {
        this.setState({
          cwdate: response.data.cwdate,
          assets: response.data.properties,
          liabilities: response.data.debts,
          netWorthLast12: response.data.netWorthLast12,
          isLoaded: true,
        });
      })
      .catch((error) => console.log(error));
  }

  componentDidMount() {
    if (isEqual(this.props.user, {})) {
      this.props.history.push("/");
    } else {
      this.get_networth_data();
    }
  }

  render() {
    const { assets, liabilities, netWorthLast12, isLoaded } = this.state;
    if (!isLoaded) return <Loader />;

    var months = [];
    var netWorthData = [];
    netWorthLast12.map((record) => {
      months.push(`${month[record[0] - 1]} ${record[1].toString().slice(-2)}`);
      netWorthData.push(formatter.format(record[2]));
      return null;
    });
    netWorthLast12.push("net-worth-last-12-key");
    netWorthData = [netWorthData];

    const assetsData = [];
    assets.map((asset) => {
      var date = new Date(asset.date + " 12:00");
      assetsData.push([
        date.getMonth() + 1 + "/" + date.getDate(),
        formatter.format(asset.amount),
        asset.source,
        asset.id,
      ]);
      return null;
    });

    const liabilitiesData = [];
    liabilities.map((liability) => {
      var date = new Date(liability.date + " 12:00");
      liabilitiesData.push([
        date.getMonth() + 1 + "/" + date.getDate(),
        formatter.format(liability.amount),
        liability.group,
        liability.id,
      ]);
      return null;
    });

    const { user, history, classes } = this.props;
    return (
      <>
        <NavBar title={"Net Worth"} user={user.email} history={history} />
        <div className={classes.root}>
          <Grid
            container
            spacing={2}
            direction="row"
            justify="center"
            alignItems="flex-start"
          >
            {/* NET WORTH LAST 12 MONTHS */}
            <Grid item xs={11} key="Net-Worth-grid">
              <CashFlowTable
                title="Net Worth Last 12 Months"
                dataTextSize="subtitle1"
                headers={months}
                rows={netWorthData}
              />
            </Grid>

            {/* ASSETS */}
            <Grid item xs={4} key="assets">
              <CashFlowTable
                title="Assets"
                dataTextSize="subtitle1"
                headers={["date", "amount", "source"]}
                rows={assetsData}
              />
            </Grid>

            {/* LIABILITIES */}
            <Grid item xs={4} key="liabilities">
              <CashFlowTable
                title="Liabilities"
                dataTextSize="subtitle1"
                headers={["date", "amount", "group"]}
                rows={liabilitiesData}
              />
            </Grid>
          </Grid>
        </div>
      </>
    );
  }
}

export default withStyles(styles)(NetWorth);
