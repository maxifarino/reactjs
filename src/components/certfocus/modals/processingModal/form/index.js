import React, { Component } from 'react';
import { Field, reduxForm, change, formValueSelector } from 'redux-form';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PDFViewer from './PDFViewer';
import renderField from '../../../../customInputs/renderField';
import renderSelect from '../../../../customInputs/renderSelect';
import renderRemovable from '../../../../customInputs/renderRemovable';
import renderTypeAhead from '../../../../customInputs/renderTypeAhead';
import Utils from '../../../../../lib/utils';

import * as commonActions from '../../../../common/actions';
import * as projectActions from '../../../projects/actions';
import * as insuredActions from '../../../insureds/actions';
import * as documentsActions from '../../../documents/actions';
import * as documentQueueDefinitionsActions from './../../../settings/documentQueueDefinitions/actions';

import validate from './validation';

class ProcessingForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showQueues: false
    }

    const { document } = props;
    if (document) {
      console.log('DOC', document);      
      const { 
        HolderID, 
        HolderName, 
        InsuredID,
        InsuredName,
        ProjectID,
        ProjectName,
        DocumentTypeID,
        UrgentFlag,
      } = document;

      props.dispatch(change('ProcessingForm', 'holderId', { label: HolderName, value: HolderID }));
      props.dispatch(change('ProcessingForm', 'projectId', { label: ProjectName, value: ProjectID }));
      props.dispatch(change('ProcessingForm', 'insuredId', { label: InsuredName, value: InsuredID }));
      props.dispatch(change('ProcessingForm', 'documentTypeId', DocumentTypeID || ''));
      props.dispatch(change('ProcessingForm', 'urgent', UrgentFlag || ''));
    }
    //props.insuredActions.resetTypeAheadResults();
  }

  componentDidMount() {
    this.props.documentsActions.fetchDocumentTypes();
    this.props.documentsActions.fetchDocumentStatus();
    this.props.documentQueueDefinitionsActions.fetchDocumentQueueDefinitions({ withoutPag: true, documentsPage: true });
  }

  handleHolderSearch = (filterTerm) => {
    this.props.commonActions.fetchTypeAhead({ nameTerm: filterTerm });
  }

  handleProjectSearch = (filterTerm) => {
    //const { insuredId } = this.props;
    const query = {
      projectName: filterTerm,
      //insuredId: insuredId,
    };

    this.props.projectActions.fetchTypeAhead(query);
  }

  handleInsuredSearch = (filterTerm) => {
    this.props.insuredActions.fetchTypeAhead(filterTerm);
  }

  renderFormField = (element, idx) => {
    const { type, name, label, ph, options, conditional, show, defaultValue, checked, disabled } = element;
    const fieldType = type || 'text';
    const style = {};
    if (conditional && !show) {
      style.display = 'none';
    }

    if (fieldType === 'typeAhead') {
      const { fetching, results, error, handleSearch } = element;

      return (
        <div key={idx} className="wiz-field admin-form-field-wrapper" style={style}>
          <label htmlFor={name}>{`${label}:`}</label>
          <Field
            resetOnClick
            name={name}
            placeholder={ph}
            fetching={fetching}
            results={results}
            handleSearch={handleSearch}
            fetchError={error}
            component={renderTypeAhead}
          />
        </div>
      );
    } else if (fieldType === 'removable') {
      const { valueText, disabled } = element;
      return (
        <div key={idx} className="wiz-field admin-form-field-wrapper" style={style}>
          <label htmlFor={name}>{`${label}:`}</label>
          <Field
            name={name}
            valueText={valueText}
            component={renderRemovable}
            disabled={disabled}
          />
        </div>
      );
    }

    return (
      <div key={idx} className="admin-form-field-wrapper" style={style}>
        <label htmlFor={name}>{`${label}:`}</label>
        {
          options ? (
            <div className="select-wrapper">
              <Field
                name={name}
                component={renderSelect}
                options={options} 
                defaultValue={defaultValue}
                disabled={disabled}
              />
            </div>
          ) : ((type === 'checkbox') ? (
              <Field
                name={name}
                type={fieldType}
                placeholder={ph}
                component={renderField}
                checked={checked}    
                disabled={disabled}        
              />
            ) : (
              <Field
                name={name}
                type={fieldType}
                placeholder={ph}
                component={renderField}
                checked={true}            
              />
            ) 
          )  
        }
      </div>
    );
  }

  render() {    
    const { 
      handleSubmit,
      document,
      holderIdCurrentValue,
      projectIdCurrentValue,
      insuredIdCurrentValue,
      documentTypeCurrentValue,
      holdersProjects,
      insureds,
    } = this.props;
    
    const {
      holderLabel,
      insuredLabel,
      projectLabel,
      documentTypeLabel,
      documentStatusLabel,
      urgentLabel,
      garbageLabel,
      // cancelButton,
      // saveButton
    } = this.props.local.strings.documents.addDocumentModal;
    
    const {
      typeAheadResults,
      typeAheadFetching,
      typeAheadError,
    } = this.props.common;

    const {
      documentTypesList,
      documentStatusList,
    } = this.props.documents;

    const holderOptions = Utils.getOptionsList(null, typeAheadResults, 'name', 'id', 'name');
    const projectOptions = Utils.getOptionsList(null, holdersProjects.typeAheadResults, 'name', 'id', 'name');
    const insuredOptions = Utils.getOptionsList(null, insureds.typeAheadResults, 'InsuredName', 'Id', 'InsuredName');
    const documentTypeOptions = Utils.getOptionsList(null, documentTypesList, 'DocumentTypeName', 'DocumentTypeID', 'DocumentTypeName');
    const documentStatusOptions = Utils.getOptionsList(`-- Select ${documentStatusLabel} --`, documentStatusList, 'DocumentStatus', 'DocumentStatusID', 'DocumentStatus');
    const queueOptions = Utils.getOptionsList(`-- Select a Queue --`, this.props.documentQueueDefinitions.list, 'Name', 'QueueId', 'Name');

    const { CFRoleId } = this.props.login.profile;    
    const availableRoles = [8, 12, 13, 14]; // CFAdmin  - DepartmentManager - AccountManager - Processor

    const disabledByRole = (availableRoles.find(e => e === Number(CFRoleId))) ? false : true;
    const disabledByDocumentStatus = document && 
      (document.DocumentStatusID === 11 || document.DocumentStatusID === 14) ? true : false;  // Processing Complete Status, 
    
    const selectedDocumentType = (documentTypeCurrentValue) ? Number(documentTypeCurrentValue) : 1;
    console.log('disabledByRole:', disabledByRole, ' disabledByDocumentStatus:', disabledByDocumentStatus)
    console.log('selectedDocumentType:', selectedDocumentType, ' document.DocumentStatusID:', document && document.DocumentStatusID);

    const leftFields = [
      {
        name:'holderId', label: holderLabel, ph: `-- Search ${holderLabel} --`, type: 'typeAhead',
        handleSearch: this.handleHolderSearch, fetching: typeAheadFetching, results: holderOptions,
        error: typeAheadError, conditional: true, show: !holderIdCurrentValue
      },
      {
        name:'holderId', label: holderLabel, type: 'removable',
        valueText: holderIdCurrentValue ? holderIdCurrentValue.label : '',
        conditional: true, show: holderIdCurrentValue, disabled: disabledByDocumentStatus
      },
      {
        name:'insuredId', label: insuredLabel, ph: `-- Search ${insuredLabel} --`, type: 'typeAhead',
        handleSearch: this.handleInsuredSearch, fetching: insureds.typeAheadFetching, results: insuredOptions,
        error: insureds.typeAheadError, conditional: true, show: !insuredIdCurrentValue
      },
      {
        name:'insuredId', label: insuredLabel, type: 'removable',
        valueText: insuredIdCurrentValue ? insuredIdCurrentValue.label : '',
        conditional: true, show: insuredIdCurrentValue, disabled: disabledByDocumentStatus
      },
      {
        name:'projectId', label: projectLabel, ph: `-- Search ${projectLabel} --`, type: 'typeAhead',
        handleSearch: this.handleProjectSearch, fetching: holdersProjects.typeAheadFetching, results: projectOptions,
        error: holdersProjects.typeAheadError, conditional: true, show: !projectIdCurrentValue
      },
      {
        name:'projectId', label: projectLabel, type: 'removable',
        valueText: projectIdCurrentValue ? projectIdCurrentValue.label : '',
        conditional: true, show: projectIdCurrentValue, disabled: disabledByDocumentStatus
      },
    ];

    const rightFields = [
      { 
        name: 'documentTypeId', 
        label: documentTypeLabel, 
        options: documentTypeOptions,
        defaultValue: (document && document.DocumentTypeId) ? document.DocumentTypeId : 1, // Certificate of Insurance by default
        disabled: disabledByDocumentStatus
      },
      { 
        name: 'queueId', 
        label: 'Data Entry Queue', 
        options: queueOptions, 
        conditional: true, 
        show: (selectedDocumentType === 1 && !disabledByRole),
        disabled: disabledByDocumentStatus
      },
      { 
        name: 'urgent', 
        label: urgentLabel, 
        type: 'checkbox',
        conditional: true,
        show: (selectedDocumentType === 1 && !disabledByRole),
        disabled: disabledByDocumentStatus,
      },
      { 
        name: 'garbage', 
        label: garbageLabel, 
        type: 'checkbox',
      },
      { 
        name: 'documentDate', 
        label: 'Document Date',
        type: 'date',
        conditional: true, 
        show: (selectedDocumentType !== 1)
      },
      { 
        name: 'expireDate', 
        label: 'Expire Date',
        type: 'date',
        conditional: true, 
        show: (selectedDocumentType !== 1)
      },
      { 
        name: 'documentStatusId', 
        label: 'Document Status', 
        options: documentStatusOptions,
        conditional: true, 
        show: (selectedDocumentType !== 1)
      },
    ];    
    
    return (
      <form
        onSubmit={handleSubmit}
        className="entity-info-form" >

        <div className="container-fluid">
          <div className="row">
            <div className="col">
              {leftFields.map(this.renderFormField)}
            </div>
            <div className="col">
              {rightFields.map(this.renderFormField)}
            </div>
          </div>
        </div>

        <div className="container-fluid">
          <div className="row">
            <div className="col">
              <nav className="list-view-nav" style={{ textAlign: 'center' }}>
                <ul>
                  <li>
                    <a
                      className="list-view-nav-link nav-bn no-overlapping"
                      style={{ display: (document && ((document.DocumentStatusID === undefined) || (document.DocumentStatusID === 4) || (document.DocumentStatusID === 10))) ? 'inline' : 'none' }}
                      onClick={handleSubmit(values => this.props.onSubmit({...values, submitType: 'sendToProcessing'}))}
                    >
                      Send to Processing
                    </a>                    
                  </li>
                  <li>
                    <a
                      className="list-view-nav-link nav-bn no-overlapping"
                      style={{ display: (selectedDocumentType === 1 && !disabledByRole && !disabledByDocumentStatus) ? 'inline' : 'none' }}
                      onClick={handleSubmit(values => this.props.onSubmit({...values, submitType: 'sendToDataEntry'}))}
                    >
                      Send to Data Entry
                    </a>                    
                  </li>
                  <li>
                  {(document && (document.canViewDataEntry !== false)) && (
                    <a
                      className="list-view-nav-link nav-bn no-overlapping"
                      style={{ display: (selectedDocumentType === 1 && !disabledByRole) ? 'inline' : 'none' }}
                      onClick={handleSubmit(values => this.props.onSubmit({...values, submitType: 'doDataEntry'}))}
                    >
                      Do Data Entry
                    </a>
                  )}  
                  </li>
                  <li>
                    <a
                      className="list-view-nav-link nav-bn no-overlapping"
                      style={{ display: (selectedDocumentType !== 1) ? 'inline' : 'none' }}
                      onClick={handleSubmit(values => this.props.onSubmit({...values, submitType: 'save'}))}
                    >
                      Save
                    </a>                    
                  </li>
                </ul>
              </nav>              
            </div>
          </div>
        </div>

        <div className="container-fluid" style={{ marginTop: '20px' }}>
          <div className="row">
            <div className="col">
              {document && document.DocumentUrl ? (
                <PDFViewer
                  pdf={document.DocumentUrl}
                  height="75vh"
                  width="100%"
                  position="sticky"
                  top="10px"
                  frameBorder="1p solid #000"
                />
              ) : (
                <div className="spinner-wrapper">
                  <div className="spinner" />
                </div>
              )}
            </div>
          </div>
        </div>

        {
          this.props.documents.errorPostDocuments &&
          <div className="error-item-form">
            { this.props.documents.errorPostDocuments }
          </div>
        }

      </form>
    );
  }
};

ProcessingForm = reduxForm({
  form: 'ProcessingForm',
  validate
})(ProcessingForm);

const mapStateToProps = (state) => {
  return {
    currentForm: state.form,
    local: state.localization,
    login: state.login,
    common: state.common,
    documents: state.documents,
    holdersProjects: state.holdersProjects,
    insureds: state.insureds,
    documentQueueDefinitions: state.documentQueueDefinitions,
    holderIdCurrentValue: formValueSelector('ProcessingForm')(state, 'holderId'),
    projectIdCurrentValue: formValueSelector('ProcessingForm')(state, 'projectId'),
    insuredIdCurrentValue: formValueSelector('ProcessingForm')(state, 'insuredId'),
    documentTypeCurrentValue: formValueSelector('ProcessingForm')(state, 'documentTypeId'),    
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    commonActions: bindActionCreators(commonActions, dispatch),
    projectActions: bindActionCreators(projectActions, dispatch),
    insuredActions: bindActionCreators(insuredActions, dispatch),
    documentsActions: bindActionCreators(documentsActions, dispatch),
    documentQueueDefinitionsActions: bindActionCreators(documentQueueDefinitionsActions, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProcessingForm);
