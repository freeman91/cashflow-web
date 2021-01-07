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
import PerfectScrollbar from "react-perfect-scrollbar";
import AddIcon from "@material-ui/icons/AddCircle";
import DeleteIcon from "@material-ui/icons/Delete";

import ExpenseDialog from "./Dialog";
import { numberToCurrency } from "../../helpers/currency";
import { dateStringShort } from "../../helpers/date-helper";
import ExpenseService from "../../service/ExpenseService";
import { showErrorSnackbar, showSuccessSnackbar } from "../../store";

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

const ExpenseTable = ({
  user,
  title,
  update,
  expenses,
  showSuccessSnackbar,
  showErrorSnackbar,
}) => {
  const classes = useStyles();
  const [value, setValue] = useState();
  const [show, setShow] = useState(false);

  const openModal = () => {
    setShow(true);
  };

  const handleEdit = (expense) => {
    setValue(expense);
    setShow(true);
  };

  const handleDelete = (expense) => {
    ExpenseService.destroy(expense.id, user.auth_token)
      .then(() => {
        showSuccessSnackbar("Expense deleted");
        update();
      })
      .catch(() => {
        showErrorSnackbar("Error: Expense was not deleted");
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
                {expenses.map((expense) => (
                  <TableRow
                    onDoubleClick={() => handleEdit(expense)}
                    hover
                    key={expense.id}
                  >
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
        update={update}
      />
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    user: state.user,
    expenses: state.expenses.list,
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

export default connect(mapStateToProps, mapDispatchToProps)(ExpenseTable);
