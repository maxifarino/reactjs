import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as registerActions from './actions';
import * as loginActions from '../auth/login/actions';
import RegisterSidebar from './RegisterSidebar';
import RegisterMain from './RegisterMain';

import './register.css';

const Alerts = require ('../alerts');

class Register extends React.Component {
  constructor(props) {
    super(props);

    const { hash } = props.match.params;
    props.registerActions.fetchRegistrationResourcesByHash(hash, props.history);
  }

  componentWillReceiveProps (nextProps) {
    if(this.props.register.processingEndpoint && !nextProps.register.processingEndpoint){
      if(nextProps.register.registrationError) {
        Alerts.showInformationAlert(
          'Error',
          nextProps.register.registrationError,
          'Accept',
          false,
          ()=>{
            if(nextProps.register.redirectOnError){
              this.props.history.push('/login');
            }
          }
        );
      } else if(nextProps.register.registrationSuccess) {
        Alerts.showInformationAlert(
          'Success',
          nextProps.register.registrationSuccess,
          'Accept',
          false,
          ()=>{
            // login the user automtically after registration
            const credentials = {
              username: this.props.register.userPayload.email,
              password: this.props.register.userPayload.pass
            }
            this.props.loginActions.sendCredentials(credentials, this.props.history, '/profile');
            this.props.history.push('/login');
          }
        );
      }
    }
  }

  render() {
    const spinnerContainerStyle = {
      position:'fixed',
      top:'0',
      left:'0',
      backgroundColor:'#80808087',
      width:'100%',
      height:'100%',
    };
    const spinnerStyle = {
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    };

    return (
      <div className="container-fluid">
        <div className="row">
          <RegisterSidebar hcLogo={this.props.register.hcLogo}/>
          <RegisterMain />
        </div>
        {
          this.props.register.processingEndpoint?
            <div style={spinnerContainerStyle} >
              <div className="spinner-wrapper" style={spinnerStyle} >
                <div className="spinner"></div>
              </div>
            </div>:null
        }
      </div>
    );
  };
}

const mapStateToProps = (state, ownProps) => {
  return {
    register: state.register,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    registerActions: bindActionCreators(registerActions, dispatch),
    loginActions: bindActionCreators(loginActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Register);
