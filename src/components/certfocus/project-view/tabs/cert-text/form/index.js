import React, { Component } from 'react';
import { connect } from 'react-redux';
import { reduxForm, Field, change, getFormValues } from 'redux-form';

import renderField from '../../../../../customInputs/renderField';

class CertTextForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      editable: false,
    };
  }

  setEditable = (condition) => {
    this.setState({ editable: condition });

    if (!condition) {
      this.setInitialValues();
    }
  }

  componentDidMount() {
    this.setInitialValues();
  }

  setInitialValues = () => {
    const { dispatch, certText } = this.props;

    dispatch(change('CertTextInfoForm', 'header', certText.Header || ""));
    dispatch(change('CertTextInfoForm', 'cancellationNotice', certText.CancellationNotice || ""));
    dispatch(change('CertTextInfoForm', 'disclaimer', certText.Disclaimer || ""));
    dispatch(change('CertTextInfoForm', 'mandatoryReqs', certText.MandatoryReqs || ""));
  }

  renderFields = (element, idx) => {
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
        {this.state.editable ?
          <Field
            name={name}
            type={type || "text"}
            placeholder={ph}
            component={renderField}
          /> :
          <div className="d-flex align-items-center">
            {this.props.currentFormValues ? this.props.currentFormValues[name] : ''}
          </div>
        }
      </div>
    );
  }

  render() {
    const { handleSubmit } = this.props;

    const {
      headerLabel,
      cancellationLabel,
      disclaimerLabel,
      mandatoryLabel,
      saveBtn,
      cancelBtn,
      editBtn,
    } = this.props.local.strings.projectCertText;

    const fields = [
      { name: 'header', label: headerLabel, ph: `-- ${headerLabel} --`, type: 'textarea' },
      { name: 'cancellationNotice', label: cancellationLabel, ph: `-- ${cancellationLabel} --`, type: 'textarea' },
      { name: 'disclaimer', label: disclaimerLabel, ph: `-- ${disclaimerLabel} --`, type: 'textarea' },
      { name: 'mandatoryReqs', label: mandatoryLabel, ph: `-- ${mandatoryLabel} --`, type: 'textarea' },
    ];

    return (
      <form
        autoComplete="off"
        className="entity-info-form cert-text-form"
        onSubmit={handleSubmit}
      >
        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              {fields.map(this.renderFields)}
            </div>
          </div>
        </div>

        {this.props.projectCertText.editError &&
          <div className="error-item-form">
            {this.props.projectCertText.editError}
          </div>
        }

        {this.props.projectCertText.editFetching ? (
          <div className="spinner-wrapper">
            <div className="spinner" />
          </div>
        ) : (
          <div className="add-item-bn pt-0">
            {this.state.editable ? (
              <div>
                <button
                  className="bn bn-small bg-green-dark-gradient create-item-bn icon-save"
                  type="submit"
                >
                  {saveBtn}
                </button>
                <a
                  className="cancel-add-item"
                  onClick={() => this.setEditable(false)} >
                  {cancelBtn}
                </a>
              </div>
            ) : (
                <button
                  className="bn bn-small bg-green-dark-gradient create-item-bn icon-edit"
                  type="button"
                  onClick={() => this.setEditable(true)}
                >
                  {editBtn}
                </button>
              )
            }
          </div>
        )}

      </form>
    );
  }
};

CertTextForm = reduxForm({
  form: 'CertTextInfoForm',
})(CertTextForm);

const mapStateToProps = (state) => {
  return {
    projectCertText: state.projectCertText,
    local: state.localization,
    currentFormValues: getFormValues('CertTextInfoForm')(state),
  };
};

export default connect(mapStateToProps)(CertTextForm);
