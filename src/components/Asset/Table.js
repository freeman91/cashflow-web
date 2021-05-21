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

import AssetDialog from './Dialog';
import { numberToCurrency } from '../../helpers/currency';
import { dateStringShort } from '../../helpers/date-helper';
import AssetService from '../../service/AssetService';
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

const AssetTable = ({
  user,
  title,
  update,
  assets,
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

  const handleEdit = (asset) => {
    setValue(asset);
    setShow(true);
  };

  const handleDelete = (asset) => {
    AssetService.destroy(asset.id, user.auth_token)
      .then(() => {
        showSuccessSnackbar('Asset deleted');
        update();
      })
      .catch(() => {
        showErrorSnackbar('Error: Asset was not deleted');
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
        <Box minWidth={300}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell className={classes.header}>date</TableCell>
                <TableCell className={classes.header}>amount</TableCell>
                <TableCell className={classes.header}>source</TableCell>
                <TableCell className={classes.header}>delete</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {assets.map((asset, idx) => {
                // if the asset is in the range of the page
                if (
                  idx < (page - 1) * ROWS_PER_PAGE ||
                  idx > (page - 1) * ROWS_PER_PAGE + ROWS_PER_PAGE - 1
                )
                  return null;
                else
                  return (
                    <TableRow
                      onDoubleClick={() => handleEdit(asset)}
                      hover
                      key={asset.id}
                    >
                      <TableCell className={classes.cell}>
                        {dateStringShort(asset.date)}
                      </TableCell>
                      <TableCell className={classes.cell}>
                        {numberToCurrency.format(asset.amount)}
                      </TableCell>
                      <TableCell className={classes.cell}>
                        {asset.source}
                      </TableCell>
                      <TableCell className={classes.cell}>
                        <IconButton
                          className={classes.deleteIcon}
                          onClick={() => handleDelete(asset)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
              })}
            </TableBody>
          </Table>
          {assets.length > ROWS_PER_PAGE ? (
            <Pagination
              count={Math.ceil(assets.length / 8)}
              page={page}
              onChange={handleChangePage}
              className={classes.pagination}
              shape="rounded"
            />
          ) : null}
        </Box>
      </Card>
      <AssetDialog
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
    assets: state.assets.list,
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

export default connect(mapStateToProps, mapDispatchToProps)(AssetTable);
