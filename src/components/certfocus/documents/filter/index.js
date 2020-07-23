import React from 'react';
import { Field, reduxForm, formValueSelector } from 'redux-form';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Utils from '../../../../lib/utils';
import renderField from '../../../customInputs/renderField';
import renderSelect from '../../../customInputs/renderSelect';
import renderRemovable from '../../../customInputs/renderRemovable';
import renderTypeAhead from '../../../customInputs/renderTypeAhead';
import FilterActions from '../../../common/filterActions/FilterActions'

import * as commonActions from '../../../common/actions';
import * as projectActions from '../../projects/actions';
import * as insuredActions from '../../insureds/actions';
import * as documentsActions from '../actions';

class FilterDocuments extends React.Component {
  componentDidMount() {
    this.props.documentsActions.fetchDocumentStatus();
    this.props.documentsActions.fetchDocumentTypes();
  }

  renderFormField = (element, idx) => {
    const {
      name,
      label,
      ph,
      type,
      conditional,
      show,
      options,
    } = element;

    const style = {};
    if (conditional && !show) {
      style.display = 'none';
    }

    if (type === 'typeAhead') {
      const { fetching, results, error, handleSearch, onSelect } = element;

      return (
        <div className="col-md no-padd" key={idx} style={style}>
          <div className="admin-form-field-wrapper keywords-field">
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
              onSelect={onSelect}
            />
          </div>
        </div>
      );
    } else if (type === 'removable') {
      const { valueText, disabled, onRemove } = element;
      return (
        <div className="col-md no-padd" key={idx} style={style}>
          <div className="admin-form-field-wrapper keywords-field">
            <label htmlFor={name}>{`${label}:`}</label>
            <Field
              name={name}
              valueText={valueText}
              component={renderRemovable}
              onRemove={onRemove}
              disabled={disabled}
            />
          </div>
        </div>
      );
    }

    return (
      <div className="col-md no-padd" key={idx} style={style}>
        <div className="admin-form-field-wrapper keywords-field">
          <label htmlFor={name}>{`${label}:`}</label>
          {
          options?
          <div className="select-wrapper">
            <Field
              name={name}
              component={renderSelect}
              options={options}
            />
          </div>
          :
          <Field
            name={name}
            type="text"
            placeholder={ph}
            component={renderField}
          />
        }
        </div>
      </div>
    );
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

  render() {
    const {
      title,
      holderLabel,
      insuredLabel,
      documentStatusLabel,
      projectLabel,
      documentTypeLabel,
      garbageLabel,
      urgentLabel,
    } = this.props.local.strings.documents.documentsList.filter;

    const {
      handleSubmit,
      holderIdCurrentValue,
      projectIdCurrentValue,
      insuredIdCurrentValue,
      holdersProjects,
      insureds,
    } = this.props;
    
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
    
    const garbageOptions = [
      { label: `-- Select ${garbageLabel} --`, value: '' },
      { label: 'Either', value: '' },
      { label: 'No', value: 0 },
      { label: 'Yes', value: 1 },
    ];
    const urgentOptions = [
      { label: `-- Select ${urgentLabel} --`, value: '' },
      { label: 'Either', value: '' },
      { label: 'Non urgent', value: 0 },
      { label: 'Urgent', value: 1 },
    ];

    const upperFields = [      
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
      { name: 'documentStatus', label: documentStatusLabel, options: documentStatusOptions },
    ];

    const centerFields = [
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
      { name: 'documentType', label: documentTypeLabel, options: documentTypeOptions },
      { name: 'garbage', label: garbageLabel, options: garbageOptions },
    ];

    const lowerFields = [
      { name: 'urgent', label: urgentLabel, options: urgentOptions },
    ];

    return (
      <form onSubmit={handleSubmit} className="list-view-filter-form">
        <h2 className="list-view-filter-title">{title}</h2>
        <div className="container-fluid filter-fields">
          <div className="row">
            {upperFields.map(this.renderFormField)}
          </div>
          <div className="row">
            {centerFields.map(this.renderFormField)}
          </div>
          <div className="row p-0">
            <div className="col-sm-4 p-0">
              {lowerFields.map(this.renderFormField)}
            </div>
          </div>

          <div className="row">
            <div className="col-md-12 d-flex justify-content-end">
              <FilterActions
                formName={this.props.form}
                dispatch={this.props.dispatch}
              />
            </div>
          </div>
        </div>
      </form>
    );
  }
}

FilterDocuments = reduxForm({
  form: 'FilterDocuments',
})(FilterDocuments);

const mapStateToProps = (state) => {
  return {
    local: state.localization,
    login: state.login,
    contacts: state.contacts,
    common: state.common,
    holdersProjects: state.holdersProjects,
    insureds: state.insureds,
    documents: state.documents,
    holderIdCurrentValue: formValueSelector('FilterDocuments')(state, 'holderId'),
    projectIdCurrentValue: formValueSelector('FilterDocuments')(state, 'projectId'),
    insuredIdCurrentValue: formValueSelector('FilterDocuments')(state, 'insuredId'),    
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    commonActions: bindActionCreators(commonActions, dispatch),
    projectActions: bindActionCreators(projectActions, dispatch),
    insuredActions: bindActionCreators(insuredActions, dispatch),
    documentsActions: bindActionCreators(documentsActions, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(FilterDocuments);
