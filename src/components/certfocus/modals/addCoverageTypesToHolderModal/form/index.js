import React, { Component } from 'react';
import { Field, reduxForm, formValueSelector } from 'redux-form';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import _ from 'lodash';

import renderRemovable from '../../../../customInputs/renderRemovable';
import renderTypeAhead from '../../../../customInputs/renderTypeAhead';
import renderField from '../../../../customInputs/renderField';
import Utils from '../../../../../lib/utils';

import * as commonActions from '../../../../common/actions';
import * as coverageTypesActions from '../../../coverage-types/actions';

import validate from './validation';

class CoverageTypeAndHolerInfoForm extends Component {
  onRemoveCoverage = () => {
    this.props.coverageTypesActions.resetTypeAheadResults();
  }

  searchCoverage = (filterTerm) => {
    this.props.coverageTypesActions.fetchTypeAhead({ name: filterTerm });
  }

  renderFormField = (element, idx) => {
    const {
      name,
      label,
      ph,
      type,
      conditional,
      show,
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
    } else {
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
  }

  render() {
    const { handleSubmit, currentCoverage, coverageTypes } = this.props;

    const {
      cancelButton,
      saveButton,
      findLabel,
      displayOrderLabel,
    } = this.props.local.strings.coverageTypes.addModal;

    const {
      typeAheadResults,
      typeAheadFetching,
      typeAheadError,
    } = this.props.coverageTypes;

    // Exclude coverage types that are already in this holder
    const coverageOptionsResult = _.differenceBy(typeAheadResults, coverageTypes.list, 'CoverageTypeID');
    const coverageOptions = Utils.getOptionsList(null, coverageOptionsResult, 'Name', 'CoverageTypeID', 'Name');

    const fields = [
      {
        name: 'coverage', label: findLabel, ph: `-- ${findLabel} --`, type: 'typeAhead',
        handleSearch: this.searchCoverage, fetching: typeAheadFetching, results: coverageOptions,
        error: typeAheadError, conditional: true, show: !currentCoverage,
      },
      {
        name: 'coverage', label: findLabel, type: 'removable',
        valueText: currentCoverage ? currentCoverage.label : '', onRemove: this.onRemoveCoverage,
        conditional: true, show: currentCoverage,
      },
      {
        name: 'displayOrder', label: displayOrderLabel, ph: `-- ${displayOrderLabel} --`,
      },
    ];

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

        {this.props.coverageTypes.addCoverageTypesError &&
          <div className="error-item-form">
            {this.props.coverageTypes.addCoverageTypesError}
          </div>
        }

        {this.props.coverageTypes.addCoverageTypesFetching ? (
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

CoverageTypeAndHolerInfoForm = reduxForm({
  form: 'CoverageTypeAndHolerInfoForm',
  validate,
})(CoverageTypeAndHolerInfoForm);

const mapStateToProps = (state) => {
  return {
    currentForm: state.form,
    local: state.localization,
    coverageTypes: state.coverageTypes,
    common: state.common,
    currentCoverage: formValueSelector('CoverageTypeAndHolerInfoForm')(state, 'coverage'),
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    commonActions: bindActionCreators(commonActions, dispatch),
    coverageTypesActions: bindActionCreators(coverageTypesActions, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CoverageTypeAndHolerInfoForm);
