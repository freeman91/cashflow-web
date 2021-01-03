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

import { updateIncomes } from "../../store";
import IncomeDialog from "./Dialog";
import { numberToCurrency } from "../../helpers/currency";
import { dateStringShort } from "../../helpers/date-helper";
import DashboardService from "../../service/DashboardService";
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

const RecentIncomes = (props) => {
  const classes = useStyles();
  const [isLoaded, setIsLoaded] = useState(false);
  const [value, setValue] = useState();
  const [show, setShow] = useState(false);
  const { updateIncomes } = props;

  const getRecentIncomes = useCallback(() => {
    DashboardService.getIncomes(props.user.auth_token).then((result) => {
      if (result) updateIncomes({ recent: result.incomes });
      setIsLoaded(true);
    });
  }, [props.user.auth_token, updateIncomes]);

  useEffect(() => {
    getRecentIncomes();
  }, [getRecentIncomes]);

  const openModal = () => {
    setShow(true);
  };

  const handleEdit = (income) => {
    setValue(income);
    setShow(true);
  };

  const handleDelete = (income) => {
    IncomeService.destroy(income.id, props.user.auth_token).then(() => {
      getRecentIncomes();
    });
  };

  if (!isLoaded) return null;

  return (
    <>
      <Card className={classes.card}>
        <CardHeader
          title="Recent Incomes"
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
                {props.incomes.recent.map((income) => (
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
      />
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    user: state.user,
    incomes: state.incomes,
  };
};

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      updateIncomes,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(RecentIncomes);
