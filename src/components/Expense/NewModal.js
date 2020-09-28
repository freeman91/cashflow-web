import React, { Component } from 'react';

// reactstrap components
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

import { numberToCurrency_ } from '../../helpers/currency';
import { dateToString } from '../../helpers/date-helper';
import Expense from '../../service/ExpenseService';

const inputTextPrepend = { lineHeight: '1.9', height: '100%' };

const defaultState = {
  open: false,
  value: {
    amount: null,
    group: '',
    vendor: '',
    bill: false,
    description: '',
    date: new Date(),
  },
};

class NewModal extends Component {
  state = { ...defaultState };

  componentWillReceiveProps() {
    this.getExpenseGroups();
  }

  handleChange = (event) => {
    this.setState({
      value: {
        ...this.state.value,
        [event.target.id]: event.target.value,
      },
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

  handleDateChange = (date) => {
    this.setState({
      value: { ...this.state.value, date: date },
    });
  };

  async getExpenseGroups() {
    Expense.getGroups(this.props.user.auth_token).then((result) => {
      this.setState({
        groups: result.expense_groups,
        isLoaded: true,
        value: {
          ...this.state.value,
          group: result.expense_groups[0],
        },
      });
    });
  }

  handleSubmit = () => {
    const { value } = this.state;
    const { user, getData, handleClose } = this.props;
    if (isNaN(value.amount) || value.group === '') {
      console.error('[ERROR]: Invalid data in input field');
    } else {
      Expense.create(
        {
          amount: Number(value.amount),
          group: value.group,
          vendor: value.vendor,
          description: value.description,
          bill: value.bill,
          date: dateToString(value.date),
        },
        user.auth_token
      ).then((result) => {
        if (result.status === 201) {
          this.setState({ ...defaultState });
          getData('expense');
          handleClose();
        }
      });
    }
  };

  render() {
    const { open, handleClose } = this.props;
    const { groups, isLoaded, value } = this.state;
    if (!isLoaded) return null;

    return (
      <Modal isOpen={open} toggle={handleClose} modalClassName='modal-info'>
        <ModalHeader>New Expense</ModalHeader>
        <ModalBody>
          <InputGroup>
            <InputGroupAddon addonType='prepend'>$</InputGroupAddon>
            <Input
              type='float'
              name='amount'
              id='amount'
              placeholder={numberToCurrency_.format(0)}
              onChange={this.handleChange}
              style={inputTextPrepend}
            />
          </InputGroup>
          <InputGroup>
            <InputGroupAddon addonType='prepend'> </InputGroupAddon>
            <Input
              type='select'
              name='group'
              id='group'
              placeholder='group select'
              onChange={this.handleChange}
            >
              {groups.map((group) => {
                return <option key={group}>{group}</option>;
              })}
            </Input>
          </InputGroup>
          <InputGroup>
            <InputGroupAddon addonType='prepend'> </InputGroupAddon>
            <Input
              type='text'
              name='vendor'
              id='vendor'
              placeholder='vendor'
              onChange={this.handleChange}
            />
          </InputGroup>
          <InputGroup>
            <InputGroupAddon addonType='prepend'> </InputGroupAddon>
            <Input
              type='text'
              name='description'
              id='description'
              placeholder='description'
              onChange={this.handleChange}
            />
          </InputGroup>
          <InputGroup>
            <InputGroupAddon addonType='prepend'> </InputGroupAddon>
            <Input
              type='date'
              name='date'
              id='date'
              defaultValue={dateToString(new Date())}
              onChange={this.handleChange}
            />
          </InputGroup>
          <InputGroup>
            <InputGroupAddon addonType='prepend'>
              <InputGroupText>
                <Input
                  addon
                  type='checkbox'
                  id='bill'
                  onChange={this.handleCheckbox}
                  checked={value.bill}
                />
              </InputGroupText>
            </InputGroupAddon>
            <Input placeholder='Bill?' disabled />
          </InputGroup>
          <InputGroup>
            <Button onClick={handleClose} color='default'>
              Cancel
            </Button>
            <Button onClick={this.handleSubmit} color='primary'>
              Submit
            </Button>
          </InputGroup>
        </ModalBody>
      </Modal>
    );
  }
}

export default NewModal;
