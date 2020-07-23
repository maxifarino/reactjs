import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import AddDocumentForm from './form';
import * as documentActions from './../../documents/actions';
import * as commonActions from '../../../common/actions';
import '../addEntityModal.css';

class AddDocumentModal extends Component {
  
  componentDidMount() {
  }

  send = (values) => {
    const { setLoading } = this.props.commonActions;
    const payload = {
      documentId: this.props.document ? this.props.document.DocumentID : undefined,
      hiringClientId: values.holderId ? values.holderId.value : '',
      projectId: values.projectId ? values.projectId.value : '',
      subcontractorId: values.insuredId ? values.insuredId.value : '',
      documentStatusId: values.documentStatus ? Number(values.documentStatus) : '',
      documentTypeId: values.documentType ? Number(values.documentType) : '',
      garbage: (values.garbage) ? 1 : 0,
      urgent: (values.urgent) ? 1 : 0,
    }
    console.log('PAY', payload);    
    setLoading(true);
    this.props.documentActions.postDocument(payload, (success) => {
      setLoading(false);
      if (success) this.props.close();
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
    } = this.props.local.strings.documents.addDocumentModal;

    const text = this.props.document ? titleEdit : title;

    return (
      <div className="add-item-view add-entity-form-small">
        <div className="add-item-header">
          <h1>{text}</h1>
        </div>

        <section className="white-section">
          <div className="add-item-form-subsection">
            <AddDocumentForm
              document={this.props.document}
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
    documentActions: bindActionCreators(documentActions, dispatch),
    commonActions: bindActionCreators(commonActions, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddDocumentModal);
