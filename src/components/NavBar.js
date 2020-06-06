import React, { Component } from "react";
import MobileLeftMenuSlider from "@material-ui/core/Drawer";
import axios from "axios";
import {
  Button,
  AppBar,
  Toolbar,
  ListItem,
  IconButton,
  ListItemText,
  ListItemIcon,
  Divider,
  List,
  Typography,
  Box,
  withStyles,
} from "@material-ui/core";
import {
  CalendarToday,
  Dashboard,
  DateRange,
  ArrowBack,
  Settings,
  TrendingUp,
  ViewDay,
} from "@material-ui/icons";

const styles = (theme) => ({
  box: {
    marginBottom: "20px",
  },
  divLeft: {
    marginLeft: "auto",
    display: "inline",
  },
  username: {
    display: "inline",
    color: "#a9bf7f",
  },
});

class NavBar extends Component {
  state = {
    left: false,
  };

  onDashboardLink() {
    this.props.history.push("/dashboard");
  }

  onWeekLink() {
    this.props.history.push("/week");
  }

  onMonthLink() {
    this.props.history.push("/month");
  }

  onYearLink() {
    this.props.history.push("/year");
  }

  onNetWorthLink() {
    this.props.history.push("/networth");
  }

  onSettingsLink() {
    this.props.history.push("/settings");
  }

  toggleSlider = (slider, open) => () => {
    this.setState({
      ...this.state,
      [slider]: open,
    });
  };

  sideList = (slider) => (
    <Box
      style={{
        width: 250,
        height: "100%",
        color: "#a9bf7f",
      }}
      component="div"
      onClick={this.toggleSlider(slider, false)}
    >
      <Divider />
      <List>
        <ListItem button onClick={() => this.onDashboardLink()}>
          <ListItemIcon>
            <Dashboard />
          </ListItemIcon>
          <ListItemText primary={"Dashboard"} />
        </ListItem>
        <ListItem button onClick={() => this.onWeekLink()}>
          <ListItemIcon>
            <DateRange />
          </ListItemIcon>
          <ListItemText primary={"Week"} />
        </ListItem>
        <ListItem button onClick={() => this.onMonthLink()}>
          <ListItemIcon>
            <CalendarToday />
          </ListItemIcon>
          <ListItemText primary={"Month"} />
        </ListItem>
        <ListItem button onClick={() => this.onYearLink()}>
          <ListItemIcon>
            <ViewDay />
          </ListItemIcon>
          <ListItemText primary={"Year"} />
        </ListItem>
        <ListItem button onClick={() => this.onNetWorthLink()}>
          <ListItemIcon>
            <TrendingUp />
          </ListItemIcon>
          <ListItemText primary={"Net Worth"} />
        </ListItem>
        <ListItem button onClick={() => this.onSettingsLink()}>
          <ListItemIcon>
            <Settings />
          </ListItemIcon>
          <ListItemText primary={"Settings"} />
        </ListItem>
      </List>
    </Box>
  );

  async handleLogoutClick() {
    if (this.props.user) {
      axios
        .delete("http://localhost:3001/sessions", {
          headers: { Authorization: this.props.user.auth_token },
        })
        .then((response) => {
          this.props.handleLogout();
        })
        .catch((error) => {
          console.log("logout error", error);
        });
    }
    this.props.history.push("/");
  }

  render() {
    const { classes } = this.props;
    const title = this.props.title;
    const user = this.props.user;

    return (
      <>
        <Box className={classes.box} component="nav">
          <AppBar position="static" style={{ background: "#222" }}>
            <Toolbar>
              <IconButton onClick={this.toggleSlider("left", true)}>
                <ArrowBack style={{ color: "grey" }} />
              </IconButton>
              <Typography variant="h5" style={{ color: "grey" }}>
                {title}
              </Typography>
              <div className={classes.divLeft}>
                <Typography className={classes.username} variant="h6">
                  {user}
                </Typography>
                <Button
                  variant="contained"
                  onClick={() => this.handleLogoutClick()}
                  style={{ marginLeft: "15px", display: "inline" }}
                >
                  Logout
                </Button>
              </div>
              <MobileLeftMenuSlider
                anchor="left"
                open={this.state.left}
                onClose={this.toggleSlider("left", false)}
              >
                {this.sideList("left")}
              </MobileLeftMenuSlider>
            </Toolbar>
          </AppBar>
        </Box>
      </>
    );
  }
}

export default withStyles(styles)(NavBar);
