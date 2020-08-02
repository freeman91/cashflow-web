import React from 'react';
import Typed from 'react-typed';

const title = {
  color: 'white',
  fontSize: '100px',
  fontWeight: 'lighter',
};

const subtitle = {
  color: 'white',
  marginBottom: '2rem',
  fontSize: '40px',
  fontWeight: 'lighter',
};

const typedContainer = {
  position: 'absolute',
  top: '25%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '100vw',
  textAlign: 'center',
  zIndex: 1,
};

const Header = () => {
  return (
    <div style={typedContainer}>
      <div style={title}>
        <Typed strings={['cashflow']} typeSpeed={100} />
      </div>
      <div style={subtitle}>
        <Typed
          strings={[
            'take control of your financial life',
            'reduce risk',
            'make informed financial decisions',
            'increase confidence',
          ]}
          typeSpeed={40}
          backSpeed={60}
          loop
        />
      </div>
    </div>
  );
};

export default Header;
