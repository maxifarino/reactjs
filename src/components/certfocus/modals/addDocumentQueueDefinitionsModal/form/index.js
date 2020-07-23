import React from 'react';
import { Field, reduxForm, change } from 'redux-form';
import { connect } from 'react-redux';

import renderField from '../../../../customInputs/renderField';

import validate from './validation';

class DocumentQueueDefinitionForm extends React.Component {
  constructor(props) {
    super(props);

    const { documentQueueDefinition } = this.props;

    if (documentQueueDefinition) {
      props.dispatch(change('DocumentQueueDefinitionForm', 'name', documentQueueDefinition.Name));
      props.dispatch(change('DocumentQueueDefinitionForm', 'archived', documentQueueDefinition.Archived));
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
      archivedLabel,
      cancelButton,
      saveButton,
    } = this.props.local.strings.documentQueueDefinitions.addModal;

    const fields = [
      { name: 'name', label: nameLabel, ph: '-- Field name --' },
      { name: 'archived', label: archivedLabel, type: 'checkbox' },
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

        {this.props.documentQueueDefinitions.addDocumentQueueDefinitionsError &&
          <div className="error-item-form">
            {this.props.documentQueueDefinitions.addDocumentQueueDefinitionsError}
          </div>
        }

        {this.props.documentQueueDefinitions.addDocumentQueueDefinitionsFetching ? (
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

DocumentQueueDefinitionForm = reduxForm({
  form: 'DocumentQueueDefinitionForm',
  validate,
})(DocumentQueueDefinitionForm);

const mapStateToProps = (state) => {
  return {
    currentForm: state.form,
    local: state.localization,
    documentQueueDefinitions: state.documentQueueDefinitions,
    common: state.common,
  };
};

export default connect(mapStateToProps)(DocumentQueueDefinitionForm);
