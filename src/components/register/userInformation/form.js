import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as registerActions from '../actions';

import Utils from '../../../lib/utils';
import renderField from '../../customInputs/renderField';
import renderSelect from '../../customInputs/renderSelect';

import validate from './validation';

class UserInformationForm extends React.Component {

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
      passwordPlaceholder,
      userButtonText,
      titlesDropdownPlaceholder,
    } = this.props.local.strings.register.userInformation;

    const { handleSubmit } = this.props;

    const titleOptions = this.props.register.titleOptions.map((title) => {
      if (Number(title.value) === 0) {
        return { label: titlesDropdownPlaceholder, value: '' };
      }

      return title;
    });

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
                <label htmlFor="title" className="required">{titleLabel}:</label>
                <div className="select-wrapper">
                  <Field
                    name="title"
                    component={renderSelect}
                    options={titleOptions} />
                </div>
              </div>
            </div>
            <div className="col-md-6 col-sm-12 step-col-right">
              <div className="register-field-wrapper">
                <label htmlFor="phone" className="required">{phoneLabel}:</label>
                <Field
                  name="phone"
                  type="text"
                  placeholder={phonePlaceholder}
                  component={renderField} />
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-6 col-sm-12 step-col-left">
              <div className="register-field-wrapper">
                <label htmlFor="cellphone">{cellPhoneLabel}:</label>
                <Field
                  name="cellphone"
                  type="text"
                  placeholder={cellPhonePlaceholder}
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

          <div className="step-button">
            <button className="bn bg-blue-gradient" type="submit">{userButtonText}</button>
          </div>
        </div>

      </form>
    );
  }
};

UserInformationForm = reduxForm({
  form: 'UserInformationForm',
  validate,
  enableReinitialize: true,
  onSubmitFail: (e) => {
    const fieldNames = [
      'firstName',
      'lastName',
      'title',
      'phone',
      'cellphone',
      'email',
      'password',
      'passwordagain'
    ];
    Utils.getFirstFailedElem(fieldNames, e).focus();
  },
})(UserInformationForm);


const mapStateToProps = (state, ownProps) => {
  const { userPayload } = state.register;
  return {
    local: state.localization,
    register: state.register,
    initialValues: {
      firstName: userPayload.firstName || '',
      lastName: userPayload.lastName || '',
      title: userPayload.titleId || 0,
      phone: userPayload.phone || '',
      cellphone: userPayload.cellPhone || '',
      email: userPayload.email || '',
      password: userPayload.pass || '',
      passwordagain: userPayload.pass || '',
    }
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(registerActions, dispatch)
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(UserInformationForm));
