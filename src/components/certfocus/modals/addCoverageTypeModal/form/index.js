import React from 'react';
import { Field, reduxForm, change } from 'redux-form';
import { connect } from 'react-redux';

import renderField from '../../../../customInputs/renderField';

import validate from './validation';

class CoverageTypeInfoForm extends React.Component {
  constructor(props) {
    super(props);

    const { coverage } = this.props;

    if (coverage) {
      props.dispatch(change('CoverageTypeInfoForm', 'name', coverage.Name));
      props.dispatch(change('CoverageTypeInfoForm', 'code', coverage.Code));
      props.dispatch(change('CoverageTypeInfoForm', 'deficiencyMessage', coverage.DeficiencyMessage));
      props.dispatch(change('CoverageTypeInfoForm', 'deficiencyCode', coverage.DeficiencyCode));
    }
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
      codeLabel,
      deficiencyMessageLabel,
      deficiencyCodeLabel,
      cancelButton,
      saveButton,
    } = this.props.local.strings.coverageTypes.addModal;

    const fields = [
      { name: 'name', label: nameLabel, ph: '-- Field name --' },
      { name: 'code', label: codeLabel, ph: '-- Code --' },
      { name: 'deficiencyMessage', label: deficiencyMessageLabel, ph: '-- Def. Message --' },
      { name: 'deficiencyCode', label: deficiencyCodeLabel, ph: '-- Def. Code --' },
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

CoverageTypeInfoForm = reduxForm({
  form: 'CoverageTypeInfoForm',
  validate,
})(CoverageTypeInfoForm);

const mapStateToProps = (state) => {
  return {
    currentForm: state.form,
    local: state.localization,
    coverageTypes: state.coverageTypesSettings,
    common: state.common,
  };
};

export default connect(mapStateToProps)(CoverageTypeInfoForm);
