import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import CustomTerminologyForm from './form';

import * as customTerminologyActions from '../../settings/customTerminology/actions';
import * as commonActions from '../../../common/actions';

import '../addEntityModal.css';

class AddCustomTerminologyModal extends Component {
  send = (values) => {
    const { selectedCustomTerm, holderId } = this.props;
    const serializedObj = {
      ...values,
      ...(selectedCustomTerm ? { customTermId: selectedCustomTerm.CustomTermId } : {}),
      holderId: values.holderId.value ? values.holderId.value : holderId,
    };

    this.props.actions.sendCustomTerminology(serializedObj, this.props.close);
  };

  hideModal = () => {
    const { onHide, close } = this.props;
    if (onHide) onHide();
    else close();
  }

  render() {
    const {
      title,
      titleEdit,
    } = this.props.local.strings.certFocusSettings.customTerminology.addModal;

    const titleText = this.props.customTerm ? titleEdit : title;
    
    return (
      <div className="add-item-view add-entity-form-small">
        <div className="add-item-header">
          <h1>{titleText}</h1>
        </div>

        <section className="white-section">
          <div className="add-item-form-subsection">
            <CustomTerminologyForm
              close={this.hideModal}
              onSubmit={this.send}
              fromHolderTab={this.props.fromHolderTab}
              holderId={this.props.holderId}
              selectedCustomTerm={this.props.selectedCustomTerm}
            />
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
    actions: bindActionCreators(customTerminologyActions, dispatch),
    commonActions: bindActionCreators(commonActions, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddCustomTerminologyModal);
