import React from 'react';
import { Field, reduxForm, formValueSelector, change } from 'redux-form';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as registerActions from '../actions';
import validate from './validation';
import Utils from '../../../lib/utils';
import renderField from '../../customInputs/renderField';
import renderSelect from '../../customInputs/renderSelect';

let CompanyProfileForm = props => {
  const {
    companyNameLabel,
    companyNamePlaceholder,
    tradeLabel,
    secondaryTradeLabel,
    tertiaryTradeLabel,
    quaternaryTradeLabel,
    quinaryTradeLabel,
    addressLabel,
    addressPlaceholder,
    cityLabel,
    cityPlaceholder,
    stateLabel,
    provinceLabel,
    statePlaceholder,
    zipCodeLabel,
    zipCodePlaceholder,
    countryLabel,
    taxIdLabel,
    vatLabel,
    taxIdPlaceholder,
    mustAgree,
    userAgreementLinkText,
    before,
    agreeLabel,
    submitText,
  } = props.local.strings.register.companyProfile;

  const { handleSubmit } = props;

  const addEmptyTradeItem = (tradeList) => {
    return tradeList.map((trade, idx) => {
      if (idx === 0) {
        return { label: trade.label, value: '' };
      }

      return trade;
    });
  };

  const resetStateValue = () => {
    props.dispatch(change('CompanyProfileForm', 'state', ''));
  };

  const selectedCountry = props.register.countryOptions.find(country => Number(country.value) === Number(props.currentCountry));
  const statesOptions = selectedCountry && selectedCountry.states;

  const stateFieldLabel = Number(props.currentCountry) === 34 ? provinceLabel : stateLabel;
  const taxIdFieldLabel = Number(props.currentCountry) === 34 ? vatLabel : taxIdLabel;

  return (
    <form onSubmit={handleSubmit}>
      <div className="container-fluid">

        <div className="row">
          <div className="col-md-6 col-sm-12 step-col-left">
            <div className="register-field-wrapper">
              <label htmlFor="companyName" className="required">{companyNameLabel}:</label>
              <Field
                name="companyName"
                type="text"
                placeholder={companyNamePlaceholder}
                component={renderField} />
            </div>
          </div>

          <div className="col-md-6 col-sm-12 step-col-right">
            <div className="register-field-wrapper">
              <label htmlFor="trade" className="required">{tradeLabel}:</label>
              <div className="select-wrapper">
                <Field
                  name="trade"
                  component={renderSelect}
                  options={addEmptyTradeItem(props.register.tradeOptions)} />
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-md-6 col-sm-12 step-col-left">
            <div className="register-field-wrapper">
              <label htmlFor="secondarytrade">{secondaryTradeLabel}:</label>
              <div className="select-wrapper">
                <Field
                  name="secondarytrade"
                  component={renderSelect}
                  options={props.register.tradeOptions} />
              </div>
            </div>
          </div>

          <div className="col-md-6 col-sm-12 step-col-right">
            <div className="register-field-wrapper">
              <label htmlFor="tertiarytrade">{tertiaryTradeLabel}:</label>
              <div className="select-wrapper">
                <Field
                  name="tertiarytrade"
                  component={renderSelect}
                  options={props.register.tradeOptions} />
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-md-6 col-sm-12 step-col-left">
            <div className="register-field-wrapper">
              <label htmlFor="quaternaryTrade">{quaternaryTradeLabel}:</label>
              <div className="select-wrapper">
                <Field
                  name="quaternaryTrade"
                  component={renderSelect}
                  options={props.register.tradeOptions} />
              </div>
            </div>
          </div>

          <div className="col-md-6 col-sm-12 step-col-right">
            <div className="register-field-wrapper">
              <label htmlFor="quinaryTrade">{quinaryTradeLabel}:</label>
              <div className="select-wrapper">
                <Field
                  name="quinaryTrade"
                  component={renderSelect}
                  options={props.register.tradeOptions} />
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-md-6 col-sm-12 step-col-left">
            <div className="register-field-wrapper">
              <label htmlFor="country">{countryLabel}:</label>
              <div className="select-wrapper">
                <Field
                  name="country"
                  callback={() => resetStateValue()}
                  component={renderSelect}
                  options={Utils.addEmptyListItem(props.register.countryOptions)}
                />
              </div>
            </div>
          </div>

          <div className="col-md-6 col-sm-12 step-col-right">
            <div className="register-field-wrapper">
              <label htmlFor="state" className="required">{stateFieldLabel}:</label>

              <div className={statesOptions ? 'select-wrapper' : ''}>
                <Field
                  name="state"
                  type={statesOptions ? undefined : "text"}
                  placeholder={statesOptions ? undefined : statePlaceholder}
                  component={statesOptions ? renderSelect : renderField}
                  options={statesOptions ? Utils.addEmptyListItem(statesOptions) : undefined}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-md-6 col-sm-12 step-col-left">
            <div className="register-field-wrapper">
              <label htmlFor="city" className="required">{cityLabel}:</label>
              <Field
                name="city"
                placeholder={cityPlaceholder}
                type="text"
                component={renderField} />
            </div>
          </div>

          <div className="col-md-6 col-sm-12 step-col-right">
            <div className="register-field-wrapper">
              <label htmlFor="address" className="required">{addressLabel}:</label>
              <Field
                name="address"
                type="text"
                placeholder={addressPlaceholder}
                component={renderField} />
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-md-6 col-sm-12 step-col-left">
            <div className="register-field-wrapper">
              <label htmlFor="zipcode" className="required">{zipCodeLabel}:</label>
              <Field
                name="zipcode"
                placeholder={zipCodePlaceholder}
                type="text"
                component={renderField} />
            </div>
          </div>

          <div className="col-md-6 col-sm-12 step-col-right">
            <div className="register-field-wrapper">
              <label htmlFor="taxid" className="required">{taxIdFieldLabel}:</label>
              <Field
                name="taxid"
                placeholder={Number(props.currentCountry) === 1 ? taxIdPlaceholder : ''}
                type="text"
                component={renderField} />
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-md-6 col-sm-12 step-col-left">
            <div className="register-field-wrapper agreement-container">
              <p className="agreement-label">
                {mustAgree}<a href="https://asset.prequalusa.com/general/prequal-eula-2015.pdf" target="_blank" rel="noopener noreferrer"> {userAgreementLinkText} </a>{before}
              </p>
              <label htmlFor="agree">
                <Field
                  id="agree"
                  name="agree"
                  type="checkbox"
                  component={renderField} />
                <span className="check"></span>
                <span className="label">{agreeLabel}</span>
              </label>
            </div>
          </div>
        </div>

        <div className="step-button">
          <button className="bn bg-blue-gradient" type="submit">{submitText}</button>
        </div>
      </div>
    </form>
  );
}

CompanyProfileForm = reduxForm({
  form: 'CompanyProfileForm',
  validate,
  enableReinitialize: true,
  onSubmitFail: (e) => {
    const fieldNames = [
      'companyName',
      'trade',
      'address',
      'city',
      'state',
      'country',
      'taxid',
      'agree'
    ];
    Utils.getFirstFailedElem(fieldNames, e).focus();
  },
})(CompanyProfileForm);

const mapStateToProps = (state, ownProps) => {
  const { companyPayload } = state.register;
  const selector = formValueSelector('CompanyProfileForm');
  return {
    register: state.register,
    local: state.localization,
    currentCountry: selector(state, 'country') || '',
    initialValues: {
      companyName: companyPayload.companyName || '',
      trade: companyPayload.tradeId || 0,
      secondarytrade: companyPayload.secTradeId || 0,
      tertiarytrade: companyPayload.terTradeId || 0,
      quaternaryTrade: companyPayload.quatTradeId || 0,
      quinaryTrade: companyPayload.quinTradeId || 0,
      address: companyPayload.address || '',
      city: companyPayload.city || '',
      state: companyPayload.state || '',
      zipcode: companyPayload.zipcode || '',
      country: companyPayload.countryId || 0,
      taxid: companyPayload.taxId || '',
    	agree: companyPayload.agree || false,
    }
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(registerActions, dispatch)
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CompanyProfileForm));
