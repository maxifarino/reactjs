import React from 'react';
import { connect } from 'react-redux';
import { reduxForm, Field, getFormValues, reset } from 'redux-form';
import renderField from '../../../../components/customInputs/renderField';
import renderDropzoneInput from './components/renderDropzoneInput';
import validate from './validation';

const afterSubmit = (result, dispatch) => dispatch(reset('DocumentUploadForm'));

let DocumentUploadForm = (props) => {
  const { error, handleSubmit, pristine, submitting, valid } = props;
    
  return (    
    props.certUpload.fetching ? (
      <div className="spinner-wrapper">
        <div className="spinner" />
      </div>
    ) : (      
      <form onSubmit={handleSubmit} encType="multipart/form-data">
      <div className="row">
        <div className="col-md-12 pr-0">
        <Field
          name="files"
          component={renderDropzoneInput}
          accept='application/pdf'
        />
        </div>
      </div>
      <div className="row pt-3">
        <div className="col-md-2 pr-0">
          <label htmlFor='firstName'>First Name: </label>
        </div>
        <div className="col-md-4 p-0">
          <Field
            name={'firstName'}
            placeholder={`Enter your First Name`}
            component={renderField}
            className="small-input"
          />
        </div>
        <div className="col-md-2 pr-0">
          <label htmlFor='lastName'>Last Name: </label>
        </div>
        <div className="col-md-4 p-0">
          <Field
            name={'lastName'}
            placeholder={`Enter your Last Name`}
            component={renderField}
            className="small-input"
          />
        </div>
      </div>
      <div className="row pt-3">
        <div className="col-md-2 pr-0">
          <label htmlFor='email'>Email: </label>
        </div>
        <div className="col-md-4 p-0">
          <Field
            name={'email'}
            placeholder={`Enter your Email`}
            component={renderField}
            className="small-input"
          />
        </div>
        <div className="col-md-2 pr-0">
          <label htmlFor='phone'>Phone: </label>
        </div>
        <div className="col-md-4 p-0">
          <Field
            name={'phone'}
            placeholder={`Enter your Phone`}
            component={renderField}
            className="small-input"
          />
        </div>
      </div>
      <div className="row pt-3">
        <div className="col-md-2 pr-0">
          <label htmlFor='comments'>Comments: </label>
        </div>
        <div className="col-md-10 p-0">
          <Field
            name={'comments'}
            type={'textarea'}
            placeholder={`Enter your comments`}
            component={renderField}
            className="comments-textarea"
          />
        </div>
      </div>      
      <div className="row" style={{ textAlign: 'right' }}>
        <div className="col-md-12 p-0">
          <div className="text-danger">{error}</div>         
          <button 
            type="submit" 
            className="bn bn-small bg-green-dark-gradient">
            {`Upload & Submit`}
          </button>        
        </div>
      </div>      
    </form>
    )
  )
};

DocumentUploadForm = reduxForm({
  form: 'DocumentUploadForm',
  validate,
  onSubmitSuccess: afterSubmit,
})(DocumentUploadForm);

const mapStateToProps = (state) => {
  return {
    local: state.localization,
    certUpload: state.certUpload,
    currentFormValues: getFormValues('DocumentUploadForm')(state),
  };
};

export default connect(mapStateToProps)(DocumentUploadForm);
