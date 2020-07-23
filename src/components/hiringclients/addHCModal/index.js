import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import CompanyInfoTab from './companyInfoTab';
import ContactTab from './contactTab';

import * as hcActions from '../actions';
import * as commonActions from '../../common/actions';

class AddHCModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      step: 1
    };

    props.actions.fetchParentsHC(false);
    props.actions.fetchUsersByType(); // brings HC-Users by default
    props.actions.fetchUsersByType('operator');
    props.commonActions.fetchTimezones();
  };

  send = () => {
    const serializedHcObj = this.props.hc.serializedHcObj;
    if (this.props.profile) {
      serializedHcObj.companyInfo.hiringClientId = this.props.profile.id;
      this.props.actions.sendUpdateHC(serializedHcObj, this.props.close);
    } else {
      this.props.actions.sendNewHC(serializedHcObj, this.props.close);
    }

  };

  setStep2 = () => {
    if (this.props.profile) {
      this.send();
    } else {
      this.setState({
        step: 2
      });
    }
  };

  render() {
    const {
      title
    } = this.props.local.strings.hiringClients.addHCModal;

    return (
      <div className="newhc-form wiz-wrapper">
        <header>
          <h2 className="modal-wiz-title">
            {title}
          </h2>
          <ul className="step-icons">
            <li>
              <span className={`step-icon-bubble ${this.state.step === 1 ? 'active' : ''}`}>
                <span className={`step-icon icon-company`}></span>
              </span>
            </li>

            {
               !this.props.profile &&
              <li>
                <span className={`step-icon-bubble ${this.state.step === 2 ? 'active' : ''}`}>
                  <span className={`step-icon icon-personal_info`}></span>
                </span>
              </li>
            }

          </ul>
        </header>
        <div className="steps-bodies add-item-view">
          <div className={`step-body add-item-form-subsection step-1 ${this.state.step === 1 ? 'active' : ''}`}>
            <CompanyInfoTab close={this.props.close} continueHandler={this.setStep2} profile={this.props.profile}/>
          </div>
          <div className={`step-body add-item-form-subsection step-2 ${this.state.step === 2 ? 'active' : ''}`}>
            <ContactTab close={this.props.close} continueHandler={this.send} profile={this.props.profile}/>
          </div>
        </div>
      </div>
    );
  }
};

const mapStateToProps = (state, ownProps) => {
  return {
    local: state.localization,
    hc: state.hc
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(hcActions, dispatch),
    commonActions: bindActionCreators(commonActions, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddHCModal);
