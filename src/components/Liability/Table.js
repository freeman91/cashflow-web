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

import LiabilityDialog from "./Dialog";
import { numberToCurrency } from "../../helpers/currency";
import { dateStringShort } from "../../helpers/date-helper";
import LiabilityService from "../../service/LiabilityService";

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

const LiabilityTable = (props) => {
  const classes = useStyles();
  const [value, setValue] = useState();
  const [show, setShow] = useState(false);

  const openModal = () => {
    setShow(true);
  };

  const handleEdit = (liability) => {
    setValue(liability);
    setShow(true);
  };

  const handleDelete = (liability) => {
    LiabilityService.destroy(liability.id, props.user.auth_token).then(() => {
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
                  <TableCell className={classes.header}>date</TableCell>
                  <TableCell className={classes.header}>amount</TableCell>
                  <TableCell className={classes.header}>group</TableCell>
                  <TableCell className={classes.header}>edit</TableCell>
                  <TableCell className={classes.header}>delete</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {props.liabilities.map((liability) => (
                  <TableRow hover key={liability.id}>
                    <TableCell className={classes.cell}>
                      {dateStringShort(liability.date)}
                    </TableCell>
                    <TableCell className={classes.cell}>
                      {numberToCurrency.format(liability.amount)}
                    </TableCell>
                    <TableCell className={classes.cell}>
                      {liability.group}
                    </TableCell>
                    <TableCell className={classes.cell}>
                      <IconButton
                        onClick={() => handleEdit(liability)}
                        className={classes.editIcon}
                      >
                        <EditIcon />
                      </IconButton>
                    </TableCell>
                    <TableCell className={classes.cell}>
                      <IconButton
                        className={classes.deleteIcon}
                        onClick={() => handleDelete(liability)}
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
      <LiabilityDialog
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
    liabilities: state.liabilities.list,
  };
};

export default connect(mapStateToProps, null)(LiabilityTable);
