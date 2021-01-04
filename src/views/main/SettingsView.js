import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import Loader from "react-loader-spinner";
import {
  // Box,
  // Container,
  // Grid,
  makeStyles,
  // Typography,
  // Card,
  // CardContent,
  // Avatar,
} from "@material-ui/core";

import Page from "../../components/Page";
// import SettingsService from "../../service/SettingsService";

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

  useEffect(() => {
    // function getSettingsData() {
    //   SettingsService.getData(props.user.auth_token).then((result) => {
    //     if (result) {
    //       console.log("result: ", result);
    setIsLoaded(true);
    //     }
    //   });
    // }
    // getSettingsData();
  }, [props.user.auth_token]);

  if (!isLoaded)
    return (
      <Page className={classes.root} title="Settings">
        <div className={classes.loader}>
          <Loader type="Oval" color="#00BFFF" height={100} width={100} />
        </div>
      </Page>
    );

  return <Page className={classes.root} title="Settings"></Page>;
};

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

export default connect(mapStateToProps, null)(SettingsView);
