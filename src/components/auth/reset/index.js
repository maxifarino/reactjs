import React from 'react';

import SidePicture from '../common/SidePicture';
import ResetForm from './ResetForm';

class Reset extends React.Component {
  render() {
    return (
      <div className="container-fluid forgot">
        <div className="row">
          <SidePicture />
          <ResetForm />
        </div>
      </div>
    );
  };
}

export default Reset;