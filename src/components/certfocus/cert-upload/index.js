/* eslint-disable */
import React from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Swal from 'sweetalert2';
import moment from 'moment';

import RequirementSetsList from './requirement-sets-list';
import AttachmentsList from './attachments-list';
import EndorsementsList from './endorsements-list';

import DocumentList from './document-list';
import DocumentUploadForm from './document-upload-form';

import * as certUploadActions from './actions';
import './cert-upload.css';

class CertUpload extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      certUploadProfile: {},
      enablePage: false,
      invalid: false,
      showRequirementSets: true,
    }
  }

  componentDidMount () {
    this.validate();
  }

  validate () {
    const { hash } = this.props.match.params;
    this.props.certUploadActions.validateHash(hash, (success, response) => {
      if (success) {
        this.setState({ enablePage: true, certUploadProfile: response });
        this.props.certUploadActions.fetchRequirementSets({ 
          projectInsuredId: response.projectInsuredId, 
          requirementSetId: response.reqSetId,
          holderId: response.holderId
        });
        this.props.certUploadActions.fetchDocuments({ projectInsuredId: response.projectInsuredId });
      } else {
        console.log('Invalid hash');        
        this.setState({ invalid: true })
      }
    });
  }

  handleFormSubmit = (values) => {
    console.log('Submit!', values, this.state.certUploadProfile);
    const serializedObj = {
      ...values,
      hiringClientId: this.state.certUploadProfile.holderId,
      projectId: this.state.certUploadProfile.projectId,
      subcontractorId: this.state.certUploadProfile.insuredId,
      projectInsuredId: this.state.certUploadProfile.projectInsuredId,
      documentStatusId: 5 // Sent to Processing
    };

    this.props.certUploadActions.uploadFiles(serializedObj, (success, data) => {
      if (success) {
        Swal({
          type: 'success',
          title: 'Cert Upload',
          text: 'Upload was successful.',
          onClose: () => {
            this.props.certUploadActions.fetchDocuments({ projectInsuredId: serializedObj.projectInsuredId });
          }
        });
      } else {        
        Swal({
          type: 'error',
          title: 'Cert Upload',
          text: 'Error uploading files. Please try again.',
        });
      }
    });
  };

  render () {
    const { certUploadProfile } = this.state;

    if (this.state.invalid) {
      Swal({
        type: 'error',
        title: 'Cert Upload',
        text: 'Invalid hash. Please try again.',
        onClose: () => { this.props.history.push("/login"); }
      });      
    }
    
    if (this.state.redirect) {
      <Redirect push to="/login" />
    }

    const requirementSetsList = Array.isArray(this.props.certUpload.requirementSets) 
      ? this.props.certUpload.requirementSets.map((requirement) => {
          return {
            ruleGroupName: requirement.CoverageType,
            ruleId: requirement.RuleID,
            attributeName: requirement.AttributeName,
            conditionTypeId: requirement.ConditionTypeID,
            conditionValue: requirement.ConditionValue,
            deficiencyText: requirement.DeficiencyText,
            deficiencyTypeId: requirement.DeficiencyTypeID,
            status: requirement.AttributeStatus
          } 
        })
      : [];


    const attachmentsList = Array.isArray(this.props.certUpload.attachments) 
      ? this.props.certUpload.attachments.map((attachment) => {
          return {
            requirementSetDocumentId: attachment.RequirementSets_DocumentID,
            fileName: attachment.FileName,
            url: attachment.Url,
          } 
      })
      : [];
    
    
    const endorsementsList = [];
    if (this.props.certUpload.endorsements.length > 0) {
      this.props.certUpload.endorsements.map((endorsement) => {
        if (! endorsementsList.some((f) => f.Id === endorsement.Id)) {
          endorsementsList.push({
            Id: endorsement.EndorsementID,
            Name: endorsement.EndorsementName,
            AlwaysVisible: endorsement.AlwaysVisible,            
          });
        }
      });  
    }    
    if (this.props.certUpload.allEndorsements.length > 0) {
      this.props.certUpload.allEndorsements.forEach((e) => {
        if ((e.AlwaysVisible === true) && (! endorsementsList.some((f) => f.Id === e.Id))) {
          endorsementsList.unshift(e);
        }
      });
    }
      
    const documentList = Array.isArray(this.props.certUpload.list) 
      ? this.props.certUpload.list.map((document) => {
          let uploadBy;          
          if (document.FirstName && document.LastName) {
            uploadBy = document.FirstName + ' ' + document.LastName.charAt(0).toUpperCase() + '.';
          }
          else {
            const uploadedByUser = document.UploadedByUser.split(' ');            
            if (uploadedByUser.length > 0) {
              uploadBy = uploadedByUser[0] + ' ' + uploadedByUser[uploadedByUser.length-1].charAt(0).toUpperCase() + '.';
            } else {
              uploadBy = document.UploadedByUser;
            }
          }

          return {
            id: document.DocumentID,
            name: document.FileName,
            uploadBy: uploadBy,
            uploadDate: moment(document.DateCreated).format('MM/DD/YYYY'),
            documentStatus: document.DocumentStatus
          }
        })
      : [];      

    return (this.state.enablePage) && (
      <div className="container-fluid">
        <section className="border p-3">        
          <div className="col-md-12">
            <div className="row">
              <div className="col-md-3 justify-content-center">
              {certUploadProfile.logo && (              
                <img src={`data:image/jpeg;base64,${certUploadProfile.logo}`} 
                  alt="Logo"
                  className="holder-logo" />              
              )}
              </div>
              <div className="col-md-3 pt-5"><h2>{certUploadProfile.holderName}</h2></div>                
              <div className="col-md-4 pt-5">
                <div className="row">
                  <div className="col-md-6">Insured: </div>
                  <div className="col-md-6">{certUploadProfile.insuredName}</div>
                </div>
                <div className="row">
                  <div className="col-md-6">Project: </div>
                  <div className="col-md-6">{certUploadProfile.projectName}</div>  
                </div>
                <div className="row">
                  <div className="col-md-6">Compliance Status: </div>
                  <div className="col-md-6">{certUploadProfile.complianceStatus}</div>
                </div>
              </div>
              <div className="col-md-2 pt-5">
                <button
                  className="bn bn-small bg-green-dark-gradient"
                  onClick={() => this.setState({showRequirementSets: !this.state.showRequirementSets})}
                >
                { this.state.showRequirementSets ? `Hide` : `Show` } Requirements
                </button>
              </div>
            </div>

            <div className="row pt-3">
              <div className="col-md-12">
                <p className="explanatory-text">
                  Carefully review the insurance requirements listed below. 
                  To upload documents please scroll to the bottom of the page or <a href="#upload">click here</a>.
                </p>
              </div>
            </div>  

          { this.state.showRequirementSets && 
            <div className="row pt-3">
              <div className="col-md-8">
                <h5>{`Required Insurance`}</h5>
                <RequirementSetsList requirementSetsList={requirementSetsList} />
              </div>
              <div className="col-md-4">
                <div className="row">
                  <div className="col-md-12">
                    <h5>{`Attachments`}</h5>
                    <AttachmentsList attachmentsList={attachmentsList} />
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-12">
                  <h5>{`Additional Requirements`}</h5>
                  <EndorsementsList endorsementsList={endorsementsList} />
                  </div>
                </div>
              </div>
            </div>
          }
            <div className="row pt-3" id="upload">
              <div className="col-md-6 pl-1">
                <h5>{`New Documents`}</h5>
                <DocumentUploadForm
                  onSubmit={this.handleFormSubmit}
                />
              </div>    
              <div className="col-md-6 pr-1">
                <h5>{`Previous Documents`}</h5>
                <DocumentList
                  documentList={documentList}
                />
              </div>
            </div>
            
          </div>  
        </section>
      </div>  
    )  
  }
}

const mapStateToProps = (state) => {
  return {
    local: state.localization,
    certUpload: state.certUpload,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    certUploadActions: bindActionCreators(certUploadActions, dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CertUpload);
