import React, { Component } from 'react';
import { Field, reduxForm, formValueSelector, FieldArray, change, arraySplice, arrayRemove } from 'redux-form';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Modal } from 'react-bootstrap';
import _ from 'lodash';

import renderField from '../../../customInputs/renderField';
import renderSelect from '../../../customInputs/renderSelect';
import renderTypeAhead from '../../../customInputs/renderTypeAhead';
import renderRemovable from '../../../customInputs/renderRemovable';
import Utils from '../../../../lib/utils';

import AddAgencyModal from '../../modals/addAgencyModal';
import AddAgentsModal from '../../modals/addAgentsModal';
import CreateInsurerModal from '../modals/createInsurerModal';
import PreviewDataEntryModal from '../modals/previewDataEntryModal';
import validate from './validation';

import * as processingActions from './../actions';
import * as registerActions from '../../../register/actions';

import './DataEntry.css';

class DataEntryForm extends Component {

  constructor(props) {
    super(props);

    this.state = {
      showCreateInsuredModal: false,
      showAddAgencyModal: false,
      showAddAgentsModal: false,
      selectedAgency: null,
      selectedCoverageTypes: {},
      //selectedEndorsements: new Set(), // DISABLE ENDORSEMENTS
      fixedInsurers: [{},{},{},{}],
      agencies: [],
      agents: [],
      loading: [false, false, false, false],
      lastInsurerIndex: null,
      showPreview: false
    };    
  }

  componentDidMount() {
    const { change, processingActions, formData } = this.props;    
    
    if (!_.isEmpty(formData)) {
      console.log('formData ', formData);
      
      processingActions.setDataEntrySelectedAgency({
        AgencyId: formData.agency.id,
        City: formData.agency.city,
        Name: formData.agency.name,
        State: formData.agency.state,
      });
      
      const insurersDistinct = Utils.uniqueBy(formData.insurers, 'insurerId');            
      const insurers = insurersDistinct.map(insurer => {
        return {
          label: insurer.insurerName,
          value: insurer.insurerId,
          naic: insurer.naicCompanyNumber,
        };
      });
      //console.log('insurers ', insurers);

      const selectedCoverageTypes = {};
      
      const coverages = formData.coverages.map(coverage => {
        if (!selectedCoverageTypes[coverage.insurerId]) {          
          selectedCoverageTypes[coverage.insurerId] = [];
        }
        selectedCoverageTypes[coverage.insurerId].push(coverage.coverageTypeId);

        const attributes = coverage.attributes.map((attribute, index) => {
          return {
            id: attribute.id,
            name: attribute.name,
            value: attribute.value,
          };
        });
        
        let insurerIndex = insurers.findIndex(e => e.value === coverage.insurerId);
        return {
          coverageTypeId: coverage.coverageTypeId,
          parentCoverageId: coverage.parentCoverageId,
          attributes: attributes,
          ruleGroupId: coverage.ruleGroupId,
          insurer: coverage.insurerId,
          insurerLetter: this.getInsurerLetter(insurerIndex),
          policy: coverage.policyNumber,
          effectiveDate: Utils.getInputDateFromDateString(coverage.effectiveDate),
          expirationDate: Utils.getInputDateFromDateString(coverage.expirationDate),
          ruleGroupName: coverage.coverageTypeName,
        };
      });
      
      change(`dateCertificate`, Utils.getInputDateFromDateString(formData.dateCertificate));
      change(`state`, formData.agency.state);
      change(`agency`, formData.agency.id);
      change('insurers', insurers);
      change('coverages', coverages);
      
      this.setState({ selectedCoverageTypes: selectedCoverageTypes });

      this.props.processingActions.fetchAgents({ agencyId: formData.agency.id }, (agents) => {
        if (this._isMounted) {
          this.setState({ agents: agents, selectedAgency: formData.agency.id });
          change(`agent`, formData.agent.id);
        }  
      });

      /** DISABLE ENDORSEMENTS 
      if (formData.endorsements && formData.endorsements.length > 0) {
        this.setState({ selectedEndorsements: new Set(formData.endorsements) }, () => {
          this.props.processingActions.setDataEntrySelectedEndorsements(this.state.selectedEndorsements);
        });
      }
      */
    }
     
    this._isMounted = true;   
    this.props.registerActions.fetchGeoStates();
    this.props.processingActions.fetchAgencies({}, (agencies) => {
      if (this._isMounted) {
        this.setState({ agencies: agencies });
      }
    });     
  } 
    
  componentWillUnmount(){
    this._isMounted= false
  }

  onChangeState = (e) => {
    //FIXME this triggers a http request each time
    const { value } = e.target;
    if (value) {
      this.props.processingActions.fetchAgencies({ state: value }, (agencies) => {
        this.setState({ agencies: agencies });
      });
    }
  }

  onChangeAgency = (e) => {
    const { value } = e.target;
    if (value) {
      const selectedAgency = this.state.agencies.filter(f => f.AgencyId === Number(value))[0] || {};
      this.props.processingActions.setDataEntrySelectedAgency(selectedAgency)
      this.props.processingActions.fetchAgents({ agencyId: value }, (agents) => {
        this.setState({ agents: agents, selectedAgency: value });
      });
    }
  }

  openAddAgencyModal = (e) => {
    e.preventDefault();
    this.setState({ showAddAgencyModal: true });
  }

  closeAddAgencyModal = () => {    
    this.setState({ showAddAgencyModal: false });
  }

  openAddAgentsModal = (e) => {
    e.preventDefault();    
    this.setState({ showAddAgentsModal: true });
  }

  closeAddAgentsModal = () => {
    this.setState({ showAddAgentsModal: false });
  }
  
  openCreateInsurerModal = (e, index) => {
    e.preventDefault();
    this.setState({ showCreateInsuredModal: true, lastInsurerIndex: index });
  }

  closeCreateInsurerModal = () => {
    this.setState({ showCreateInsuredModal: false });
  }

  changeInsurerLoadingStatus = (index, newStatus) => {
    this.setState(prevState => {
      const newLoading = [...prevState.loading];
      newLoading[index] = newStatus;
      return { loading: newLoading };
    });
  }

  onSaveAgency = (value) => {
    const { change } = this.props;
    if (value) {
      this.props.processingActions.fetchAgencies({}, (agencies) => {
        const selectedAgency = agencies.filter(f => f.AgencyId === Number(value))[0] || {};
        this.props.processingActions.setDataEntrySelectedAgency(selectedAgency);
        this.setState({ agencies: agencies, selectedAgency: selectedAgency.AgencyId });
        change(`agency`, selectedAgency.AgencyId);       
      });
    }
  }

  onSaveAgent = (value) => {
    const { change } = this.props;
    if (value) {
      this.props.processingActions.fetchAgents({ agencyId: this.state.selectedAgency }, (agents) => {
        this.setState({ agents: agents });
        change(`agent`, value);
      });
    }
  }

  onSaveInsurer = (value) => {
    const index = this.state.lastInsurerIndex;
    if (value && index) {
      this.changeInsurerLoadingStatus(index, true);
      this.props.processingActions.fetchInsurers({ insurerId: value }, (insurer) => {
        if (insurer && insurer[0]) {   
          this.props.dispatch(change('DataEntryForm', `insurers[${index}].value`, insurer[0].InsurerID));
          this.props.dispatch(change('DataEntryForm', `insurers[${index}].label`, insurer[0].InsurerName));
          this.props.dispatch(change('DataEntryForm', `insurers[${index}].naic`, insurer[0].NAICCompanyNumber));
        }
        this.changeInsurerLoadingStatus(index, false);
      });
    }
  }

  getInsurerLetter = idx => String.fromCharCode(idx + 65);

  addInsurer = () => {
    this.setState({ fixedInsurers: [...this.state.fixedInsurers, {}]});
  }

  onSearchInsurer = (filterTerm) => {
    this.props.processingActions.fetchInsurersTypeAhead({ filterTerm: filterTerm });
  }

  onInsurerSelected = (index, val) => {
    this.props.dispatch(change('DataEntryForm', `insurers[${index}].value`, val.value));
    this.props.dispatch(change('DataEntryForm', `insurers[${index}].label`, val.label));
    this.props.dispatch(change('DataEntryForm', `insurers[${index}].naic`, val.NAICCompanyNumber));
    this.props.processingActions.setInsurersTypeAheadResults([]);
  }

  onInsurerRemoved = (index) => {
    const { currentInsurers, currentCoverages } = this.props;
    this.props.dispatch(change('DataEntryForm', `insurers[${index}]`, null));
    const removedInsurer = currentInsurers[index].value;
    
    // If that insurer was selected by a coverage, remove it in the coverage array
    currentCoverages.forEach((coverage, idx) => {             
      if (Number(coverage.insurer) === Number(removedInsurer)) {
        this.props.dispatch(change('DataEntryForm', `coverages[${idx}]`, ''));
      }
    });
  }

  handleFocus (field) {
    setTimeout(() => {
      const element = document.getElementById(field);
      if(element) {
        element.focus();
        element.scrollIntoView();
      }
    }, 200);
  }

  onChangeInsurerCoverageType = (e, coverageType, insurerIndex) => {    
    const { requirementSetDetail, availableCoverages } = this.props.processing;
    const { currentInsurers, currentCoverages, dispatch } = this.props;
    
    const isChecked = e.target.checked;
    const insurerId = currentInsurers[insurerIndex].value;
    const coverageTypeId = coverageType.CoverageTypeID;
  
    if (isChecked) {
      const selectedCoverageTypes = this.state.selectedCoverageTypes;      

      if (!selectedCoverageTypes[insurerId]) {
        selectedCoverageTypes[insurerId] = [];
      }
      selectedCoverageTypes[insurerId].push(coverageTypeId);
      this.setState({ selectedCoverageTypes: selectedCoverageTypes });

      const rules = requirementSetDetail.filter(rule => rule.RuleGroupID === coverageType.RuleGroupID);
      const rulesArray = rules.map((rule, idx) => ({ 
        id: rule.AttributeID, 
        ...rule
      }));
      //console.log('RULES', rules, rulesArray);
      const coverageObj = {
        insurer: insurerId,
        insurerLetter: this.getInsurerLetter(insurerIndex),
        coverageTypeId: coverageTypeId, 
        parentCoverageId: 0,
        ruleGroupId: coverageType.RuleGroupID,
        ruleGroupName: coverageType.Name,
        attributes: rulesArray
      }

      // Check for last insurer index for the previous coverageType
      const currentCoverageTypeIndex = availableCoverages.findIndex(e => e.CoverageTypeID === coverageTypeId);
      console.log('currentCoverageTypeIndex', currentCoverageTypeIndex, availableCoverages);      
      
      // check coverageType sort priority      
      let keys = [];
      currentCoverages.forEach((e, i) => { 
        let currIndex =  availableCoverages.findIndex(f => f.CoverageTypeID === e.coverageTypeId);
        //console.log('currIndex', currIndex, 'selIndex', currentCoverageTypeIndex)
        if (currIndex < currentCoverageTypeIndex) {
          keys.push(currIndex)
        }
      })
      keys.sort((a, b) => a - b);
      //console.log('keys', keys)
      let currentIndex = (keys.length > 0) ? keys[keys.length -1] : 0;
      let newIndex = _.findLastIndex(currentCoverages, e => e.coverageTypeId === availableCoverages[currentIndex].CoverageTypeID);
      //console.log('currentIndex', currentIndex);      
      newIndex = newIndex + 1;
      console.log('newIndex', newIndex);           
      dispatch(arraySplice('DataEntryForm', `coverages`, newIndex, 0, coverageObj));
      this.handleFocus(`policyNumber[${newIndex}]`);      
    } 
    else {
      const newSelectedCoverageTypes = Object.assign({}, this.state.selectedCoverageTypes);
      newSelectedCoverageTypes[insurerId] = this.state.selectedCoverageTypes[insurerId].filter(x => x !== coverageTypeId);
      this.setState({ selectedCoverageTypes: newSelectedCoverageTypes });
      
      const currentCoverageTypeIndex = currentCoverages.findIndex(e => (e.coverageTypeId === coverageTypeId && e.insurer === insurerId));
      dispatch(arrayRemove(`DataEntryForm`, `coverages`, currentCoverageTypeIndex));
    }
  }

  renderInsurers = () => {    
    const {
      insurersTypeAheadFetching,
      insurersTypeAheadResults,
      insurersTypeAheadError,
      availableCoverages,
    } = this.props.processing;
    
    const insurerOptions = Utils.getOptionsListWithAllValues(null, insurersTypeAheadResults, 'InsurerName', 'InsurerID', 'InsurerName', null, ['NAICCompanyNumber']);
    // Remove the already selected Insurers
    const insurerFilteredOptions = insurerOptions.filter(insurer => !this.props.currentInsurers.find(currentInsurer => {
      if (currentInsurer) {
        return currentInsurer.value === insurer.value;
      }
      return false;
    }));
    
    //let elementIndex = null;
    
    return this.state.fixedInsurers.map((insurer, index) => {      
      let hasValue = (this.props.currentInsurers[index] && this.props.currentInsurers[index].value) ? true : false;
  
      return (
        <div key={index} className="row pt-1 pb-1" style={{ borderTop: '1px solid lightgray'}}>
          <div className="col-md-auto">
            <label>Insurer {this.getInsurerLetter(index)}:</label>
          </div>
          <div className="col-md-4">
            {(!hasValue) ? (
              <Field
                resetOnClick
                name={`insurers[${index}].name`}
                placeholder={`Search by Insurer Name or NAIC #`}
                fetching={insurersTypeAheadFetching}
                results={insurerFilteredOptions}
                handleSearch={this.onSearchInsurer}
                fetchError={insurersTypeAheadError}
                component={renderTypeAhead}
                onSelect={(val) => this.onInsurerSelected(index, val)}
                conditional={true}
                show={hasValue}
              />
            ) : (
              <Field
                name={`insurers[${index}].name`}
                component={renderRemovable}
                valueText={hasValue ? this.props.currentInsurers[index].label : ''}
                conditional={true}
                show={hasValue}
                onRemove={(val) => this.onInsurerRemoved(index, val)}
              />
            )}
          </div>  
          <div className="col-md-1">
            <button 
              className="bn bn-small bg-green-dark-gradient" 
              style={{ paddingTop: 7, paddingBottom: 7 }}
              onClick={(e) => this.openCreateInsurerModal(e, index)} 
            >
              Create
            </button>
          </div>
          <div className="col-md-3">            
            { Array.isArray(availableCoverages) && availableCoverages.map((item, idx) => {
              let isChecked = false;

              if (this.props.currentInsurers[index] && this.props.currentInsurers[index].value) {
                let insurerId = this.props.currentInsurers[index].value;
                let coverageTypeId = item.CoverageTypeID;

                if (this.state.selectedCoverageTypes[insurerId] && Array.isArray(this.state.selectedCoverageTypes[insurerId])) {                    
                  if (this.state.selectedCoverageTypes[insurerId].indexOf(coverageTypeId) !== -1) {
                    isChecked = true;
                  }  
                }
              }

              //(elementIndex === null) ? elementIndex = 0 : elementIndex++; // increase it to have an unique index per insured/coverageType
              
              return (
                <div key={idx} style={(hasValue) ? { display: 'inline', marginRight: 4 } : { display: 'none' }}>
                  {(idx === 0) && ( <span style={{ display: 'inline-flex', marginRight: 4 }}><label>Coverages: </label></span> )}
                  <input
                    type="checkbox"
                    name={`insurers[${index}].coverageType[${idx}]`}
                    className='agree pretty-checkbox'
                    onChange={(e) => this.onChangeInsurerCoverageType(e, item, index)}
                    checked={isChecked}
                  /> 
                  <span>{item.Code}</span>
                </div>                    
              )
            })}
          </div>        
          <div className="col-md-3" style={{ textAlign: 'center' }}>
            {index === (this.state.fixedInsurers.length - 1) && (
              <button 
                className="bn bn-small bg-green-dark-gradient"
                style={{ paddingTop: 7, paddingBottom: 7 }}
                onClick={this.addInsurer}
              >
                Add Additional Insurer
              </button>
            )}
          </div>
        </div>
      );
    });
  }

  renderCoverages = ({ fields, meta: { error, submitFailed } }) => {
    const { requirementSetDetail } = this.props.processing;    
    const { currentCoverages } = this.props;    
    const {
      coverageRowInsurerLabel,
      coverageRowCoverageLabel,
      coverageRowPolicyLabel,
      coverageRowEffectiveDateLabel,
      coverageRowExpirationDateLabel,
    } = this.props.local.strings.processing.dataEntry;

    return (
      <div className="coverages-section">
        {fields.map((coverage, index) => {
          let coveragesInsurersOptions = [];
          let ruleGroupOptions = [];
          let rules = [];

          if (currentCoverages && currentCoverages[index]) {            
            rules = requirementSetDetail.filter(rule => rule.RuleGroupID === Number(currentCoverages[index].ruleGroupId));
           
            coveragesInsurersOptions = [{ 
              value: currentCoverages[index].insurer, 
              label: currentCoverages[index].insurerLetter 
            }];
            ruleGroupOptions = [{ 
              value: currentCoverages[index].ruleGroupId, 
              label: currentCoverages[index].ruleGroupName 
            }];            
          }

          return (!_.isEmpty(currentCoverages[index])) && (
            <div key={index}>
              <div className="row mt-2">
                <div className="col-md-1 col-sm-6 wiz-field admin-form-field-wrapper">
                  <label>{coverageRowInsurerLabel}:</label>
                  <div className="select-wrapper">
                    <Field
                      name={`${coverage}.insurer`}                      
                      component={renderSelect}
                      options={coveragesInsurersOptions}
                      disabled
                    />
                  </div>
                </div>
                <div className="col-md-2 col-sm-6 wiz-field admin-form-field-wrapper">
                  <label>{coverageRowCoverageLabel}:</label>
                  <div className="select-wrapper">
                    <Field
                      name={`${coverage}.ruleGroupId`}
                      component={renderSelect}
                      options={ruleGroupOptions}
                      disabled
                    />
                  </div>
                </div>
                <div className="col-md-2 col-sm-6 wiz-field admin-form-field-wrapper">
                  <label>{coverageRowPolicyLabel}:</label>
                  <Field
                    name={`${coverage}.policy`}
                    type="text"
                    component={renderField}
                    id={`policyNumber[${index}]`}
                  />
                </div>
                <div className="col-md-2 col-sm-6 wiz-field admin-form-field-wrapper">
                  <label>{coverageRowEffectiveDateLabel}:</label>
                  <Field
                    name={`${coverage}.effectiveDate`}
                    type="date"
                    component={renderField}
                  />
                </div>
                <div className="col-md-2 col-sm-6 wiz-field admin-form-field-wrapper">
                  <label>{coverageRowExpirationDateLabel}:</label>
                  <Field
                    name={`${coverage}.expirationDate`}
                    type="date"
                    component={renderField}
                  />
                </div>                
              </div>
              <FieldArray name={`${coverage}.attributes`} rules={rules} component={this.renderAttributes} />
              <hr />
            </div>
          );
        })}
          
        {submitFailed && error && <div className="text-danger">{error}</div>}
        
      </div>
    );
  }

  renderAttributes = ({ fields, meta: { error, submitFailed }, rules },) => {
    const { holderRequirementSets } = this.props;
    const { valueRatingOptions } = holderRequirementSets;

    return (
      <div className="attributes-section">
        {fields.map((attribute, index) => {
          const attributeField = () => {
            if (Number(rules[index].ConditionTypeID) > 3) {
              return (
                <Field
                  name={`${attribute}.value`}
                  type="text"
                  component={renderField}
                  format={val => val ? Utils.formatCurrency(val) : ''}
                  normalize={val => val ? Utils.normalizeCurrency(val) : ''}
                />
              );
            } else if (Number(rules[index].ConditionTypeID) === 1) {
              return (
                <Field
                  name={`${attribute}.value`}
                  type="checkbox"
                  component={renderField}
                  format={val => val === 'CHECKED' ? true : false}
                  parse={val => val ? 'CHECKED' : 'UNCHECKED'}               
                />
              );
            } else {
              return (
                <div className="select-wrapper">
                  <Field
                    name={`${attribute}.value`}
                    component={renderSelect}
                    options={valueRatingOptions}
                  />
                </div>
              );
            }
          }

          return (
            <div className="row mt-2" key={index}>
              <div className="col-sm-3 offset-sm-5 wiz-field admin-form-field-wrapper">
                {rules[index] && rules[index].AttributeName}
                <Field
                  name={`${attribute}.id`}
                  type="hidden"
                  component={renderField}
                />
              </div>
              <div className="col-sm-3 wiz-field admin-form-field-wrapper">
                {/* Render empty label just for the styling to match */}
                <label style={{ display: 'none'}} />
                {rules[index] && attributeField()}
              </div>
            </div>
          );
        })}
      </div>
    );
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

  /** DISABLE ENDORSEMENTS
  onChangeEndorsement = (e, endorsementId) => {
    const isChecked = e.target.checked;
    
    if (isChecked) {
      this.setState(prevState => ({
        selectedEndorsements: prevState.selectedEndorsements.add(endorsementId) 
      }), () => {
        this.props.processingActions.setDataEntrySelectedEndorsements(Array.from(this.state.selectedEndorsements));
      });
    } else {      
      this.state.selectedEndorsements.delete(endorsementId);
      const newSelected = this.state.selectedEndorsements;
      this.setState({ selectedEndorsements: newSelected }, () => {
        this.props.processingActions.setDataEntrySelectedEndorsements(Array.from(this.state.selectedEndorsements));
      });
    }
  }
  */

  renderProducer = () => {
    const agenciesList = (this.state.agencies.length === 0) ?  this.props.processing.agencies : this.state.agencies;    
    const agencyOptions = Utils.getOptionsList(`-- Select Producer --`, agenciesList, 'AgencyData', 'AgencyId', 'AgencyData');
    const agentOptions = Utils.getOptionsList(`-- Select Contact --`, this.state.agents, 'FullName' , 'AgentID', 'FullName');

    return (
      <React.Fragment>
        <div className="row pt-1">
          <div className="col-md-2">
            <label htmlFor="state">{`State`}</label>
          </div>
          <div className="col-md-4">
            <div className="select-wrapper">
              <Field
                name="state"
                type="text"
                placeholder="-- State --"
                component={renderField}
                onChange={this.onChangeState}
              />
            </div>                  
          </div>
          <div className="col-md-2">
            <label htmlFor="agency">{`Producer`}</label>
          </div>
          <div className="col-md-4">
            <div className="select-wrapper">
              <Field
                name="agency"
                component={renderSelect}
                options={agencyOptions}
                onChange={this.onChangeAgency}
              />
            </div>                  
          </div>
        </div>

        <div className="row pt-1">
          <div className="col-md-2">
            <label htmlFor="agent">{`Producer Contact`}</label>
          </div>
          <div className="col-md-4">
            <div className="select-wrapper">
              <Field
                name="agent"
                component={renderSelect}
                options={agentOptions}
              />
            </div>                  
          </div>
          <div className="col-md-6">
            <button
              className="bn bn-small bg-green-dark-gradient"
              style={{ paddingTop: 7, paddingBottom: 7, marginRight: 2 }}
              onClick={(e) => this.openAddAgencyModal(e)}
            >
              Add New Producer
            </button>
            <button
              className="bn bn-small bg-green-dark-gradient"
              style={{ paddingTop: 7, paddingBottom: 7 }}
              onClick={(e) => this.openAddAgentsModal(e)}
            >
              Add New Contact
            </button>
          </div>
        </div>
      </React.Fragment>
    );
  }

  openPreview = (data) => {
    //const { selectedEndorsements } = this.props.processing;  DISABLE ENDORSEMENTS
    const { insurers, coverages } = data;
    const { certificateData } = this.props;
    //console.log('DATA', certificateData, data, coverages);
    
    // filter empty coverages
    let filteredCoverages = coverages.filter(e => !_.isEmpty(e));
    let joinedInsurers = insurers.map((e) => e.value).join(",");
    
    const payload = {
      certificateId: certificateData.certificateId,
      documentId: certificateData.documentId ,
      holderId: certificateData.holderId, 
      projectId: certificateData.projectId,
      insuredId: certificateData.insuredId, 
      projectInsuredId: certificateData.projectInsuredId,
      dateCertificate: data.dateCertificate,
      masterCertificate: (data.masterCertificate) ? data.masterCertificate : 0,
      agencyId: (data.agency) ? parseInt(data.agency, 10) : 0,
      agentId: (data.agent) ? parseInt(data.agent, 10) : 0,
      state: (data.state) ? data.state : undefined,
      insurerIds: joinedInsurers,
      coverages: filteredCoverages,
      //endorsements: Array.from(selectedEndorsements), // DISABLE ENDORSEMENTS 
      insurers: insurers
    };
    this.setState({ showPreview: true, processingData: payload });
  }

  closePreview = () => {
    this.setState({ showPreview: false, processingData: null });
  }

  render() {
    const {
      error,
      handleSubmit,
      submitting,
      valid,
    } = this.props;

    const {
      certificateOfLiabilityInsuranceTitle,
      masterCertificateLabel,
      dateLabel,
      producerTitle,
      insurersTitle,
      coveragesTitle,
      endorsementsTitle,
    } = this.props.local.strings.processing.dataEntry;

    const {
      addDataEntryError,
    } = this.props.processing;

    const masterCertificateOptions = [{ label: 'No', value: 0 }, { label: 'Yes', value: 1 }];
    
    return (
      <div className="container-fluid">
        <form onSubmit={handleSubmit} className="entity-info-form">
          <div className="row">

            <div className="col-md-12">
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
                      <div className="col-md-6">
                        <div className="select-wrapper">
                          <Field
                            name="masterCertificate"
                            component={renderSelect}
                            options={masterCertificateOptions}
                          />
                        </div>
                      </div>
                    </div>                        
                    <div className="row pt-1">
                      <div className="col-md-6">
                        <label htmlFor="dateCertificate">{dateLabel}</label>
                      </div>
                      <div className="col-md-6">
                        <div className="select-wrapper">
                          <Field
                            name="dateCertificate"
                            type="date"
                            placeholder={'-- MM-DD-YYYY --'}
                            component={renderField}
                          />
                        </div>
                      </div>
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
                <FieldArray name="coverages" component={this.renderCoverages} />
              </div>
              <hr />
              <div className="container-fluid">
                <h2>{endorsementsTitle}</h2>
                {this.renderEndorsements()}
              </div>
            </div>
            <hr />            
            <div className="wiz-buttons">
              <div className="text-danger">{addDataEntryError}</div>
              <button
                className="bg-sky-blue-gradient bn bn-small"
                onClick={handleSubmit(values => this.openPreview({...values}))}
              >
                Preview & Save
              </button>
            </div>
          </div>
      </form>

      <Modal
        onHide={this.closeCreateInsurerModal}
        show={this.state.showCreateInsuredModal}
        className="add-item-modal" >
        <Modal.Body className="add-item-modal-body p-3 mt-0">
          <CreateInsurerModal
            close={this.closeCreateInsurerModal}
            onSave={this.onSaveInsurer}
          />
        </Modal.Body>
      </Modal>

      <Modal
        onHide={this.closeAddAgencyModal}
        show={this.state.showAddAgencyModal}
        className="add-item-modal" >
        <Modal.Body className="add-item-modal-body p-3 mt-0">
          <AddAgencyModal
            close={this.closeAddAgencyModal}
            onSave={this.onSaveAgency}
          />
        </Modal.Body>
      </Modal>

      <Modal
        onHide={this.closeAddAgentsModal}
        show={this.state.showAddAgentsModal && !!this.state.selectedAgency}
        className="add-item-modal" >
        <Modal.Body className="add-item-modal-body p-3 mt-0">
          <AddAgentsModal
            close={this.closeAddAgentsModal}            
            agencyId={this.state.selectedAgency}
            onSave={this.onSaveAgent}
          />
        </Modal.Body>
      </Modal>

      <Modal
        onHide={this.closePreview}
        show={this.state.showPreview}
        className="add-item-modal add-hc">
        <Modal.Body className="add-item-modal-body mt-0">
          <PreviewDataEntryModal
            close={this.closePreview}
            onSave={handleSubmit(values => 
                  this.props.onSubmit({ 
                    ...this.state.processingData
                  }))}
            certificateData={this.props.certificateData}
            processingData={this.state.processingData}
            fixedInsurers={this.state.fixedInsurers}
          />
        </Modal.Body>
      </Modal>
      
    </div>
    );
  }
};

DataEntryForm = reduxForm({
  form: 'DataEntryForm',
  validate,
  initialValues: {
    insurers: [],
    coverages: [],
  },
})(DataEntryForm);

const mapStateToProps = (state) => {
  const selector = formValueSelector('DataEntryForm');
  return {
    local: state.localization,
    processing: state.processing,
    currentInsurers: selector(state, 'insurers') || [],
    currentCoverages: selector(state, 'coverages') || [],
    holderRequirementSets: state.holderRequirementSets,
    register: state.register,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    processingActions: bindActionCreators(processingActions, dispatch),
    registerActions: bindActionCreators(registerActions, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(DataEntryForm);
