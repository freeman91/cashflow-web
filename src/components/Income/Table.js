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
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";

import IncomeDialog from "./Dialog";
import { numberToCurrency } from "../../helpers/currency";
import { dateStringShort } from "../../helpers/date-helper";
import IncomeService from "../../service/IncomeService";

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

const IncomeTable = (props) => {
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
    IncomeService.destroy(income.id, props.user.auth_token).then(() => {
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
                {props.incomes.map((income) => (
                  <TableRow hover key={income.id}>
                    <TableCell className={classes.cell}>
                      {dateStringShort(income.date)}
                    </TableCell>
                    <TableCell className={classes.cell}>
                      {numberToCurrency.format(income.amount)}
                    </TableCell>
                    <TableCell className={classes.cell}>
                      {income.source}
                    </TableCell>
                    <TableCell className={classes.cell}>
                      <IconButton
                        onClick={() => handleEdit(income)}
                        className={classes.editIcon}
                      >
                        <EditIcon />
                      </IconButton>
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
        update={props.update}
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

export default connect(mapStateToProps, null)(IncomeTable);
