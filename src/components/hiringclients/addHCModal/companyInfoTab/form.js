import React from 'react';
import { Field, reduxForm, formValueSelector, change } from 'redux-form';
import { connect } from 'react-redux';
import _ from 'lodash'

import renderField from '../../../customInputs/renderField';
import renderSelect from '../../../customInputs/renderSelect';
import fileInput from '../../../customInputs/fileInput';

import Utils from '../../../../lib/utils';
import asyncValidate from './asyncValidation';
import validate from './validation';

class CompanyInfoForm extends React.Component {
  constructor(props) {
    super(props);

    const { profile } = this.props;
    console.log(profile);
    
    if (profile) {
      props.dispatch(change('CompanyInfoForm', 'companyName', profile.name||""));
      props.dispatch(change('CompanyInfoForm', 'companyAddress1', profile.address1||""));
      props.dispatch(change('CompanyInfoForm', 'city', profile.city||""));
      props.dispatch(change('CompanyInfoForm', 'state', profile.state||""));
      props.dispatch(change('CompanyInfoForm', 'postalCode', profile.zipCode||""));
      props.dispatch(change('CompanyInfoForm', 'phone', profile.phone||""));

      if(profile.address2 !== "not available"){
        props.dispatch(change('CompanyInfoForm', 'companyAddress2', profile.address2||""));
      }
      if(profile.phone2 !== "not available"){
        props.dispatch(change('CompanyInfoForm', 'phone2', profile.phone2||""));
      }

      if(profile.subdomain !== "not available"){
        props.dispatch(change('CompanyInfoForm', 'subdomain', profile.subdomain||""));
      }

      if (profile.parentHiringClientId) {
        props.dispatch(change('CompanyInfoForm', 'entityType', 1));
        props.dispatch(change('CompanyInfoForm', 'parentHC', profile.parentHiringClientId||""));
      }

      if(profile.AllowApplications){
        props.dispatch(change('CompanyInfoForm', 'allowApplications', true));
      }
      if(profile.AutoApproveApplications){
        props.dispatch(change('CompanyInfoForm', 'autoApproveApplications', true));
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    const self = this;
    function previewFile() {
      const file    = document.querySelector('input[type=file]').files[0];
      const reader  = new FileReader();

      reader.onloadend = function () {
        let style = document.getElementById('upload-file-wrapper').style;
        style.background = `url(${reader.result})`;
        //style.backgroundSize = 'cover';
        style.backgroundSize = 'contain';
        style.backgroundRepeat = 'no-repeat';
        style.backgroundPosition = 'center';
      }

      if (file) {
        reader.readAsDataURL(file);
      } else {
        self.props.dispatch(change('CompanyInfoForm', 'companyLogo', ""));
        const currentLogo = _.get(self.props, 'profile.logo', null);
        let style = document.getElementById('upload-file-wrapper').style;
        if (currentLogo) {
          style.background = `url(data:image/jpg;base64,${currentLogo})`;
          //style.backgroundSize = 'cover';
          style.backgroundSize = 'contain';
          style.backgroundRepeat = 'no-repeat';
          style.backgroundPosition = 'center';
        } else {
          style.background = "none";
        }
      }
    }

    previewFile();
  }

  render() {
    const {handleSubmit} = this.props;
    const {
      registrationUrlSufix,
      labelRegistrationUrl,
      labelCompanyLogo,
      labelCompanyName,
      labelAddress1,
      labelAddress2,
      labelCity,
      labelState,
      labelPostalCode,
      labelPhone,
      labelPhone2,
      labelEntity,
      allowApplications,
      autoApproveApplications,
      cancel,
      continueButton,
      saveButton
    } = this.props.local.strings.hiringClients.addHCModal.companyInfoTab;

    const btnLabel = this.props.profile? saveButton:continueButton;

    const companyLogoFieldLabel = _.get(this.props, 'currentForm.CompanyInfoForm.values.companyLogo.name', labelCompanyLogo);
    const subdomain = _.get(this.props, 'currentForm.CompanyInfoForm.values.subdomain', 'subdomain');
    const baseHCUrl = _.get(this.props, 'profile.baseHCUrl', registrationUrlSufix);

    const entityTypeOptions = [
      {
        value: 0,
        label: 'NONE'
      },
      {
        value: 1,
        label: 'CHILD'
      },
      {
        value: 2,
        label: 'PARENT'
      }
    ];

    return (
      <form
        onSubmit={handleSubmit}
        className="company-info-form wiz-form"
      >
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-4 col-sm-12">
              <div className="upload-file-wrapper">
                <label id="upload-file-wrapper" htmlFor="companyLogo">
                  {`${companyLogoFieldLabel}`}
                </label>
                <Field
                    name="companyLogo"
                    id="companyLogo"
                    component={fileInput}
                   />
              </div>
            </div>
            <div className="col-md-8 col-sm-12">

              <div className="row">
                <div className="col-md-6 col-sm-12">
                  <div className="wiz-field admin-form-field-wrapper">
                    <label htmlFor="companyName">
                      {`${labelCompanyName}:`}
                    </label>
                    <Field
                      name="companyName"
                      type="text"
                      placeholder={'--ACME CORP--'}
                      component={renderField} />
                  </div>
                </div>
                <div className="col-md-6 col-sm-12">
                  <div className="wiz-field admin-form-field-wrapper">
                    <label htmlFor="companyAddress1">
                      {`${labelAddress1}:`}
                    </label>
                    <Field
                      name="companyAddress1"
                      type="text"
                      placeholder={'--ACME CORP--'}
                      component={renderField} />
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 col-sm-12">
                  <div className="wiz-field admin-form-field-wrapper">
                    <label htmlFor="companyAddress2">
                      {`${labelAddress2}:`}
                    </label>
                    <Field
                      name="companyAddress2"
                      type="text"
                      placeholder={'--ACME CORP--'}
                      component={renderField} />
                  </div>
                </div>
                <div className="col-md-6 col-sm-12">
                  <div className="wiz-field admin-form-field-wrapper">
                    <label htmlFor="city">
                      {`${labelCity}:`}
                    </label>
                    <Field
                      name="city"
                      type="text"
                      placeholder={'--ACME CORP--'}
                      component={renderField} />
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 col-sm-12">
                  <div className="wiz-field admin-form-field-wrapper">
                    <label htmlFor="state">
                      {`${labelState}:`}
                    </label>
                    <Field
                      name="state"
                      type="text"
                      placeholder={'--ACME CORP--'}
                      component={renderField} />
                  </div>
                </div>
                <div className="col-md-6 col-sm-12">
                  <div className="wiz-field admin-form-field-wrapper">
                    <label htmlFor="postalCode">
                      {`${labelPostalCode}:`}
                    </label>
                    <Field
                      name="postalCode"
                      type="text"
                      placeholder={'--ACME CORP--'}
                      component={renderField} />
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 col-sm-12">
                  <div className="wiz-field admin-form-field-wrapper">
                    <label htmlFor="phone">
                      {`${labelPhone}:`}
                    </label>
                    <Field
                      name="phone"
                      type="text"
                      placeholder={'--ACME CORP--'}
                      component={renderField} />
                  </div>
                </div>
                <div className="col-md-6 col-sm-12">
                  <div className="wiz-field admin-form-field-wrapper">
                    <label htmlFor="phone2">
                      {`${labelPhone2}:`}
                    </label>
                    <Field
                      name="phone2"
                      type="text"
                      placeholder={'--ACME CORP--'}
                      component={renderField} />
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 col-sm-12">
                  <div className="wiz-field admin-form-field-wrapper">
                    <label htmlFor="subdomain">
                      {`${labelRegistrationUrl}: `}
                      <span style={{fontSize: '12px', color: 'black', fontWeight: 400}}>
                        {`${subdomain}${baseHCUrl}`}
                      </span>
                    </label>
                    <Field
                      name="subdomain"
                      type="text"
                      placeholder={'subdomain'}
                      component={renderField} />
                  </div>
                </div>
                <div className="col-md-6 col-sm-12">
                  <div className="wiz-field admin-form-field-wrapper">
                    <label htmlFor="entityType">
                      {`${labelEntity}:`}
                    </label>
                    <div className="select-wrapper">
                      <Field
                        name="entityType"
                        component={renderSelect}
                        options={entityTypeOptions} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 col-sm-12">
                  <div className="wiz-field admin-form-field-wrapper">
                    <label htmlFor="allowApplications">
                      {`${allowApplications}: `}
                    </label>
                    <Field
                      name="allowApplications"
                      type="checkbox"
                      component={renderField} />
                  </div>
                </div>
                <div className="col-md-6 col-sm-12">
                  <div className="wiz-field admin-form-field-wrapper">
                    <label htmlFor="autoApproveApplications">
                      {`${autoApproveApplications}: `}
                    </label>
                    <Field
                      name="autoApproveApplications"
                      type="checkbox"
                      component={renderField} />
                  </div>
                </div>
              </div>

              {this.renderParentHC()}

            </div>
          </div>
        </div>
        <div className="wiz-buttons">
          <a className="wiz-cancel-button" onClick={this.props.close}>{cancel}</a>
          <button className="wiz-continue-btn bg-sky-blue-gradient bn">{btnLabel}</button>
        </div>

      </form>
    );
  }

  renderParentHC() {
    const {
      labelParentHC,
      parentHCPlaceholder
    } = this.props.local.strings.hiringClients.addHCModal.companyInfoTab;
    const currentEntityType = _.get(this.props, 'currentForm.CompanyInfoForm.values.entityType', 0);
    const hcParentsOptions = Utils.getOptionsList(parentHCPlaceholder, this.props.hc.parentsList, 'name', 'id', 'name');
    const parentHC = (
      <div className="row">
        <div className="col-md-6 col-sm-12">
          <div className="admin-form-field-wrapper wiz-field">
            <label htmlFor="parentHC">
            {`${labelParentHC}:`}
            </label>
            <div className="select-wrapper">
              <Field
                name="parentHC"
                component={renderSelect}
                options={hcParentsOptions} />
            </div>
          </div>
        </div>
        <div />
      </div>
    );

    return currentEntityType === '1' ? parentHC : null;
  }
};

CompanyInfoForm = reduxForm({
  form: 'CompanyInfoForm',
  validate,
  asyncValidate,
  asyncBlurFields: ['companyName'],
})(CompanyInfoForm);

const mapStateToProps = (state, ownProps) => {
  const selector = formValueSelector('CompanyInfoForm');
  return {
    currentForm: state.form,
    local: state.localization,
    hc: state.hc,
    companyLogo: selector(state, 'companyLogo') || null
  };
};

export default connect(mapStateToProps)(CompanyInfoForm);
