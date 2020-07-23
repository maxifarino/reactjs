import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import InsurerForm from './form';

import * as actions from '../../actions';
import * as commonActions from '../../../../common/actions';

import './createInsurerModal.css';

class createInsurerModal extends Component {

  onSave = (values) => {
    const { insurerId } = this.props;

    const payload = {
      insurerId: insurerId ? insurerId : undefined,
      ...values,
    }

    this.props.commonActions.setLoading(true);
    this.props.actions.setAddInsurer(payload, (success) => {
      this.props.commonActions.setLoading(false);
      if (success) {
        this.props.close(true);       
        if (this.props.onSave) this.props.onSave(success.insurerId);
      }
    });
  };

  hideModal = () => {
    const { onHide, close } = this.props;
    if (onHide) onHide();
    else close();
  }

  render() {
    const {
      insurerTitleCreate, 
      insurerTitleEdit
    } = this.props.local.strings.processing.dataEntry.insurer;
    
    const titleText = this.props.insurer ? insurerTitleEdit : insurerTitleCreate;
    
    return (
      <div className="add-item-view add-entity-form-small">
        <div className="add-item-header">
          <h1>{titleText}</h1>
        </div>

        <section className="white-section">
          <div className="add-item-form-subsection">
            <InsurerForm
              close={this.hideModal}
              onSubmit={this.onSave}
              insurer={this.props.insurer} />
          </div>
        </section>
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
    actions: bindActionCreators(actions, dispatch),
    commonActions: bindActionCreators(commonActions, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(createInsurerModal);
