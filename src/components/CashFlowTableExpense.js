import React, { Component } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  Button,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Input,
  MenuItem,
  Paper,
  TableContainer,
  Table,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  TextField,
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
    textAlign: "center",
    width: "50%",
    float: "left",
  },
  createButton: {
    margin: "10px",
    marginRight: "25px",
    float: "center",
  },
  dialog: {
    margin: theme.spacing(1),
  },
  th: {
    fontWeight: "bold",
  },
});

class CashFlowTable extends Component {
  state = {
    open: false,
    value: { group: "", date: new Date() },
  };

  handleCreateClick = () => {
    this.setState({
      open: true,
    });
  };

  handleClose = () => {
    this.setState({
      open: false,
      value: {
        amount: null,
        descrption: "",
        group: "",
        date: new Date(),
      },
    });
  };

  handleSubmit = () => {
    if (isNaN(this.state.value.amount) || this.state.value.group === "") {
      console.error("[ERROR]: Invalid data in input field");
    } else {
      this.props.createExpense(
        Number(this.state.value.amount),
        this.state.value.group,
        this.state.value.company,
        this.state.value.description,
        this.state.value.date
      );
      this.setState({
        open: false,
        value: {
          amount: null,
          group: "",
          description: "",
          date: new Date(),
        },
      });
    }
  };

  handleChange = (event) => {
    this.setState({
      value: {
        ...this.state.value,
        [event.target.id]: event.target.value,
      },
    });
  };

  handleGroupSelect = (event) => {
    this.setState({
      value: {
        ...this.state.value,
        group: event.target.value,
      },
    });
  };

  handleDateChange = (date) => {
    this.setState({
      value: { ...this.state.value, date: date },
    });
  };

  render() {
    // title = titel of table
    // headers = Array of tables headers
    // rows = Array of Arrays of data displayed in the table
    const {
      classes,
      title,
      headers,
      rows,
      dataTextSize,
      groups,
      create,
    } = this.props;

    const { open } = this.state;
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
            <Button
              className={classes.createButton}
              variant="contained"
              color="primary"
              onClick={this.handleCreateClick}
            >
              Create
            </Button>
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
                        {
                          if (!Object.is(arr.length - 1, key2)) {
                            return (
                              <TableCell key={`${key1}-cell-${key2}`}>
                                <Typography variant={dataTextSize}>
                                  {cell}
                                </Typography>
                              </TableCell>
                            );
                          }
                        }
                      })}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
        <Dialog
          onClose={this.handleClose}
          aria-labelledby="expense-dialog"
          open={open}
        >
          <DialogTitle id="expense-dialog-title">
            Create New Expense
          </DialogTitle>
          <DialogContent>
            <form className={classes.form}>
              <Input
                id="amount"
                placeholder="amount"
                inputProps={{ "aria-label": "amount" }}
                onChange={this.handleChange}
                fullWidth
                className={classes.dialog}
              />
              <TextField
                id="group"
                select
                label="category"
                value={this.state.value.group}
                onChange={this.handleGroupSelect}
                fullWidth
                className={classes.dialog}
              >
                {groups.sort().map((group) => (
                  <MenuItem key={group.name} value={group.name}>
                    {group.name}
                  </MenuItem>
                ))}
              </TextField>
              <Input
                id="company"
                placeholder="company"
                inputProps={{ "aria-label": "company" }}
                onChange={this.handleChange}
                fullWidth
                className={classes.dialog}
              />
              <Input
                id="description"
                placeholder="description"
                inputProps={{ "aria-label": "description" }}
                onChange={this.handleChange}
                fullWidth
                className={classes.dialog}
              />
              <DatePicker
                id="date"
                className={classes.dialog}
                placeholderText="date"
                selected={this.state.value.date}
                onChange={this.handleDateChange}
                showWeekNumbers
              />
            </form>
            <DialogActions>
              <Button onClick={this.handleClose} color="primary">
                Cancel
              </Button>
              <Button onClick={this.handleSubmit} color="primary">
                Submit
              </Button>
            </DialogActions>
          </DialogContent>
        </Dialog>
      </>
    );
  }
}

export default withStyles(styles)(CashFlowTable);
