import React, { Component } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import { isEqual } from 'lodash';
import {
  Button,
  Card,
  Collapse,
  Paper,
  TableContainer,
  Table,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  Typography,
  withStyles,
} from '@material-ui/core';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import formatter_no$ from '../helpers/currency_no$';
import WorkHourDialogEdit from './WorkHourDialogEdit';
import Dashboard from '../service/DashboardService';

const styles = (theme) => ({
  card: {
    textAlign: 'center',
  },
  cardTitle: {
    margin: '10px',
    fontWeight: 'bold',
    textAlign: 'center',
    width: '50%',
    float: 'left',
  },
  createButton: {
    margin: '10px',
    marginRight: '25px',
    float: 'center',
  },
  dialog: {
    margin: theme.spacing(1),
  },
  th: {
    fontWeight: 'bold',
  },
});

const defaultState = {
  isLoaded: false,
  open: false,
  collapse: true,
  value: {
    amount: 0,
    id: 0,
    source: '',
    date: new Date(),
  },
};

class WorkHourTable extends Component {
  state = { ...defaultState };

  componentDidMount() {
    if (isEqual(this.props.user, {})) {
      this.props.history.push('/');
    } else {
      this.get_workHours();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.reload) {
      this.get_workHours().then(() => {
        this.props.stop_reload();
      });
    }
  }

  get_workHours = async () => {
    Dashboard.getWorkHours(this.props.user.auth_token).then((result) => {
      if (result) {
        this.setState({
          workHours: result.workHours,
          isLoaded: true,
        });
      }
    });
  };

  handleClick = (workHour) => {
    this.setState({
      open: true,
      value: {
        id: workHour[0],
        amount: workHour[1],
        source: workHour[2],
        date: workHour[3],
      },
    });
  };

  handleClose = () => {
    this.setState({ ...defaultState });
  };

  handleCollapse = () => {
    this.setState({
      collapse: !this.state.collapse,
    });
  };

  render() {
    const { classes, user } = this.props;
    const { workHours, isLoaded, open, value, collapse } = this.state;
    if (!isLoaded) return null;

    var workHoursData = [];
    workHours.map((exp) => {
      workHoursData.push([exp.id, exp.amount, exp.source, exp.date]);
      return null;
    });

    return (
      <>
        <Card className={classes.card} variant="outlined">
          <Typography className={classes.cardTitle} variant="h5" gutterBottom>
            Recent Work Hours
          </Typography>
          <Button onClick={this.handleCollapse}>
            {collapse ? <ExpandLess /> : <ExpandMore />}
          </Button>
          <TableContainer component={Paper}>
            <Collapse in={collapse} timeout="auto" unmountOnExit>
              <Table>
                <TableHead>
                  <TableRow>
                    {['date', 'amount', 'source'].map((header) => {
                      return (
                        <TableCell key={`${header}-header`}>
                          <Typography
                            className={classes.th}
                            variant="subtitle2"
                          >
                            {header}
                          </Typography>
                        </TableCell>
                      );
                    })}
                  </TableRow>
                </TableHead>

                <TableBody>
                  {workHoursData.map((workHour, idx) => {
                    return (
                      <TableRow
                        key={`${workHour[0]}-data`}
                        hover
                        onClick={() => this.handleClick(workHour)}
                      >
                        <TableCell key={`date-${idx}`}>
                          <Typography variant="subtitle1">
                            {new Date(workHour[3] + ' 12:00').getMonth() +
                              1 +
                              '/' +
                              new Date(workHour[3] + ' 12:00').getDate()}
                          </Typography>
                        </TableCell>
                        <TableCell key={`amount-${idx}`}>
                          <Typography variant="subtitle1">
                            {formatter_no$.format(workHour[1])}
                          </Typography>
                        </TableCell>
                        <TableCell key={`source-${idx}`}>
                          <Typography variant="subtitle1">
                            {workHour[2]}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </Collapse>
          </TableContainer>
        </Card>
        <WorkHourDialogEdit
          open={open}
          handleClose={this.handleClose}
          user={user}
          value={value}
          get_workHours={this.get_workHours}
        />
      </>
    );
  }
}

export default withStyles(styles)(WorkHourTable);
