import React from 'react';
import { Field, reduxForm, change } from 'redux-form';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import _ from 'lodash';

import renderField from '../../../../customInputs/renderField';
import renderSelect from '../../../../customInputs/renderSelect';
import renderRemovable from '../../../../customInputs/renderRemovable';
import renderTypeAhead from '../../../../customInputs/renderTypeAhead';

import * as commonActions from '../../../../common/actions';
import * as projectsActions from '../../../projects/actions';
import * as reqSetsActions from '../../../requirement-sets/actions';

import Utils from '../../../../../lib/utils';
// import asyncValidate from './asyncValidation';
import validate from './validation';
import  { isEmpty } from 'lodash';

class ProjectInfoForm extends React.Component {
  constructor(props) {
		super(props);

    const { project, fromHolderTab, holdersProfile } = props;

    if (!project && fromHolderTab) {
      const { profileData } = holdersProfile;
      props.dispatch(change('ProjectInfoForm', 'holderId', { value: profileData.id, label: profileData.name } || ""));
      props.projectsActions.fetchHolderCustomFields(profileData.id);
      props.reqSetsActions.fetchRequirementSetsPossibleValues({ holderId: profileData.id, archived: 0 });
    }

    if (project) {
      const { holderId, holderName } = project;
      const holderObj = {
        value: holderId,
        label: holderName
			};
			
      props.reqSetsActions.fetchRequirementSetsPossibleValues({ holderId: holderId, archived: 0 });
      props.projectsActions.fetchHolderCustomFields(holderId);

      props.dispatch(change('ProjectInfoForm', 'name', project.name || ""));
      props.dispatch(change('ProjectInfoForm', 'holderId', holderObj || ""));
      props.dispatch(change('ProjectInfoForm', 'address1', project.address1 || ""));
      if (project.address2 !== "not available") {
        props.dispatch(change('ProjectInfoForm', 'address2', project.address2 || ""));
      }
      props.dispatch(change('ProjectInfoForm', 'city', project.city || ""));
      props.dispatch(change('ProjectInfoForm', 'state', project.state || ""));
      props.dispatch(change('ProjectInfoForm', 'zipCode', project.zipCode || ""));
      props.dispatch(change('ProjectInfoForm', 'CFCountryId', project.CFCountryId || ""));
      props.dispatch(change('ProjectInfoForm', 'reqSet', project.RequirementSetID || ""));

      props.dispatch(change('ProjectInfoForm', 'note', project.CFNote || ""));
      // props.dispatch(change('ProjectInfoForm', 'statusId', project.statusId || ""));
      props.dispatch(change('ProjectInfoForm', 'CFContactName', project.CFContactName || ""));
      props.dispatch(change('ProjectInfoForm', 'CFContactPhone', project.CFContactPhone || ""));
      props.dispatch(change('ProjectInfoForm', 'number', project.number || ""));
      props.dispatch(change('ProjectInfoForm', 'customAttribute', project.customAttribute || ""));
      props.dispatch(change('ProjectInfoForm', 'description', project.description || ""));

      //SET CUSTOM FIELD VALUES
      const { projectCustomFields } = project;
      if (projectCustomFields && projectCustomFields.length) {
        projectCustomFields.forEach(field => {
          const { CustomFieldId, FieldValue, Archived } = field;
          if (!Archived) {
            const fieldName = `customField-${CustomFieldId}`;
            props.dispatch(change('ProjectInfoForm', fieldName, FieldValue || ""));
          }
        });
      }
    }
  }

  componentWillUnmount() {
    if (!this.props.fromProjectView) {
      this.props.projectsActions.setCustomFieldsList([]);
    }
  }

  onRemoveHolder = () => {
    this.props.commonActions.resetTypeAheadResults();
    this.props.projectsActions.setCustomFieldsList([]);
    this.props.reqSetsActions.setReqSetsPossibleValues([]);
  }

  onSelectHolder = (holder) => {
    this.props.projectsActions.fetchHolderCustomFields(holder.value);
    this.props.reqSetsActions.fetchRequirementSetsPossibleValues({ holderId: holder.value });
  }

  searchHolder = (filterTerm) => {
    this.props.commonActions.fetchTypeAhead({ nameTerm: filterTerm });
  }

  getCustomFieldOptions = (options) => {
    const arr = options.split(',');
    return [
      { label: '--select--', value: '' },
      ...arr.map((opt) => { return { label: opt, value: opt } })
    ];
  }

  renderFormField = (element, idx) => {    
    const { type, name, label, ph, options, conditional, show } = element;
    const fieldType = type || 'text';
    const style = {};
    if (conditional && !show) {
      style.display = 'none';
    }

    if (fieldType === 'typeAhead') {
      const { fetching, results, error, handleSearch, onSelect } = element;

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
            onSelect={onSelect}
          />
        </div>
      );
    } else if (fieldType === 'removable') {
      const { valueText, disabled, onRemove } = element;
      return (
        <div key={idx} className="wiz-field admin-form-field-wrapper" style={style}>
          <label htmlFor={name}>{`${label}:`}</label>
          <Field
            name={name}
            valueText={valueText}
            component={renderRemovable}
            onRemove={onRemove}
            disabled={disabled}
          />
        </div>
      );
    }

    return (
      <div key={idx} className="wiz-field admin-form-field-wrapper" style={style}>
        <label htmlFor={name}>{`${label}:`}</label>
        {
          options ?
            <div className="select-wrapper">
              <Field
                name={name}
                component={renderSelect}
                options={options}
                defaultValue={name == 'CFCountryId' ? '1' : null} />
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
    const { addProjectCustomFields, addProjectCustomFieldsFetching } = this.props.projects;
    const { handleSubmit } = this.props;
    const {
      labelProjectName,
      labelHolder,
      labelAddress1,
      labelAddress2,
      labelCity,
      labelState,
      labelPostalCode,
      labelCountry,
      labelReqSet,
      labelProjectNote,
      labelContactName,
      labelContactPhone,
      labelProjectNumber,
      labelProjectDescription,
      // labelStatus,
      cancel,
      saveButton,
    } = this.props.local.strings.hcProfile.projects.addProjectModal.projectTab;
    const {
      typeAheadResults,
      typeAheadFetching,
      typeAheadError } = this.props.common;
    const { fromHolderTab, holderRequirementSets } = this.props;

    // Filter RequirementSets without any RuleGroup defined
    const requirementSetFilteredOptions = holderRequirementSets.possibleValuesResults.filter((e => e.HasRuleGroup > 0));
    
    const holderOptions = Utils.getOptionsList(null, typeAheadResults, 'name', 'id', 'name');
    const countryOptions = Utils.getOptionsList('--Select Country--', this.props.common.countries, 'name', 'id', 'name');
    const reqSetOptions = Utils.getOptionsList('--Select Req. Set.--', requirementSetFilteredOptions, 'Name', 'Id', 'Name');

    const holder = _.get(this.props, 'currentForm.ProjectInfoForm.values.holderId', null);
    const country = _.get(this.props, 'currentForm.ProjectInfoForm.values.CFCountryId', '');

    const customFields = addProjectCustomFields.length > 0 ? addProjectCustomFields.map((item, index) => {
      const fieldType = parseInt(item.FieldTypeId, 10);
      if (fieldType === 2) {
        return {
          name: `customField-${item.CustomFieldId}`,
          label: item.CustomFieldName,
          options: this.getCustomFieldOptions(item.FieldOptions)
        };
      } else {
        return {
          name: `customField-${item.CustomFieldId}`,
          label: item.CustomFieldName,
          type: fieldType === 3 ? 'number' : 'text'
        };
      }
    }) : {};

    const leftFields = [
      { name: 'name', label: labelProjectName, ph: '--project name--' },
      {
        name: 'holderId', label: labelHolder, ph: '--search holder--', type: 'typeAhead',
        handleSearch: this.searchHolder, fetching: typeAheadFetching, results: holderOptions,
        onSelect: this.onSelectHolder, error: typeAheadError, conditional: true, show: !holder
      },
      {
        name: 'holderId', label: labelHolder, type: 'removable',
        valueText: holder ? holder.label : '', onRemove: this.onRemoveHolder,
        disabled: fromHolderTab, conditional: true, show: holder,
      },
      { name: 'address1', label: labelAddress1, ph: '--address line 1--' },
      { name: 'address2', label: labelAddress2, ph: '--address line 2--' },
      { name: 'city', label: labelCity, ph: '--city--' },
      { name: 'state', label: labelState, ph: '--state--' },
      { name: 'zipCode', label: labelPostalCode, ph: '--postal code--' },
      { name: 'CFCountryId', label: labelCountry, options: countryOptions, defaultValue: '' },
      { name: 'reqSet', label: labelReqSet, options: reqSetOptions },
      { name: 'note', label: labelProjectNote, ph: '', type: 'textarea' },
		]
		let rightFields = [];
		if(isEmpty(customFields)) {
			rightFields = [
				// { name:'statusId', label:labelStatus, options: statusOptions },
				{ name: 'CFContactName', label: labelContactName, ph: '--contact name--' },
				{ name: 'CFContactPhone', label: labelContactPhone, ph: '--phone number--' },
				{ name: 'number', label: labelProjectNumber, ph: '--project number--' },
				{ name: 'description', label: labelProjectDescription, ph: '', type: 'textarea' },
			];
		} else {
			rightFields = [
				// { name:'statusId', label:labelStatus, options: statusOptions },
				{ name: 'CFContactName', label: labelContactName, ph: '--contact name--' },
				{ name: 'CFContactPhone', label: labelContactPhone, ph: '--phone number--' },
				{ name: 'number', label: labelProjectNumber, ph: '--project number--' },
				...customFields,
				{ name: 'description', label: labelProjectDescription, ph: '', type: 'textarea' },
			];
		}

    if (addProjectCustomFieldsFetching) {
      return (
        <div className="spinner-wrapper">
          <div className="spinner" />
        </div>
      );
    }

    return (
      <form
        onSubmit={handleSubmit}
        className="entity-info-form wiz-form"
      >
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-6 col-sm-12">
              {leftFields.map(this.renderFormField)}
            </div>
            <div className="col-md-6 col-sm-12">
              {rightFields.map(this.renderFormField)}
            </div>
          </div>
        </div>
        <div className="wiz-buttons">
          <div>
            <a className="wiz-cancel-button" onClick={this.props.close}>{cancel}</a>
            <button className="wiz-continue-btn bg-sky-blue-gradient bn">{saveButton}</button>
          </div>
        </div>
      </form>
    );
  }
};

ProjectInfoForm = reduxForm({
  form: 'ProjectInfoForm',
  validate,
  //asyncValidate,
  //asyncBlurFields: ['projectName'],
})(ProjectInfoForm);

const mapStateToProps = (state) => {
  return {
    currentForm: state.form,
    local: state.localization,
    holders: state.holders,
    projects: state.holdersProjects,
    common: state.common,
    holdersProfile: state.holdersProfile,
    holderRequirementSets: state.holderRequirementSets,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    commonActions: bindActionCreators(commonActions, dispatch),
    projectsActions: bindActionCreators(projectsActions, dispatch),
    reqSetsActions: bindActionCreators(reqSetsActions, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProjectInfoForm);
