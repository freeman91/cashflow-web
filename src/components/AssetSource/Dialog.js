import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputAdornment,
  TextField,
  Button,
  Grid,
} from '@material-ui/core';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import DescriptionIcon from '@material-ui/icons/Description';
import CategoryIcon from '@material-ui/icons/Category';

import AssetSourceService from '../../service/AssetSourceService';
import { showErrorSnackbar, showSuccessSnackbar } from '../../store';

const useStyles = makeStyles((theme) => ({
  title: {
    paddingBottom: '1rem',
  },
  actions: {
    paddingBottom: '1rem',
    paddingRight: '1.5rem',
    paddingLeft: '1.5rem',
  },
  cssOutlinedInput: {
    '&$cssFocused $notchedOutline': {
      borderColor: `${theme.palette.primary.main} !important`,
    },
    color: `${theme.palette.gray}`,
  },
  cssFocused: {},
  notchedOutline: {
    borderWidth: '1px',
    borderColor: `${theme.palette.gray} !important`,
  },
  formControl: {
    '&:hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline.Mui-focused':
      {
        borderColor: `${theme.palette.primary.main} !important`,
      },
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: `${theme.palette.gray}`,
    },
    '& .MuiInputLabel-root.Mui-focused': {
      color: `${theme.palette.primary.main} !important`,
    },
  },
  select: {
    color: `${theme.palette.gray}`,
  },
}));

const defaultState = {
  name: '',
  description: '',
};

const AssetSourceDialog = ({
  user,
  value,
  setValue,
  show,
  setShow,
  update,
  showSuccessSnackbar,
  showErrorSnackbar,
}) => {
  const classes = useStyles();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [values, setValues] = useState({ ...defaultState });

  useEffect(() => {
    if (value) {
      setValues({
        name: value.name,
        description: value.description,
      });
    }
  }, [value]);

  const handleChange = (prop) => (event) => {
    setValues({
      ...values,
      [prop]: event.target.value,
    });
  };

  const handleClose = () => {
    setValue();
    setValues({ ...defaultState });
    return setShow(false);
  };

  const onSubmit = () => {
    if (values.name === '') {
      console.error('[ERROR]: Invalid data in input field');
    } else {
      if (value) {
        AssetSourceService.update(
          {
            id: value.id,
            name: values.name,
            description: values.description,
          },
          user.auth_token
        )
          .then(() => {
            showSuccessSnackbar('Source saved');
            update();
            handleClose();
          })
          .catch(() => {
            showErrorSnackbar('Error: Source not saved');
          });
      } else {
        AssetSourceService.create(
          {
            name: values.name,
            description: values.description,
          },
          user.auth_token
        )
          .then(() => {
            showSuccessSnackbar('New Source created');
            update();
            handleClose();
          })
          .catch(() => {
            showErrorSnackbar('Error: Source not created');
          });
      }
    }
  };

  return (
    <Dialog
      fullWidth
      fullScreen={fullScreen}
      maxWidth="sm"
      open={show}
      onClose={handleClose}
      PaperProps={{
        style: {
          backgroundColor: '#1e1e1e',
        },
      }}
    >
      <DialogTitle id="dialog-title" className={classes.title}>
        {value ? 'Edit Asset Source' : 'Create Asset Source'}
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
                onChange={handleChange('name')}
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
                onChange={handleChange('description')}
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

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      showErrorSnackbar,
      showSuccessSnackbar,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(AssetSourceDialog);
