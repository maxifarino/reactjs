import React, { Component } from 'react';
import { Field, reduxForm, formValueSelector } from 'redux-form';
import { connect } from 'react-redux';
import _ from 'lodash';

import Utils from '../../../../lib/utils';
import renderField from '../../../customInputs/renderField';
import renderSelect from '../../../customInputs/renderSelect';
import FileInput from '../../../customInputs/fileInput';

import validate from './validation';

class PortalForm extends Component {
  renderFormField = (element, idx) => {
    const {
      name,
      label,
      ph,
      options,
      conditional,
      show,
      type,
      buttonLabel,
    } = element;

    const style = {};

    if (conditional && !show) {
      style.display = 'none';
    }

    if (type === 'file') {
      const { selectedFiles } = this.props;

      return (
        <div key={idx} className="wiz-field admin-form-field-wrapper admin-field-wrapper-file" style={style}>
          <label>{`${label}:`}</label>
          <div>
            <label htmlFor={name} className="bn bn-small icon-send mb-0 input-label">
              {buttonLabel}
            </label>
            <Field
              id={name}
              name={name}
              component={FileInput}
              multiple
              style={{ display: 'none' }}
            />
            <ul className="files-list mt-2 pl-4">
              {selectedFiles && _.map(selectedFiles, (file) => <li key={file.name}>{file.name}</li>)}
            </ul>
          </div>
        </div>
      );
    }

    return (
      <div key={idx} className="wiz-field admin-form-field-wrapper" style={style}>
        <label htmlFor={name}>{`${label}:`}</label>
        {options ?
          <div className="select-wrapper">
            <Field
              name={name}
              component={renderSelect}
              options={options}
            />
          </div>
          :
          <Field
            name={name}
            type={type ? type : 'text'}
            placeholder={ph}
            component={renderField}
          />
        }
      </div>
    );
  }

  render() {
    const {
      handleSubmit,
      selectedCompanyCountry,
      selectedAgencyCountry,
      resetForm,
      portal,
    } = this.props;

    const {
      companyHeader,
      agencyHeader,
      companyNameLabel,
      legalNameLabel,
      addressLabel,
      cityLabel,
      stateLabel,
      zipCodeLabel,
      countryLabel,
      filesLabel,
      agencyNameLabel,
      agentNameLabel,
      commentsLabel,
      addFilesBtn,
      submitBtn,
      resetBtn,
    } = this.props.local.strings.portal.form;

    const countryOptions = Utils.getOptionsList('-- Select Country --', this.props.common.countries, 'name', 'name', 'name');
    const stateOptions = Utils.getOptionsList('-- Select State --', this.props.common.usStates, 'Name', 'ShortName', 'Name');

    const showCompanyStateOptions = selectedCompanyCountry === 'United States';
    const showAgencyStateOptions = selectedAgencyCountry === 'United States';

    const leftFields = [
      { name: 'companyName', label: companyNameLabel, ph: `-- ${companyNameLabel} --` },
      { name: 'companyLegalName', label: legalNameLabel, ph: `-- ${legalNameLabel} --` },
      { name: 'companyAddress', label: addressLabel, ph: `-- ${addressLabel} --` },
      { name: 'companyCity', label: cityLabel, ph: `-- ${cityLabel} --` },
      { name: 'companyState', label: stateLabel, options: stateOptions, conditional: true, show: showCompanyStateOptions },
      { name: 'companyState', label: stateLabel, ph: `-- ${stateLabel} --`, conditional: true, show: !showCompanyStateOptions },
      { name: 'companyPostalCode', label: zipCodeLabel, ph: `-- ${zipCodeLabel} --`, type: 'number' },
      { name: 'companyCountry', label: countryLabel, options: countryOptions },
      { name: 'companyFiles', label: filesLabel, type: 'file', buttonLabel: addFilesBtn },
    ]
    const rightFields = [
      { name: 'agencyName', label: agencyNameLabel, ph: `-- ${agencyNameLabel} --` },
      { name: 'agencyAgentName', label: agentNameLabel, ph: `-- ${agentNameLabel} --` },
      { name: 'agencyAddress', label: addressLabel, ph: `-- ${addressLabel} --` },
      { name: 'agencyCity', label: cityLabel, ph: `-- ${cityLabel} --` },
      { name: 'agencyState', label: stateLabel, options: stateOptions, conditional: true, show: showAgencyStateOptions },
      { name: 'agencyState', label: stateLabel, ph: `-- ${stateLabel} --`, conditional: true, show: !showAgencyStateOptions },
      { name: 'agencyPostalCode', label: zipCodeLabel, ph: `-- ${zipCodeLabel} --`, type: 'number' },
      { name: 'agencyCountry', label: countryLabel, options: countryOptions },
      { name: 'agencycomments', label: commentsLabel, ph: `-- ${commentsLabel} --`, type: 'textarea' },
    ];

    return (
      <form
        onSubmit={handleSubmit}
        className="entity-info-form wiz-form pt-3"
      >
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-6 col-sm-12">
              <h2 className="modal-wiz-title">{companyHeader}</h2>

              {leftFields.map(this.renderFormField)}
            </div>
            <div className="col-md-6 col-sm-12">
              <h2 className="modal-wiz-title">{agencyHeader}</h2>

              {rightFields.map(this.renderFormField)}
            </div>
          </div>
        </div>

        <div className="text-danger text-center">{portal.error}</div>
        <div className="wiz-buttons pr-0">
          <a className="wiz-cancel-button" onClick={resetForm}>{resetBtn}</a>
          <button type="submit" className="bn bg-blue-gradient">{submitBtn}</button>
        </div>
      </form>
    );
  }
}

PortalForm = reduxForm({
  form: 'PortalURLForm',
  validate,
})(PortalForm);

const mapStateToProps = (state) => {
  return {
    local: state.localization,
    common: state.common,
    portal: state.portal,
    selectedCompanyCountry: formValueSelector('PortalURLForm')(state, 'companyCountry'),
    selectedAgencyCountry: formValueSelector('PortalURLForm')(state, 'agencyCountry'),
    selectedFiles: formValueSelector('PortalURLForm')(state, 'companyFiles'),
  };
};

export default connect(mapStateToProps)(PortalForm);
