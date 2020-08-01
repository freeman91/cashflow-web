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

import LiabilityGroup from '../../service/LiabilityGroupService';

const defaultState = {
  open: false,
  value: {
    name: '',
    description: '',
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
          name: value.name,
          description: value.description,
        },
        isLoaded: true,
      });
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

  handleDelete = () => {
    LiabilityGroup.destroy(
      this.state.value.id,
      this.props.user.auth_token
    ).then((response) => {
      if (response.status === 200) {
        this.props.getData();
        this.props.handleClose();
      }
    });
  };

  handleSubmit = () => {
    const { value } = this.state;
    const { user, getData, handleClose } = this.props;

    if (value.name === '') {
      console.error('[ERROR]: Invalid data in input field');
    } else {
      LiabilityGroup.update(
        {
          id: value.id,
          name: value.name,
          description: value.description,
        },
        user.auth_token
      ).then((response) => {
        if (response.status === 200) {
          this.setState({ ...defaultState });
          getData();
          handleClose();
        }
      });
    }
  };

  render() {
    const { open, handleClose } = this.props;
    const { isLoaded, value } = this.state;
    if (!isLoaded) return null;
    return (
      <Modal isOpen={open} toggle={handleClose} modalClassName="modal-info">
        <ModalHeader>Edit Liability Group</ModalHeader>
        <ModalBody>
          <InputGroup>
            <InputGroupAddon addonType="prepend"> </InputGroupAddon>
            <Input
              type="text"
              name="name"
              id="name"
              defaultValue={value.name}
              onChange={this.handleChange}
            />
          </InputGroup>
          <InputGroup>
            <InputGroupAddon addonType="prepend"> </InputGroupAddon>
            <Input
              type="text"
              name="description"
              id="description"
              placeholder={value.description ? null : 'description'}
              defaultValue={value.description ? value.description : null}
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
