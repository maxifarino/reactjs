import React, { Component } from 'react';
import { reduxForm, Field, change, formValueSelector } from 'redux-form';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import renderField from '../../../../customInputs/renderField';
import renderSelect from '../../../../customInputs/renderSelect';
import renderTypeAhead from '../../../../customInputs/renderTypeAhead';
import renderRemovable from '../../../../customInputs/renderRemovable';
import Utils from '../../../../../lib/utils';
import _ from 'lodash';

import * as reqSetsActions from '../../actions';
import * as coverageTypeActions from '../../../coverage-types/actions';

import validation from './requirementValidation';

class RequirementForm extends Component {
  componentDidMount() {
    const { requirement, dispatch } = this.props;

    if (requirement) {
      const attributeObj = {
        value: requirement.AttributeID,
        label: requirement.AttributeName,
      };
      console.log('RequirementForm', requirement);
      dispatch(change('RequirementSetsRequirementForm', 'attribute', requirement.AttributeID ? attributeObj : null));
      dispatch(change('RequirementSetsRequirementForm', 'conditionTypeId', requirement.ConditionTypeID || ''));
      dispatch(change('RequirementSetsRequirementForm', 'conditionValue', (requirement.ConditionValue !== '') ? requirement.ConditionValue : ''));
      dispatch(change('RequirementSetsRequirementForm', 'deficiencyTypeId', requirement.DeficiencyTypeID || ''));
      dispatch(change('RequirementSetsRequirementForm', 'deficiencyText', requirement.DeficiencyText || ''));
    }
  }

  componentWillUnmount() {
    this.props.coverageTypeActions.resetTypeAheadResults();
    this.props.actions.resetAttributeTypeAheadResults();
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
      onChange,
    } = element;

    const style = {};
    if (conditional && !show) {
      style.display = 'none';
    }

    if (type === 'typeAhead') {
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
    } else if (type === 'removable') {
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

    if (options) {
      return (
        <div key={idx} className="admin-form-field-wrapper" style={style}>
          <label htmlFor={name}>{`${label}:`}</label>
          <div className="select-wrapper">
            <Field
              name={name}
              component={renderSelect}
              options={options}
              onChange={onChange}
            />
          </div>
        </div>
      );
    }
    return (
      <div key={idx} className="admin-form-field-wrapper" style={style}>
        <label htmlFor={name}>{`${label}:`}</label>
        <Field
          name={name}
          type={type || "text"}
          placeholder={ph}
          valueText={element.valueText}
          component={renderField}
        />
      </div>
    );
  }

  onRemoveCoverageType = () => {
    this.props.dispatch(change('RequirementSetsRequirementForm', 'coverageType', null));
    this.props.dispatch(change('RequirementSetsRequirementForm', 'ruleGroupName', ''));
  }

  onSelectCoverageType = (selected) => {
    console.log('onSelectCoverageType',selected);
    this.props.dispatch(change('RequirementSetsRequirementForm', 'coverageType', selected));
    this.props.dispatch(change('RequirementSetsRequirementForm', 'ruleGroupName', selected.label));
  }

  render() {    
    const {
      handleSubmit,
      conditionTypeCurrentValue,
      attributeCurrentValue,
      fromSettingsTab,
      coverageTypeValue,
      requirement,
      coverageTypeActions,
      holderId,
    } = this.props;    

    const {
      valueStatusOptions,
      deficiencyTypeOptions,
      valueRatingOptions,
      conditionPossibleValues
    } = this.props.holderRequirementSets;

    const {
      titleText,
      attributeLabel,
      conditionLabel,
      valueLabel,
      deficiencyTextLabel,
      deficiencyTypeLabel,
      saveButton,
      cancelButton,
    } = this.props.local.strings.holderRequirementSets.details.addRequirementModal;

    const {
      nameLabel,
      coverageLabel,
    } = this.props.local.strings.holderRequirementSets.details.addRequirementGroupModal;

    const {
      typeAheadError,
      typeAheadFetching,
      typeAheadResults,
    } = this.props.coverageTypes;

    const {
      attributeTypeAheadError,
      attributeTypeAheadFetching,
      attributeTypeAheadResults,
    } = this.props.holderRequirementSets;

    const selectedCoverageTypeId = (requirement) 
      ? requirement.CoverageTypeID 
      : (coverageTypeValue) ? coverageTypeValue.value : undefined;

    const coverageOptions = Utils.getOptionsList(null, typeAheadResults, 'Name', 'CoverageTypeID', 'Name');
    const attributeOptions = Utils.getOptionsList(null, attributeTypeAheadResults, 'AttributeName', 'AttributeID', 'AttributeName');
    const fields = [
      {
        name: 'coverageType', label: coverageLabel, ph:'-- Search Coverage Type --', type: 'typeAhead',
        handleSearch: (term) => coverageTypeActions.fetchTypeAhead({ name: term, holderId }), fetching: typeAheadFetching, results: coverageOptions,
        error: typeAheadError, conditional: true, show: !coverageTypeValue && fromSettingsTab && !requirement, onSelect: this.onSelectCoverageType,
        onRemove: this.onRemoveHolder
      },
      {
        name: 'coverageType', label: coverageLabel, type: 'removable',
        valueText: coverageTypeValue ? coverageTypeValue.label : '', onRemove: this.onRemoveCoverageType,
        conditional: true, show: coverageTypeValue && fromSettingsTab && !requirement,
      },
      { 
        name: 'ruleGroupName', label: nameLabel, ph: '-- Name --', conditional: true,
        show: fromSettingsTab && !requirement
      },
      {
        name: 'attribute', label: attributeLabel, ph:'-- Attribute --', type: 'typeAhead',
        handleSearch:  (term) => this.props.actions.fetchAttributeTypeAhead({ name: term, coverageTypeId: selectedCoverageTypeId }), fetching: attributeTypeAheadFetching, results: attributeOptions,
        error: attributeTypeAheadError, conditional: true, show: !attributeCurrentValue,
      },
      {
        name: 'attribute', label: attributeLabel, type: 'removable',
        valueText: attributeCurrentValue ? attributeCurrentValue.label : '', onRemove: this.onRemoveHolder,
        conditional: true, show: attributeCurrentValue,
      },
      { name: 'conditionTypeId', label: conditionLabel, options: conditionPossibleValues },
      { name: 'conditionValue', label: valueLabel, ph: '-- 00 --', conditional: true, show: Number(conditionTypeCurrentValue) > 3 },
      { name: 'conditionValue', label: valueLabel, conditional: true, show: Number(conditionTypeCurrentValue) === 1, options: valueStatusOptions },
      { name: 'conditionValue', label: valueLabel, conditional: true, show: (Number(conditionTypeCurrentValue) === 2) || (Number(conditionTypeCurrentValue) === 3), options: valueRatingOptions },
      { name: 'deficiencyTypeId', label: deficiencyTypeLabel, options: deficiencyTypeOptions },
      { name: 'deficiencyText', label: deficiencyTextLabel, ph: '-- Deficiency Text --', type:'textarea' },
    ];

    return (
      <div className="add-item-view add-entity-form-small requirement-form-modal">
        <div className="add-item-header">
          <h1>{requirement ? 'Edit': 'Add'} {titleText}</h1>
        </div>

        <section className="white-section">
          <div className="add-item-form-subsection">
            <form
              autoComplete="off"
              className="entity-info-form"
              onSubmit={handleSubmit}
            >
              <div className="container-fluid">
                <div className="row">
                  <div className="col-12">
                    {fields.map(this.renderFormField)}
                  </div>
                </div>
              </div>

              {this.props.holderRequirementSets.rulesGroupsError &&
                <div className="error-item-form">
                  {this.props.holderRequirementSets.rulesGroupsError}
                </div>
              }

              <div className="add-item-bn">
                <button
                  className="bn bn-small bg-green-dark-gradient create-item-bn icon-save"
                  type="submit"
                >
                  {saveButton}
                </button>
                <a
                  className="cancel-add-item"
                  onClick={() => this.props.close()} >
                  {cancelButton}
                </a>
              </div>

            </form>
          </div>
        </section>
      </div>
    );
  }
}

RequirementForm = reduxForm({
  form: 'RequirementSetsRequirementForm',
  validate: validation,
})(RequirementForm);

const mapStateToProps = (state) => {
  return {
    currentForm: state.form,
    local: state.localization,
    holderRequirementSets: state.holderRequirementSets,
    coverageTypes: state.coverageTypes,
    coverageTypeValue: formValueSelector('RequirementSetsRequirementForm')(state, 'coverageType'),
    conditionTypeCurrentValue: formValueSelector('RequirementSetsRequirementForm')(state, 'conditionTypeId'),
    attributeCurrentValue: formValueSelector('RequirementSetsRequirementForm')(state, 'attribute'),
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(reqSetsActions, dispatch),
    coverageTypeActions: bindActionCreators(coverageTypeActions, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(RequirementForm);
