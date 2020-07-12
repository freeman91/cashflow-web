import React, { Component } from 'react';
import formatter_no$ from '../helpers/currency_no$';
import {
  Button,
  Input,
  InputGroup,
  InputGroupAddon,
  Modal,
  ModalBody,
  ModalHeader,
} from 'reactstrap';

import Income from '../service/IncomeService';
import formatDate from '../helpers/date';

const defaultValue = {
  amount: null,
  source: '',
  description: '',
  date: new Date(),
};

class IncomeModalEdit extends Component {
  state = {
    ...defaultValue,
  };

  componentWillReceiveProps(newProps) {
    const { open, value } = newProps;
    if (open) {
      this.setState({
        value: {
          id: value.id,
          amount: value.amount,
          source: value.source,
          description: value.description,
          date: value.date,
        },
      });
      this.get_income_sources();
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

  handleSourceSelect = (event) => {
    this.setState({
      value: {
        ...this.state.value,
        source: event.target.value,
      },
    });
  };

  handleDateChange = (date) => {
    this.setState({
      value: { ...this.state.value, date: date },
    });
  };

  async get_income_sources() {
    Income.getSources(this.props.user.auth_token).then((response) => {
      this.setState({
        sources: response.income_sources,
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
    const { user, handleClose, get_incomes, get_data } = this.props;

    if (isNaN(value.amount) || value.source === '') {
      console.error('[ERROR]: Invalid data in input field');
    } else {
      Income.edit(
        {
          id: value.id,
          amount,
          source: value.source,
          description: value.description,
          date: formatDate.stringToDate(value.date),
        },
        user.auth_token
      ).then((res) => {
        this.setState({
          open: false,
          value: {
            ...defaultValue,
          },
        });
        get_data();
        if (get_incomes) get_incomes();
        handleClose();
      });
    }
  };

  handleDelete = () => {
    Income._delete(this.state.value.id, this.props.user.auth_token).then(() => {
      this.props.get_incomes();
      this.props.get_data();
      this.props.handleClose();
    });
  };

  render() {
    const { open, handleClose } = this.props;
    const { sources, isLoaded, value } = this.state;
    if (!isLoaded) return null;

    return (
      <Modal isOpen={open} toggle={handleClose} modalClassName="modal-info">
        <ModalHeader>Edit Income</ModalHeader>
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
              name="source"
              id="source"
              defaultValue={value.source}
              onChange={this.handleChange}
            >
              {sources.map((source) => {
                return <option key={source}>{source}</option>;
              })}
            </Input>
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

export default IncomeModalEdit;