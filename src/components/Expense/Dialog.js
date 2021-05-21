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
  FormControl,
  Button,
  Grid,
  InputLabel,
  Select,
  MenuItem,
} from '@material-ui/core';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import TodayIcon from '@material-ui/icons/Today';
import BusinessIcon from '@material-ui/icons/Business';
import DescriptionIcon from '@material-ui/icons/Description';

import ExpenseService from '../../service/ExpenseService';
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

const today = new Date();
const defaultState = {
  amount: '',
  group: '',
  vendor: '',
  description: '',
  date:
    today.getFullYear() +
    '-' +
    ('0' + (today.getMonth() + 1)).slice(-2) +
    '-' +
    ('0' + today.getDate()).slice(-2),
};

const ExpenseDialog = ({
  user,
  update,
  value,
  setValue,
  show,
  setShow,
  showSuccessSnackbar,
  showErrorSnackbar,
}) => {
  const classes = useStyles();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [groups, setGroups] = useState();
  const [isLoaded, setIsLoaded] = useState();
  const [values, setValues] = useState({ ...defaultState });

  useEffect(() => {
    function getExpenseGroups() {
      ExpenseService.getGroups(user.auth_token).then((result) => {
        setGroups(result.expense_groups);
        setIsLoaded(true);
      });
    }
    getExpenseGroups();
    if (value) {
      setValues({
        amount: value.amount,
        vendor: value.vendor,
        description: value.description,
        date: value.date,
        group: value.group,
      });
    }
  }, [user.auth_token, value]);

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
    if (isNaN(values.amount) || values.group === '') {
      console.error('[ERROR]: Invalid data in input field');
    } else {
      if (value) {
        ExpenseService.edit(
          {
            id: value.id,
            amount: Number(values.amount),
            group: values.group,
            vendor: values.vendor,
            description: values.description,
            bill: false,
            date: values.date,
          },
          user.auth_token
        )
          .then(() => {
            showSuccessSnackbar('Expense saved');
            update();
            handleClose();
          })
          .catch(() => {
            showErrorSnackbar('Error: Expense not saved');
          });
      } else {
        ExpenseService.create(
          {
            amount: Number(values.amount),
            group: values.group,
            vendor: values.vendor,
            description: values.description,
            bill: false,
            date: values.date,
          },
          user.auth_token
        )
          .then(() => {
            showSuccessSnackbar('New Expense created');
            update();
            handleClose();
          })
          .catch(() => {
            showErrorSnackbar('Error: Expense not created');
          });
      }
    }
  };

  if (!isLoaded) return false;
  if (!values.group) setValues({ ...values, group: groups[0] });

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
        {value ? 'Edit Expense' : 'Create Expense'}
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={1}>
          <Grid container item xs={12}>
            <Grid item xs={12} sm={12}>
              <TextField
                id="amount"
                label="amount"
                variant="outlined"
                placeholder="0.00"
                required
                value={values.amount}
                onChange={handleChange('amount')}
                fullWidth={true}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">$</InputAdornment>
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
              <FormControl
                variant="outlined"
                className={classes.formControl}
                fullWidth={true}
              >
                <InputLabel id="group-label">group</InputLabel>
                <Select
                  labelId="group-label"
                  id="group"
                  value={values.group}
                  onChange={handleChange('group')}
                  label="group"
                  fullWidth={true}
                  className={classes.select}
                >
                  {groups.map((group, idx) => {
                    return (
                      <MenuItem key={`${group}-${idx}`} value={group}>
                        {group}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          <Grid container item xs={12}>
            <Grid item xs={12} sm={12}>
              <TextField
                id="vendor"
                label="vendor"
                variant="outlined"
                value={values.vendor}
                onChange={handleChange('vendor')}
                fullWidth={true}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <BusinessIcon />
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
          <Grid container item xs={12}>
            <Grid item xs={12} sm={12}>
              <TextField
                id="date"
                label="date"
                variant="outlined"
                type="date"
                defaultValue={values.date}
                fullWidth={true}
                onChange={handleChange('date')}
                InputLabelProps={{
                  shrink: true,
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <TodayIcon />
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

export default connect(mapStateToProps, mapDispatchToProps)(ExpenseDialog);
