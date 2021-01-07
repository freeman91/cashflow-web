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

import IncomeDialog from "./Dialog";
import { numberToCurrency } from "../../helpers/currency";
import { dateStringShort } from "../../helpers/date-helper";
import IncomeService from "../../service/IncomeService";
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

const IncomeTable = ({
  user,
  title,
  update,
  incomes,
  showSuccessSnackbar,
  showErrorSnackbar,
}) => {
  const classes = useStyles();
  const [value, setValue] = useState();
  const [show, setShow] = useState(false);

  const openModal = () => {
    setShow(true);
  };

  const handleEdit = (income) => {
    setValue(income);
    setShow(true);
  };

  const handleDelete = (income) => {
    IncomeService.destroy(income.id, user.auth_token)
      .then(() => {
        showSuccessSnackbar("Income deleted");
        update();
      })
      .catch(() => {
        showErrorSnackbar("Error: Income was not deleted");
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
                {incomes.map((income) => (
                  <TableRow
                    onDoubleClick={() => handleEdit(income)}
                    hover
                    key={income.id}
                  >
                    <TableCell className={classes.cell}>
                      {dateStringShort(income.date)}
                    </TableCell>
                    <TableCell className={classes.cell}>
                      {numberToCurrency.format(income.amount)}
                    </TableCell>
                    <TableCell className={classes.cell}>
                      {income.source.substring(0, 6)}
                    </TableCell>
                    <TableCell className={classes.cell}>
                      <IconButton
                        className={classes.deleteIcon}
                        onClick={() => handleDelete(income)}
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
      <IncomeDialog
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
    incomes: state.incomes.list,
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

export default connect(mapStateToProps, mapDispatchToProps)(IncomeTable);
