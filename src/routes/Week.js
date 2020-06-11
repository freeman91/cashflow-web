import React, { Component } from "react";
import axios from "axios";
import { isEqual } from "lodash";
import { Grid, withStyles } from "@material-ui/core";
import formatter from "../helpers/currency_formatter";
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

class Week extends Component {
  state = {
    isLoaded: false,
  };

  async get_week_data() {
    axios({
      method: "get",
      url: API_HOST + "/week/data",
      headers: { Authorization: this.props.user.auth_token },
      timeout: 10000,
    })
      .then((response) => {
        this.setState({
          cwdate: response.data.cwdate,
          netincome: response.data.netincome,
          expTotal: response.data.expTotal,
          incTotal: response.data.incTotal,
          wkhrTotal: response.data.wkhrTotal,
          expenses: response.data.expenses,
          incomes: response.data.incomes,
          work_hours: response.data.work_hours,
          isLoaded: true,
        });
      })
      .catch((error) => console.log(error));
  }

  componentDidMount() {
    if (isEqual(this.props.user, {})) {
      this.props.history.push("/");
    } else {
      this.get_week_data();
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
      expenses,
      incomes,
      work_hours,
    } = this.state;
    if (!isLoaded) return <Loader />;

    var expensesData = [];
    expenses.map((exp) => {
      var date = new Date(exp.date + " 12:00");
      expensesData.push([
        date.getMonth() + 1 + "/" + date.getDate(),
        formatter.format(exp.amount),
        exp.group,
        exp.vendor,
        exp.id,
      ]);
      return null;
    });

    var incomesData = [];
    incomes.map((inc) => {
      var date = new Date(inc.date + " 12:00");
      incomesData.push([
        date.getMonth() + 1 + "/" + date.getDate(),
        formatter.format(inc.amount),
        inc.source,
        inc.id,
      ]);
      return null;
    });

    var workHoursData = [];
    work_hours.map((wkhr) => {
      var date = new Date(wkhr.date + " 12:00");
      workHoursData.push([
        date.getMonth() + 1 + "/" + date.getDate(),
        formatter.format(wkhr.amount),
        wkhr.source,
        wkhr.id,
      ]);
      return null;
    });

    const { user, history, classes } = this.props;
    return (
      <>
        <NavBar
          title={"Week " + cwdate.week + " of " + cwdate.year}
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
            {/* WEEK STATS */}
            <Grid item xs={8} key="week-stats">
              <CashFlowTable
                dataTextSize="h5"
                headers={[
                  "net income",
                  "expense total",
                  "income total",
                  "work hours",
                  "hourly wage",
                ]}
                rows={[
                  [
                    formatter.format(netincome),
                    formatter.format(expTotal),
                    formatter.format(incTotal),
                    wkhrTotal,
                    formatter.format(wkhrTotal ? incTotal / wkhrTotal : 0),
                    "week-stats-key",
                  ],
                ]}
              />
            </Grid>

            {/* EXPENSES */}
            <Grid item xs={6} key="expenses">
              <CashFlowTable
                title="Expenses"
                dataTextSize="subtitle1"
                headers={["date", "amount", "group", "vendor"]}
                rows={expensesData}
              />
            </Grid>

            {/* Incomes */}
            <Grid item xs={3} key="incomes">
              <CashFlowTable
                title="Incomes"
                dataTextSize="subtitle1"
                headers={["date", "amount", "source"]}
                rows={incomesData}
              />
            </Grid>

            {/* WorkHours */}
            <Grid item xs={3} key="work-hours">
              <CashFlowTable
                title="Recent Work Hours"
                dataTextSize="subtitle1"
                headers={["date", "hours", "source"]}
                rows={workHoursData}
              />
            </Grid>
          </Grid>
        </div>
      </>
    );
  }
}

export default withStyles(styles)(Week);
