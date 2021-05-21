import React, { useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
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
} from '@material-ui/core';
import { Pagination } from '@material-ui/lab';
import AddIcon from '@material-ui/icons/AddCircle';
import DeleteIcon from '@material-ui/icons/Delete';

import AssetSourceDialog from './Dialog';
import AssetSourceService from '../../service/AssetSourceService';
import { showErrorSnackbar, showSuccessSnackbar } from '../../store';
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
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
}));

const AssetSourceTable = ({
  user,
  title,
  update,
  assetSources,
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

  const handleEdit = (expense) => {
    setValue(expense);
    setShow(true);
  };

  const handleDelete = (assetSource) => {
    AssetSourceService.destroy(assetSource.id, user.auth_token)
      .then(() => {
        showSuccessSnackbar('Source deleted');
        update();
      })
      .catch(() => {
        showErrorSnackbar('Error: Source was not deleted');
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
        <Box minWidth={200}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell className={classes.header}>name</TableCell>
                <TableCell className={classes.header}>delete</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {assetSources.map((assetSource, idx) => {
                // if the assetSource is in the range of the page
                if (
                  idx < (page - 1) * ROWS_PER_PAGE ||
                  idx > (page - 1) * ROWS_PER_PAGE + ROWS_PER_PAGE - 1
                )
                  return null;
                else
                  return (
                    <TableRow
                      hover
                      key={assetSource.id}
                      onDoubleClick={() => handleEdit(assetSource)}
                    >
                      <TableCell className={classes.cell}>
                        {assetSource.name}
                      </TableCell>
                      <TableCell className={classes.cell}>
                        <IconButton
                          className={classes.deleteIcon}
                          onClick={() => handleDelete(assetSource)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
              })}
            </TableBody>
          </Table>
          {assetSources.length > ROWS_PER_PAGE ? (
            <Pagination
              count={Math.ceil(assetSources.length / 8)}
              page={page}
              onChange={handleChangePage}
              className={classes.pagination}
              shape="rounded"
            />
          ) : null}
        </Box>
      </Card>
      <AssetSourceDialog
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
    assetSources: state.assetSources.list,
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

export default connect(mapStateToProps, mapDispatchToProps)(AssetSourceTable);
