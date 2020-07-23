import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import _ from 'lodash';

import DataEntry from './DataEntry';
import * as actions from './actions';
import './processing.css';

class Processing extends Component {
  constructor(props) {
    super(props);

    this.state = {
      certificateData: null,
      formData: null,
      error: false,
      isNew: true,
      toggleFileViewer: true,
      enablePreview: false,
      loading: true,
    };
  };

  componentDidMount() {
    const { certificateId } = this.props.match.params;
    
    if (certificateId) {      
      this.props.actions.fetchCertificateData(certificateId, (err, data) => {            
        if (!err) {
          const certificateData = {
            certificateId: certificateId,
            documentId: data.DocumentId,
            documentUrl: data.DocumentUrl,
            holderId : data.HolderId,
            holderName: data.HolderName,
            projectId: data.ProjectId,
            projectName: data.ProjectName,
            insuredId: data.InsuredId,
            insuredName: data.InsuredName,
            projectInsuredId: data.ProjectInsuredId,
          }

          // Opens the document when initialized
          if (data.DocumentUrl) {     
            this.openDocument(data.DocumentUrl);
          }
          this.props.actions.fetchDataEntry(certificateId, (err, data) => {            
            this.setState({ certificateData: certificateData, isNew: false, loading: false, formData: data});
          });
        } else {
          this.setState({ error: true, loading: false });
        }
      });
    }    
  }
  
  openDocument (documentUrl) {
    window.open(documentUrl, '_blank','left=700, top=150, height=500, width=650, scrollbars=yes');
  }

  render() {
    const { certificateData, formData, error, loading } = this.state;
        
    return (
      <div className="newhc-form wiz-wrapper processing-screen-container">   
        
        {(!_.isEmpty(certificateData) && !loading) && ( 
          <div className="container-fluid">          
            <div className="row p-3">
              <div className="col-md-auto">
                <label htmlFor="holderId">Holder: </label>
              </div>
              <div className="col-md-auto">
                <input
                  type="text"
                  name="holderId"
                  value={certificateData.holderName}
                  disabled={true}
                />
              </div>
              <div className="col-md-auto">
                <label htmlFor="projectId">Project: </label>
              </div>
              <div className="col-md-auto">
                <input
                  type="text"
                  name="projectId"
                  value={certificateData.projectName}
                  disabled={true}
                />
              </div>
              <div className="col-md-auto">
                <label htmlFor="insuredId">Insured: </label>
              </div>
              <div className="col-md-auto">
                <input
                  type="text"
                  name="insuredId"
                  value={certificateData.insuredName}
                  disabled={true}
                />
              </div>
              <div className="col-md-auto">
                <a href={certificateData.documentUrl} className="bn bn-small bg-green-dark-gradient" target = "_blank">PDF Preview</a>
              </div>
            </div>  
          </div> 
        )}      
           
        <div className="steps-bodies add-item-view">
          <div className={`step-body add-item-form-subsection active`}>
          {(error) ? (
            <div className="missing-data-container">
              <div className="alert alert-danger" role="alert">
                Cannot retrieve coverage and deficiency data. Please try again.
              </div>
            </div>
          ) : (
            (certificateData) && (
              <DataEntry
                certificateData={certificateData}
                formData={formData}
                continueHandler={this.onContinueHandler}
                toggleFileViewer={this.state.toggleFileViewer}
                isNew={this.state.isNew}
              />
            )
          )}
          </div> 
        </div> 
      </div> 
    );
  }
};

const mapStateToProps = (state) => {
  return {
    local: state.localization,
    processing: state.processing,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(actions, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Processing);
