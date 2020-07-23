import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';

import renderField from '../../customInputs/renderField';
import renderSelect  from '../../customInputs/renderSelect';
import Utils from '../../../lib/utils';

import validate from './validation';

class ApplyForm extends Component {
  constructor(props) {
    super(props);
  }  

  renderFormField = (element, idx) => {
    const { type, name, label, ph, options, conditional, show } = element;
    const fieldType = type || 'text';
    const style = {};
    if (conditional && !show) {
      style.display = 'none';
    }
  
    return (
      <div key={idx} className="wiz-field admin-form-field-wrapper" style={style}>
        <label htmlFor={name}>{`${label}:`}</label>
        {
          options?
          <div className="select-wrapper">
            <Field
              name={name}
              component={renderSelect}
              options={options} />
          </div>
          :
          <Field
            name={name}
            type={fieldType}
            placeholder={ph}
            component={renderField} />
        }
      </div>
    );
  }

  render() {
    const { error, handleSubmit, pristine, submitting, valid } = this.props;
    const {
      subcontractorContactNameLabel,
      subcontractorContactPhoneLabel,
      subcontractorContactEmailLabel,
      subcontractorNameLabel,
      primaryTradeLabel,
      subcontractorFullAddressLabel,
      subcontractorPhoneLabel,
      subcontractorTaxIdLabel,
      saveButton,
    } = this.props.local.strings.reviewApplications.applyForm;

    const primaryTradeOptions = [
      { label: '-- Select type --', value: '' },
      { label: 'Fence Installation', value: 'Fence Installation' },
      { label: 'Heavy Civil Construction', value: 'Heavy Civil Construction' },
      { label: 'Other', value: 'Other' },
    ];

    const leftFields = [
      { name: 'subcontractorContactName', label: subcontractorContactNameLabel, ph: `John Doe`, type: 'text', value: '' },
      { name: 'subcontractorContactPhone', label: subcontractorContactPhoneLabel, ph: `123 Main Street` },
      { name: 'subcontractorContactEmail', label: subcontractorContactEmailLabel, ph: `john.doe@john.doe.com` },
    ];  
    const rightFields = [
      { name: 'subcontractorName', label: subcontractorNameLabel, ph: `Company Name ABC, Inc.` },
      { name: 'primaryTrade', label: primaryTradeLabel, options: primaryTradeOptions },
      { name: 'subcontractorFullAddress', label: subcontractorFullAddressLabel, ph: `123 Main Street` },
      { name: 'subcontractorPhone', label: subcontractorPhoneLabel, ph: `555-550-0000` },
      { name: 'subcontractorTaxId', label: subcontractorTaxIdLabel, ph: `XX-XXXXXXX` },
    ];

    return (
      <form onSubmit={handleSubmit(this.props.onSubmit)}>
        <div className="container-fluid">
          <h3>Sub-Contractor Application Form</h3>
          <div className="row">
            <div className="col-6">
              <span className="label label-default">User Information (Prequal Contact)</span>
              {leftFields.map(this.renderFormField)}
            </div>
            <div className="col-6">
              <span className="label label-default">Company Profile</span>
              {rightFields.map(this.renderFormField)}
            </div>
          </div>
        </div>

        <div className="wiz-buttons">
          <div className="text-danger">{error}</div>
          <button 
            className="wiz-continue-btn bg-sky-blue-gradient bn"
            type="submit" 
            disabled={!valid || pristine || submitting}>
            {saveButton}
          </button>
        </div>
      </form>
    )
  }  
}

ApplyForm = reduxForm({
  form: 'ApplyForm',
  validate,
})(ApplyForm);

export default ApplyForm;