import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import InsuredInfoTab from './insuredInfoTab';

import * as insuredActions from '../../insureds/actions';
import * as commonActions from '../../../common/actions';
import Utils from '../../../../lib/utils';
import '../addEntityModal.css';

class AddInsuredModal extends Component {
  constructor(props) {
    super(props);

    if(props.common.countries.length <= 0){
      props.commonActions.fetchCountries();
    }
  };

  send = (values) => {
    const serializedInsuredObj = { ...values };
    const { contactPhone } = serializedInsuredObj;

    let formattedPhone;
    if (contactPhone) {
      formattedPhone = Utils.normalizePhoneNumber(contactPhone);
      /*if(formattedPhone.length === 10){
        formattedPhone = `+1${formattedPhone}`
      }*/
    }
    serializedInsuredObj.contactPhone = formattedPhone;
    serializedInsuredObj.holderId = (values.holderId) ? values.holderId.value : undefined;
    
    if (this.props.profile) {
      serializedInsuredObj.insuredId = this.props.profile.Id;
      this.props.actions.sendInsureds(serializedInsuredObj, (success) => {
        if (success) {
          this.props.close(true);
        }
      });
    } else {
      this.props.actions.sendInsureds(serializedInsuredObj, (success) => {
        if (success) {
          this.props.close(true);
        }
      });
    }

  };

  hideModal = () => {
    const { onHide, close } = this.props;
    if (onHide) onHide();
    else close();
  }

  render() {
    const {
      title
    } = this.props.local.strings.insured.addInsuredModal;

    return (
      <div className="new-entity-form wiz-wrapper">
        <header>
          <h2 className="modal-wiz-title">
            {title}
          </h2>
        </header>

        <div className="steps-bodies add-item-view">
          <div className='step-body add-item-form-subsection active'>
            <InsuredInfoTab
              close={this.hideModal}
              continueHandler={this.send}
              profile={this.props.profile}
            />
          </div>
        </div>
      </div>
    );
  }
};

const mapStateToProps = (state) => {
  return {
    local: state.localization,
    common: state.common
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(insuredActions, dispatch),
    commonActions: bindActionCreators(commonActions, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddInsuredModal);
