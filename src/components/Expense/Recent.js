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

import { updateExpenses } from "../../store";
import ExpenseDialog from "./Dialog";
import { numberToCurrency } from "../../helpers/currency";
import { dateStringShort } from "../../helpers/date-helper";
import DashboardService from "../../service/DashboardService";
import ExpenseService from "../../service/ExpenseService";

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

const RecentExpenses = (props) => {
  const classes = useStyles();
  const [isLoaded, setIsLoaded] = useState(false);
  const [value, setValue] = useState();
  const [show, setShow] = useState(false);
  const { updateExpenses } = props;

  const getRecentExpenses = useCallback(() => {
    DashboardService.getExpenses(props.user.auth_token).then((result) => {
      if (result) updateExpenses({ recent: result.expenses });
      setIsLoaded(true);
    });
  }, [props.user.auth_token, updateExpenses]);

  useEffect(() => {
    getRecentExpenses();
  }, [getRecentExpenses]);

  const openModal = () => {
    setShow(true);
  };

  const handleEdit = (expense) => {
    setValue(expense);
    setShow(true);
  };

  const handleDelete = (expense) => {
    ExpenseService.destroy(expense.id, props.user.auth_token).then(() => {
      getRecentExpenses();
    });
  };

  if (!isLoaded) return null;

  return (
    <>
      <Card className={classes.card}>
        <CardHeader
          title="Recent Expenses"
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
                  <TableCell className={classes.header}>Vendor</TableCell>
                  <TableCell className={classes.header}>Edit</TableCell>
                  <TableCell className={classes.header}>Delete</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {props.expenses.recent.map((expense) => (
                  <TableRow hover key={expense.id}>
                    <TableCell className={classes.cell}>
                      {dateStringShort(expense.date)}
                    </TableCell>
                    <TableCell className={classes.cell}>
                      {numberToCurrency.format(expense.amount)}
                    </TableCell>
                    <TableCell className={classes.cell}>
                      {expense.vendor}
                    </TableCell>
                    <TableCell className={classes.cell}>
                      <IconButton
                        onClick={() => handleEdit(expense)}
                        className={classes.editIcon}
                      >
                        <EditIcon />
                      </IconButton>
                    </TableCell>
                    <TableCell className={classes.cell}>
                      <IconButton
                        className={classes.deleteIcon}
                        onClick={() => handleDelete(expense)}
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
      <ExpenseDialog
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
    expenses: state.expenses,
  };
};

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      updateExpenses,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(RecentExpenses);
