import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import DocumentTypeInfoForm from './form';

import * as documentTypesActions from '../../holders-profile/tabs/document-types/actions';
import * as commonActions from '../../../common/actions';

import '../addEntityModal.css';

class AddDocumentType extends Component {
  send = (values) => {
    const { document } = this.props;

    const serializedDocument = {
      ...values,
      archived: values.archived ? 1 : 0,
      holderId: this.props.holdersProfile.profileData.id,
      ...(document ? { documentTypeId: document.documentTypeID } : {}),
    };

    this.props.actions.sendDocumentTypes(serializedDocument, this.props.close);
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
    } = this.props.local.strings.documentTypes.addModal;

    const titleText = this.props.document ? titleEdit : title;

    return (
      <div className="add-item-view add-entity-form-small">
        <div className="add-item-header">
          <h1>{titleText}</h1>
        </div>

        <section className="white-section">
          <div className="add-item-form-subsection">
            <DocumentTypeInfoForm
              close={this.hideModal}
              onSubmit={this.send}
              document={this.props.document}
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
    documentTypes: state.documentTypes,
    holdersProfile: state.holdersProfile,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(documentTypesActions, dispatch),
    commonActions: bindActionCreators(commonActions, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddDocumentType);
