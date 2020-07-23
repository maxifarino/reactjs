import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';

import * as forgotActions from './actions';
import AuthFormHeader from '../common/AuthFormHeader';

class ForgotForm extends React.Component {
  constructor(props) {
    let forgotStrings = props.local.strings.auth.forgot;
    super(props);
    this.state = {
      username: '',
      usernameErrorMsg: forgotStrings.userNameRequired,
      usernameShowError: ''
    };
  }

  onUsernameChange = (event) => {
    let forgotStrings = this.props.local.strings.auth.forgot;
    const val = event.target.value;
    let newState = {};
    if(!val) {
      newState.usernameShowError = 'show-error';
      newState.usernameErrorMsg = forgotStrings.userNameRequired;
    }
    else {
      newState.usernameShowError = '';
      newState.usernameErrorMsg = '';
    }
    newState.username = val;
    this.setState(newState);
  }

  sendForgotForm = (event) => {
    let forgotStrings = this.props.local.strings.auth.forgot;
    event.preventDefault();
    if(this.state.username) {
      this.setState({
        usernameShowError: '',
        usernameErrorMsg: ''
      });
      this.props.actions.sendUser(this.state.username, this.props.history);
    }
    else {
      this.setState({
        usernameShowError: 'show-error',
        usernameErrorMsg: forgotStrings.userNameRequired
      });
    }  
  }

  render() {
    let forgotStrings = this.props.local.strings.auth.forgot;
    return (
      <div className="form-wrapper col-custom-padding col-md-4 col-sm-12">

        <AuthFormHeader subtitle={forgotStrings.subTitleHeader} />
        <form action="" className='auth-form forgot-form'>
          <div className="step-body">
            <div className="field-wrapper">
              <input 
                type="text" 
                name="username"
                placeholder={forgotStrings.placeholdUserName}
                onChange={this.onUsernameChange}
                value={this.state.username}
                onBlur={this.onUsernameChange}
              />
              <span className={`errorMessage ${this.state.usernameShowError || (this.props.forgot.errorUser ? 'show-error' : '')}`}>{this.state.usernameErrorMsg || this.props.forgot.errorUser}</span>  
            </div>
          </div>
          <div className="button-forgot-wrapper">
            <button onClick={this.sendForgotForm} className="bn-small bn bg-blue-gradient bn-forgot">{forgotStrings.sendButtonText}</button>  
          </div>
        </form>
        
      </div>
    );
  };
}

const mapStateToProps = (state, ownProps) => {
  return {
    forgot: state.forgot,
    local: state.localization
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(forgotActions, dispatch)
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ForgotForm));