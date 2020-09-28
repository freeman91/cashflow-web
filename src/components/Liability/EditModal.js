import React, { Component } from 'react';

// reactstrap components
import {
  Button,
  Input,
  InputGroup,
  InputGroupAddon,
  Modal,
  ModalBody,
  ModalHeader,
} from 'reactstrap';

import { numberToCurrency_ } from '../../helpers/currency';
import { dateToString } from '../../helpers/date-helper';
import Liability from '../../service/LiabilityService';

const inputTextPrepend = { lineHeight: '1.9', height: '100%' };

const defaultState = {
  open: false,
  value: {
    amount: null,
    group: '',
    description: '',
    date: new Date(),
  },
};

class EditModal extends Component {
  state = { ...defaultState };

  componentWillReceiveProps(newProps) {
    const { open, value } = newProps;
    if (open) {
      this.setState({
        value: {
          id: value.id,
          amount: value.amount,
          group: value.group,
          description: value.description,
          date: value.date,
        },
      });
      this.getGroups();
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

  handleDateChange = (date) => {
    this.setState({
      value: { ...this.state.value, date: date },
    });
  };

  async getGroups() {
    Liability.getGroups(this.props.user.auth_token).then((result) => {
      this.setState({
        groups: result.groups,
        isLoaded: true,
      });
    });
  }

  handleDelete = () => {
    Liability.destroy(this.state.value.id, this.props.user.auth_token).then(
      (response) => {
        if (response.status === 202) {
          this.props.getData();
          this.props.handleClose();
        }
      }
    );
  };

  handleSubmit = () => {
    const amount =
      typeof this.state.value.amount === 'string'
        ? Number(this.state.value.amount.replace(',', ''))
        : Number(this.state.value.amount);

    const { value } = this.state;
    const { user, getData, handleClose } = this.props;
    if (isNaN(amount) || value.group === '') {
      console.error('[ERROR]: Invalid data in input field');
    } else {
      Liability.update(
        {
          id: value.id,
          amount: Number(amount),
          group: value.group,
          description: value.description,
          date: dateToString(value.date),
        },
        user.auth_token
      ).then((response) => {
        if (response.status === 202) {
          this.setState({ ...defaultState });
          getData();
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
        <ModalHeader>Edit Liability</ModalHeader>
        <ModalBody>
          <InputGroup>
            <InputGroupAddon addonType='prepend'>$</InputGroupAddon>
            <Input
              type='float'
              name='amount'
              id='amount'
              defaultValue={numberToCurrency_.format(value.amount)}
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
              defaultValue={value.group}
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
              name='description'
              id='description'
              defaultValue={value.description ? value.description : null}
              onChange={this.handleChange}
            />
          </InputGroup>
          <InputGroup>
            <InputGroupAddon addonType='prepend'> </InputGroupAddon>
            <Input
              type='date'
              name='date'
              id='date'
              defaultValue={value.date}
              onChange={this.handleChange}
            />
          </InputGroup>
          <InputGroup>
            <Button onClick={handleClose} color='default'>
              Cancel
            </Button>
            <Button onClick={this.handleDelete} color='warning'>
              Delete
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

export default EditModal;
