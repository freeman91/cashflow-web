import React, { useState } from "react";
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
import AddIcon from "@material-ui/icons/AddCircle";
import DeleteIcon from "@material-ui/icons/Delete";

import ExpenseDialog from "./Dialog";
import { numberToCurrency } from "../../helpers/currency";
import { dateStringShort } from "../../helpers/date-helper";
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

const ExpenseTable = (props) => {
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
    ExpenseService.destroy(expense.id, props.user.auth_token).then(() => {
      props.update();
    });
  };

  return (
    <>
      <Card className={classes.card}>
        <CardHeader
          title={props.title}
          action={
            <IconButton color="primary" onClick={() => openModal()}>
              <AddIcon />
            </IconButton>
          }
        />
        <PerfectScrollbar>
          <Box minWidth={400}>
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
                {props.expenses.map((expense) => (
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
        update={props.update}
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

export default connect(mapStateToProps, null)(ExpenseTable);
