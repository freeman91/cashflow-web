import React, { Component } from "react";
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
} from "@material-ui/core";

const styles = (theme) => ({
  card: {
    textAlign: "center",
  },
  cardTitle: {
    margin: "10px",
    fontWeight: "bold",
  },
  th: {
    fontWeight: "bold",
  },
});

class CashFlowTable extends Component {
  render() {
    // title = titel of table
    // headers = Array of tables headers
    // rows = Array of Arrays of data displayed in the table
    const { classes, title, headers, rows, dataTextSize } = this.props;
    return (
      <Card className={classes.card} variant="outlined">
        <TableContainer component={Paper}>
          {title ? (
            <Typography className={classes.cardTitle} variant="h5" gutterBottom>
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
                        <Typography className={classes.th} variant="subtitle2">
                          {header}
                        </Typography>
                      </TableCell>
                    );
                  })}
                </TableRow>
              </TableHead>
            ) : null}
            <TableBody>
              {rows.map((row) => {
                return (
                  <TableRow key={`${row}-data`}>
                    {row.map((cell) => {
                      return (
                        <TableCell key={`${cell}-cell`}>
                          <Typography variant={dataTextSize}>{cell}</Typography>
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    );
  }
}

export default withStyles(styles)(CashFlowTable);
