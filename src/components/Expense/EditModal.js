import React, { Component } from 'react';
import {
  Button,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Modal,
  ModalBody,
  ModalHeader,
} from 'reactstrap';

import formatter_no$ from '../../helpers/currency_no$';
import Expense from '../../service/ExpenseService';
import formatDate from '../../helpers/date';

const defaultValue = {
  open: false,
  value: {
    amount: null,
    group: '',
    description: '',
    bill: false,
    date: new Date(),
  },
  isLoaded: false,
};

class EditModal extends Component {
  state = { ...defaultValue };

  componentWillReceiveProps(newProps) {
    const { open, value } = newProps;
    if (open) {
      this.setState({
        value: {
          id: value.id,
          amount: value.amount,
          group: value.group,
          vendor: value.vendor,
          description: value.description,
          bill: value.bill,
          date: value.date,
        },
      });
      this.get_expense_groups();
    }
  }

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

  handleCheckbox = () => {
    this.setState({
      value: {
        ...this.state.value,
        bill: !this.state.value.bill,
      },
    });
  };

  async get_expense_groups() {
    Expense.getGroups(this.props.user.auth_token).then((result) => {
      this.setState({
        groups: result.expense_groups,
        isLoaded: true,
      });
    });
  }

  handleSubmit = () => {
    const amount =
      typeof this.state.value.amount === 'string'
        ? Number(this.state.value.amount.replace(',', ''))
        : Number(this.state.value.amount);
    const { value } = this.state;
    const { user, handleClose, get_expenses, get_data } = this.props;

    if (isNaN(value.amount) || value.group === '') {
      console.error('[ERROR]: Invalid data in input field');
    } else {
      Expense.edit(
        {
          id: value.id,
          amount,
          group: value.group,
          vendor: value.vendor,
          description: value.description,
          bill: value.bill,
          date: formatDate.stringToDate(value.date),
        },
        user.auth_token
      ).then(() => {
        this.setState({ ...defaultValue });
        get_data();
        if (get_expenses) get_expenses();
        handleClose();
      });
    }
  };

  handleDelete = () => {
    Expense.destroy(this.state.value.id, this.props.user.auth_token).then(
      () => {
        this.props.get_expenses();
        this.props.get_data();
        this.props.handleClose();
      }
    );
  };

  render() {
    const { open, handleClose } = this.props;
    const { groups, isLoaded, value } = this.state;
    if (!isLoaded) return null;
    return (
      <Modal isOpen={open} toggle={handleClose} modalClassName="modal-info">
        <ModalHeader>Edit Expense</ModalHeader>
        <ModalBody>
          <InputGroup>
            <InputGroupAddon addonType="prepend">$</InputGroupAddon>
            <Input
              type="float"
              name="amount"
              id="amount"
              defaultValue={formatter_no$.format(value.amount)}
              onChange={this.handleChange}
            />
          </InputGroup>
          <InputGroup>
            <InputGroupAddon addonType="prepend"> </InputGroupAddon>
            <Input
              type="select"
              name="group"
              id="group"
              defaultValue={value.group}
              onChange={this.handleChange}
            >
              {groups.map((group) => {
                return <option key={group}>{group}</option>;
              })}
            </Input>
          </InputGroup>
          <InputGroup>
            <InputGroupAddon addonType="prepend"> </InputGroupAddon>
            <Input
              type="text"
              name="vendor"
              id="vendor"
              placeholder="vendor"
              defaultValue={value.vendor ? value.vendor : null}
              onChange={this.handleChange}
            />
          </InputGroup>
          <InputGroup>
            <InputGroupAddon addonType="prepend"> </InputGroupAddon>
            <Input
              type="text"
              name="description"
              id="description"
              placeholder="description"
              defaultValue={value.description ? value.description : null}
              onChange={this.handleChange}
            />
          </InputGroup>
          <InputGroup>
            <InputGroupAddon addonType="prepend"> </InputGroupAddon>
            <Input
              type="date"
              name="date"
              id="date"
              defaultValue={value.date}
              onChange={this.handleChange}
            />
          </InputGroup>
          <InputGroup>
            <InputGroupAddon addonType="prepend">
              <InputGroupText>
                <Input
                  addon
                  type="checkbox"
                  id="bill"
                  onChange={this.handleCheckbox}
                  checked={value.bill}
                />
              </InputGroupText>
            </InputGroupAddon>
            <Input placeholder="Bill?" disabled />
          </InputGroup>
          <InputGroup>
            <Button onClick={handleClose} color="default">
              Cancel
            </Button>
            <Button onClick={this.handleDelete} color="warning">
              Delete
            </Button>
            <Button onClick={this.handleSubmit} color="primary">
              Submit
            </Button>
          </InputGroup>
        </ModalBody>
      </Modal>
    );
  }
}

export default EditModal;
