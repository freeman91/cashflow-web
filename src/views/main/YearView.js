import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import Loader from "react-loader-spinner";
import { DatePicker } from "@material-ui/pickers";
import {
  //   Box,
  Container,
  Grid,
  makeStyles,
  //   Typography,
  Card,
  CardContent,
  //   Avatar,
} from "@material-ui/core";

import Page from "../../components/Page";
import YearService from "../../service/YearService";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    backgroundColor: theme.palette.colors[0],
    height: "100%",
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3),
  },
  loader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
  },
  card: {
    backgroundColor: `${theme.palette.colors[1]}`,
    color: `${theme.palette.white}`,
  },
  datePicker: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
}));

const YearView = (props) => {
  const classes = useStyles();
  const [isLoaded, setIsLoaded] = useState(false);
  const [stats, setStats] = useState();
  const [expenseTotal, setExpenseTotal] = useState();
  const [incomeTotal, setIncomeTotal] = useState();
  const [netIncome, setNetIncome] = useState();
  const [selectedDate, handleDateChange] = useState(new Date());

  useEffect(() => {
    function getYearData() {
      YearService.getData(
        props.user.auth_token,
        selectedDate.getFullYear()
      ).then((result) => {
        if (result) {
          setStats(JSON.parse(result.yearStats));
          setExpenseTotal(result.expenseTotal);
          setIncomeTotal(result.incomeTotal);
          setNetIncome(result.netIncome);
          setIsLoaded(true);
        }
      });
    }
    getYearData();
  }, [props.user.auth_token, selectedDate]);

  if (!isLoaded)
    return (
      <Page className={classes.root} title="Year">
        <div className={classes.loader}>
          <Loader type="Oval" color="#00BFFF" height={100} width={100} />
        </div>
      </Page>
    );

  console.log("stats: ", stats);
  console.log("expenseTotal: ", expenseTotal);
  console.log("incomeTotal: ", incomeTotal);
  console.log("netIncome: ", netIncome);

  return (
    <Page className={classes.root} title="Year">
      <Container maxWidth={false}>
        <Grid container spacing={3}>
          <Grid item lg={4} sm={6} xl={4} xs={12}>
            <Card className={classes.card}>
              <CardContent>
                <DatePicker
                  variant="dialog"
                  openTo="year"
                  views={["year"]}
                  autoOk={true}
                  disableFuture={true}
                  value={selectedDate}
                  onChange={handleDateChange}
                  className={classes.datePicker}
                />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
};

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

export default connect(mapStateToProps, null)(YearView);
