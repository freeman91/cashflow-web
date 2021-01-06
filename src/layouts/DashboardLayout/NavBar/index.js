import React, { useEffect } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Link as RouterLink, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import {
  Avatar,
  Box,
  Button,
  Divider,
  Drawer,
  Hidden,
  List,
  Typography,
  makeStyles,
} from "@material-ui/core";
import {
  BarChart as BarChartIcon,
  Calendar as CalendarIcon,
  DollarSign as DollarSignIcon,
  Settings as SettingsIcon,
} from "react-feather";

import NavItem from "./NavItem";
import SessionService from "../../../service/SessionService";
import {
  updateUser,
  showErrorSnackbar,
  showSuccessSnackbar,
} from "../../../store";

const items = [
  {
    href: "/app/dashboard",
    icon: BarChartIcon,
    title: "Dashboard",
  },
  {
    href: "/app/month",
    icon: CalendarIcon,
    title: "Month",
  },
  {
    href: "/app/year",
    icon: CalendarIcon,
    title: "Year",
  },
  {
    href: "/app/networth",
    icon: DollarSignIcon,
    title: "Net Worth",
  },
  {
    href: "/app/settings",
    icon: SettingsIcon,
    title: "Settings",
  },
];

const useStyles = makeStyles((theme) => ({
  mobileDrawer: {
    width: 200,
  },
  desktopDrawer: {
    width: 200,
    top: 64,
    height: "calc(100% - 64px)",
    backgroundColor: theme.palette.colors[1],
  },
  avatar: {
    cursor: "pointer",
    width: 54,
    height: 54,
    boxShadow: "0px 0px 5px #ccc",
    marginBottom: "15px",
    marginTop: "15px",
  },
  email: {
    color: theme.palette.colors[3],
  },
}));

const NavBar = ({
  onMobileClose,
  openMobile,
  user,
  updateUser,
  showErrorSnackbar,
  showSuccessSnackbar,
}) => {
  const classes = useStyles();
  const location = useLocation();
  // eslint-disable-next-line
  const [cookie, setCookie, removeCookie] = useCookies(["email", "token"]);
  const navigate = useNavigate();

  useEffect(() => {
    if (openMobile && onMobileClose) {
      onMobileClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  const handleLogout = () => {
    SessionService.destroy(user.auth_token)
      .then(() => {
        showSuccessSnackbar("Successfully Logged out");
        removeCookie("email");
        removeCookie("token");
        updateUser({ email: "", auth_token: "" });
        navigate("/login", { replace: true });
      })
      .catch(() => {
        showErrorSnackbar("Error: logging out");
      });
  };

  const content = (
    <Box height="100%" display="flex" flexDirection="column">
      <Box alignItems="center" display="flex" flexDirection="column" p={2}>
        <Avatar
          className={classes.avatar}
          component={RouterLink}
          // src={user.avatar}
          to="/app/account"
        />
        <Typography className={classes.email} variant="h5">
          {user.email}
        </Typography>
        <Button
          size="small"
          className={classes.logoutButton}
          fullWidth={true}
          onClick={handleLogout}
        >
          Logout
        </Button>
      </Box>
      <Divider />
      <Box p={2}>
        <List>
          {items.map((item) => (
            <NavItem
              href={item.href}
              key={item.title}
              title={item.title}
              icon={item.icon}
            />
          ))}
        </List>
      </Box>
      <Box flexGrow={1} />
    </Box>
  );

  return (
    <>
      <Hidden lgUp>
        <Drawer
          anchor="left"
          classes={{ paper: classes.mobileDrawer }}
          onClose={onMobileClose}
          open={openMobile}
          variant="temporary"
        >
          {content}
        </Drawer>
      </Hidden>
      <Hidden mdDown>
        <Drawer
          anchor="left"
          classes={{ paper: classes.desktopDrawer }}
          open
          variant="persistent"
        >
          {content}
        </Drawer>
      </Hidden>
    </>
  );
};

NavBar.propTypes = {
  onMobileClose: PropTypes.func,
  openMobile: PropTypes.bool,
};

NavBar.defaultProps = {
  onMobileClose: () => {},
  openMobile: false,
};

const mapStateToProps = (state) => ({
  user: state.user,
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      updateUser,
      showErrorSnackbar,
      showSuccessSnackbar,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(NavBar);
