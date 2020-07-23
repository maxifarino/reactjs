import React, { Component } from 'react';
import { reduxForm, Field, formValueSelector, change } from 'redux-form';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import renderField from '../../../../customInputs/renderField';
import renderTypeAhead from '../../../../customInputs/renderTypeAhead';
import renderRemovable from '../../../../customInputs/renderRemovable';

import validation from './requirementGroupValidation';
import Utils from '../../../../../lib/utils';

import * as coverageTypeActions from '../../../coverage-types/actions';

class RequirementGroupForm extends Component {
  componentDidMount() {
    const { group, dispatch } = this.props;

    if (group) {
      const coverageObj = {
        value: group.CoverageTypeID,
        label: group.CoverageTypeName,
      };

      dispatch(change('RequirementSetsGroupForm', 'coverageType', group.CoverageTypeID ? coverageObj : null));
      dispatch(change('RequirementSetsGroupForm', 'ruleGroupName', group.RuleGroupName || ''));
    }
  }

  componentWillUnmount() {
    this.props.coverageTypeActions.resetTypeAheadResults();
  }

  onRemoveCoverage = () => {
    this.props.dispatch(change('RequirementSetsGroupForm', 'coverageType', ''));
  }

  onSelectCoverage = (selected) => {
    this.props.dispatch(change('RequirementSetsGroupForm', 'ruleGroupName', selected.label));
  }

  renderFormField = (element, idx) => {
    const {
      name,
      label,
      ph,
      type,
      conditional,
      show,
      disabled,
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

    return (
      <div key={idx} className="admin-form-field-wrapper" style={style}>
        <label htmlFor={name}>{`${label}:`}</label>
        <Field
          name={name}
          type={type || "text"}
          placeholder={ph}
          component={renderField}
          disabled={disabled}
        />
      </div>
    );
  }

  handleSearch = (term) => {
    const { holderId, isTemplate } = this.props;
    (isTemplate) 
      ? this.props.coverageTypeActions.fetchTypeAhead({ name: term, archived: 0 })
      : this.props.coverageTypeActions.fetchCoverageTypes({ name: term, holderId, archived: 0 })
  }

  render() {
    const { handleSubmit, coverageTypeValue, group } = this.props;
    const {
      error,
      fetching,
      list,
      typeAheadError,
      typeAheadFetching,
      typeAheadResults,
    } = this.props.coverageTypes;
    
    const coverageTypeError = (this.props.isTemplate) ? typeAheadError : error;
    const coverageTypeFetching = (this.props.isTemplate) ? typeAheadFetching : fetching;
    const coverageTypeResults = (this.props.isTemplate) ? typeAheadResults : list;   

    const {
      titleText,
      editText,
      nameLabel,
      coverageLabel,
      saveButton,
      cancelButton,
    } = this.props.local.strings.holderRequirementSets.details.addRequirementGroupModal;

    const coverageOptions = Utils.getOptionsList(null, coverageTypeResults, 'Name', 'CoverageTypeID', 'Name');

    const fields = [
      {
        name: 'coverageType', label: coverageLabel, ph:'-- Search Coverage Type --', type: 'typeAhead',
        handleSearch: (term) => this.handleSearch(term), fetching: coverageTypeFetching, results: coverageOptions,
        error: coverageTypeError, conditional: true, show: !coverageTypeValue, onSelect: this.onSelectCoverage,
      },
      {
        name: 'coverageType', label: coverageLabel, type: 'removable',
        valueText: coverageTypeValue ? coverageTypeValue.label : '', onRemove: this.onRemoveHolder,
        conditional: true, show: coverageTypeValue,
      },
      { name: 'ruleGroupName', label: nameLabel, ph: '-- Name --', disabled: (group) ? false : true },
    ];

    return (
      <div className="add-item-view add-entity-form-small requirement-group-form-modal">
        <div className="add-item-header">
          <h1>{(this.props.group) ? editText : titleText}</h1>
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

RequirementGroupForm = reduxForm({
  form: 'RequirementSetsGroupForm',
  validate: validation,
})(RequirementGroupForm);

const mapStateToProps = (state) => {
  return {
    local: state.localization,
    holderRequirementSets: state.holderRequirementSets,
    coverageTypes: state.coverageTypes,
    coverageTypeValue: formValueSelector('RequirementSetsGroupForm')(state, 'coverageType'),
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    coverageTypeActions: bindActionCreators(coverageTypeActions, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(RequirementGroupForm);
