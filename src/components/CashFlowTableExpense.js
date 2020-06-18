import React, { Component } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import {
  Card,
  Paper,
  TableContainer,
  Table,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  Typography,
  withStyles,
} from '@material-ui/core';

const styles = (theme) => ({
  card: {
    textAlign: 'center',
  },
  cardTitle: {
    margin: '10px',
    fontWeight: 'bold',
    textAlign: 'center',
    width: '50%',
    float: 'left',
  },
  createButton: {
    margin: '10px',
    marginRight: '25px',
    float: 'center',
  },
  dialog: {
    margin: theme.spacing(1),
  },
  th: {
    fontWeight: 'bold',
  },
});

class CashFlowTable extends Component {
  state = {
    open: false,
    value: { group: '', date: new Date() },
  };

  render() {
    // title = titel of table
    // headers = Array of tables headers
    // rows = Array of Arrays of data displayed in the table
    const { classes, title, headers, rows, dataTextSize } = this.props;

    return (
      <>
        <Card className={classes.card} variant="outlined">
          <TableContainer component={Paper}>
            {title ? (
              <Typography
                className={classes.cardTitle}
                variant="h5"
                gutterBottom
              >
                {title}
              </Typography>
            ) : null}
            <Table>
              {headers ? (
                <TableHead>
                  <TableRow>
                    {headers.map((header) => {
                      return (
                        <TableCell key={`${header}-header`}>
                          <Typography
                            className={classes.th}
                            variant="subtitle2"
                          >
                            {header}
                          </Typography>
                        </TableCell>
                      );
                    })}
                  </TableRow>
                </TableHead>
              ) : null}
              <TableBody>
                {rows.map((row, key1) => {
                  return (
                    <TableRow key={`${key1}-data`}>
                      {row.map((cell, key2, arr) => {
                        if (!Object.is(arr.length - 1, key2)) {
                          return (
                            <TableCell key={`${key1}-cell-${key2}`}>
                              <Typography variant={dataTextSize}>
                                {cell}
                              </Typography>
                            </TableCell>
                          );
                        } else {
                          return null;
                        }
                      })}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      </>
    );
  }
}

export default withStyles(styles)(CashFlowTable);
