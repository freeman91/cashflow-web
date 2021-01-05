import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputAdornment,
  TextField,
  Button,
  Grid,
} from "@material-ui/core";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import DescriptionIcon from "@material-ui/icons/Description";
import CategoryIcon from "@material-ui/icons/Category";

import IncomeSourceService from "../../service/IncomeSourceService";

const useStyles = makeStyles((theme) => ({
  title: {
    paddingBottom: "1rem",
  },
  actions: {
    paddingBottom: "1rem",
    paddingRight: "1.5rem",
    paddingLeft: "1.5rem",
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
  formControl: {
    "&:hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline.Mui-focused": {
      borderColor: `${theme.palette.primary.main} !important`,
    },
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: `${theme.palette.gray}`,
    },
    "& .MuiInputLabel-root.Mui-focused": {
      color: `${theme.palette.primary.main} !important`,
    },
  },
  select: {
    color: `${theme.palette.gray}`,
  },
}));

const defaultState = {
  name: "",
  description: "",
};

const IncomeSourceDialog = (props) => {
  const classes = useStyles();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [values, setValues] = useState({ ...defaultState });

  useEffect(() => {
    if (props.value) {
      setValues({
        name: props.value.name,
        description: props.value.description,
      });
    }
  }, [props.value]);

  const handleChange = (prop) => (event) => {
    setValues({
      ...values,
      [prop]: event.target.value,
    });
  };

  const handleClose = () => {
    props.setValue();
    setValues({ ...defaultState });
    return props.setShow(false);
  };

  const onSubmit = async () => {
    if (values.name === "") {
      console.error("[ERROR]: Invalid data in input field");
    } else {
      if (props.value) {
        await IncomeSourceService.update(
          {
            id: props.value.id,
            name: values.name,
            description: values.description,
          },
          props.user.auth_token
        );
      } else {
        await IncomeSourceService.create(
          {
            name: values.name,
            description: values.description,
          },
          props.user.auth_token
        );
      }
      props.update();
      handleClose();
    }
  };

  return (
    <Dialog
      fullWidth
      fullScreen={fullScreen}
      maxWidth="sm"
      open={props.show}
      onClose={handleClose}
      PaperProps={{
        style: {
          backgroundColor: "#1e1e1e",
        },
      }}
    >
      <DialogTitle id="dialog-title" className={classes.title}>
        {props.value ? "Edit Income Source" : "Create Income Source"}
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={1}>
          <Grid container item xs={12}>
            <Grid item xs={12} sm={12}>
              <TextField
                id="name"
                label="name"
                variant="outlined"
                value={values.name}
                onChange={handleChange("name")}
                fullWidth={true}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <CategoryIcon />
                    </InputAdornment>
                  ),
                  classes: {
                    root: classes.cssOutlinedInput,
                    focused: classes.cssFocused,
                    notchedOutline: classes.notchedOutline,
                  },
                }}
              />
            </Grid>
          </Grid>
          <Grid container item xs={12}>
            <Grid item xs={12} sm={12}>
              <TextField
                id="description"
                label="description"
                variant="outlined"
                value={values.description}
                onChange={handleChange("description")}
                fullWidth={true}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <DescriptionIcon />
                    </InputAdornment>
                  ),
                  classes: {
                    root: classes.cssOutlinedInput,
                    focused: classes.cssFocused,
                    notchedOutline: classes.notchedOutline,
                  },
                }}
              />
            </Grid>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions className={classes.actions}>
        <Button
          color="primary"
          variant="contained"
          className={classes.submitButton}
          fullWidth={true}
          onClick={onSubmit}
        >
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

export default connect(mapStateToProps, null)(IncomeSourceDialog);