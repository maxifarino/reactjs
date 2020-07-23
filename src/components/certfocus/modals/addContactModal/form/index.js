import React from 'react';
import { Field, reduxForm, change } from 'redux-form';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Utils from '../../../../../lib/utils';
import renderField from '../../../../customInputs/renderField';
import renderSelect from '../../../../customInputs/renderSelect';
//import asyncValidate from './asyncValidation';
import validate from './validation';

import * as contactsActions from '../../../contacts/actions';

class ContactInfoForm extends React.Component {
  constructor(props) {
    super(props);

    const { profile } = this.props;
    if (profile) {
      props.dispatch(change('ContactInfoForm', 'firstName', profile.FirstName || ''));
      props.dispatch(change('ContactInfoForm', 'lastName', profile.LastName || ''));
      props.dispatch(change('ContactInfoForm', 'phone', profile.phoneNumber || ''));
      props.dispatch(change('ContactInfoForm', 'mobile', profile.mobileNumber || ''));
      props.dispatch(change('ContactInfoForm', 'email', profile.emailAddress || ''));
      props.dispatch(change('ContactInfoForm', 'contactType', profile.contactTypeId || ''));
    }
  }

  renderFormField = (element, idx) => {
    const {
      name, label, ph, options
    } = element;

    return (
      <div key={idx} className="admin-form-field-wrapper">
        <label htmlFor={name}>{`${label}:`}</label>
        {
          options?
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
            type="text"
            placeholder={ph}
            component={renderField}
          />
        }
      </div>
    );
  }

  render() {
    const { handleSubmit, contacts } = this.props;
    const {
      labelFirstName,
      labelLastName,
      labelPhone,
      labelMobile,
      labelEmail,
      labelContactType,
      cancelButton,
      saveButton,
    } = this.props.local.strings.contacts.addContactModal;

    const contactTypesOptions = Utils.getOptionsList('-- Contact Types --', contacts.contactTypes, 'description', 'id', 'description');

    const fields = [
      { name:'firstName', label: labelFirstName, ph: `-- ${labelFirstName} --` },
      { name:'lastName', label: labelLastName, ph: `-- ${labelLastName} --`},
      { name:'phone', label: labelPhone, ph:`-- ${labelPhone} --` },
      { name:'mobile', label: labelMobile, ph: `-- ${labelMobile} --` },
      { name:'email', label: labelEmail, ph: `-- ${labelEmail} --` },
      { name:'contactType', label: labelContactType, options: contactTypesOptions },
    ];

    return (
      <form
        className="entity-info-form"
        onSubmit={handleSubmit} >
        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              {fields.map(this.renderFormField)}
            </div>
          </div>
        </div>

        {
          this.props.contacts.errorPostContact &&
          <div className="error-item-form">
            { this.props.contacts.errorPostContact }
          </div>
        }
        <div className="add-item-bn">
          <button
            className="bn bn-small bg-green-dark-gradient create-item-bn icon-save"
            type="submit" >
            {saveButton}
          </button>
          <a
            className="cancel-add-item"
            onClick={this.props.close} >
            {cancelButton}
          </a>
        </div>

      </form>
    );
  }
};

ContactInfoForm = reduxForm({
  form: 'ContactInfoForm',
  validate,
  //asyncValidate,
  //asyncBlurFields: ['email'],
})(ContactInfoForm);

const mapStateToProps = (state, ownProps) => {
  return {
    currentForm: state.form,
    local: state.localization,
    contacts: state.contacts,
    common: state.common,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(contactsActions, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ContactInfoForm);
