import React, { useEffect } from "react";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
// import FormControlLabel from "@material-ui/core/FormControlLabel";
// import Checkbox from "@material-ui/core/Checkbox";
// import Link from "@material-ui/core/Link";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import { useForm } from "react-hook-form";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

import { updateUser } from "../../store";
import SessionService from "../../service/SessionService";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100%",
  },
  image: {
    backgroundImage: "url(https://source.unsplash.com/8peGuud5cEw/1200x1200)",
    backgroundRepeat: "no-repeat",
    backgroundColor: "black",
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
  paper: {
    margin: theme.spacing(8, 4),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  paperContainer: {
    backgroundColor: theme.palette.colors[0],
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: "#7f7caf",
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  cssOutlinedInput: {
    "&$cssFocused $notchedOutline": {
      borderColor: `${theme.palette.primary.main} !important`,
    },
    color: `${theme.palette.gray}`,
  },
  cssFocused: {},
  notchedOutline: {
    borderWidth: "1px",
    borderColor: `${theme.palette.gray} !important`,
  },
}));

export function Login(props) {
  const classes = useStyles();
  const [cookie, setCookie] = useCookies(["email", "token"]);
  const { handleSubmit, register } = useForm();
  const { updateUser } = props;
  const navigate = useNavigate();

  useEffect(() => {
    if (cookie.email && cookie.token) {
      SessionService.tokenValid(cookie.token).then((response) => {
        updateUser({ email: cookie.email, auth_token: cookie.token });
        navigate("/app/dashboard", { replace: true });
      });
    }
  }, [navigate, updateUser, cookie]);

  const onSubmit = handleSubmit(async (data) => {
    SessionService.create(data.email, data.password)
      .then((response) => {
        if (response.data.email) {
          setCookie("email", response.data.email, "/");
          setCookie("token", response.data.auth_token, "/");
          updateUser(response.data);
          navigate("/app/dashboard", { replace: true });
        }
      })
      .catch((error) => {
        console.error("login error", error);
      });
  });

  return (
    <Grid container component="main" className={classes.root}>
      <CssBaseline />
      <Grid item xs={false} sm={4} md={7} className={classes.image} />
      <Grid
        item
        xs={12}
        sm={8}
        md={5}
        component={Paper}
        elevation={6}
        square
        className={classes.paperContainer}
      >
        <div className={classes.paper}>
          <Typography component="h1" variant="h1" color="primary" align="left">
            CashFlow - Login
          </Typography>
          <form className={classes.form} noValidate onSubmit={onSubmit}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              inputRef={register}
              InputProps={{
                classes: {
                  root: classes.cssOutlinedInput,
                  focused: classes.cssFocused,
                  notchedOutline: classes.notchedOutline,
                },
              }}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              inputRef={register}
              InputProps={{
                classes: {
                  root: classes.cssOutlinedInput,
                  focused: classes.cssFocused,
                  notchedOutline: classes.notchedOutline,
                },
              }}
            />
            {/* <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            /> */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Sign In
            </Button>
            <Grid container>
              {/* <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid> */}
              {/* <Grid item>
                <Link href="#" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid> */}
            </Grid>
          </form>
        </div>
      </Grid>
    </Grid>
  );
}

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      updateUser,
    },
    dispatch
  );

export default connect(null, mapDispatchToProps)(Login);
