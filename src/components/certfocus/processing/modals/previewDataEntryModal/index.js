import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Swal from 'sweetalert2';
import moment from 'moment';
import _ from 'lodash';

import * as processingActions from '../../actions';
import * as registerActions from '../../../../register/actions';
import './previewDataEntryModal.css';

class PreviewDataEntryModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      agencies: [],
      agents: [],
    }

    this._isMounted = true;   
    this.props.registerActions.fetchGeoStates();
    this.props.processingActions.fetchAgencies({}, (agencies) => {
      if (this._isMounted) {
        this.setState({ agencies: agencies });
      }
    });
    this.props.processingActions.fetchAgents({}, (agents) => {
      if (this._isMounted) {
        this.setState({ agents: agents });
      } 
    });
  };

  componentWillUnmount(){
    this._isMounted= false
  }

  onSave = () => {
    this.props.onSave();
    this.props.close();
  }

  renderProducer = () => {
    const { processingData } = this.props;
    const { agencies, agents } = this.state;

    const selectedState = (processingData.state) ? processingData.state : null;
    const selectedAgency = (processingData.agencyId && agencies) 
      ? agencies.filter(e => e.AgencyId === processingData.agencyId).map(e => e.Name)
      : null;
    const selectedAgent = (processingData.agentId && agents) 
      ? agents.filter(e => e.AgentID === processingData.agentId).map(e => e.FullName)
      : null;
    
    return (
      <React.Fragment>
        <div className="row pt-1">
          <div className="col-md-2"><label htmlFor="state">{`State`}</label></div>
          <div className="col-md-2">{selectedState}</div>
          <div className="col-md-2"><label htmlFor="agency">{`Producer`}</label></div>
          <div className="col-md-2">{(selectedAgency) ? selectedAgency : null}</div>
          <div className="col-md-2"><label htmlFor="agent">{`Producer Contact`}</label></div>
          <div className="col-md-2">{(selectedAgent) ? selectedAgent : null}</div>
        </div>
      </React.Fragment>
    );
  }

  renderInsurers = () => {
    const {
      availableCoverages,
    } = this.props.processing;
    const {
      processingData
    } = this.props;
    console.log('processingData: ', processingData);    
    
    return this.props.fixedInsurers.map((insurer, index) => {      
      let hasValue = (processingData && processingData.insurers && processingData.insurers[index]) ? true : false;

      return (
        <div key={index} className="row pt-1 pb-1" style={{ borderTop: '1px solid lightgray'}}>
          <div className="col-md-auto">
            <label>Insurer {this.getInsurerLetter(index)}:</label>
          </div>
           <div className="col-md-4">{(hasValue) ? processingData.insurers[index].label : null}</div>  
    
           <div className="col-md-3">            
             { Array.isArray(availableCoverages) && availableCoverages.map((item, idx) => {               
               let isChecked = false;

              if (processingData && processingData.coverages && hasValue) {                
                isChecked = processingData.coverages.find(e => { 
                  return (
                    (e.insurer === processingData.insurers[index].value) && 
                    (e.coverageTypeId === item.CoverageTypeID)
                  )});
              }

               return (
                 <div key={idx} style={(hasValue) ? { display: 'inline', marginRight: 4 } : { display: 'none' }}>
                   {(idx === 0) && ( <span style={{ display: 'inline-flex', marginRight: 4 }}><label>Coverages: </label></span> )}
                   <input
                     type="checkbox"
                     className='agree pretty-checkbox'
                     checked={isChecked}
                     disabled={true}
                   /> 
                   <span>{item.Code}</span>
                 </div>                    
               )
             })}
           </div>
         </div>
       );
     });
  }

  getInsurerLetter = idx => String.fromCharCode(idx + 65);

  renderCoverages = () => {
    const { 
      requirementSetDetail
    } = this.props.processing;
    const {
      processingData
    } = this.props;        
    const {
      coverageRowInsurerLabel,
      coverageRowCoverageLabel,
      coverageRowPolicyLabel,
      coverageRowEffectiveDateLabel,
      coverageRowExpirationDateLabel,
    } = this.props.local.strings.processing.dataEntry;
    let rules = [];

    return (
      <div className="coverages-section">
      { processingData.coverages.map((coverage, index) => {
          rules = requirementSetDetail.filter(rule => rule.RuleGroupID === coverage.ruleGroupId);

          return (
            <div key={index}>
              <div className="row mt-2">
                <div className="col-md-1"><label>{coverageRowInsurerLabel}: </label></div>
                <div className="col-md-1">{coverage.insurerLetter}</div>
                <div className="col-md-auto"><label>{coverageRowCoverageLabel}:</label></div>
                <div className="col-md-auto">{coverage.ruleGroupName}</div>
                <div className="col-md-auto"><label>{coverageRowPolicyLabel}:</label></div>
                <div className="col-md-auto">{coverage.policy}</div>
                <div className="col-md-auto"><label>{coverageRowEffectiveDateLabel}:</label></div>
                <div className="col-md-auto">{(coverage.effectiveDate) && moment(coverage.effectiveDate).format('MM/DD/YYYY')}</div>
                <div className="col-md-auto"><label>{coverageRowExpirationDateLabel}:</label></div>
                <div className="col-md-auto">{(coverage.expirationDate) && moment(coverage.expirationDate).format('MM/DD/YYYY')}</div>
              </div>
              {this.renderAttributes(coverage, rules)}
              <hr />
            </div>
          ); 
        })
      }        
      </div>
    );
  }

  renderAttributes = (coverage, rules) => {    
    return coverage.attributes.map((attribute, index) => {
      const attributeName = (attribute.name) ? attribute.name : attribute.AttributeName;

      const attributeField = () => {
        if (Number(rules[index].ConditionTypeID) === 1) {
          return (
            <input
              type="checkbox"
              className='agree pretty-checkbox'
              checked={(attribute.value === 'CHECKED') ? true : false}
              disabled={true}
            />
          );          
        } else {
          return (
            <input
              type="text"
              value={attribute.value}
              readOnly={true}
            />
          );
        }
      }
      
      return (
        <div key={index}>
          <div className="row mt-2">
            <div className="col-md-6"></div>  
            <div className="col-md-4" style={{ fontSize: 'medium' }}>{attributeName}</div>
            <div className="col-md-2">{rules[index] && attributeField()}</div>
          </div>
        </div>
      )
    });
  }

  renderEndorsements = () => {
    const { availableEndorsements } = this.props.processing;
    return (
      <div className="attributes-section">
        {availableEndorsements.map((endorsement, index) => {
          return (
            <div className="row mt-2" key={index}>              
              <div className="col-sm-3 wiz-field admin-form-field-wrapper">  
                <label>{endorsement.Name}</label>
              </div>              
              <hr />
            </div>
          );
        })}
      </div>
    );
  }

  render() {
    const {
      certificateOfLiabilityInsuranceTitle,
      masterCertificateLabel,
      dateLabel,
      producerTitle,
      insurersTitle,
      coveragesTitle,
      endorsementsTitle,
      previewTitle,
      previewSaveButton,
      previewCancelButton,
    } = this.props.local.strings.processing.dataEntry;

    const {
      certificateData,
      processingData,
    } = this.props;
    
    return (
      <div className="add-item-view processing-preview-screen-container">

        <section className="border">
          <div className="col-md-12">
            <div className="row buttons-section">
              <div className="col-md-auto">
                <button className="bg-sky-blue-gradient bn bn-small" onClick={this.props.close}>{previewCancelButton}</button>
              </div>
              <div className="col-md-auto">
                <button className="bg-sky-blue-gradient bn bn-small"onClick={this.onSave}>{previewSaveButton}</button>
              </div>
            </div>
          </div>  
        </section>

        <section className="white-section">
          <div className="col-md-12">

          {(!_.isEmpty(certificateData)) && ( 
            <div className="container-fluid">          
              <div className="row pb-3 pt-3">
                <div className="col-md-auto"><label>Holder: </label></div>
                <div className="col-md-auto">{certificateData.holderName}</div>
                <div className="col-md-auto"><label>Project: </label></div>
                <div className="col-md-auto">{certificateData.projectName}</div>
                <div className="col-md-auto"><label>Insured: </label></div>
                <div className="col-md-auto">{certificateData.insuredName}</div>
              </div>  
            </div> 
          )}

          {(!_.isEmpty(processingData)) && ( 
          <React.Fragment>
            <div className="container-fluid">
              <div className="row">                
                <div className="col-md-4">
                  <h2>{certificateOfLiabilityInsuranceTitle}</h2>                        
                  <div className="row pt-1">
                    <div className="col-md-6">
                      <div className="wiz-field admin-form-field-wrapper">
                        <label htmlFor="masterCertificate">{masterCertificateLabel}</label>
                      </div>
                    </div>
                    <div className="col-md-6">{(processingData.masterCertificate === 0) ? 'No' : 'Yes'}</div>
                  </div>                        
                  <div className="row pt-1">
                    <div className="col-md-6">
                      <label htmlFor="dateCertificate">{dateLabel}</label>
                    </div>
                    <div className="col-md-6">{(processingData.dateCertificate) && moment(processingData.dateCertificate).format('MM/DD/YYYY')}</div>
                  </div>
                </div>                   
                <div className="col-md-8">
                  <h2>{producerTitle}</h2>
                  {this.renderProducer()}
                </div>
              </div>
            </div>              
            <hr />
            <div className="container-fluid">
              <div className="row">
                <div className="col-md-12">
                  <h2>{insurersTitle}</h2>
                  {this.renderInsurers()}
                </div>
              </div>
            </div>
            <hr />
            <div className="container-fluid">
              <h2>{coveragesTitle}</h2>
              {this.renderCoverages()}
            </div>
            <hr />
            <div className="container-fluid">
              <h2>{endorsementsTitle}</h2>
              {this.renderEndorsements()}
            </div>
          </React.Fragment>  
          )}
          </div>
        </section>
      </div>
    );
  }
};

const mapStateToProps = (state, ownProps) => {
  return {
    local: state.localization,
    login: state.login,
    common: state.common,
    processing: state.processing,
    register: state.register,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    processingActions: bindActionCreators(processingActions, dispatch),
    registerActions: bindActionCreators(registerActions, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PreviewDataEntryModal);
