import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Loader from "react-loader-spinner";
import { DatePicker } from "@material-ui/pickers";
import {
  Box,
  Card,
  CardContent,
  Container,
  Grid,
  makeStyles,
  Typography,
} from "@material-ui/core";

import Page from "../../components/Page";
import AssetTable from "../../components/Asset/Table";
import LiabilityTable from "../../components/Liability/Table";
import NetWorthService from "../../service/NetWorthService";
import { numberToCurrency } from "../../helpers/currency";
import { updateAssets, updateLiabilities } from "../../store";

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

const NetWorthView = (props) => {
  const classes = useStyles();
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedDate, handleDateChange] = useState(new Date());
  const [stats, setStats] = useState();

  const { updateAssets, updateLiabilities } = props;

  useEffect(() => {
    function getNetWorthData() {
      Promise.all([
        NetWorthService.getData(
          props.user.auth_token,
          selectedDate.getMonth() + 1,
          selectedDate.getFullYear()
        ),
        NetWorthService.getAssets(
          props.user.auth_token,
          selectedDate.getMonth() + 1,
          selectedDate.getFullYear()
        ),
        NetWorthService.getLiabilities(
          props.user.auth_token,
          selectedDate.getMonth() + 1,
          selectedDate.getFullYear()
        ),
      ]).then((results) => {
        if (results[0]) {
          setStats(results[0].netWorthData);
          updateAssets({ list: results[1].properties });
          updateLiabilities({ list: results[2].debts });
          setIsLoaded(true);
        }
      });
    }
    getNetWorthData();
  }, [props.user.auth_token, selectedDate, updateAssets, updateLiabilities]);

  if (!isLoaded)
    return (
      <Page className={classes.root} title="NetWorth">
        <div className={classes.loader}>
          <Loader type="Oval" color="#00BFFF" height={100} width={100} />
        </div>
      </Page>
    );

  let assetTotal = 0;
  props.assets.map((asset) => {
    return (assetTotal += Number(asset.amount));
  });

  let liabilityTotal = 0;
  props.liabilities.map((liability) => {
    return (liabilityTotal += Number(liability.amount));
  });

  console.log("stats: ", stats);

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
                  views={["year", "month"]}
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
            <Card className={classes.card}>
              <CardContent>
                <Box height={100} position="relative" />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xl={2} lg={1} sm={0} xs={0} />
          <Grid item xl={4} lg={5} sm={6} xs={12}>
            <AssetTable
              title="Assets"
              update={() =>
                NetWorthService.getAssets(
                  props.user.auth_token,
                  selectedDate.getMonth() + 1,
                  selectedDate.getFullYear()
                ).then((result) => {
                  if (result) props.updateAssets({ list: result.properties });
                })
              }
            />
          </Grid>
          <Grid item xl={4} lg={5} sm={6} xs={12}>
            <LiabilityTable
              title="Liabilities"
              update={() =>
                NetWorthService.getLiabilities(
                  props.user.auth_token,
                  selectedDate.getMonth() + 1,
                  selectedDate.getFullYear()
                ).then((result) => {
                  if (result) props.updateLiabilities({ list: result.debts });
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
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(NetWorthView);
