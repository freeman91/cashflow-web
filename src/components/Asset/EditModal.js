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
import Asset from '../../service/AssetService';

const defaultState = {
  open: false,
  value: {
    amount: null,
    source: '',
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
          source: value.group,
          description: value.description,
          date: value.date,
        },
      });
      this.getSources();
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

  async getSources() {
    Asset.getSources(this.props.user.auth_token).then((result) => {
      this.setState({
        value: {
          ...this.state.value,
          source: result.sources[0],
        },
        sources: result.sources,
        isLoaded: true,
      });
    });
  }

  handleDelete = () => {
    Asset._delete(this.state.value.id, this.props.user.auth_token).then(
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

    if (isNaN(amount) || value.source === '') {
      console.error('[ERROR]: Invalid data in input field');
    } else {
      Asset.update(
        {
          id: value.id,
          amount: Number(amount),
          source: value.source,
          description: value.description,
          date: value.date,
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
    const { sources, isLoaded, value } = this.state;
    if (!isLoaded) return null;
    return (
      <Modal isOpen={open} toggle={handleClose} modalClassName="modal-info">
        <ModalHeader>Edit Asset</ModalHeader>
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

export default EditModal;
