import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';

import * as resetActions from './actions';

import AuthFormHeader from '../common/AuthFormHeader';

class ResetForm extends React.Component {
  constructor(props) {
    let resetStrings = props.local.strings.auth.reset;
    if(props.login.profile.MustRenewPass !== 1) {
      props.history.push('/login');
    }
    super(props);
    this.state = {
      password: '',
      passwordAgain: '',
      passwordErrorMsg1: resetStrings.passwordRequired,
      passwordErrorMsg2: resetStrings.passwordRequired,
      passwordShowError1: '',
      passwordShowError2: ''
    };
  }

  onPasswordChange = (event) => {
    const val = event.target.value;
    let newState = {};
    if(!val) {
      newState.passwordShowError1 = 'show-error';
    }
    else {
      newState.passwordShowError1 = '';
    }
    newState.password = val;
    this.setState(newState);
  }

  onPasswordAgainChange = (event) => {
    const val = event.target.value;
    let newState = {};
    if(!val) {
      newState.passwordShowError2 = 'show-error';
    }
    else {
      newState.passwordShowError2 = '';
    }
    newState.passwordAgain = val;
    this.setState(newState);
  }

  sendResetForm = (event) => {
    let resetStrings = this.props.local.strings.auth.reset;
    event.preventDefault();
    let newState = {}, valid = true;

    if(!this.state.password) {
      newState.passwordShowError1 = 'show-error';
      valid = false;
    } 
    else {
      newState.passwordShowError1 = '';
    }

    if(!this.state.passwordAgain) {
      newState.passwordShowError2 = 'show-error';
      valid = false;
    } 
    else {
      newState.passwordShowError2 = '';
    }
    if(valid) {
      if(this.state.password === this.state.passwordAgain) {
        this.props.actions.sendResetData({
          newPassword: this.state.password, 
          oldPassword: this.props.login.password
        }, this.props.history);
      }
      else {
        newState.passwordErrorMsg2 = resetStrings.passwordBoth;
        newState.passwordShowError2 = 'show-error';
      }
    }
    this.setState(newState);
  }

  render() {
    let resetStrings = this.props.local.strings.auth.reset;
    return (
      <div className="form-wrapper col-custom-padding col-md-4 col-sm-12">

        <AuthFormHeader subtitle={resetStrings.subTitleHeader} />

        <form className='auth-form forgot-form'>
          <div className="step-body">
            <div className="field-wrapper">
              <input 
                type="password"
                name="password"
                placeholder={resetStrings.newPasswordPlaceholder}
                onChange={this.onPasswordChange}
                onBlur={this.onPasswordChange}
                value={this.state.password}
              />
              <span className={`errorMessage ${this.state.passwordShowError1}`}>{this.state.passwordErrorMsg1}</span>
            </div>
            <div className="field-wrapper">
              <input 
                type="password"
                name="retypepassword"
                placeholder={resetStrings.retypePasswordPlaceholder}
                onChange={this.onPasswordAgainChange}
                onBlur={this.onPasswordAgainChange}
                value={this.state.passwordAgain}
              />
              <span className={`errorMessage ${this.state.passwordShowError2}`}>{this.state.passwordErrorMsg2}</span>
            </div>
          </div>
          <div className="button-forgot-wrapper">
            <button className="bn-small send-form-recover bn bg-blue-gradient bn-forgot" onClick={this.sendResetForm}>Change Password</button>
            <span className="server-error-reset">{this.props.reset.errorReset}</span>
          </div>
        </form>
      </div>
    );
  };
}

const mapStateToProps = (state, ownProps) => {
  return {
    reset: state.reset,
    login: state.login,
    local: state.localization
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(resetActions, dispatch)
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ResetForm));