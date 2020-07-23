import React from 'react';
import './login.css';

import SidePicture from '../common/SidePicture';
import LoginForm from './LoginForm';

class Login extends React.Component {
  render() {
    return (
      <div className="container-fluid login">
        <div className="row">
          <SidePicture />
          <LoginForm />
        </div>
      </div>
    );
  };
}

export default Login;