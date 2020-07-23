import React, { Component, Fragment } from 'react';
import { Field, reduxForm, change, formValueSelector } from 'redux-form';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Utils from '../../../../../lib/utils';

import renderField from '../../../../customInputs/renderField';
import renderSelect from '../../../../customInputs/renderSelect';
import renderTypeAhead from '../../../../customInputs/renderTypeAhead';
import renderRemovable from '../../../../customInputs/renderRemovable';
import * as commonActions from '../../../../common/actions';

import validate from './validation';

class InsuredInfoForm extends Component {
  componentDidMount() {
    const { profile, dispatch } = this.props;
    
    if (profile) {
      dispatch(change('InsuredInfoForm', 'insuredName', profile.InsuredName || ""));
      dispatch(change('InsuredInfoForm', 'legalName', profile.LegalName || ""));
      dispatch(change('InsuredInfoForm', 'address1', profile.Address || ""));
      if(profile.Address2 !== "not available"){
        dispatch(change('InsuredInfoForm', 'address2', profile.Address2 || ""));
      }
      dispatch(change('InsuredInfoForm', 'city', profile.City || ""));
      dispatch(change('InsuredInfoForm', 'stateId', profile.State || ""));
      dispatch(change('InsuredInfoForm', 'postalCode', profile.PostalCode || ""));
      dispatch(change('InsuredInfoForm', 'countryId', profile.CountryID || ""));

      dispatch(change('InsuredInfoForm', 'contactName', profile.ContactName || ""));
      dispatch(change('InsuredInfoForm', 'contactPhone', profile.ContactPhone || ""));
      dispatch(change('InsuredInfoForm', 'contactFax', profile.ContactFax || ""));
      dispatch(change('InsuredInfoForm', 'contactEmail', profile.ContactEmail || ""));      
      dispatch(change('InsuredInfoForm', 'taxId', profile.TaxID || ""));

      if (Array.isArray(profile.HolderId) && Array.isArray(profile.HolderName)) {
        const holderObj = {
          value: profile.HolderId[0],
          label: profile.HolderName[0]
        };
        dispatch(change('InsuredInfoForm', 'holderId', holderObj || ""));
      }
    }
    else{
      dispatch(change('InsuredInfoForm', 'countryId', "1"));
    }
  }

  renderFormField = (element, idx) => {
    const { type, name, label, ph, options, conditional, show } = element;    
    const fieldType = type || 'text';
    const style = {};
    if (conditional && !show) {
      style.display = 'none';
    }

    if (type === 'typeAhead') {
      const { fetching, results, error, handleSearch, onSelect } = element;

      return (
        <div className="col-md no-padd" key={idx} style={style}>
          <div className="admin-form-field-wrapper keywords-field">
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
        </div>
      );
    } else if (type === 'removable') {
      const { valueText, disabled, onRemove } = element;
      return (
        <div className="col-md no-padd" key={idx} style={style}>
          <div className="admin-form-field-wrapper keywords-field">
            <label htmlFor={name}>{`${label}:`}</label>
            <Field
              name={name}
              valueText={valueText}
              component={renderRemovable}
              onRemove={onRemove}
              disabled={disabled}
            />
          </div>
        </div>
      );
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

  handleSearch = (filterTerm) => {
    this.props.commonActions.fetchTypeAhead({ nameTerm: filterTerm });
  }

  render() {
    const {
      labelInsuredName,
      labelLegalName,
      labelAddress1,
      labelAddress2,
      labelCity,
      labelState,
      labelPostalCode,
      labelCountry,
      labelContactName,
      labelContactPhone,
      labelContactFax,
      labelContactEmail,
      labelTaxId,
      labelHolder,
      cancelButton,
      saveButton
    } = this.props.local.strings.insured.addInsuredModal.insuredInfoTab;
    const { 
      handleSubmit, 
      countryCurrentValue, 
      holderIdCurrentValue,
      common 
    } = this.props;
    const {
      typeAheadResults,
      typeAheadFetching,
      typeAheadError,
    } = this.props.common;

    const countryOptions = Utils.getOptionsList(`-- ${labelCountry} --`, common.countries, 'name', 'id', 'name');
    const holderOptions = Utils.getOptionsList(null, typeAheadResults, 'name', 'id', 'name');

    const leftFields = [
      { name: 'insuredName', label: labelInsuredName, ph: `-- ${labelInsuredName} --` },
      { name: 'legalName', label: labelLegalName, ph: `-- ${labelLegalName} --` },
      { name: 'address1', label: labelAddress1, ph: `-- ${labelAddress1} --` },
      { name: 'address2', label: labelAddress2, ph: `-- ${labelAddress2} --` },
      { name: 'city', label: labelCity, ph: `-- ${labelCity} --` },
      { name: 'stateId', label: labelState, ph: `-- ${labelState} --`},
      { name: 'postalCode', label: labelPostalCode, ph: `-- ${labelPostalCode} --` },
      { name: 'countryId', label: labelCountry, options: countryOptions },
    ]
    const rightFields = [
      { name: 'contactName', label: labelContactName, ph: `-- ${labelContactName} --` },
      { name: 'contactPhone', label: labelContactPhone, ph: `-- ${labelContactPhone} --` },
      { name: 'contactFax', label: labelContactFax, ph: `-- ${labelContactFax} --` },
      { name: 'contactEmail', label: labelContactEmail, ph: `-- ${labelContactEmail} --` },
      { name: 'taxId', label: labelTaxId, ph: `-- ${labelTaxId} --` },
      {
        name:'holderId', label: labelHolder, ph: `-- Search ${labelHolder} --`, type: 'typeAhead',
        handleSearch: this.handleSearch, fetching: typeAheadFetching, results: holderOptions,
        error: typeAheadError, conditional: true, show: !holderIdCurrentValue
      },
      {
        name:'holderId', label: labelHolder, type: 'removable',
        valueText: holderIdCurrentValue ? holderIdCurrentValue.label : '',
        conditional: true, show: holderIdCurrentValue,
      },    
    ];

    return (
      <form
        onSubmit={handleSubmit}
        className="entity-info-form wiz-form"
      >
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-6 col-sm-12">
              {leftFields.map(this.renderFormField)}
            </div>
            <div className="col-md-6 col-sm-12">
              {rightFields.map(this.renderFormField)}
            </div>
          </div>
        </div>

        <div className="wiz-buttons">
          {this.props.insureds.addInsuredFetching ? (
            <div className="spinner-wrapper">
              <div className="spinner mb-4"></div>
            </div>
          ) : (
            <Fragment>
              <a className="wiz-cancel-button" onClick={this.props.close}>{cancelButton}</a>
              <button className="wiz-continue-btn bg-sky-blue-gradient bn">{saveButton}</button>
            </Fragment>
          )}
        </div>
      </form>
    );
  }
};

InsuredInfoForm = reduxForm({
  form: 'InsuredInfoForm',
  validate,
  //asyncValidate,
  //asyncBlurFields: ['insuredName'],
})(InsuredInfoForm);

const mapStateToProps = (state, ownProps) => {
  return {
    currentForm: state.form,
    local: state.localization,
    common: state.common,
    insureds: state.insureds,
    countryCurrentValue: formValueSelector('InsuredInfoForm')(state, 'countryId'),
    holderIdCurrentValue: formValueSelector('InsuredInfoForm')(state, 'holderId')
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    commonActions: bindActionCreators(commonActions, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(InsuredInfoForm);
