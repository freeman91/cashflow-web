import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { makeStyles } from "@material-ui/core";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { useCookies } from "react-cookie";

import NavBar from "./NavBar";
import TopBar from "./TopBar";
import { updateUser } from "../../store";
import SessionService from "../../service/SessionService";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.colors[0],
    display: "flex",
    height: "100%",
    overflow: "hidden",
    width: "100%",
  },
  wrapper: {
    display: "flex",
    flex: "1 1 auto",
    overflow: "hidden",
    paddingTop: 64,
    [theme.breakpoints.up("lg")]: {
      paddingLeft: 200,
    },
  },
  contentContainer: {
    display: "flex",
    flex: "1 1 auto",
    overflow: "hidden",
  },
  content: {
    flex: "1 1 auto",
    height: "100%",
    overflow: "auto",
  },
}));

const DashboardLayout = (props) => {
  const classes = useStyles();
  const navigate = useNavigate();
  const [isMobileNavOpen, setMobileNavOpen] = useState(false);
  // eslint-disable-next-line
  const [cookie, setCookie, removeCookie] = useCookies(["email", "token"]);
  const { updateUser } = props;

  useEffect(() => {
    function checkForValidToken() {
      if (!props.user.auth_token) {
        if (cookie.email && cookie.token) {
          SessionService.tokenValid(cookie.token).then((response) => {
            if (response === "VALID") {
              updateUser({ email: cookie.email, auth_token: cookie.token });
            } else {
              removeCookie("email");
              removeCookie("token");
              navigate("/login", { replace: true });
            }
          });
        } else {
          navigate("/login", { replace: true });
        }
      }
    }
    checkForValidToken();
  }, [
    props.user.auth_token,
    navigate,
    cookie.email,
    cookie.token,
    removeCookie,
    updateUser,
  ]);

  return (
    <div className={classes.root}>
      <TopBar onMobileNavOpen={() => setMobileNavOpen(true)} />
      <NavBar
        onMobileClose={() => setMobileNavOpen(false)}
        openMobile={isMobileNavOpen}
      />
      <div className={classes.wrapper}>
        <div className={classes.contentContainer}>
          <div className={classes.content}>
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      updateUser,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(DashboardLayout);
