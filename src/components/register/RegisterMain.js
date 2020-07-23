import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as registerActions from './actions';
import CompanyProfileTab from './companyProfile';
import UserInformationTab from './userInformation';

class RegisterMain extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      step: 1
    };
  }

  setStep1 = (event) => {
    event.preventDefault();
    this.setState({
      step: 1
    });
  };

  setStep2 = (event) => {
    this.setState({
      step: 2
    });
  };

  render() {
    let {
      step1Title,
      step2Title,
      title,
      instruction,
      suggestion,
    } = this.props.local.strings.register.registerMain;

    return (
      <div className="col-sm-12 col-md-8 register-main">
        <div className="register-main-header">
          <h1 className="register-title">{title}</h1>
          <p className="register-instr">{instruction}</p>
          <p className="register-instr">{suggestion}</p>
        </div>
        <div className="tabs-frame">
          <ul className="nav nav-tabs">
            <li className="nav-item tab-wrapper">
              <a
                className={`step-nav ${this.state.step === 1 ? 'active' : ''}`}
                onClick={this.setStep1}
                >{step1Title}</a>
            </li>
            <li className="nav-item tab-wrapper">
              <a
                className={`step-nav ${this.state.step === 2 ? 'active' : ''}`}
                onClick={()=>{/*this.setStep2*/}}
                >{step2Title}</a>
            </li>
          </ul>

          <div className="tab-content">
            <div className={`tab-pane step1 ${this.state.step === 1 ? 'active' : ''}`}>
              <UserInformationTab continueHandler={this.setStep2}></UserInformationTab>
            </div>
            <div className={`tab-pane step2 ${this.state.step === 2 ? 'active' : ''}`}>
              <CompanyProfileTab />
            </div>
          </div>

        </div>
      </div>

    );
  };
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

export default connect(mapStateToProps, mapDispatchToProps)(RegisterMain);
