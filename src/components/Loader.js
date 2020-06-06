import React, { Component } from "react";
import { Grid, withStyles } from "@material-ui/core";
import LoaderClass from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

const styles = (theme) => ({
  loader: {
    height: "100%",
    position: "relative",
  },
});

class Loader extends Component {
  render() {
    const { classes } = this.props;

    return (
      <div className={classes.loader}>
        <Grid
          container
          style={{ minHeight: "100vh" }}
          spacing={0}
          direction="column"
          justify="center"
          alignItems="center"
        >
          <LoaderClass
            type="TailSpin"
            color="#00BFFF"
            height={100}
            width={100}
          />
        </Grid>
      </div>
    );
  }
}

export default withStyles(styles)(Loader);
