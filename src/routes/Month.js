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

class Month extends Component {
  state = {
    isLoaded: false,
  };

  async get_month_data() {
    axios
      .get(API_HOST + "/month/data", {
        headers: { Authorization: this.props.user.auth_token },
      })
      .then((response) => {
        this.setState({
          cwdate: response.data.cwdate,
          monthStats: response.data.monthStats,
          netincome: response.data.netincome,
          expTotal: response.data.expTotal,
          incTotal: response.data.incTotal,
          wkhrTotal: response.data.wkhrTotal,
          bills: response.data.bills,
          isLoaded: true,
        });
      })
      .catch((error) => console.log(error));
  }

  componentDidMount() {
    if (isEqual(this.props.user, {})) {
      this.props.history.push("/");
    } else {
      this.get_month_data();
    }
  }

  render() {
    const {
      isLoaded,
      cwdate,
      netincome,
      expTotal,
      incTotal,
      wkhrTotal,
      bills,
    } = this.state;
    if (!isLoaded) return <Loader />;

    const monthStats = JSON.parse(this.state.monthStats);
    const monthStatsArr = [];
    Object.keys(monthStats)
      .sort()
      .forEach(function (week) {
        monthStatsArr.push([
          week,
          formatter.format(monthStats[week].net),
          formatter.format(monthStats[week].expense),
          formatter.format(monthStats[week].income),
          monthStats[week].work_hours,
          formatter.format(monthStats[week].wage),
        ]);
      });

    monthStatsArr.push([
      null,
      formatter.format(netincome),
      formatter.format(expTotal),
      formatter.format(incTotal),
      wkhrTotal,
      formatter.format(incTotal / wkhrTotal),
    ]);

    var billsData = [];
    bills.map((bill) => {
      var date = new Date(bill.date + " 12:00");
      billsData.push([
        date.getMonth() + 1 + "/" + (date.getDay() + 1),
        formatter.format(bill.amount),
        bill.group,
        bill.vendor,
      ]);
      return null;
    });

    const { user, history, classes } = this.props;
    return (
      <>
        <NavBar
          title={month[cwdate.month] + " " + cwdate.year}
          user={user.email}
          history={history}
        />
        <div className={classes.root}>
          <Grid
            container
            spacing={2}
            direction="row"
            justify="center"
            alignItems="flex-start"
          >
            {/* MONTH STATS */}
            <Grid item xs={8} key="month-stats">
              <CashFlowTable
                dataTextSize="subtitle1"
                headers={[
                  "week",
                  "net income",
                  "expense total",
                  "income total",
                  "work hours",
                  "hourly wage",
                ]}
                rows={monthStatsArr}
              />
            </Grid>

            {/* BILLS */}
            <Grid item xs={6} key="bills">
              <CashFlowTable
                title="Bills"
                dataTextSize="subtitle2"
                headers={["date", "amount", "group", "vendor"]}
                rows={billsData}
              />
            </Grid>
          </Grid>
        </div>
      </>
    );
  }
}

export default withStyles(styles)(Month);
