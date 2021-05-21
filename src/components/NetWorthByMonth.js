import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  Box,
  Typography,
  Card,
  CardContent,
  makeStyles,
} from '@material-ui/core';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

import NetWorthService from '../service/NetWorthService';
import { updateNetWorthData } from '../store';
import { monthToString } from '../helpers/date-helper';
import { numberToCurrency } from '../helpers/currency';

const prepareChartData = (data) => {
  let ret = [];
  data.forEach((record) => {
    if (record[2] !== 0) {
      ret.push({
        name: `${monthToString(record[0])} ${record[1].toString()}`,
        netWorth: record[2],
      });
    }
  });
  return ret.reverse();
};

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    backgroundColor: theme.palette.colors[0],
    height: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3),
  },
  card: {
    backgroundColor: `${theme.palette.colors[1]}`,
    color: `${theme.palette.white}`,
  },
}));

const NetWorthByMonth = ({ updateNetWorthData, user, date, data }) => {
  const classes = useStyles();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    function getChartData() {
      NetWorthService.getData(
        user.auth_token,
        date.getMonth() + 1,
        date.getFullYear()
      ).then((result) => {
        if (result) {
          updateNetWorthData({
            chartData: result.netWorthData,
          });
          setIsLoaded(true);
        }
      });
    }
    if (user.auth_token) getChartData();
  }, [user.auth_token, updateNetWorthData, date]);

  if (!isLoaded)
    return (
      <Card className={classes.card}>
        <CardContent>
          <Box height={300} position="relative"></Box>
        </CardContent>
      </Card>
    );

  return (
    <Card className={classes.card}>
      <CardContent>
        <Typography className={classes.title} gutterBottom>
          Net Worth over time
        </Typography>
        <Box height={300} position="relative">
          <ResponsiveContainer minHeight="250" minWidth="250">
            <LineChart
              width={500}
              height={300}
              data={prepareChartData(data.chartData)}
            >
              <XAxis dataKey="name" padding={{ left: 30, right: 30 }} />
              <YAxis
                tickFormatter={(value) => {
                  return `$ ${value}`;
                }}
              />
              <Tooltip
                formatter={(value, name) => {
                  return [numberToCurrency.format(value), 'net worth'];
                }}
              />
              <Line type="monotone" dataKey="netWorth" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
};

const mapStateToProps = (state) => {
  return {
    user: state.user,
    data: state.netWorthData,
  };
};

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      updateNetWorthData,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(NetWorthByMonth);
