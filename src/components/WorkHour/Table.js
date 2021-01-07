import React, { useState } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
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
import { Pagination } from "@material-ui/lab";
import PerfectScrollbar from "react-perfect-scrollbar";
import AddIcon from "@material-ui/icons/AddCircle";
import DeleteIcon from "@material-ui/icons/Delete";

import WorkHourDialog from "./Dialog";
import { numberToCurrency_ } from "../../helpers/currency";
import { dateStringShort } from "../../helpers/date-helper";
import WorkHourService from "../../service/WorkHourService";
import { showErrorSnackbar, showSuccessSnackbar } from "../../store";
const ROWS_PER_PAGE = 8;

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
  pagination: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
}));

const WorkHourTable = ({
  user,
  title,
  update,
  workHours,
  showSuccessSnackbar,
  showErrorSnackbar,
}) => {
  const classes = useStyles();
  const [value, setValue] = useState();
  const [show, setShow] = useState(false);
  const [page, setPage] = useState(1);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const openModal = () => {
    setShow(true);
  };

  const handleEdit = (workHour) => {
    setValue(workHour);
    setShow(true);
  };

  const handleDelete = (workHour) => {
    WorkHourService.destroy(workHour.id, user.auth_token)
      .then(() => {
        showSuccessSnackbar("Work Hour deleted");
        update();
      })
      .catch(() => {
        showErrorSnackbar("Error: Work Hour was not deleted");
      });
  };

  return (
    <>
      <Card className={classes.card}>
        <CardHeader
          title={title}
          action={
            <IconButton color="primary" onClick={() => openModal()}>
              <AddIcon />
            </IconButton>
          }
        />
        <PerfectScrollbar>
          <Box minWidth={300}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell className={classes.header}>date</TableCell>
                  <TableCell className={classes.header}>amount</TableCell>
                  <TableCell className={classes.header}>vendor</TableCell>
                  <TableCell className={classes.header}>delete</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {workHours.map((workHour, idx) => {
                  // if the workHour is in the range of the page
                  if (
                    idx < (page - 1) * ROWS_PER_PAGE ||
                    idx > (page - 1) * ROWS_PER_PAGE + ROWS_PER_PAGE - 1
                  )
                    return null;
                  else
                    return (
                      <TableRow
                        onDoubleClick={() => handleEdit(workHour)}
                        hover
                        key={workHour.id}
                      >
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
                            className={classes.deleteIcon}
                            onClick={() => handleDelete(workHour)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                })}
              </TableBody>
            </Table>
            {workHours.length > ROWS_PER_PAGE ? (
              <Pagination
                count={Math.ceil(workHours.length / 8)}
                page={page}
                onChange={handleChangePage}
                className={classes.pagination}
                shape="rounded"
              />
            ) : null}
          </Box>
        </PerfectScrollbar>
      </Card>
      <WorkHourDialog
        show={show}
        setShow={setShow}
        value={value}
        setValue={setValue}
        update={update}
      />
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    user: state.user,
    workHours: state.workHours.list,
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

export default connect(mapStateToProps, mapDispatchToProps)(WorkHourTable);
