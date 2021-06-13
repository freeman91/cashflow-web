import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  Table,
  TableCell,
  TableBody,
  TableRow,
  makeStyles,
} from '@material-ui/core';
import { PieChart, Pie, Sector } from 'recharts';

import DashboardService from '../service/DashboardService';
import { numberToCurrency } from '../helpers/currency';
import { get, find, reduce } from 'lodash';

const renderActiveShape = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  startAngle,
  endAngle,
  fill,
  payload,
  value,
}) => {
  const RADIAN = Math.PI / 180;

  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? 'start' : 'end';

  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor='middle' fill={fill}>
        {payload.name}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <path
        d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
        stroke={fill}
        fill='none'
      />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke='none' />
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        textAnchor={textAnchor}
        fill='#FFF'>{`${Math.round(value * 100) / 100} %`}</text>
    </g>
  );
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
  loader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  avatar: {
    backgroundColor: theme.palette.colors[3],
    height: 56,
    width: 56,
  },
  differenceValue: {
    marginRight: theme.spacing(1),
  },
  cell: {
    borderBottom: `1px solid ${theme.palette.gray}`,
  },
}));

const PercentIncome = ({ updateDashboardData, user, data }) => {
  const classes = useStyles();
  const [incomeSum, setIncomeSum] = useState(0);
  const [expenseSum, setExpenseSum] = useState(0);
  const [isLoaded, setIsLoaded] = useState(true);
  const [chartData, setChartData] = useState({});

  const [activeIndex, setActiveIndex] = useState(1);

  useEffect(() => {
    function getPercentIncome() {
      const endDate = new Date();
      const startDate = new Date(new Date().setDate(endDate.getDate() - 182));

      const startStr = `${startDate.getFullYear()}-${(
        '0' +
        (startDate.getMonth() + 1)
      ).slice(-2)}-${startDate.getDate()}`;
      const endStr = `${endDate.getFullYear()}-${(
        '0' +
        (endDate.getMonth() + 1)
      ).slice(-2)}-${endDate.getDate()}`;

      DashboardService.getPercentIncome(user.auth_token, endStr, startStr).then(
        (result) => {
          if (result) {
            const incomeSum_ = result.income_sum;
            const sums = result.expense_sums;
            const sumsTotal = reduce(
              sums,
              (sum, value) => {
                return sum + value;
              },
              0
            );
            setIncomeSum(result.income_sum);
            setExpenseSum(sumsTotal);
            let shelter = sums.Rent + sums.Utilities;
            let food = sums.Food + sums.Grocery;
            let essential =
              sums.Insurance + sums.Health + sums.Car + sums.Tuition;
            let ee = sumsTotal - shelter - food - essential;
            let surplus = incomeSum_ - shelter - food - essential - ee;
            setChartData([
              {
                name: 'Shelter',
                value: (shelter / incomeSum_) * 100,
                sum: shelter,
              },
              {
                name: 'Food',
                value: (food / incomeSum_) * 100,
                sum: food,
              },
              {
                name: 'Essential',
                value: (essential / incomeSum_) * 100,
                sum: essential,
              },
              {
                name: 'Else',
                value: (ee / incomeSum_) * 100,
                sum: ee,
              },
              {
                name: 'Surplus',
                value: (surplus / incomeSum_) * 100,
                sum: surplus,
              },
            ]);
            setIsLoaded(true);
          }
        }
      );
    }
    if (user.auth_token) getPercentIncome();
  }, [user.auth_token, updateDashboardData]);

  if (!isLoaded) return null;

  const shelter = get(
    find(chartData, (elem) => {
      return elem.name === 'Shelter';
    }),
    'sum',
    0
  );
  const food = get(
    find(chartData, (elem) => {
      return elem.name === 'Food';
    }),
    'sum',
    0
  );
  const essential = get(
    find(chartData, (elem) => {
      return elem.name === 'Essential';
    }),
    'sum',
    0
  );
  const ee = get(
    find(chartData, (elem) => {
      return elem.name === 'Else';
    }),
    'sum',
    0
  );

  return (
    <Card className={classes.card}>
      <CardContent>
        <Typography className={classes.title} gutterBottom>
          Percent Income (6 months)
        </Typography>
        <Grid container spacing={3}>
          <Grid item xl={6} lg={6} sm={6} xs={12}>
            <Box height={250} position='relative'>
              <PieChart width={500} height={250}>
                <Pie
                  activeIndex={activeIndex}
                  activeShape={renderActiveShape}
                  data={chartData}
                  cx={200}
                  cy={125}
                  innerRadius={50}
                  outerRadius={80}
                  fill='#2dc653'
                  onMouseEnter={(data, index) => {
                    setActiveIndex(index);
                  }}
                  dataKey='value'
                />
              </PieChart>
            </Box>
          </Grid>

          <Grid item xl={6} lg={6} sm={6} xs={12}>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell className={classes.cell}>Shelter</TableCell>
                  <TableCell className={classes.cell}>
                    {numberToCurrency.format(shelter)}
                  </TableCell>
                  <TableCell className={classes.cell}>
                    {Math.round((shelter / incomeSum) * 1000) / 10}%
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className={classes.cell}>Food</TableCell>
                  <TableCell className={classes.cell}>
                    {numberToCurrency.format(food)}
                  </TableCell>
                  <TableCell className={classes.cell}>
                    {Math.round((food / incomeSum) * 1000) / 10}%
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className={classes.cell}>Essential</TableCell>
                  <TableCell className={classes.cell}>
                    {numberToCurrency.format(essential)}
                  </TableCell>
                  <TableCell className={classes.cell}>
                    {Math.round((essential / incomeSum) * 1000) / 10}%
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className={classes.cell}>
                    Everything Else
                  </TableCell>
                  <TableCell className={classes.cell}>
                    {numberToCurrency.format(ee)}
                  </TableCell>
                  <TableCell className={classes.cell}>
                    {Math.round((ee / incomeSum) * 1000) / 10}%
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className={classes.cell}>Surplus</TableCell>
                  <TableCell className={classes.cell}>
                    {numberToCurrency.format(incomeSum - expenseSum)}
                  </TableCell>
                  <TableCell className={classes.cell}>
                    {Math.round(((incomeSum - expenseSum) / incomeSum) * 1000) /
                      10}
                    %
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

const mapStateToProps = (state) => {
  return {
    user: state.user,
    data: state.dashboardData,
  };
};

const mapDispatchToProps = (dispatch) => bindActionCreators({}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(PercentIncome);
