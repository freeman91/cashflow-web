import React, { Component } from 'react';
import { isEqual } from 'lodash';

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

import WorkHour from '../service/WorkHourService';
import Income from '../service/IncomeService';
import formatter_no$ from '../helpers/currency_no$';
import formatDate from '../helpers/date';

const defaultState = {
  open: false,
  value: {
    amount: null,
    source: '',
    date: new Date(),
  },
};

class WorkHourModalgNew extends Component {
  state = { ...defaultState };

  componentWillReceiveProps(newProps) {
    const { user, history } = newProps;
    if (user) {
      if (isEqual(user, {})) {
        history.push('/');
      } else {
        this.getIncomeSources();
      }
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

  async getIncomeSources() {
    Income.getSources(this.props.user.auth_token).then((result) => {
      this.setState({
        sources: result.income_sources,
        isLoaded: true,
      });
    });
  }

  handleSubmit = () => {
    const { user, get_data, handleClose } = this.props;
    if (isNaN(this.state.value.amount) || this.state.value.source === '') {
      console.error('[ERROR]: Invalid data in input field');
    } else {
      WorkHour.create(
        {
          amount: Number(this.state.value.amount),
          source: this.state.value.source,
          date: this.state.value.date,
        },
        user.auth_token
      ).then((result) => {
        if (result.status === 201) {
          this.setState({
            ...defaultState,
          });
          get_data('workHour');
          handleClose();
        }
      });
    }
  };

  render() {
    const { open, handleClose } = this.props;
    const { sources, isLoaded } = this.state;
    if (!isLoaded) return null;
    return (
      <Modal isOpen={open} toggle={handleClose} modalClassName="modal-info">
        <ModalHeader>New Income</ModalHeader>
        <ModalBody>
          <InputGroup>
            <InputGroupAddon addonType="prepend"> </InputGroupAddon>
            <Input
              type="float"
              name="amount"
              id="amount"
              placeholder={formatter_no$.format(0)}
              onChange={this.handleChange}
            />
          </InputGroup>
          <InputGroup>
            <InputGroupAddon addonType="prepend"> </InputGroupAddon>
            <Input
              type="select"
              name="source"
              id="source"
              placeholder="source select"
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
              type="date"
              name="date"
              id="date"
              defaultValue={formatDate.dateToString(new Date())}
              onChange={this.handleChange}
            />
          </InputGroup>
          <InputGroup>
            <Button onClick={handleClose} color="default">
              Cancel
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

export default WorkHourModalgNew;
