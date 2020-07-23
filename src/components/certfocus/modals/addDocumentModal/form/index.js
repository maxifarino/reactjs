import React, { Component } from 'react';
import { Field, reduxForm, change, formValueSelector } from 'redux-form';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import renderField from '../../../../customInputs/renderField';
import renderSelect from '../../../../customInputs/renderSelect';
import renderRemovable from '../../../../customInputs/renderRemovable';
import renderTypeAhead from '../../../../customInputs/renderTypeAhead';
import Utils from '../../../../../lib/utils';

import * as commonActions from '../../../../common/actions';
import * as projectActions from '../../../projects/actions';
import * as insuredActions from '../../../insureds/actions';
import * as documentsActions from '../../../documents/actions';

import validate from './validation';

class AddDocumentForm extends Component {
  constructor(props) {
    super(props);
    const { document } = props;
    if (document) {
      console.log('DOC', document);      
      const { 
        Holder, 
        HolderName, 
        Insured,
        InsuredName,
        Project,
        ProjectName,
        DocumentStatusID,
        DocumentTypeID,
        GarbageFlag,
        UrgentFlag,
      } = document;

      props.dispatch(change('AddDocumentForm', 'holderId', { label:HolderName, value:Holder }));
      props.dispatch(change('AddDocumentForm', 'projectId', { label:ProjectName, value:Project }));
      props.dispatch(change('AddDocumentForm', 'insuredId', { label:InsuredName, value:Insured }));
      props.dispatch(change('AddDocumentForm', 'documentStatus', DocumentStatusID || ''));
      props.dispatch(change('AddDocumentForm', 'documentType', DocumentTypeID || ''));
      props.dispatch(change('AddDocumentForm', 'garbage', GarbageFlag || ''));
      props.dispatch(change('AddDocumentForm', 'urgent', UrgentFlag || ''));
    }
    //props.insuredActions.resetTypeAheadResults();
  }

  componentDidMount() {
    this.props.documentsActions.fetchDocumentStatus();
    this.props.documentsActions.fetchDocumentTypes();
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
    const { type, name, label, ph, options, conditional, show } = element;
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
      <div key={idx} className="wiz-field admin-form-field-wrapper" style={style}>
        <label htmlFor={name}>{`${label}:`}</label>
        {
          options?
          <div className="select-wrapper">
            <Field
              name={name}
              component={renderSelect}
              options={options} />
          </div>
          :
          <Field
            name={name}
            type={fieldType}
            placeholder={ph}
            component={renderField} />
        }
      </div>
    );
  }

  render() {
    const { 
      handleSubmit, 
      holderIdCurrentValue,
      projectIdCurrentValue,
      insuredIdCurrentValue,
      holdersProjects,
      insureds,
    } = this.props;
    
    const {
      holderLabel,
      insuredLabel,
      documentStatusLabel,
      projectLabel,
      documentTypeLabel,
      garbageLabel,
      urgentLabel,
      cancelButton,
      saveButton
    } = this.props.local.strings.documents.addDocumentModal;
    
    const {
      typeAheadResults,
      typeAheadFetching,
      typeAheadError,
    } = this.props.common;

    const {
      documentStatusList,
      documentTypesList,
    } = this.props.documents;

    const holderOptions = Utils.getOptionsList(null, typeAheadResults, 'name', 'id', 'name');
    const projectOptions = Utils.getOptionsList(null, holdersProjects.typeAheadResults, 'name', 'id', 'name');
    const insuredOptions = Utils.getOptionsList(null, insureds.typeAheadResults, 'InsuredName', 'Id', 'InsuredName');
    const documentStatusOptions = Utils.getOptionsList(`-- Select ${documentStatusLabel} --`, documentStatusList, 'DocumentStatus', 'DocumentStatusID', 'DocumentStatus');
    const documentTypeOptions = Utils.getOptionsList(`-- Select ${documentTypeLabel} --`, documentTypesList, 'DocumentTypeName', 'DocumentTypeID', 'DocumentTypeName');

    const fields = [      
      {
        name:'holderId', label: holderLabel, ph: `-- Search ${holderLabel} --`, type: 'typeAhead',
        handleSearch: this.handleHolderSearch, fetching: typeAheadFetching, results: holderOptions,
        error: typeAheadError, conditional: true, show: !holderIdCurrentValue
      },
      {
        name:'holderId', label: holderLabel, type: 'removable',
        valueText: holderIdCurrentValue ? holderIdCurrentValue.label : '',
        conditional: true, show: holderIdCurrentValue,
      },
      {
        name:'insuredId', label: insuredLabel, ph: `-- Search ${insuredLabel} --`, type: 'typeAhead',
        handleSearch: this.handleInsuredSearch, fetching: insureds.typeAheadFetching, results: insuredOptions,
        error: insureds.typeAheadError, conditional: true, show: !insuredIdCurrentValue
      },
      {
        name:'insuredId', label: insuredLabel, type: 'removable',
        valueText: insuredIdCurrentValue ? insuredIdCurrentValue.label : '',
        conditional: true, show: insuredIdCurrentValue,
      },
      {
        name:'projectId', label: projectLabel, ph: `-- Search ${projectLabel} --`, type: 'typeAhead',
        handleSearch: this.handleProjectSearch, fetching: holdersProjects.typeAheadFetching, results: projectOptions,
        error: holdersProjects.typeAheadError, conditional: true, show: !projectIdCurrentValue
      },
      {
        name:'projectId', label: projectLabel, type: 'removable',
        valueText: projectIdCurrentValue ? projectIdCurrentValue.label : '',
        conditional: true, show: projectIdCurrentValue
      },
      { name: 'documentStatus', label: documentStatusLabel, options: documentStatusOptions },
      { name: 'documentType', label: documentTypeLabel, options: documentTypeOptions },
      { name: 'garbage', label: garbageLabel, type: 'checkbox' },
      { name: 'urgent', label: urgentLabel, type: 'checkbox' },
    ];

    return (
      <form
        onSubmit={handleSubmit}
        className="entity-info-form" >

        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              {fields.map(this.renderFormField)}
            </div>
          </div>
        </div>

        {
          this.props.documents.errorPostDocuments &&
          <div className="error-item-form">
            { this.props.documents.errorPostDocuments }
          </div>
        }

        <div className="add-item-bn">
          <button
            className="bn bn-small bg-green-dark-gradient create-item-bn icon-save"
            type="submit" >
            {saveButton}
          </button>
          <a
            className="cancel-add-item"
            onClick={this.props.close} >
            {cancelButton}
          </a>
        </div>

      </form>
    );
  }
};

AddDocumentForm = reduxForm({
  form: 'AddDocumentForm',
  validate
})(AddDocumentForm);

const mapStateToProps = (state) => {
  return {
    currentForm: state.form,
    local: state.localization,
    common: state.common,
    documents: state.documents,
    holdersProjects: state.holdersProjects,
    insureds: state.insureds,
    holderIdCurrentValue: formValueSelector('AddDocumentForm')(state, 'holderId'),
    projectIdCurrentValue: formValueSelector('AddDocumentForm')(state, 'projectId'),
    insuredIdCurrentValue: formValueSelector('AddDocumentForm')(state, 'insuredId'),    
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    commonActions: bindActionCreators(commonActions, dispatch),
    projectActions: bindActionCreators(projectActions, dispatch),
    insuredActions: bindActionCreators(insuredActions, dispatch),
    documentsActions: bindActionCreators(documentsActions, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddDocumentForm);
