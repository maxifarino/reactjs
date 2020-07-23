import React, { Component } from 'react';
import { reduxForm, Field } from 'redux-form';
import { connect } from 'react-redux';

import FileInput from '../../../../customInputs/fileInput';
import renderField from '../../../../customInputs/renderField';
import validation from './attachmentValidation';

class AttachmentForm extends Component {
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

    if (type === 'file') {
      return (
        <div key={idx} className="admin-field-wrapper-file" style={style}>
          <label htmlFor={name} className="bn bn-small bg-green-dark-gradient icon-send mb-0">
            {label}
          </label>
          <Field
            id={name}
            name={name}
            component={FileInput}
            style={{ display: 'none' }}
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
      titleText,
      nameLabel,
      fileLabel,
      saveButton,
      cancelButton,
    } = this.props.local.strings.holderRequirementSets.details.addAttachmentModal;

    const fields = [
      { name: 'name', label: nameLabel, ph: '-- Name --' },
      { name: 'document', label: fileLabel, type: 'file' },
    ];

    return (
      <div className="add-item-view add-entity-form-small attachment-form-modal">
        <div className="add-item-header">
          <h1>{titleText}</h1>
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

const mapStateToProps = (state) => {
  return {
    local: state.localization,
    holderRequirementSets: state.holderRequirementSets,
  };
};

AttachmentForm = reduxForm({
  form: 'RequirementSetsAttachments',
  validate: validation,
})(AttachmentForm);

export default connect(mapStateToProps)(AttachmentForm);
