import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import UploadDocumentForm from './form';

import * as attachmentsActions from '../../attachments/actions';
import * as commonActions from '../../../common/actions';

import '../addEntityModal.css';

class UploadDocumentModal extends Component {
  
  handleFormSubmit = (values) => {
    const { currentUploadData, onSubmit } = this.props;
    const serializedObj = {
      ...values,
      hiringClientId: currentUploadData.holderId,
      projectId: currentUploadData.projectId,
      subcontractorId: currentUploadData.insuredId,
      projectInsuredId: currentUploadData.projectInsuredId,
      documentStatusId: 4 // Pending Processing
    };
    onSubmit(serializedObj);
  }

  hideModal = () => {
    const { onHide, close } = this.props;
    if (onHide) onHide();
    else close();
  }

  render() {
    return (
      <div className="add-item-view add-entity-form-small">
        <div className="add-item-header">
          <h1>Upload Document</h1>
        </div>

        <section className="white-section">
          <div className="add-item-form-subsection">
            <UploadDocumentForm
              close={this.hideModal}
              onSubmit={this.handleFormSubmit}
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
    actions: bindActionCreators(attachmentsActions, dispatch),
    commonActions: bindActionCreators(commonActions, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(UploadDocumentModal);