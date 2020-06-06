import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Typography, Box } from "@material-ui/core";
import Typed from "react-typed";

// CSS STYLES
const useStyles = makeStyles((theme) => ({
  title: {
    color: "white",
  },
  subtitle: {
    color: "white",
    marginBottom: "3rem",
  },
  typedContainer: {
    position: "absolute",
    top: "25%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "100vw",
    textAlign: "center",
    zIndex: 1,
  },
}));

const Header = () => {
  const classes = useStyles();
  return (
    <Box className={classes.typedContainer}>
      <br />
      <Typography className={classes.title} variant="h2">
        <Typed strings={["cashflow"]} typeSpeed={100}></Typed>
      </Typography>
      <Typography className={classes.subtitle} variant="h4">
        <Typed
          strings={[
            "take control of your financial life",
            "reduce risk",
            "make informed financial decisions",
            "increase confidence",
          ]}
          typeSpeed={40}
          backSpeed={60}
          loop
        ></Typed>
      </Typography>
    </Box>
  );
};

export default Header;
