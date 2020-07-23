import React from 'react';
import { connect } from 'react-redux';
import { reduxForm, Field, getFormValues, reset } from 'redux-form';
import renderDropzoneInput from './../components/renderDropzoneInput';
import validate from './validation';

const afterSubmit = (result, dispatch) => dispatch(reset('DocumentUploadForm'));

let UploadDocumentForm = (props) => {
  const { error, handleSubmit, pristine, submitting, valid } = props;

  const {
    saveButton,
    cancelButton,
  } = props.local.strings.attachments.list.addModal;
  
  return (     
    <form onSubmit={handleSubmit} encType="multipart/form-data">      
      <div className="row">
        <div className="col-md-12">
        <Field
          name="files"
          component={renderDropzoneInput}
          accept='application/pdf'
        />
        </div>
      </div>      
      <div className="row" style={{ textAlign: 'right' }}>
        <div className="col-md-12 p-0">
          <div className="text-danger">{error}</div>

          <div className="add-item-bn">
            <button
              className="bn bn-small bg-green-dark-gradient create-item-bn icon-save"
              type="submit"
            >
              {saveButton}
            </button>
            <a
              className="cancel-add-item"
              onClick={props.close} >
              {cancelButton}
            </a>
          </div>
        </div>
      </div>
  </form>
  )
};

UploadDocumentForm = reduxForm({
  form: 'UploadDocumentForm',
  validate,
  onSubmitSuccess: afterSubmit,
})(UploadDocumentForm);

const mapStateToProps = (state) => {
  return {
    local: state.localization,
    currentFormValues: getFormValues('UploadDocumentForm')(state),
  };
};

export default connect(mapStateToProps)(UploadDocumentForm);