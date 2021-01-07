import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import { clearSnackbar } from "../store";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const CFSnackbar = ({ snackbar, clearSnackbar }) => {
  function handleClose() {
    clearSnackbar();
  }

  return (
    <Snackbar
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      open={snackbar.open}
      autoHideDuration={4000}
      onClose={handleClose}
    >
      <Alert onClose={handleClose} severity={snackbar.severity}>
        {snackbar.message}
      </Alert>
    </Snackbar>
  );
};

const mapStateToProps = (state) => {
  return {
    snackbar: state.snackbar,
  };
};

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      clearSnackbar,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(CFSnackbar);
