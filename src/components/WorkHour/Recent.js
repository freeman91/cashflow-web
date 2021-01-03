import React, { useEffect, useState, useCallback } from "react";
import {
  Card,
  CardHeader,
  TableCell,
  Table,
  TableBody,
  TableRow,
  TableHead,
  Box,
  IconButton,
  makeStyles,
} from "@material-ui/core";
import PerfectScrollbar from "react-perfect-scrollbar";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import AddIcon from "@material-ui/icons/AddCircle";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";

import { updateWorkHours } from "../../store";
import WorkHourDialog from "./Dialog";
import { numberToCurrency_ } from "../../helpers/currency";
import { dateStringShort } from "../../helpers/date-helper";
import DashboardService from "../../service/DashboardService";
import WorkHourService from "../../service/WorkHourService";

const useStyles = makeStyles((theme) => ({
  card: {
    backgroundColor: `${theme.palette.colors[1]}`,
    color: `${theme.palette.white}`,
  },
  header: {
    borderBottom: `1px solid ${theme.palette.gray}`,
    color: `${theme.palette.gray}`,
  },
  cell: {
    borderBottom: `1px solid ${theme.palette.gray}`,
  },
  editIcon: {
    color: `${theme.palette.cyan}`,
  },
  deleteIcon: {
    color: `${theme.palette.red}`,
  },
}));

const RecentWorkHours = (props) => {
  const classes = useStyles();
  const [isLoaded, setIsLoaded] = useState(false);
  const [value, setValue] = useState();
  const [show, setShow] = useState(false);
  const { updateWorkHours } = props;

  const getRecentWorkHours = useCallback(() => {
    DashboardService.getWorkHours(props.user.auth_token).then((result) => {
      if (result) updateWorkHours({ recent: result.workHours });
      setIsLoaded(true);
    });
  }, [props.user.auth_token, updateWorkHours]);

  useEffect(() => {
    getRecentWorkHours();
  }, [getRecentWorkHours]);

  const openModal = () => {
    setShow(true);
  };

  const handleEdit = (workHour) => {
    setValue(workHour);
    setShow(true);
  };

  const handleDelete = (workHour) => {
    WorkHourService.destroy(workHour.id, props.user.auth_token).then(() => {
      getRecentWorkHours();
    });
  };

  if (!isLoaded) return null;

  return (
    <>
      <Card className={classes.card}>
        <CardHeader
          title="Recent Work Hours"
          action={
            <IconButton color="primary" onClick={() => openModal()}>
              <AddIcon />
            </IconButton>
          }
        />
        <PerfectScrollbar>
          <Box minWidth={400}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell className={classes.header}>Date</TableCell>
                  <TableCell className={classes.header}>Amount</TableCell>
                  <TableCell className={classes.header}>Source</TableCell>
                  <TableCell className={classes.header}>Edit</TableCell>
                  <TableCell className={classes.header}>Delete</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {props.workHours.recent.map((workHour) => (
                  <TableRow hover key={workHour.id}>
                    <TableCell className={classes.cell}>
                      {dateStringShort(workHour.date)}
                    </TableCell>
                    <TableCell className={classes.cell}>
                      {numberToCurrency_.format(workHour.amount)}
                    </TableCell>
                    <TableCell className={classes.cell}>
                      {workHour.source}
                    </TableCell>
                    <TableCell className={classes.cell}>
                      <IconButton
                        onClick={() => handleEdit(workHour)}
                        className={classes.editIcon}
                      >
                        <EditIcon />
                      </IconButton>
                    </TableCell>
                    <TableCell className={classes.cell}>
                      <IconButton
                        className={classes.deleteIcon}
                        onClick={() => handleDelete(workHour)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        </PerfectScrollbar>
      </Card>
      <WorkHourDialog
        show={show}
        setShow={setShow}
        value={value}
        setValue={setValue}
      />
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    user: state.user,
    workHours: state.workHours,
  };
};

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      updateWorkHours,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(RecentWorkHours);
