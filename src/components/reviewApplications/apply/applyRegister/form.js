import React from 'react';
import { Field, reduxForm, formValueSelector } from 'redux-form';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as applyActions from '../actions';

import Utils from '../../../../lib/utils';
import renderField from '../../../customInputs/renderField';
import renderSelect from '../../../customInputs/renderSelect';

import validate from './validation';

class ApplyRegisterForm extends React.Component {

  render() {
    const {
      firstNameLabel,
      firstNamePlaceholder,
      lastNameLabel,
      lastNamePlaceholder,
      titleLabel,
      phoneLabel,
      phonePlaceholder,
      cellPhoneLabel,
      cellPhonePlaceholder,
      emailLabel,
      mainEmailPlaceholder,
      passwordLabel,
      retypePassword,
      passwordPlaceholder
    } = this.props.local.strings.register.userInformation;

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
      statePlaceholder,
      zipCodeLabel,
      zipCodePlaceholder,
      countryLabel,
      taxIdLabel,
      taxIdPlaceholder,
      mustAgree,
      userAgreementLinkText,
      before,
      agreeLabel,
      submitText
    } = this.props.local.strings.register.companyProfile;


    const {handleSubmit} = this.props;

    return (
      <form onSubmit={handleSubmit}>
        <div className="container-fluid">
          <div className="row">

            <div className="col-md-6 col-sm-12 step-col-left">
              <div className="register-field-wrapper">
                <label htmlFor="firstName" className="required">{firstNameLabel}:</label>
                <Field
                  name="firstName"
                  type="text"
                  placeholder={firstNamePlaceholder}
                  component={renderField} />
              </div>
            </div>
            <div className="col-md-6 col-sm-12 step-col-right">
              <div className="register-field-wrapper">
                <label htmlFor="lastName" className="required">{lastNameLabel}:</label>
                <Field
                  name="lastName"
                  type="text"
                  placeholder={lastNamePlaceholder}
                  component={renderField} />
              </div>
            </div>
          </div>

          <div className="row">            
            <div className="col-md-6 col-sm-12 step-col-left">
              <div className="register-field-wrapper">
                <label htmlFor="phone" className="required">{phoneLabel}:</label>
                <Field
                  name="phone"
                  type="text"
                  placeholder={phonePlaceholder}
                  component={renderField} />
              </div>
            </div>            
            <div className="col-md-6 col-sm-12 step-col-right">
              <div className="register-field-wrapper">
                <label htmlFor="email" className="required">{emailLabel}:</label>
                <Field
                  name="email"
                  type="text"
                  placeholder={mainEmailPlaceholder}
                  component={renderField} />
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-6 col-sm-12 step-col-left">
              <div className="register-field-wrapper">
                <label htmlFor="password" className="required">{passwordLabel}:</label>
                <Field
                  name="password"
                  type="password"
                  placeholder={passwordPlaceholder}
                  component={renderField} />
              </div>
            </div>
            <div className="col-md-6 col-sm-12 step-col-right">
              <div className="register-field-wrapper">
                <label htmlFor="passwordagain" className="required">{retypePassword}:</label>
                <Field
                  name="passwordagain"
                  type="password"
                  placeholder={passwordPlaceholder}
                  component={renderField} />
              </div>
            </div>
          </div>

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
          </div>


          <div className="row">  
            <div className="col-md-6 col-sm-12 step-col-left">
              <div className="register-field-wrapper">
                <label htmlFor="taxid" className="required">{taxIdLabel}:</label>
                <Field
                  name="taxid"
                  placeholder={taxIdPlaceholder}
                  type="text"
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
                    options={this.props.apply.tradeOptions} />
                </div>
              </div>
            </div>
          </div>



          <div className="row">
            <div className="col-md-6 col-sm-12 step-col-left">
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
                <label htmlFor="state" className="required">{stateLabel}:</label>
                <Field
                  name="state"
                  type="text"
                  placeholder={statePlaceholder}
                  component={renderField} />
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-6 col-sm-12 step-col-left">
              <div className="register-field-wrapper">
                <label htmlFor="zipcode">{zipCodeLabel}:</label>
                <Field
                  name="zipcode"
                  placeholder={zipCodePlaceholder}
                  type="text"
                  component={renderField} />
              </div>
            </div>  
            <div className="col-md-6 col-sm-12 step-col-right">
              <div className="register-field-wrapper">
                <label htmlFor="country">{countryLabel}:</label>
                <div className="select-wrapper">
                  <Field
                    name="country"
                    component={renderSelect}
                    options={this.props.apply.countryOptions} />
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-6 col-sm-12 step-col-left">
              <div className="register-field-wrapper">
                <label htmlFor="hcContactName">Hiring Client Contact Name:</label>
                <Field
                  name="hcContactName"
                  type="text"
                  placeholder={statePlaceholder}
                  component={renderField} />
              </div>
            </div>

            <div className="col-md-6 col-sm-12 step-col-right">
              <div className="register-field-wrapper">
                <label htmlFor="hcContactEmail">Hiring Client Contact Email:</label>
                <Field
                  name="hcContactEmail"
                  type="text"
                  placeholder={statePlaceholder}
                  component={renderField} />
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-6 col-sm-12 step-col-left">
              <div className="register-field-wrapper">
                <label htmlFor="previousWorkedForHC" className="">Previously worked for the Hiring Client: </label>
                <Field
                  name="previousWorkedForHC"
                  type="checkbox"
                  component={renderField} />
              </div>
            </div>  
            <div className="col-md-6 col-sm-12 step-col-right">
            </div>                       
          </div>

          <div className="row">
            <div className="col-md-6 col-sm-12 step-col-left">
              <div className="register-field-wrapper">
                <label htmlFor="hcProject">Hiring Client Previous Project Name:</label>
                <Field
                  name="hcProject"
                  type="text"
                  placeholder={statePlaceholder}
                  component={renderField} />
              </div>
            </div>
            <div className="col-md-6 col-sm-12 step-col-right">
            </div>
          </div>

          <div className="row">
            <div className="col-md-12 col-sm-12 step-col-left">
              <div className="register-field-wrapper">
                <label htmlFor="generalComments">General Comments:</label>
                <Field
                  name="generalComments"
                  type="textarea"
                  placeholder={statePlaceholder}
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
};

ApplyRegisterForm = reduxForm({
  form: 'ApplyRegisterForm',
  validate,
  enableReinitialize: true,  
  onSubmitFail: (e) => {
    const fieldNames = [
      'firstName',
      'lastName',
      'phone',
      'email',
      'companyName',
      'trade',
      'address',
      'city',
      'state',
      'country',
      'taxid',
      'agree',
      'password',
      'passwordagain'      
    ];
    Utils.getFirstFailedElem(fieldNames, e).focus();
  },
})(ApplyRegisterForm);


const mapStateToProps = (state, ownProps) => {  
  const { applyPayload } = state.apply;
  const selector = formValueSelector('ApplyRegisterForm');
  return {
    local: state.localization,
    apply: state.apply,
    currentCountry: selector(state, 'country') || '',
    initialValues: {
      firstName: applyPayload.firstName || '',
      lastName: applyPayload.lastName || '',
      phone: applyPayload.phone || '',
      email: applyPayload.email || '',
      companyName: applyPayload.companyName || '',
      trade: applyPayload.tradeId || 0,
      address: applyPayload.address || '',
      city: applyPayload.city || '',
      state: applyPayload.state || '',
      zipcode: applyPayload.zipcode || '',
      country: applyPayload.countryId || 1,
      taxid: applyPayload.taxId || '',
      agree: applyPayload.agree || false,
      password: applyPayload.pass || '',
      passwordagain: applyPayload.pass || '',      
    }
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(applyActions, dispatch),
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ApplyRegisterForm));
