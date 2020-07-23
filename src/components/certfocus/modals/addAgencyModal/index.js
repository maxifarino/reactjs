import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import AddAgencyForm from './form';
import * as actions from './../../agencies/actions';
import * as commonActions from '../../../common/actions';
import '../addEntityModal.css';

class AddAgencyModal extends Component {
  
  componentDidMount() {
  }

  send = (values) => {
    const { setLoading } = this.props.commonActions;
    const payload = {
      agencyId: this.props.agency ? this.props.agency.AgencyId : undefined,
      name: values.name,
      city: values.city,
      state: values.state,
      zipCode: values.zipCode,
      mainPhone: values.mainPhone,
      mainEmail: values.mainEmail,
      faxNumber: values.faxNumber,
      address: values.address,
      country: values.country,
    }
    console.log('PAY', payload);    
    setLoading(true);
    
    this.props.actions.postAgency(payload, (success) => {
      setLoading(false);
      if (success) this.props.close();
      if (success && this.props.onSave) this.props.onSave(success.agencyId);
    });
  };

  hideModal = () => {
    const { onHide, close } = this.props;
    if (onHide) onHide();
    else close();
  }

  render() {
    const {
      title,
      titleEdit
    } = this.props.local.strings.agencies.addAgencyModal;

    const text = this.props.agency ? titleEdit : title;

    return (
      <div className="add-item-view add-entity-form-small">
        <div className="add-item-header">
          <h1>{text}</h1>
        </div>

        <section className="white-section">
          <div className="add-item-form-subsection">
            <AddAgencyForm
              agency={this.props.agency}
              close={this.hideModal}
              onSubmit={this.send} />
          </div>
        </section>
      </div>
    );
  }
};

const mapStateToProps = (state) => {
  return {
    local: state.localization,
    common: state.common,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(actions, dispatch),
    commonActions: bindActionCreators(commonActions, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddAgencyModal);
