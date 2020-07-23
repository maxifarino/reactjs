import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import HolderInfoTab from './holderInfoTab';

import * as holdersActions from '../../holders/actions';
import * as commonActions from '../../../common/actions';

import Utils from '../../../../lib/utils';

import '../addEntityModal.css';

class AddHolderModal extends React.Component {
  constructor(props) {
    super(props);

    //props.actions.fetchParentHolders();
    props.actions.fetchAccountManagers();
    if(props.common.countries.length <= 0){
      props.commonActions.fetchCountries();
    }
  };

  send = (values) => {
    let formattedPhone = values.contactPhone;
    if(formattedPhone){
      formattedPhone = Utils.normalizePhoneNumber(formattedPhone);
      /*if(formattedPhone.length === 10){
        formattedPhone = `+1${formattedPhone}`
      }*/
    }     

    const payload = {
      
      holderId: this.props.profile ? this.props.profile.id : undefined,
      holderName: values.holderName,
      parentHolderID: values.parentHolder ? values.parentHolder.value : null,
      address1: values.address1,
      address2: values.address2,
      city: values.city,
      state: values.state,
      postalCode: values.postalCode,
      country: values.country,
      department: values.department,
      phoneNumber: formattedPhone,
      accountManagerId: values.accountManager,
      portalURL: values.subdomain,
      contactName: values.contactName,
      contactPhone: formattedPhone,
      contactId: values.contactId ? values.contactId : undefined,
      intOfficeID: values.intOfficeID,
      contactEmail: values.contactEmail,
      initialFee: values.initialFee ? values.initialFee : undefined,
      initialCredits: values.initialCredits ? values.initialCredits : undefined,
      addlFee: values.addlFee ? values.addlFee : undefined,
      addlCredits: values.addlCredits ? values.addlCredits : undefined,
    };
    //console.log(payload);

    this.props.commonActions.setLoading(true);
    this.props.actions.postHolder (payload, (holder) => {
      this.props.commonActions.setLoading(false);
      if(holder){
        this.props.close(true);
      }
    });

  };

  hideModal = () => {
    const { onHide, close } = this.props;
    if(onHide)onHide();
    else close();
  }

  render() {
    const {
      title
    } = this.props.local.strings.holders.addHolderModal;

    return (
      <div className="new-entity-form wiz-wrapper">
        <header>
          <h2 className="modal-wiz-title">
            {title} 
          </h2>
        </header>

        <div className="steps-bodies add-item-view">
          <div className='step-body add-item-form-subsection active'>
            <HolderInfoTab
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

const mapStateToProps = (state, ownProps) => {
  return {
    local: state.localization,
    holders: state.holders,
    common: state.common
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(holdersActions, dispatch),
    commonActions: bindActionCreators(commonActions, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddHolderModal);
