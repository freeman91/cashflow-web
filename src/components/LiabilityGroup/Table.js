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

import LiabilityGroupDialog from "./Dialog";
import LiabilityGroupService from "../../service/LiabilityGroupService";
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

const LiabilityGroupTable = (props) => {
  const classes = useStyles();
  const [value, setValue] = useState();
  const [show, setShow] = useState(false);
  const { showSuccessSnackbar, showErrorSnackbar } = props;

  const openModal = () => {
    setShow(true);
  };

  const handleEdit = (expense) => {
    setValue(expense);
    setShow(true);
  };

  const handleDelete = (liabilityGroup) => {
    LiabilityGroupService.destroy(liabilityGroup.id, props.user.auth_token)
      .then(() => {
        showSuccessSnackbar("Group deleted");
        props.update();
      })
      .catch(() => {
        showErrorSnackbar("Error: Group was not deleted");
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
          <Box minWidth={200}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell className={classes.header}>name</TableCell>
                  <TableCell className={classes.header}>delete</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {props.liabilityGroups.map((liabilityGroup) => (
                  <TableRow
                    hover
                    key={liabilityGroup.id}
                    onDoubleClick={() => handleEdit(liabilityGroup)}
                  >
                    <TableCell className={classes.cell}>
                      {liabilityGroup.name}
                    </TableCell>
                    <TableCell className={classes.cell}>
                      <IconButton
                        className={classes.deleteIcon}
                        onClick={() => handleDelete(liabilityGroup)}
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
      <LiabilityGroupDialog
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
    liabilityGroups: state.liabilityGroups.list,
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LiabilityGroupTable);
