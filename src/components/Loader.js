import React, { Component } from 'react';
import LoaderClass from 'react-loader-spinner';
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';

const loader = {
  position: 'relative',
  marginTop: '45vh',
  top: '50%',
  left: '50%',
};

class Loader extends Component {
  render() {
    return (
      <div style={loader}>
        <LoaderClass type="TailSpin" color="#00BFFF" height={100} width={100} />
      </div>
    );
  }
}

export default Loader;
