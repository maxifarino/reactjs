import React, { Component } from 'react';
import { Field, reduxForm, change, formValueSelector } from 'redux-form';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import renderField from '../../../../customInputs/renderField';
import renderSelect from '../../../../customInputs/renderSelect';
import renderRemovable from '../../../../customInputs/renderRemovable';
import renderTypeAhead from '../../../../customInputs/renderTypeAhead';
import Utils from '../../../../../lib/utils';

import * as commonActions from '../../../../common/actions';

import validate from './validation';

class AddAgentsForm extends Component {
  constructor(props) {
    super(props);
    const { agent } = props;
    if (agent) {
      console.log('agent', agent);      
      const { 
        AgentId, 
        FirstName, 
        LastName,
        MobileNumber,
        PhoneNumber,
        EmailAddress,
      } = agent;

      props.dispatch(change('AddAgentsForm', 'firstName', FirstName || ''));
      props.dispatch(change('AddAgentsForm', 'lastName', LastName || ''));
      props.dispatch(change('AddAgentsForm', 'mobileNumber', MobileNumber || ''));
      props.dispatch(change('AddAgentsForm', 'phoneNumber', PhoneNumber || ''));
      props.dispatch(change('AddAgentsForm', 'emailAddress', EmailAddress || ''));
    }
  }

  componentDidMount() {
  }

  renderFormField = (element, idx) => {
    const { type, name, label, ph, options, conditional, show } = element;
    const fieldType = type || 'text';
    const style = {};
    if (conditional && !show) {
      style.display = 'none';
    }

    if (fieldType === 'typeAhead') {
      const { fetching, results, error, handleSearch } = element;

      return (
        <div key={idx} className="wiz-field admin-form-field-wrapper" style={style}>
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
          />
        </div>
      );
    } else if (fieldType === 'removable') {
      const { valueText, disabled } = element;
      return (
        <div key={idx} className="wiz-field admin-form-field-wrapper" style={style}>
          <label htmlFor={name}>{`${label}:`}</label>
          <Field
            name={name}
            valueText={valueText}
            component={renderRemovable}
            disabled={disabled}
          />
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

  render() {
    const { 
      handleSubmit,
    } = this.props;
    
    const {
      firstNameLabel,
      lastNameLabel,
      mobileNumberLabel,
      phoneNumberLabel,
      emailAddressLabel,
      cancelButton,
      saveButton
    } = this.props.local.strings.agencies.addAgentsModal;
    
    const fields = [
      { name: 'firstName', label: firstNameLabel, ph: `-- Select ${firstNameLabel} --` },
      { name: 'lastName', label: lastNameLabel, ph: `-- Select ${lastNameLabel} --` },
      { name: 'mobileNumber', label: mobileNumberLabel, ph: `-- Select ${mobileNumberLabel} --`  },
      { name: 'phoneNumber', label: phoneNumberLabel, ph: `-- Select ${phoneNumberLabel} --`  },
      { name: 'emailAddress', label: emailAddressLabel, ph: `-- Select ${emailAddressLabel} --`  },
    ];

    return (
      <form
        onSubmit={handleSubmit}
        className="entity-info-form" >

        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              {fields.map(this.renderFormField)}
            </div>
          </div>
        </div>

        {
          this.props.agencies.errorPostAgents &&
          <div className="error-item-form">
            { this.props.agencies.errorPostAgents }
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

AddAgentsForm = reduxForm({
  form: 'AddAgentsForm',
  validate
})(AddAgentsForm);

const mapStateToProps = (state) => {
  return {
    currentForm: state.form,
    local: state.localization,
    common: state.common,
    agencies: state.agencies,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    commonActions: bindActionCreators(commonActions, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddAgentsForm);
