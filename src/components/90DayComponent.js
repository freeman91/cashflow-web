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
  colors,
} from '@material-ui/core';
import { useTheme } from '@material-ui/core/styles';
import { PieChart, Pie, Sector } from 'recharts';

import DashboardService from '../service/DashboardService';
import { numberToCurrency, numberToCurrency_ } from '../helpers/currency';
import { updateDashboardData } from '../store';

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
      <text x={cx} y={cy} dy={8} textAnchor='middle' fill={colors.grey[300]}>
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
        fill='#FFF'>{`${numberToCurrency.format(value)}`}</text>
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

const Dashboard90Day = ({ updateDashboardData, user, data }) => {
  const theme = useTheme();
  const classes = useStyles();
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeIndex, setActiveIndex] = useState(1);

  useEffect(() => {
    function getChartData() {
      DashboardService.getData(user.auth_token).then((result) => {
        if (result) {
          updateDashboardData({
            groupedExpenses: result.data,
            expenseSum: result.expense_sum,
            incomeSum: result.income_sum,
            workHourSum: result.work_hour_sum,
          });
          setIsLoaded(true);
        }
      });
    }
    if (user.auth_token) getChartData();
  }, [user.auth_token, updateDashboardData]);

  const onPieEnter = (data, index) => {
    setActiveIndex(index);
  };

  if (!isLoaded) return null;

  const chartData = Object.keys(data.groupedExpenses).map((group) => {
    return { name: group, value: data.groupedExpenses[group] };
  });

  return (
    <Card className={classes.card}>
      <CardContent>
        <Typography className={classes.title} gutterBottom>
          Expenses by Group (90 days)
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
                  fill={colors.blue[500]}
                  onMouseEnter={onPieEnter}
                  dataKey='value'
                  stroke={theme.palette.colors[1]}
                  textFill={theme.palette.white}
                />
              </PieChart>
            </Box>
          </Grid>
          <Grid item xl={6} lg={6} sm={6} xs={12}>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell className={classes.cell}>Net Income</TableCell>
                  <TableCell className={classes.cell}>
                    {numberToCurrency.format(data.incomeSum - data.expenseSum)}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className={classes.cell}>Expenses</TableCell>
                  <TableCell className={classes.cell}>
                    {numberToCurrency.format(data.expenseSum)}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className={classes.cell}>Incomes</TableCell>
                  <TableCell className={classes.cell}>
                    {numberToCurrency.format(data.incomeSum)}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className={classes.cell}>Work Hours</TableCell>
                  <TableCell className={classes.cell}>
                    {numberToCurrency_.format(data.workHourSum)}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className={classes.cell}>Pay Rate</TableCell>
                  <TableCell className={classes.cell}>
                    {numberToCurrency.format(data.incomeSum / data.workHourSum)}
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

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      updateDashboardData,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard90Day);
