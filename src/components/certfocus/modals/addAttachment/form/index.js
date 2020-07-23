import React, { Component } from 'react';
import { reduxForm, Field, formValueSelector } from 'redux-form';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import FileInput from '../../../../customInputs/fileInput';
import renderField from '../../../../customInputs/renderField';
import renderTypeAhead from '../../../../customInputs/renderTypeAhead';
import renderRemovable from '../../../../customInputs/renderRemovable';
import Utils from '../../../../../lib/utils';

import * as projectsActions from '../../../projects/actions';

import validation from './validation';

class AttachmentInfoForm extends Component {
  componentWillUnmount() {
    this.props.projectsActions.resetTypeAheadResults();
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

  onSearchProject = (filterTerm) => {
    const { insuredId } = this.props;
    const query = {
      projectName: filterTerm,
      insuredId: insuredId,
    };

    this.props.projectsActions.fetchTypeAhead(query);
  }

  render() {
    const { handleSubmit, projectCurrentValue, insuredId } = this.props;

    const {
      projectLabel,
      nameLabel,
      fileLabel,
      saveButton,
      cancelButton,
    } = this.props.local.strings.attachments.list.addModal;

    const {
      typeAheadResults,
      typeAheadFetching,
      typeAheadError
    } = this.props.holdersProjects;

    const projectOptions = Utils.getOptionsList(null, typeAheadResults, 'name', 'id', 'name');

    const fields = [
      {
        name:'projectId', label: projectLabel, ph: `-- Search ${projectLabel} --`, type: 'typeAhead',
        handleSearch: this.onSearchProject, fetching: typeAheadFetching, results: projectOptions,
        error: typeAheadError, conditional: true, show: !projectCurrentValue && insuredId
      },
      {
        name:'projectId', label: projectLabel, type: 'removable',
        valueText: projectCurrentValue ? projectCurrentValue.label:'',
        conditional: true, show: projectCurrentValue && insuredId,
      },
      { name: 'name', label: nameLabel, ph: `-- ${nameLabel} --` },
      { name: 'document', label: fileLabel, type: 'file' },
    ];

    return (
      <div className="add-item-view add-entity-form-small attachment-form-modal">
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

          {this.props.attachments.addError &&
            <div className="error-item-form">
              {this.props.attachments.addError}
            </div>
          }

          {this.props.attachments.addFetching ? (
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
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    local: state.localization,
    attachments: state.attachments,
    holdersProjects: state.holdersProjects,
    projectCurrentValue: formValueSelector('AttachmentsInfoForm')(state, 'projectId')
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    projectsActions: bindActionCreators(projectsActions, dispatch),
  };
}

AttachmentInfoForm = reduxForm({
  form: 'AttachmentsInfoForm',
  validate: validation,
})(AttachmentInfoForm);

export default connect(mapStateToProps, mapDispatchToProps)(AttachmentInfoForm);
