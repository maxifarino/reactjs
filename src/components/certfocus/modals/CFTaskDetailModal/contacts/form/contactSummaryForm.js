import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Field, reduxForm} from "redux-form";
import {connect} from "react-redux";
import validate from "./validate";
import renderField from "../../../../../customInputs/renderField";

class ContactSummaryForm extends Component {

  render() {
    const {handleSubmit, dismiss, closeAndNew} = this.props;
    const {pristine, submitting} = this.props;

    return (
      <form onSubmit={handleSubmit} className={'list-view-filter-form taskForm'}>
        <Field name="contactUser" component="input" type="hidden" readOnly/>
        <div className="container-fluid filter-fields pt-2">
          <div className="row">

            <div className="col-8">
              <label htmlFor="contactSummary"> Contact Summary: </label>
            </div>
            <div className="col-4">
              <label>Contact Person: {this.props.contact}</label>
            </div>
            <div className="col-12 admin-form-field-wrapper no-padding">
              <Field
                name="contactSummary"
                type="textarea"
                component={renderField}
                disabled={submitting}
              />
            </div>

          </div>
        </div>
        <div className="formButtons">
          <button name={'save'} className={`${pristine ? '' : 'bg-sky-blue-gradient'} bn`} type="submit"
                  disabled={pristine || submitting}>Save
          </button>
          {/*<button name={'new'} className={`${pristine ? '' : 'bg-sky-blue-gradient'} bn`} type={'button'}*/}
          {/*        onClick={closeAndNew} disabled={pristine || submitting}>New Task*/}
          {/*</button>*/}
          <a className="bg-sky-blue-gradient bn" onClick={dismiss}>Cancel</a>
        </div>
      </form>
    );
  }
}

ContactSummaryForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
};

ContactSummaryForm = reduxForm({
  form: 'taskContactSummaryForm',
  validate,
  initialValues: {
    contactSummary: ''
  }
})(ContactSummaryForm)

const mapStateToProps = (state) => {
  return {
    locale: state.localization.strings.CFTasks.modal,
    tasks: state.CFTasks,
    common: state.common,
  }
}
const mapDispatchToProps = (dispatch) => {
  return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(ContactSummaryForm);