import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as registerActions from './actions';

class RegisterSecondary extends React.Component {
  render() {
    let {
      title,
      instruction,
      suggestion,
      submit
    } = this.props.local.strings.register.registerMain;

    return (
      <div className="col-sm-12 col-md-8 register-main">
        <div className="register-main-header">
          <h1 className="register-title">{title}</h1>
        </div>
        <div className="tabs-frame">
          Your account has been associated with an additional Hiring Client. You can switch between Hiring Clients by changing the Hiring Client dropdown value at the top of the screen.

          <div className="step-button">
            <button className="bn bg-blue-gradient" type="submit" onClick={this.submit.bind(this)}>{submit}</button>
          </div>
        </div>
      </div>

    );
  };

  submit() {
    const payload = {
      user: {
        userExists: true
      },
      subcontractor: {
        id: this.props.register.subcontractorId,
        hiringClientId: this.props.register.hiringClientId
      }
    }
    this.props.actions.sendExistsUserRegistration(payload);
  }
};

const mapStateToProps = (state, ownProps) => {
  return {
    register: state.register,
    local: state.localization
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(registerActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(RegisterSecondary);
