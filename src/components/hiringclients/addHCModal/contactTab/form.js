import React from 'react';
import { Field, reduxForm, change } from 'redux-form';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import renderField from '../../../customInputs/renderField';
import renderSelect from '../../../customInputs/renderSelect';

import * as registerActions from '../../../register/actions';

import Utils from '../../../../lib/utils';
import asyncValidate from './asyncValidation';
import validate from './validation';

class ContactForm extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      tab: 'create'
    };

    const { profile } = this.props;
    if (profile && profile.contactId) {
      props.dispatch(change('ContactForm', 'tab', 'choose'));
      props.dispatch(change('ContactForm', 'hcUser', profile.contactId||""));
      this.state.tab = 'choose';
    } else {
      props.dispatch(change('ContactForm', 'tab', 'create'));
    }
    props.registerActions.fetchResources();
  }

  generatePassword = (e) => {
    e.preventDefault();
    const length = 8, charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let pw = '';
    for (let i = 0, n = charset.length; i < length; ++i) {
        pw += charset.charAt(Math.floor(Math.random() * n));
    }
    this.props.dispatch(change('ContactForm', 'password', pw));
    this.props.dispatch(change('ContactForm', 'retypePassword', pw));
    this.props.dispatch(change('ContactForm', 'changeuponlogin', true));
  }

  setTabCreate = (ev) => {
    ev.preventDefault();
    this.setState({
      tab: 'create'
    });
    this.props.dispatch(change('ContactForm', 'tab', 'create'));
  };

  setTabChoose = (ev) => {
    ev.preventDefault();
    this.setState({
      tab: 'choose'
    });
    this.props.dispatch(change('ContactForm', 'tab', 'choose'));
  };

  render() {

    const {handleSubmit} = this.props;

    const {
      tabCreate,
      tabChoose,
      labelFirstName,
      labelLastName,
      labelEmail,
      labelPhone,
      labelPassword,
      labelRetypePassword,
      generatePasswordButton,
      chooseExistingHC,
      existingHCPlaceholder,
      cancel,
      finishButton
    } = this.props.local.strings.hiringClients.addHCModal.contactTab;

    const hcUsersOptions = Utils.getOptionsList(existingHCPlaceholder, this.props.hc.hcUsers, 'name', 'id', 'name');

    return (
      <form
        onSubmit={handleSubmit}
        className="contact-info-form wiz-form"
      >
        <div className="container-fluid">

          <div className="hidden-field-wrapper">
            <Field
              name="tab"
              type="text"
              placeholder={'create'}
              component={renderField}
              className="hidden-field" />
          </div>
          <div className="row">
            <div className="col-md-4 col-sm-12">
              <div className="person-contact-tabs">
                <a
                  className={`wiz-tab-link create ${this.state.tab === 'create' ? 'active' : ''}`}
                  onClick={this.setTabCreate}>
                  {tabCreate}
                </a>
                <a
                  className={`wiz-tab-link create ${this.state.tab === 'choose' ? 'active' : ''}`}
                  onClick={this.setTabChoose}>
                  {tabChoose}
                </a>
              </div>
            </div>

            <div className="col-md-8 col-sm-12">
              <div className={`create-tab-container wiz-tab-container ${this.state.tab === 'create' ? 'active' : ''}`}>
                <div className="row">
                  <div className="col-md-6 col-sm-12">
                    <div className="wiz-field admin-form-field-wrapper">
                      <label htmlFor="firstName">
                        {`${labelFirstName}:`}
                      </label>
                      <Field
                        name="firstName"
                        type="text"
                        placeholder={'John'}
                        component={renderField} />
                    </div>
                  </div>
                  <div className="col-md-6 col-sm-12">
                    <div className="wiz-field admin-form-field-wrapper">
                    <label htmlFor="lastName">
                      {`${labelLastName}:`}
                    </label>
                    <Field
                      name="lastName"
                      type="text"
                      placeholder={'Does'}
                      component={renderField} />
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 col-sm-12">
                    <div className="wiz-field admin-form-field-wrapper">
                      <label htmlFor="email">
                        {`${labelEmail}:`}
                      </label>
                      <Field
                        name="email"
                        type="text"
                        placeholder={'example@example.com'}
                        component={renderField} />
                    </div>
                  </div>
                  <div className="col-md-6 col-sm-12">
                    <div className="wiz-field admin-form-field-wrapper">
                      <label htmlFor="phone">
                        {`${labelPhone}:`}
                      </label>
                      <Field
                        name="phone"
                        type="text"
                        placeholder={'+0 000 000 0000'}
                        component={renderField} />
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 col-sm-12">
                    <div className="wiz-field admin-form-field-wrapper">
                      <label htmlFor="password">
                        {`${labelPassword}:`}
                      </label>
                      <Field
                        name="password"
                        type="password"
                        placeholder={'**************'}
                        component={renderField} />
                    </div>
                  </div>
                  <div className="col-md-6 col-sm-12">
                    <div className="wiz-field admin-form-field-wrapper">
                      <label htmlFor="retypePassword">
                        {`${labelRetypePassword}:`}
                      </label>
                      <Field
                        name="retypePassword"
                        type="password"
                        placeholder={'**************'}
                        component={renderField} />
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 col-sm-12">
                    <div className="wiz-field admin-form-field-wrapper">
                      <button className="bn bg-green-dark-gradient bn-generate-pw" onClick={this.generatePassword}>{generatePasswordButton}</button>
                    </div>
                  </div>
                  <div className="col-md-6 col-sm-12">
                    <div className="wiz-field admin-form-field-wrapper">
                      <label htmlFor="changeuponlogin">
                      <Field
                        id="changeuponlogin"
                        className="changeuponlogin"
                        name="changeuponlogin"
                        component={renderField}
                        type="checkbox"
                      />
                      <span className="check"></span>
                      <span className="label">{'Ask to change password after login'}</span>
                    </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className={`choose-tab-container wiz-tab-container ${this.state.tab === 'choose' ? 'active' : ''}`}>
                <div className="row">
                  <div className="col-md-6 col-sm-12">
                    <div className="wiz-field admin-form-field-wrapper">
                      <label htmlFor="hcUser">
                        {`${chooseExistingHC}:`}
                      </label>
                      <div className="select-wrapper">
                        <Field
                          name="hcUser"
                          component={renderSelect}
                          options={hcUsersOptions} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        <div className="wiz-buttons">
          <a className="wiz-cancel-button" onClick={this.props.close}>{cancel}</a>
          <button className="wiz-continue-btn bg-sky-blue-gradient bn">{finishButton}</button>
        </div>

      </form>
    );
  }
};

ContactForm = reduxForm({
  form: 'ContactForm',
  validate,
  asyncValidate,
  asyncBlurFields: ['email'],
})(ContactForm);

const mapStateToProps = (state, ownProps) => {
  return {
    local: state.localization,
    hc: state.hc,
    register: state.register,
    common: state.common
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    registerActions: bindActionCreators(registerActions, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ContactForm);
