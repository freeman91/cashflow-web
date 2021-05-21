import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Loader from 'react-loader-spinner';
import { DatePicker } from '@material-ui/pickers';
import {
  Card,
  CardContent,
  Container,
  Grid,
  makeStyles,
  Typography,
} from '@material-ui/core';

import Page from '../../components/Page';
import AssetTable from '../../components/Asset/Table';
import LiabilityTable from '../../components/Liability/Table';
import NetWorthByMonth from '../../components/NetWorthByMonth';
import NetWorthService from '../../service/NetWorthService';
import { numberToCurrency } from '../../helpers/currency';
import {
  updateAssets,
  updateLiabilities,
  updateNetWorthData,
} from '../../store';

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
}));

const NetWorthView = ({
  user,
  assets,
  liabilities,
  updateAssets,
  updateLiabilities,
  updateNetWorthData,
}) => {
  const classes = useStyles();
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedDate, handleDateChange] = useState(new Date());

  useEffect(() => {
    function getNetWorthData() {
      Promise.all([
        NetWorthService.getAssets(
          user.auth_token,
          selectedDate.getMonth() + 1,
          selectedDate.getFullYear()
        ),
        NetWorthService.getLiabilities(
          user.auth_token,
          selectedDate.getMonth() + 1,
          selectedDate.getFullYear()
        ),
      ]).then((results) => {
        if (results[0]) {
          updateAssets({ list: results[0].properties });
          updateLiabilities({ list: results[1].debts });
          setIsLoaded(true);
        }
      });
    }
    getNetWorthData();
  }, [user.auth_token, selectedDate, updateAssets, updateLiabilities]);

  if (!isLoaded)
    return (
      <Page className={classes.root} title="NetWorth">
        <div className={classes.loader}>
          <Loader type="Oval" color="#00BFFF" height={100} width={100} />
        </div>
      </Page>
    );

  let assetTotal = 0;
  assets.map((asset) => {
    return (assetTotal += Number(asset.amount));
  });

  let liabilityTotal = 0;
  liabilities.map((liability) => {
    return (liabilityTotal += Number(liability.amount));
  });

  return (
    <Page className={classes.root} title="NetWorth">
      <Container maxWidth={false}>
        <Grid container spacing={3}>
          <Grid item xl={3} lg={3} sm={6} xs={12}>
            <Card className={classes.card}>
              <CardContent>
                <DatePicker
                  variant="dialog"
                  inputVariant="outlined"
                  openTo="month"
                  views={['year', 'month']}
                  autoOk={true}
                  disableFuture={true}
                  value={selectedDate}
                  onChange={handleDateChange}
                  className={classes.datePicker}
                />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xl={3} lg={3} sm={6} xs={12}>
            <Card className={classes.card}>
              <CardContent>
                <Grid container justify="space-between" spacing={3}>
                  <Grid item>
                    <Typography color="textSecondary" gutterBottom variant="h4">
                      Net Worth
                    </Typography>
                    <Typography color="textPrimary" variant="h2">
                      {numberToCurrency.format(assetTotal - liabilityTotal)}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xl={3} lg={3} sm={6} xs={12}>
            <Card className={classes.card}>
              <CardContent>
                <Grid container justify="space-between" spacing={3}>
                  <Grid item>
                    <Typography color="textSecondary" gutterBottom variant="h4">
                      Asset Total
                    </Typography>
                    <Typography color="textPrimary" variant="h2">
                      {numberToCurrency.format(assetTotal)}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xl={3} lg={3} sm={6} xs={12}>
            <Card className={classes.card}>
              <CardContent>
                <Grid container justify="space-between" spacing={3}>
                  <Grid item>
                    <Typography color="textSecondary" gutterBottom variant="h4">
                      Debt Total
                    </Typography>
                    <Typography color="textPrimary" variant="h2">
                      {numberToCurrency.format(liabilityTotal)}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xl={12} lg={12} sm={12} xs={12}>
            <NetWorthByMonth date={selectedDate} />
          </Grid>
          <Grid item xl={2} lg={1} sm={0} xs={0} />
          <Grid item xl={4} lg={5} sm={6} xs={12}>
            <AssetTable
              title="Assets"
              update={() =>
                Promise.all([
                  NetWorthService.getAssets(
                    user.auth_token,
                    selectedDate.getMonth() + 1,
                    selectedDate.getFullYear()
                  ),
                  NetWorthService.getData(
                    user.auth_token,
                    selectedDate.getMonth() + 1,
                    selectedDate.getFullYear()
                  ),
                ]).then((result) => {
                  if (result[0]) {
                    updateAssets({ list: result[0].properties });
                    updateNetWorthData({
                      chartData: result[1].netWorthData,
                    });
                  }
                })
              }
            />
          </Grid>
          <Grid item xl={4} lg={5} sm={6} xs={12}>
            <LiabilityTable
              title="Liabilities"
              update={() =>
                Promise.all([
                  NetWorthService.getLiabilities(
                    user.auth_token,
                    selectedDate.getMonth() + 1,
                    selectedDate.getFullYear()
                  ),
                  NetWorthService.getData(
                    user.auth_token,
                    selectedDate.getMonth() + 1,
                    selectedDate.getFullYear()
                  ),
                ]).then((result) => {
                  if (result[0]) {
                    updateLiabilities({ list: result[0].debts });
                    updateNetWorthData({
                      chartData: result[1].netWorthData,
                    });
                  }
                })
              }
            />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
};

const mapStateToProps = (state) => {
  return {
    user: state.user,
    assets: state.assets.list,
    liabilities: state.liabilities.list,
  };
};

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      updateAssets,
      updateLiabilities,
      updateNetWorthData,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(NetWorthView);
