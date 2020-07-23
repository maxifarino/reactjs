import React from 'react';
import { connect } from 'react-redux';
import { reduxForm, Form, Field } from 'redux-form';
import _ from 'lodash';

import renderField from '../../../../customInputs/renderField';
import fileInput from '../../../../customInputs/fileInput';
import validate from './validation';

import './addFileModal.css';

class AddFileModal extends React.Component {
  render() {
    const {
      title,
      fileInputLabel,
      descriptionInputLabel,
      buttonText,
      checkboxLabel
    } = this.props.local.strings.scProfile.files.addModal;

    const fileLabel = _.get(this.props, 'reduxForm.AddFileModalForm.values.documentFile.name')

    return (
      <Form className="add-file-modal" onSubmit={this.props.handleSubmit}>
        <header className="add-file-modal-header">{title}</header>

        <div className="add-file-content container-fluid filter-fields">
          <div className="row">
            <div className="col-sm-12 no-padd">
              <div className="upload-file-wrapper">
                <label htmlFor="documentFile" className='file-input'>
                  {fileLabel || fileInputLabel}
                </label>
                <Field
                  name="documentFile"
                  id="documentFile"
                  component={fileInput}
                  onChange={this.onFileInputChange}
                />
              </div>
            </div>
          </div>

          <div className="row checkboxRow">
            <div className="col-sm-12 no-padd">
              <div className="admin-form-field-wrapper">
                <div className="add-file-label custLabel">    {checkboxLabel}:</div>
                <Field
                  className="finCheckBox"
                  type="checkbox"
                  name="FinancialDataFlag"
                  component={renderField}
                />
              </div>
            </div>
          </div >

          <div className="row">
            <div className="col-sm-12 no-padd">
              <div className="admin-form-field-wrapper">
                <div className="add-file-label">{descriptionInputLabel}:</div>
                  <Field
                    type="textarea"
                    name="description"
                    component={renderField}
                    className="description-input"
                  />
              </div>
            </div>
          </div >

          <div className="wiz-buttons">
            <button disabled={this.props.isSubmitting ? 'disabled' : null} className="wiz-continue-btn bg-sky-blue-gradient bn">{buttonText}</button>
          </div>
        </div >

      </Form>
    );
  }
};

AddFileModal = reduxForm({
  form: 'AddFileModalForm',
  validate
})(AddFileModal);

const mapStateToProps = (state) => {
  return {
    users: state.users,
    local: state.localization,
    reduxForm: state.form
  };
};

export default connect(mapStateToProps)(AddFileModal);
