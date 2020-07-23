import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import Swal from 'sweetalert2';

import ProcessingForm from './form';
import * as documentActions from './../../documents/actions';
import * as processingActions from './../../processing/actions';
import * as commonActions from '../../../common/actions';
import '../addEntityModal.css';

class ProcessingModal extends Component {

  onSubmit = (values) => {
    const { setLoading } = this.props.commonActions;
    const { document } = this.props;
    console.log('values', values);
    // Document Status
    switch (values.submitType) {
      case 'sendToProcessing':
        values.documentStatusId = 5; break; // Sent to OCR
      case 'sendToDataEntry':
        values.documentStatusId = 4; break; // Pending Data Entry 
      case 'doDataEntry':
        values.documentStatusId = 10; break; // Data Entry In Progress
      default:
        values.documentStatusId = values.documentStatusId;
    }
    
    const payload = {
      documentId: document ? document.DocumentID : undefined,
      hiringClientId: values.holderId ? values.holderId.value : '',
      projectId: values.projectId ? values.projectId.value : '',
      subcontractorId: values.insuredId ? values.insuredId.value : '',
      documentStatusId: values.documentStatusId 
        ? Number(values.documentStatusId) 
        : Number(values.documentTypeId !== 1) ? 14 : undefined
      ,
      documentTypeId: values.documentTypeId ? Number(values.documentTypeId) : 0,
      garbage: (values.garbage) ? 1 : 0,
      urgent: (values.urgent) ? 1 : 0,
      queueId: (values.queueId) ? values.queueId : undefined,
      documentDate: (values.documentDate) ? values.queueId : undefined,
      expireDate: (values.expireDate) ? values.queueId : undefined,
    };
    setLoading(true);
    
    this.props.documentActions.postDocument(payload, (err, data) => {
      setLoading(false);      
      if (!err) {
        this.props.close();
                
        if ((values.submitType === 'doDataEntry') || (values.submitType === 'sendToDataEntry')) {          
          // create certificate
          const certificateData = {
            certificateId: (document && document.CertificateID) ? document.CertificateID : undefined,
            documentId: document.DocumentID,
            documentUrl: document.DocumentUrl,
            holderId : document.HolderID,
            projectId: document.ProjectID,
            insuredId: document.InsuredID,
            projectInsuredId: document.ProjectInsuredID,
          }

          this.props.processingActions.addCertificate(certificateData, (err, certificateId) => {
            if (!err) {
              // redirect to DataEntry page
              if (values.submitType === 'doDataEntry') {
                this.openDataEntry(`/certfocus/processing/${certificateId}`)
              } else {
                Swal({
                  type: 'success',
                  title: '',
                  text: 'The Document has successfully been sent to Data Entry for processing',
                });
              }
            }            
          });

        } else if (values.submitType === 'sendToProcessing') {
          Swal({
            type: 'success',
            title: '',
            text: 'The Document has successfully been sent to OCR for processing',
          });
        } else {
          Swal({
            type: 'success',
            title: '',
            text: 'The Document has successfully been saved',
          });
        }

      } else {
        Swal({
          type: 'error',
          title: '',
          text: 'Error uploading files. Please try again.',
        });
      } 
    });
  };

  openDataEntry = (link) => {
    window.open(link, '_blank');
  }

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
            <ProcessingForm
              document={this.props.document}
              close={this.hideModal}
              onSubmit={this.onSubmit} />
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
    processingActions: bindActionCreators(processingActions, dispatch),
    commonActions: bindActionCreators(commonActions, dispatch)
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ProcessingModal));
