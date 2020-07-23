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

import validate from './validation';

class AddAttributesForm extends Component {
  constructor(props) {
    super(props);
    const { attribute } = props;
    if (attribute) {
      console.log('attribute', attribute);      
      const { 
        AttributeName,
        Archived
      } = attribute;

      props.dispatch(change('AddAttributesForm', 'attributeName', AttributeName || ''));
      props.dispatch(change('AddAttributesForm', 'archived', Archived || ''));
    }
  }

  componentDidMount() {
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
    } = this.props;
    
    const {
      attributeNameLabel,
      archivedLabel,
      cancelButton,
      saveButton
    } = this.props.local.strings.coverageTypes.attributes.addAttributeModal;
    
    const fields = [
      { name: 'attributeName', label: attributeNameLabel, ph: `-- Select ${attributeNameLabel} --` },
      { name: 'archived', label: archivedLabel, type: 'checkbox' },
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
          this.props.coverageTypes.errorPostAttributes &&
          <div className="error-item-form">
            { this.props.coverageTypes.errorPostAttributes }
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

AddAttributesForm = reduxForm({
  form: 'AddAttributesForm',
  validate
})(AddAttributesForm);

const mapStateToProps = (state) => {
  return {
    currentForm: state.form,
    local: state.localization,
    common: state.common,
    coverageTypes: state.coverageTypes,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    commonActions: bindActionCreators(commonActions, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddAttributesForm);
