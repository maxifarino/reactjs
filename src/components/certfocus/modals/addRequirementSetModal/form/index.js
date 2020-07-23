import React, { Component } from 'react';
import { Field, reduxForm, change } from 'redux-form';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import _ from 'lodash';

import renderField from '../../../../customInputs/renderField';
import renderRemovable from '../../../../customInputs/renderRemovable';
import renderTypeAhead from '../../../../customInputs/renderTypeAhead';

import * as commonActions from '../../../../common/actions';
import validate from './validation';
import Utils from '../../../../../lib/utils';

class RequirementSetInfoForm extends Component {
  constructor(props) {
    super(props);

    const { requirementSet, fromHolderTab, holdersProfile } = props;
    if (!requirementSet && fromHolderTab) {
      const { profileData } = holdersProfile;
      props.dispatch(change('RequirementSetInfoForm', 'holderId', { value: profileData.id, label: profileData.name } || ''));
    }

    if (requirementSet) {
      const { HolderId, HolderName } = requirementSet;
      const holderObj = {
        value: HolderId,
        label: HolderName
      };

      props.dispatch(change('RequirementSetInfoForm', 'name', requirementSet.Name || ''));
      props.dispatch(change('RequirementSetInfoForm', 'holderId', HolderId ? holderObj : ''));
      props.dispatch(change('RequirementSetInfoForm', 'archived', requirementSet.Archived || ''));
      props.dispatch(change('RequirementSetInfoForm', 'description', requirementSet.Description || ''));
      props.dispatch(change('RequirementSetInfoForm', 'template', requirementSet.Template || ''));
    }
  }

  onRemoveHolder = () => {
    this.props.commonActions.resetTypeAheadResults();
  }
  searchHolder = (filterTerm) => {
    this.props.commonActions.fetchTypeAhead({ nameTerm: filterTerm });
  }

  renderFormField = (element, idx) => {
    const {
      name, label, ph, type, conditional, show
    } = element;
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
      <div key={idx} className="admin-form-field-wrapper" style={style}>
        <label htmlFor={name}>{`${label}:`}</label>
          <Field
            name={name}
            type={type || "text"}
            placeholder={ph}
            component={renderField}
          />
      </div>
    );
  }

  render() {
    const { handleSubmit } = this.props;
    const {
      nameLabel,
      templateLabel,
      holderLabel,
      archivedLabel,
      descriptionLabel,
      cancelButton,
      saveButton,
    } = this.props.local.strings.holderRequirementSets.list.addModal;
    const {
      typeAheadResults,
      typeAheadFetching,
      typeAheadError } = this.props.common;
    const { fromHolderTab } = this.props;

    const holderOptions = Utils.getOptionsList(null, typeAheadResults, 'name', 'id', 'name');
    const holder = _.get(this.props, 'currentForm.RequirementSetInfoForm.values.holderId', null);

    const fields = [
      { name: 'name', label: nameLabel, ph: '-- Name --' },
      { name: 'template', label: templateLabel, type: 'checkbox', conditional: true, show: !fromHolderTab },
      {
        name: 'holderId', label:holderLabel, ph:'--search holder--', type: 'typeAhead',
        handleSearch: this.searchHolder, fetching: typeAheadFetching, results: holderOptions,
        error: typeAheadError, conditional: true, show: !holder && !fromHolderTab
      },
      {
        name: 'holderId', label:holderLabel, type: 'removable',
        valueText: holder ? holder.label:'', onRemove: this.onRemoveHolder,
        disabled: fromHolderTab, conditional: true, show: holder && !fromHolderTab,
      },
      { name: 'archived', label: archivedLabel, type: 'checkbox' },  //, conditional: true, show: !fromHolderTab
      { name: 'description', label: descriptionLabel, ph: '-- Description --', type: 'textarea' },
    ];

    const template = _.get(this.props, 'currentForm.RequirementSetInfoForm.values.template', null);

    if (template && !fromHolderTab) {
      fields[2].show = false;
      this.props.currentForm.RequirementSetInfoForm.values.holderId = 0;
    }
    if (holder && !fromHolderTab) {
      fields[1].show = false;
    }

    return (
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

        {this.props.holderRequirementSets.addRequirementSetError &&
          <div className="error-item-form">
            {this.props.holderRequirementSets.addRequirementSetError}
          </div>
        }

        {this.props.holderRequirementSets.addRequirementSetFetching ? (
          <div className="spinner-wrapper">
            <div className="spinner" />
          </div>
        ) : (
          <div className="add-item-bn">
            <button
              className="bn bn-small bg-green-dark-gradient create-item-bn icon-save"
              type="submit"
            >
              {saveButton}
            </button>
            <a
              className="cancel-add-item"
              onClick={this.props.close} >
              {cancelButton}
            </a>
          </div>
        )}

      </form>
    );
  }
};

RequirementSetInfoForm = reduxForm({
  form: 'RequirementSetInfoForm',
  validate,
})(RequirementSetInfoForm);

const mapStateToProps = (state) => {
  return {
    currentForm: state.form,
    local: state.localization,
    holderRequirementSets: state.holderRequirementSets,
    common: state.common,
    holdersProfile: state.holdersProfile
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    commonActions: bindActionCreators(commonActions, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(RequirementSetInfoForm);
