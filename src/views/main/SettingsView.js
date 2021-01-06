import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Loader from "react-loader-spinner";
import { Container, Grid, makeStyles, Card } from "@material-ui/core";

import Page from "../../components/Page";
import ExpenseGroupTable from "../../components/ExpenseGroup/Table";
import IncomeSourceTable from "../../components/IncomeSource/Table";
import LiabilityGroupTable from "../../components/LiabilityGroup/Table";
import AssetSourceTable from "../../components/AssetSource/Table";

import ExpenseGroupService from "../../service/ExpenseGroupService";
import IncomeSourceService from "../../service/IncomeSourceService";
import LiabilityGroupService from "../../service/LiabilityGroupService";
import AssetSourceService from "../../service/AssetSourceService";
import {
  updateExpenseGroups,
  updateIncomeSources,
  updateLiabilityGroups,
  updateAssetSources,
} from "../../store";

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
}));

const SettingsView = (props) => {
  const classes = useStyles();
  const [isLoaded, setIsLoaded] = useState(false);

  const {
    updateExpenseGroups,
    updateIncomeSources,
    updateLiabilityGroups,
    updateAssetSources,
  } = props;

  useEffect(() => {
    function getSettingsData() {
      Promise.all([
        ExpenseGroupService.getGroups(props.user.auth_token),
        IncomeSourceService.getSources(props.user.auth_token),
        LiabilityGroupService.getGroups(props.user.auth_token),
        AssetSourceService.getSources(props.user.auth_token),
      ]).then((results) => {
        if (results[0]) {
          updateExpenseGroups({ list: results[0].expense_groups });
          updateIncomeSources({ list: results[1].income_sources });
          updateLiabilityGroups({ list: results[2].groups });
          updateAssetSources({ list: results[3].sources });
          setIsLoaded(true);
        }
      });
    }
    getSettingsData();
  }, [
    props.user.auth_token,
    updateExpenseGroups,
    updateIncomeSources,
    updateLiabilityGroups,
    updateAssetSources,
  ]);

  if (!isLoaded)
    return (
      <Page className={classes.root} title="Settings">
        <div className={classes.loader}>
          <Loader type="Oval" color="#00BFFF" height={100} width={100} />
        </div>
      </Page>
    );

  return (
    <Page className={classes.root} title="Settings">
      <Container maxWidth={false}>
        <Grid container spacing={3}>
          <Grid item xl={2} lg={3} md={6} xs={12}>
            <ExpenseGroupTable
              title="Expense Groups"
              update={() =>
                ExpenseGroupService.getGroups(props.user.auth_token).then(
                  (result) => {
                    updateExpenseGroups({ list: result.expense_groups });
                  }
                )
              }
            />
          </Grid>
          <Grid item xl={2} lg={3} md={6} xs={12}>
            <Card className={classes.card}>
              <IncomeSourceTable
                title="Income Sources"
                update={() =>
                  IncomeSourceService.getSources(props.user.auth_token).then(
                    (result) => {
                      updateIncomeSources({ list: result.income_sources });
                    }
                  )
                }
              />
            </Card>
          </Grid>
          <Grid item xl={2} lg={3} md={6} xs={12}>
            <Card className={classes.card}>
              <LiabilityGroupTable
                title="Liability Groups"
                update={() =>
                  LiabilityGroupService.getGroups(props.user.auth_token).then(
                    (result) => {
                      updateLiabilityGroups({ list: result.groups });
                    }
                  )
                }
              />
            </Card>
          </Grid>
          <Grid item xl={2} lg={3} md={6} xs={12}>
            <Card className={classes.card}>
              <AssetSourceTable
                title="Asset Sources"
                update={() =>
                  AssetSourceService.getSources(props.user.auth_token).then(
                    (result) => {
                      updateAssetSources({ list: result.sources });
                    }
                  )
                }
              />
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
    expenseGroups: state.expenseGroups.list,
    incomeSources: state.incomeSources.list,
    liabilityGroups: state.liabilityGroups.list,
    assetSources: state.assetSources.list,
  };
};

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      updateExpenseGroups,
      updateIncomeSources,
      updateLiabilityGroups,
      updateAssetSources,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(SettingsView);
