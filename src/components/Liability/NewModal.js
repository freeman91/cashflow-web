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

import formatter_no$ from '../../helpers/currency_no$';
import formatDateObject from '../../helpers/format-date-object';
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

class NewModal extends Component {
  state = { ...defaultState };

  componentWillReceiveProps(newProps) {
    this.getGroups();
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
        value: {
          ...this.state.value,
          group: result.groups[0],
        },
        groups: result.groups,
        isLoaded: true,
      });
    });
  }

  handleSubmit = () => {
    const { value } = this.state;
    const { user, getData, handleClose } = this.props;
    if (isNaN(value.amount) || value.group === '') {
      console.error('[ERROR]: Invalid data in input field');
    } else {
      Liability.create(
        {
          amount: Number(value.amount),
          group: value.group,
          description: value.description,
          date: formatDateObject(value.date),
        },
        user.auth_token
      ).then((result) => {
        if (result.status === 201) {
          this.setState({ ...defaultState });
          getData();
          handleClose();
        }
      });
    }
  };

  render() {
    const { open, handleClose } = this.props;
    const { groups, isLoaded } = this.state;
    if (!isLoaded) return null;
    return (
      <Modal isOpen={open} toggle={handleClose} modalClassName='modal-info'>
        <ModalHeader>New Liability</ModalHeader>
        <ModalBody>
          <InputGroup>
            <InputGroupAddon addonType='prepend'>$</InputGroupAddon>
            <Input
              type='float'
              name='amount'
              id='amount'
              placeholder={formatter_no$.format(0)}
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
              defaultValue={groups[0]}
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
              defaultValue={formatDateObject(new Date())}
              onChange={this.handleChange}
            />
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
