import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import ContactInfoForm from './form';

import * as contactsActions from '../../contacts/actions';
import * as commonActions from '../../../common/actions';
import Utils from '../../../../lib/utils';
import '../addEntityModal.css';

class AddContactModal extends React.Component {

  send = (values) => {
    let formattedPhone = values.phone;
    let formattedMobile = values.mobile;
    if(formattedPhone){
      formattedPhone = Utils.normalizePhoneNumber(formattedPhone);
    }
    if(formattedMobile){
      formattedMobile = Utils.normalizePhoneNumber(formattedMobile);
    }

    let payload = {
      contactId: this.props.profile ? this.props.profile.id : undefined,
      firstName: values.firstName,
      lastName: values.lastName,
      phoneNumber: formattedPhone,
      mobileNumber: formattedMobile,
      emailAddress: values.email,
      title: values.title,
      typeId: values.contactType,
    };

    const { insuredId, holderId } = this.props;

    if (insuredId) {
      payload = { ...payload, insuredId };
    } else if (holderId) {
      payload = { ...payload, holderId };
    }

    this.props.commonActions.setLoading(true);
    this.props.actions.postContact(payload, (contact) => {
      this.props.commonActions.setLoading(false);
      if(contact){
        this.props.close();
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
      title, titleEdit
    } = this.props.local.strings.contacts.addContactModal;
    const titleText = this.props.profile? titleEdit:title;

    return (
      <div className="add-item-view add-entity-form-small">
        <div className="add-item-header">
          <h1>{titleText}</h1>
        </div>

        <section className="white-section">
          <div className="add-item-form-subsection">
            <ContactInfoForm
              close={this.hideModal}
              onSubmit={this.send}
              profile={this.props.profile} />
          </div>
        </section>
      </div>
    );
  }
};

const mapStateToProps = (state, ownProps) => {
  return {
    local: state.localization,
    contacts: state.contacts,
    common: state.common
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(contactsActions, dispatch),
    commonActions: bindActionCreators(commonActions, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddContactModal);
