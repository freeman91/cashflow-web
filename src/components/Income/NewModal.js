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
import Income from '../../service/IncomeService';

const defaultState = {
  open: false,
  value: {
    amount: null,
    source: '',
    description: '',
    date: new Date(),
  },
};

class NewModal extends Component {
  state = { ...defaultState };

  componentWillReceiveProps(newProps) {
    this.getIncomeSources();
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

  async getIncomeSources() {
    Income.getSources(this.props.user.auth_token).then((result) => {
      this.setState({
        sources: result.income_sources,
        isLoaded: true,
        value: {
          ...this.state.value,
          source: result.income_sources[0],
        },
      });
    });
  }

  handleSubmit = () => {
    const { value } = this.state;
    const { user, getData, handleClose } = this.props;
    if (isNaN(value.amount) || value.source === '') {
      console.error('[ERROR]: Invalid data in input field');
    } else {
      Income.create(
        {
          amount: Number(value.amount),
          source: value.source,
          description: value.description,
          date: dateToString(value.date),
        },
        user.auth_token
      ).then((result) => {
        if (result.status === 201) {
          this.setState({ ...defaultState });
          getData('income');
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
      <Modal isOpen={open} toggle={handleClose} modalClassName='modal-info'>
        <ModalHeader>New Income</ModalHeader>
        <ModalBody>
          <InputGroup>
            <InputGroupAddon
              addonType='prepend'
              className='input-text-transparent'
            >
              $
            </InputGroupAddon>
            <Input
              type='float'
              name='amount'
              id='amount'
              placeholder={numberToCurrency_.format(0)}
              onChange={this.handleChange}
              style={{ lineHeight: '1.9', height: '100%' }}
            />
          </InputGroup>
          <InputGroup>
            <InputGroupAddon addonType='prepend'> </InputGroupAddon>
            <Input
              type='select'
              name='source'
              id='source'
              placeholder='source select'
              onChange={this.handleChange}
            >
              {sources.map((source) => {
                return <option key={source}>{source}</option>;
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
              defaultValue={dateToString(new Date())}
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
