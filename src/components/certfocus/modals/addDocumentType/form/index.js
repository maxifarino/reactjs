import React from 'react';
import { Field, reduxForm, change } from 'redux-form';
import { connect } from 'react-redux';

import renderField from '../../../../customInputs/renderField';
import renderSelect from '../../../../customInputs/renderSelect';

import validate from './validation';

class DocumentTypeInfoForm extends React.Component {
  constructor(props) {
    super(props);

    const { document } = this.props;

    if (document) {
      props.dispatch(change('DocumentTypeInfoForm', 'documentTypeName', document.documentTypeName));
      props.dispatch(change('DocumentTypeInfoForm', 'expireAmount', document.expireAmount));
      props.dispatch(change('DocumentTypeInfoForm', 'expirePeriod', document.expirePeriod));
      props.dispatch(change('DocumentTypeInfoForm', 'archived', document.archived === 1));
    }
  }

  renderFormField = (element, idx) => {
    const {
      name,
      label,
      ph,
      type,
      options,
      conditional,
      show,
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
              name={name}
              component={renderSelect}
              options={options}
            />
          </div>
          :
          <Field
            name={name}
            type={type || "text"}
            placeholder={ph}
            component={renderField}
          />
        }
      </div>
    );
  }

  render() {
    const { handleSubmit } = this.props;
    const {
      labelName,
      labelExpires,
      labelExpireAmount,
      placeholderExpires,
      labelArchive,
      cancelButton,
      saveButton
    } = this.props.local.strings.documentTypes.addModal;

    const expirePeriodOptions = [
      {
        label: '---Select a period---',
        value: '',
      },
      {
        label: 'Month/s',
        value: 'Months',
      },
      {
        label: 'Year/s',
        value: 'Years'
      },
    ];

    const fields = [
      { name: 'documentTypeName', label: labelName, ph: '--field name--' },
      { name: 'expireAmount', label: labelExpireAmount, ph: placeholderExpires, type: 'number' },
      { name: 'expirePeriod', label: labelExpires, options: expirePeriodOptions},
      { name: 'archived', label: labelArchive, type: 'checkbox' },
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

        {this.props.documentTypes.addDocumentError &&
          <div className="error-item-form">
            { this.props.documentTypes.addDocumentError }
          </div>
        }

        {this.props.documentTypes.addDocumentFetching ? (
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

DocumentTypeInfoForm = reduxForm({
  form: 'DocumentTypeInfoForm',
  validate,
})(DocumentTypeInfoForm);

const mapStateToProps = (state) => {
  return {
    currentForm: state.form,
    local: state.localization,
    documentTypes: state.documentTypes,
    common: state.common,
  };
};

export default connect(mapStateToProps)(DocumentTypeInfoForm);
