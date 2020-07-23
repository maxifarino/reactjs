import React from 'react';

import SidePicture from '../common/SidePicture';
import ForgotForm from './ForgotForm';

class Forgot extends React.Component {
  render() {
    return (
      <div className="container-fluid forgot">
        <div className="row">
          <SidePicture />
          <ForgotForm />
        </div>
      </div>
    );
  };
}

export default Forgot;