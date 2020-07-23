import React from 'react';
import { Field, reduxForm, change, formValueSelector } from 'redux-form';
import { connect } from 'react-redux';
import renderField from '../../../../customInputs/renderField';
import renderSelect from '../../../../customInputs/renderSelect';
//import asyncValidate from './asyncValidation';
import validate from './validation';

class CustomFieldInfoForm extends React.Component {
  constructor(props) {
    super(props);

    const { customField } = this.props;
    if (customField) {
      props.dispatch(change('CustomFieldInfoForm', 'name', customField.CustomFieldName));
      props.dispatch(change('CustomFieldInfoForm', 'type', customField.FieldTypeId));
      props.dispatch(change('CustomFieldInfoForm', 'values', customField.FieldOptions));
      props.dispatch(change('CustomFieldInfoForm', 'order', customField.DisplayOrder));
      props.dispatch(change('CustomFieldInfoForm', 'archived', customField.Archived));
    }
  }

  renderFormField = (element, idx) => {
    const {
      name, label, ph, type, options, conditional, show, onChange
    } = element;
    const style = {};
    if (conditional && !show) {
      style.display = 'none';
    }

    return (
      <div key={idx} className="admin-form-field-wrapper" style={style}>
        <label htmlFor={name}>{`${label}:`}</label>
        {
          options?
          <div className="select-wrapper">
            <Field
              onChange={onChange}
              name={name}
              component={renderSelect}
              options={options} />
          </div>
          :
          <Field
            name={name}
            type={type || "text"}
            placeholder={ph}
            component={renderField} />
        }
      </div>
    );
  }

  handleTypeChange = (val) => {
    this.props.dispatch(change('CustomFieldInfoForm', 'values', ''));
  }

  render() {
    const { handleSubmit, selectedType } = this.props;
    const {
      labelName,
      labelType,
      labelValues,
      placeholderValues,
      labelOrder,
      labelArchived,
      cancelButton,
      saveButton
    } = this.props.local.strings.customFields.addCustomFieldModal;

    const typeOptions = [
      { label: '-- Select type --', value: '' },
      { label: 'Text', value: 1 },
      { label: 'Dropdown', value: 2 },
      { label: 'Decimal', value: 3 },
    ];

    const showValues = Number(selectedType) === 2; //Dropdown type

    const fields = [
      { name: 'name', label: labelName, ph: '-- Field Name --' },
      { name: 'type', label: labelType, options: typeOptions, onChange: this.handleTypeChange },
      { name: 'values', label: labelValues, ph:placeholderValues, conditional:true, show: showValues },
      { name: 'order', label: labelOrder, ph:'-- Display order --', type: 'number' },
      { name: 'archived', label: labelArchived, type: 'checkbox' },
    ];

    return (
      <form
        autoComplete="off"
        className="entity-info-form"
        onSubmit={handleSubmit} >
        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              {fields.map(this.renderFormField)}
            </div>
          </div>
        </div>

        {
          this.props.customFields.errorPostCustomField &&
          <div className="error-item-form">
            { this.props.customFields.errorPostCustomField }
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

CustomFieldInfoForm = reduxForm({
  form: 'CustomFieldInfoForm',
  validate,
  //asyncValidate,
  //asyncBlurFields: ['email'],
})(CustomFieldInfoForm);

const mapStateToProps = (state) => {
  return {
    local: state.localization,
    customFields: state.customFields,
    common: state.common,
    selectedType: formValueSelector('CustomFieldInfoForm')(state, 'type'),
  };
};

export default connect(mapStateToProps)(CustomFieldInfoForm);
