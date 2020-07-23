import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Field, reduxForm, change } from 'redux-form';
import _ from 'lodash';

import renderField from '../../../../customInputs/renderField';
import renderTypeAhead from '../../../../customInputs/renderTypeAhead';
import renderRemovable from '../../../../customInputs/renderRemovable';
import Utils from '../../../../../lib/utils';

import * as commonActions from '../../../../common/actions';
import validate from './validation';

class CustomTerminologyForm extends React.Component {
  constructor(props) {
    super(props);

    const { selectedCustomTerm } = this.props;
    if (selectedCustomTerm) {
      const { HolderId, HolderName } = selectedCustomTerm;
      const holderObj = {
        value: HolderId,
        label: HolderName
      };

      props.dispatch(change('CustomTerminologyForm', 'holderId', HolderId ? holderObj : ''));
      props.dispatch(change('CustomTerminologyForm', 'originalTerm', selectedCustomTerm.OriginalTerm));
      props.dispatch(change('CustomTerminologyForm', 'customTerm', selectedCustomTerm.CustomTerm));
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
    const { handleSubmit, fromHolderTab } = this.props;
    const {
      typeAheadResults,
      typeAheadFetching,
      typeAheadError 
    } = this.props.common;

    const {
      holderLabel,
      originalTermLabel,
      customTermLabel,
      cancelButton,
      saveButton,
    } = this.props.local.strings.certFocusSettings.customTerminology.addModal;    

    const holderOptions = Utils.getOptionsList(null, typeAheadResults, 'name', 'id', 'name');
    const holder = _.get(this.props, 'currentForm.CustomTerminologyForm.values.holderId', null);

    const fields = [
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
      { name: 'originalTerm', label: originalTermLabel, ph: '-- Original Term --' },
      { name: 'customTerm', label: customTermLabel, ph: '-- Custom Term --' },
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

        {this.props.customTerminology.addCustomTerminologyError &&
          <div className="error-item-form">
            {this.props.customTerminology.addCustomTerminologyError}
          </div>
        }

        {this.props.customTerminology.addCustomTerminologyFetching ? (
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

CustomTerminologyForm = reduxForm({
  form: 'CustomTerminologyForm',
  validate,
})(CustomTerminologyForm);

const mapStateToProps = (state) => {
  return {
    currentForm: state.form,
    local: state.localization,
    common: state.common,
    customTerminology: state.customTerminologySettings,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    commonActions: bindActionCreators(commonActions, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CustomTerminologyForm);
