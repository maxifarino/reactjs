import React from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';

import * as loginActions from './actions';
import AuthFormHeader from '../common/AuthFormHeader';

class LoginForm extends React.Component {
  constructor(props) {
    let loginStrings = props.local.strings.auth.login;
    super(props);
    this.props.actions.setErrorCredentials('');

    let location = {from: {pathname: '/profile'}};
    if (props.location.state) {
      if(props.location.state.from.pathname !== "/"){
        location = props.location.state;
      }
    }

    this.state = {
      username: props.login.username,
      password: props.login.password,
      remember: props.login.remember,
      usernameErrorMsg: loginStrings.userNameRequired,
      passwordErrorMsg: loginStrings.passwordRequired,
      usernameShowError: '',
      passwordShowError: '',
      location
    };
  }

  onUsernameChange = (event) => {
    const val = event.target.value;
    let newState = {};
    if(!val) {
      newState.usernameShowError = 'show-error';
    }
    else {
      newState.usernameShowError = '';
    }
    newState.username = val;
    this.setState(newState);
  }

  onPasswordChange = (event) => {
    const val = event.target.value;
    let newState = {};
    if(!val) {
      newState.passwordShowError = 'show-error';
    }
    else {
      newState.passwordShowError = '';
    }
    newState.password = val;
    this.setState(newState);
  }

  onRememberChange = (event) => {
    this.setState({
      remember: !this.state.remember
    });
  }

  onClickSignin = (event) => {
    event.preventDefault();
    let newState = {}, valid = true;
    if(!this.state.username) {
      newState.usernameShowError = 'show-error';
      valid = false;
    }
    else {
      newState.usernameShowError = '';
    }

    if(!this.state.password) {
      newState.passwordShowError = 'show-error';
      valid = false;
    }
    else {
      newState.passwordShowError = '';
    }

    this.setState(newState);

    if(valid) {
      const {username, password, remember} = this.state;
      const creds = {
        username,
        password,
        remember
      };
      this.props.actions.sendCredentials(creds, this.props.history, this.state.location.from);
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
    
    let loginStrings = this.props.local.strings.auth.login;
    return (
      <div className="form-wrapper col-custom-padding col-md-4 col-sm-12">

        <AuthFormHeader subtitle={this.props.login.extraMessage || ''}/>

        <form action="" className="auth-form login-form">
          <div className="field-wrapper user">
            <input
              type="text"
              name="username"
              placeholder={loginStrings.userPlaceholder}
              onChange={this.onUsernameChange}
              value={this.state.username}
            />
            <span className={`errorMessage ${this.state.usernameShowError}`}>{this.state.usernameErrorMsg}</span>
          </div>

          <div className="field-wrapper">
            <input
              type="password"
              name="password"
              placeholder={loginStrings.passwordPlaceholder}
              onChange={this.onPasswordChange}
              value={this.state.password}
            />
            <span className={`errorMessage ${this.state.passwordShowError}`}>{this.state.passwordErrorMsg}</span>
          </div>

          <div className="field-wrapper">
            <label htmlFor="remember-me">
              <input
                name="remember-me"
                id="remember-me"
                className="remember-me pretty-checkbox"
                type="checkbox"
                value={this.state.remember}
                onChange={this.onRememberChange}
              />
              <span className="check"></span>
              <span className="label">{loginStrings.rememberMe}</span>
            </label>
            <span className={`errorMessage ${this.props.login.errorCredentials ? 'show-error': ''}`}>
              {this.props.login.errorCredentials}
            </span>
          </div>

          <div className="form-buttons">
            <button
              className="sign-in-icon bn icon-login-door"
              onClick={this.onClickSignin}
            >{loginStrings.signIn}</button>

            <span className="link-forgot-wrapper"><Link to="forgot">{loginStrings.recoverPasswordLink}</Link></span>            
          </div>
          <br/>
					<div className="form-buttons position-privacy-link">
          	<a href="http://www.vertikalrms.com/privacy-policy" target="_new">{loginStrings.privacyPolicy}</a>
					</div>
        </form>

        {
          this.props.login.loginProcessing?
            <div style={spinnerContainerStyle} >
              <div className="spinner-wrapper" style={spinnerStyle} >
                <div className="spinner"></div>
              </div>
            </div>
            :
            null
        }
      </div>
    );
  };
}

const mapStateToProps = (state, ownProps) => {
  return {
    login: state.login,
    local: state.localization
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(loginActions, dispatch)
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(LoginForm));
