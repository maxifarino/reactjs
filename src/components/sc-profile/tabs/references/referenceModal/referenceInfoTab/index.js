import React from 'react';
import { connect } from 'react-redux';
import { reduxForm, Form, Field, change } from 'redux-form';

import renderField from '../../../../../customInputs/renderField';
import renderSelect from '../../../../../customInputs/renderSelect';
import Utils from '../../../../../../lib/utils';
import validate from './validation';

class ReferenceInfoTab extends React.Component {
  constructor(props) {
    super(props);

    const {
      currentReference,
      dispatch
     } = props;

    if (currentReference) {
      dispatch(change('ReferenceInfoTabForm', 'typeId', currentReference.typeId));
      dispatch(change('ReferenceInfoTabForm', 'companyName', currentReference.companyName));
      dispatch(change('ReferenceInfoTabForm', 'savedFormId', currentReference.savedFormId));
      dispatch(change('ReferenceInfoTabForm', 'contactName', currentReference.contactName));
      dispatch(change('ReferenceInfoTabForm', 'contactEmail', currentReference.contactEmail));
      dispatch(change('ReferenceInfoTabForm', 'contactPhone', Utils.formatPhoneNumber(currentReference.contactPhone)));
      dispatch(change('ReferenceInfoTabForm', 'evaluationId', currentReference.evaluationId));
    }

    this.submit = this.submit.bind(this);
  }

  submit(data) {
    data.contactPhone = Utils.normalizePhoneNumber(data.contactPhone);

    this.props.continueHandler(data);
  };

  render() {
    const {
      typeLabel,
      companyNameLabel,
      savedFormLabel,
      contactNameLabel,
      contactEmailLabel,
      contactPhoneLabel,
      continueButton
    } = this.props.local.strings.scProfile.references.modal;

    const {
      referencesTypesPossibleValues,
      submissions
    } = this.props.references;

    const referencesStatusOptions = Utils.getOptionsList('', referencesTypesPossibleValues, 'type', 'id', 'id');
    const submissionsOptions = Utils.getOptionsList('', submissions, 'name', 'id', 'id');

    return (
      <Form className="noteForm" onSubmit={this.props.handleSubmit(this.submit)}>
        <div className="add-reference-content container-fluid filter-fields">

          <div className="row">
            <div className="col-sm-6">
              <div className="wiz-field admin-form-field-wrapper">
                <label htmlFor="typeId">{typeLabel}:</label>
                <div className="select-wrapper">
                  <Field
                    name="typeId"
                    component={renderSelect}
                    options={referencesStatusOptions}
                    className="input"
                    disabled={this.props.currentReference && 'disabled'} />
                </div>
              </div>
            </div>
            <div className="col-sm-6">
              <div className="wiz-field admin-form-field-wrapper">
                <label htmlFor="companyName">{companyNameLabel}:</label>
                <Field
                  name="companyName"
                  component={renderField}
                  className="input"
                />
              </div>
            </div>
          </div >

          <div className="row">
            <div className="col-sm-6">
              <div className="wiz-field admin-form-field-wrapper">
                <label htmlFor="savedFormId">{savedFormLabel}:</label>
                <div className="select-wrapper">
                  <Field
                    name="savedFormId"
                    component={renderSelect}
                    options={submissionsOptions}
                    className="input"
                    disabled={this.props.currentReference && 'disabled'} />
                </div>
              </div>
            </div>
            <div className="col-sm-6">
              <div className="wiz-field admin-form-field-wrapper">
                <label htmlFor="contactName">{contactNameLabel}:</label>
                <Field
                  name="contactName"
                  component={renderField}
                  className="input"
                />
              </div>
            </div>
          </div >

          <div className="row">
            <div className="col-sm-6">
              <div className="wiz-field admin-form-field-wrapper">
                <label htmlFor="contactEmail">{contactEmailLabel}:</label>
                <Field
                  name="contactEmail"
                  component={renderField}
                  className="input"
                />
              </div>
            </div>
            <div className="col-sm-6">
              <div className="wiz-field admin-form-field-wrapper">
                <label htmlFor="contactPhone">{contactPhoneLabel}:</label>
                <Field
                  name="contactPhone"
                  component={renderField}
                  className="input"
                />
              </div>
            </div>
          </div >

          <div className="wiz-buttons">
            <button disabled={this.props.isSubmitting ? 'disabled' : null} className="wiz-continue-btn bg-sky-blue-gradient bn">{continueButton}</button>
          </div>
        </div>
      </Form>
    );
  }
};

ReferenceInfoTab = reduxForm({
  form: 'ReferenceInfoTabForm',
  validate
})(ReferenceInfoTab);

const mapStateToProps = (state) => {
  return {
    local: state.localization,
    references: state.references
  };
};

export default connect(mapStateToProps)(ReferenceInfoTab);
