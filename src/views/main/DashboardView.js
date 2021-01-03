import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import MoneyIcon from "@material-ui/icons/Money";
// import { Bar } from "react-chartjs-2";
import {
  Box,
  Container,
  Grid,
  makeStyles,
  Typography,
  Card,
  CardContent,
  Avatar,
} from "@material-ui/core";

import Page from "../../components/Page";
import RecentExpenses from "../../components/Expense/Recent";
import RecentIncomes from "../../components/Income/Recent";
import RecentWorkHours from "../../components/WorkHour/Recent";
import Loader from "react-loader-spinner";
import DashboardService from "../../service/DashboardService";
import { numberToCurrency } from "../../helpers/currency";

// const options = {
//   animation: false,
//   cornerRadius: 20,
//   layout: { padding: 0 },
//   legend: { display: false },
//   maintainAspectRatio: false,
//   responsive: true,
//   scales: {
//     xAxes: [
//       {
//         barThickness: 12,
//         maxBarThickness: 10,
//         barPercentage: 0.5,
//         categoryPercentage: 0.5,
//         ticks: {
//           fontColor: "#FFFFFF",
//         },
//         gridLines: {
//           display: false,
//           drawBorder: false,
//         },
//       },
//     ],
//     yAxes: [
//       {
//         ticks: {
//           fontColor: "#FFFFFF",
//           beginAtZero: true,
//           min: 0,
//         },
//         gridLines: {
//           borderDash: [2],
//           borderDashOffset: [2],
//           color: "#e1e1e1",
//           drawBorder: false,
//           zeroLineBorderDash: [2],
//           zeroLineBorderDashOffset: [2],
//           zeroLineColor: "#e1e1e1",
//         },
//       },
//     ],
//   },
//   tooltips: {
//     backgroundColor: "#444444",
//     bodyFontColor: "#FFFFFF",
//     borderColor: "#e1e1e1",
//     borderWidth: 1,
//     enabled: true,
//     footerFontColor: "#FFFFFF",
//     intersect: false,
//     mode: "index",
//     titleFontColor: "#232323",
//   },
// };

// const prepareExpenseChartData = (expenseTotals, incomeTotals) => {
//   let datasets = [
//     { backgroundColor: "#343333", data: [], label: "Expense" },
//     { backgroundColor: "#e1e1e1", data: [], label: "Income" },
//   ];
//   let labels = [];

//   for (let idx = 0; idx < expenseTotals.length; idx++) {
//     datasets[0].data.push(Math.round(expenseTotals[idx] * 100) / 100);
//     datasets[1].data.push(Math.round(incomeTotals[idx] * 100) / 100);
//     labels.push(monthToString(idx + 1));
//   }
//   return { datasets, labels };
// };

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    backgroundColor: theme.palette.colors[0],
    height: "100%",
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3),
  },
  card: {
    backgroundColor: `${theme.palette.colors[1]}`,
    color: `${theme.palette.white}`,
  },
  loader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
  },
  avatar: {
    backgroundColor: theme.palette.colors[3],
    height: 56,
    width: 56,
  },
  differenceValue: {
    marginRight: theme.spacing(1),
  },
}));

const DashboardView = (props) => {
  const classes = useStyles();
  const [isLoaded, setIsLoaded] = useState(false);
  const [expenseSum, setExpenseSum] = useState(0);
  const [incomeSum, setIncomeSum] = useState(0);
  const [workHourSum, setWorkHourSum] = useState(0);
  // const [expenseTotals, setExpenseTotals] = useState([]);
  // const [incomeTotals, setIncomeTotals] = useState([]);

  const date = new Date();

  useEffect(() => {
    function getDashData() {
      DashboardService.getData(props.user.auth_token).then((result) => {
        if (result) {
          setExpenseSum(result.expense_sum);
          setIncomeSum(result.income_sum);
          setWorkHourSum(result.work_hour_sum);
          // setExpenseTotals(result.expenseTotals);
          // setIncomeTotals(result.incomeTotals);
          setIsLoaded(true);
        }
      });
    }
    getDashData();
  }, [props.user.auth_token]);

  if (!isLoaded)
    return (
      <Page className={classes.root} title="Dashboard">
        <div className={classes.loader}>
          <Loader type="Oval" color="#00BFFF" height={100} width={100} />
        </div>
      </Page>
    );

  // const chartData = prepareExpenseChartData(expenseTotals, incomeTotals);

  return (
    <Page className={classes.root} title="Dashboard">
      <Container maxWidth={false}>
        <Grid container spacing={3}>
          <Grid item lg={4} sm={6} xl={4} xs={12}>
            <Card className={classes.card}>
              <CardContent>
                <Grid container justify="space-between" spacing={3}>
                  <Grid item>
                    <Typography color="textSecondary" gutterBottom variant="h4">
                      Today is
                    </Typography>
                    <Typography color="textPrimary" variant="h2">
                      {`${date.toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}`}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          <Grid item lg={4} sm={6} xl={4} xs={12}>
            <Card className={classes.card}>
              <CardContent>
                <Grid container justify="space-between" spacing={3}>
                  <Grid item>
                    <Typography color="textSecondary" gutterBottom variant="h4">
                      Net Income YTD
                    </Typography>
                    <Typography color="textPrimary" variant="h2">
                      {numberToCurrency.format(incomeSum - expenseSum)}
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Avatar className={classes.avatar}>
                      <MoneyIcon />
                    </Avatar>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          <Grid item lg={4} sm={6} xl={4} xs={12}>
            <Card className={classes.card}>
              <CardContent>
                <Grid container justify="space-between" spacing={3}>
                  <Grid item>
                    <Typography color="textSecondary" gutterBottom variant="h4">
                      Pay Rate YTD
                    </Typography>
                    <Typography color="textPrimary" variant="h2">
                      {`${numberToCurrency.format(
                        workHourSum === 0 ? 0 : incomeSum / workHourSum
                      )} per hour`}
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Avatar className={classes.avatar}>
                      <MoneyIcon />
                    </Avatar>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          <Grid item lg={12} sm={12} xl={12} xs={12}>
            <Card className={classes.card}>
              <CardContent>
                <Box height={400} position="relative">
                  {/* <Bar data={chartData} options={options} /> */}
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item lg={4} md={6} xl={4} xs={12}>
            <RecentExpenses />
          </Grid>
          <Grid item lg={4} md={6} xl={4} xs={12}>
            <Card className={classes.card}>
              <RecentIncomes />
            </Card>
          </Grid>
          <Grid item lg={4} md={6} xl={4} xs={12}>
            <Card className={classes.card}>
              <RecentWorkHours />
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

export default connect(mapStateToProps, null)(DashboardView);