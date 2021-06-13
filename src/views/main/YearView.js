import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import Loader from 'react-loader-spinner';
import { DatePicker } from '@material-ui/pickers';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Container,
  Grid,
  makeStyles,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@material-ui/core';

import Page from '../../components/Page';
import YearService from '../../service/YearService';
import { numberToCurrency, numberToCurrency_ } from '../../helpers/currency';
import { monthToString } from '../../helpers/date-helper';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    backgroundColor: theme.palette.colors[0],
    height: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3),
  },
  loader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  card: {
    backgroundColor: `${theme.palette.colors[1]}`,
    color: `${theme.palette.white}`,
  },
  datePicker: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    borderBottom: `1px solid ${theme.palette.gray}`,
    color: `${theme.palette.gray}`,
  },
  cell: {
    borderBottom: `1px solid ${theme.palette.gray}`,
  },
}));

const YearView = ({ user }) => {
  const classes = useStyles();
  const [isLoaded, setIsLoaded] = useState(false);
  const [stats, setStats] = useState();
  const [expenseTotal, setExpenseTotal] = useState();
  const [incomeTotal, setIncomeTotal] = useState();
  const [workHourTotal, setWorkHourTotal] = useState();
  const [netIncome, setNetIncome] = useState();
  const [selectedDate, handleDateChange] = useState(new Date());

  useEffect(() => {
    function getYearData() {
      YearService.getData(user.auth_token, selectedDate.getFullYear()).then(
        (result) => {
          if (result) {
            setStats(JSON.parse(result.yearStats));
            setExpenseTotal(result.expenseTotal);
            setIncomeTotal(result.incomeTotal);
            setWorkHourTotal(result.workHourTotal);
            setNetIncome(result.netIncome);
            setIsLoaded(true);
          }
        }
      );
    }
    getYearData();
  }, [user.auth_token, selectedDate]);

  if (!isLoaded)
    return (
      <Page className={classes.root} title='Year'>
        <div className={classes.loader}>
          <Loader type='Oval' color='#00BFFF' height={100} width={100} />
        </div>
      </Page>
    );

  return (
    <Page className={classes.root} title='Year'>
      <Container maxWidth={false}>
        <Grid container spacing={3}>
          <Grid item xl={2} lg={4} sm={6} xs={12}>
            <Card className={classes.card}>
              <CardContent>
                <DatePicker
                  variant='dialog'
                  inputVariant='outlined'
                  openTo='year'
                  views={['year']}
                  autoOk={true}
                  disableFuture={true}
                  value={selectedDate}
                  onChange={handleDateChange}
                  className={classes.datePicker}
                />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xl={2} lg={4} sm={6} xs={12}>
            <Card className={classes.card}>
              <CardContent>
                <Grid container justify='space-between' spacing={3}>
                  <Grid item>
                    <Typography color='textSecondary' gutterBottom variant='h4'>
                      Net Income
                    </Typography>
                    <Typography color='textPrimary' variant='h2'>
                      {numberToCurrency.format(netIncome)}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xl={2} lg={4} sm={6} xs={12}>
            <Card className={classes.card}>
              <CardContent>
                <Grid container justify='space-between' spacing={3}>
                  <Grid item>
                    <Typography color='textSecondary' gutterBottom variant='h4'>
                      Expense Total
                    </Typography>
                    <Typography color='textPrimary' variant='h2'>
                      {numberToCurrency.format(expenseTotal)}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xl={2} lg={4} sm={6} xs={12}>
            <Card className={classes.card}>
              <CardContent>
                <Grid container justify='space-between' spacing={3}>
                  <Grid item>
                    <Typography color='textSecondary' gutterBottom variant='h4'>
                      Income Total
                    </Typography>
                    <Typography color='textPrimary' variant='h2'>
                      {numberToCurrency.format(incomeTotal)}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xl={2} lg={4} sm={6} xs={12}>
            <Card className={classes.card}>
              <CardContent>
                <Grid container justify='space-between' spacing={3}>
                  <Grid item>
                    <Typography color='textSecondary' gutterBottom variant='h4'>
                      Total Work Hours
                    </Typography>
                    <Typography color='textPrimary' variant='h2'>
                      {numberToCurrency_.format(workHourTotal)}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xl={2} lg={4} sm={6} xs={12}>
            <Card className={classes.card}>
              <CardContent>
                <Grid container justify='space-between' spacing={3}>
                  <Grid item>
                    <Typography color='textSecondary' gutterBottom variant='h4'>
                      Income per Work Hour
                    </Typography>
                    <Typography color='textPrimary' variant='h2'>
                      {numberToCurrency.format(
                        workHourTotal === 0 || incomeTotal === 0
                          ? 0
                          : incomeTotal / workHourTotal
                      )}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xl={2} lg={2} sm={1} xs={1} />
          <Grid item xl={8} lg={8} sm={10} xs={12}>
            <Card className={classes.card}>
              <CardHeader title='Stats by Month' />
              <Box minWidth={800}>
                <Table size='small'>
                  <TableHead>
                    <TableRow>
                      <TableCell className={classes.header}>month</TableCell>
                      <TableCell className={classes.header}>
                        net income
                      </TableCell>
                      <TableCell className={classes.header}>expenses</TableCell>
                      <TableCell className={classes.header}>incomes</TableCell>
                      <TableCell className={classes.header}>
                        work hours
                      </TableCell>
                      <TableCell className={classes.header}>wage</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {stats.map((month, idx) =>
                      month.net === 0 ? null : (
                        <TableRow hover key={idx}>
                          <TableCell className={classes.cell}>
                            {monthToString(idx + 1)}
                          </TableCell>
                          <TableCell className={classes.cell}>
                            {numberToCurrency.format(month.net)}
                          </TableCell>
                          <TableCell className={classes.cell}>
                            {numberToCurrency.format(month.expense)}
                          </TableCell>
                          <TableCell className={classes.cell}>
                            {numberToCurrency.format(month.income)}
                          </TableCell>
                          <TableCell className={classes.cell}>
                            {numberToCurrency_.format(month.work_hours)}
                          </TableCell>
                          <TableCell className={classes.cell}>
                            {numberToCurrency.format(month.wage)}
                          </TableCell>
                        </TableRow>
                      )
                    )}
                  </TableBody>
                </Table>
              </Box>
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
