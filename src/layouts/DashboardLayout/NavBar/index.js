import React, { useEffect } from "react";
import { Link as RouterLink, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import {
  Avatar,
  Box,
  // Button,
  Divider,
  Drawer,
  Hidden,
  List,
  Typography,
  makeStyles,
} from "@material-ui/core";
import {
  // AlertCircle as AlertCircleIcon,
  BarChart as BarChartIcon,
  // Lock as LockIcon,
  // Settings as SettingsIcon,
  // ShoppingBag as ShoppingBagIcon,
  // User as UserIcon,
  // UserPlus as UserPlusIcon,
  // Users as UsersIcon,
} from "react-feather";
import { connect } from "react-redux";

import NavItem from "./NavItem";

const items = [
  {
    href: "/app/dashboard",
    icon: BarChartIcon,
    title: "Dashboard",
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

const NavBar = ({ onMobileClose, openMobile, user }) => {
  const classes = useStyles();
  const location = useLocation();

  useEffect(() => {
    if (openMobile && onMobileClose) {
      onMobileClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

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

export default connect(
  (state) => ({
    user: state.user,
  }),
  null
)(NavBar);
