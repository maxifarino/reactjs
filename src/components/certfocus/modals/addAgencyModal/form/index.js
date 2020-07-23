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
import * as registerActions from '../../../../register/actions';

import validate from './validation';

class AddAgencyForm extends Component {
  constructor(props) {
    super(props);
    const { agency } = props;
    if (agency) {
      console.log('agency', agency);      
      const { 
        AgencyId, 
        Name,
        Address,
        City,
        State,
        Country,
        ZipCode,
        MainPhone,
        MainEmail,
        FaxNumber,
      } = agency;

      props.dispatch(change('AddAgencyForm', 'country', Country || ''));
      props.dispatch(change('AddAgencyForm', 'name', Name || ''));
      props.dispatch(change('AddAgencyForm', 'address', Address || ''));
      props.dispatch(change('AddAgencyForm', 'city', City || ''));
      props.dispatch(change('AddAgencyForm', 'state', State || ''));
      props.dispatch(change('AddAgencyForm', 'zipCode', ZipCode || ''));
      props.dispatch(change('AddAgencyForm', 'mainPhone', MainPhone || ''));
      props.dispatch(change('AddAgencyForm', 'mainEmail', MainEmail || ''));
      props.dispatch(change('AddAgencyForm', 'faxNumber', FaxNumber || ''));
    }
  }

  componentDidMount() {
    this.props.commonActions.fetchCountries();
  }

  componentWillReceiveProps(prevProps) {
    if (this.props.common.countries !== prevProps.common.countries) {
      if (this.props.agency) {
        this.props.dispatch(change('AddAgencyForm', 'country', this.props.agency.Country || ''));
      }      
    }
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
              options={options} 
              defaultValue={name === 'country' ? 'United States' : null}
            />
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
      register,
      currentCountry,
    } = this.props;
    
    const {
      agencyNameLabel,
      addressLabel,
      cityLabel,
      stateLabel,
      countryLabel,
      zipCodeLabel,
      mainPhoneLabel,
      mainEmailLabel,
      faxNumberLabel,
      cancelButton,
      saveButton
    } = this.props.local.strings.agencies.addAgencyModal;
    
    const countryOptions = Utils.getOptionsList(`-- ${countryLabel} --`, this.props.common.countries, 'name', 'name', 'name');
    
    // const country = currentCountry || '';

    const fields = [
      { name: 'name', label: agencyNameLabel, ph: `-- Select ${agencyNameLabel} --` },
      { name: 'address', label: addressLabel, ph: `-- Select ${addressLabel} --`  },
      { name: 'city', label: cityLabel, ph: `-- Select ${cityLabel} --`  },
      { name: 'state', label: stateLabel, ph: `-- ${stateLabel} --`},
      { name: 'country', label: countryLabel, options: countryOptions  },
      { name: 'zipCode', label: zipCodeLabel, ph: `-- Select ${zipCodeLabel} --`  },
      { name: 'mainPhone', label: mainPhoneLabel, ph: `-- Select ${mainPhoneLabel} --`  },
      { name: 'mainEmail', label: mainEmailLabel, ph: `-- Select ${mainEmailLabel} --`  },
      { name: 'faxNumber', label: faxNumberLabel, ph: `-- Select ${faxNumberLabel} --`  },
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
          this.props.agencies.errorPostAgency &&
          <div className="error-item-form">
            { this.props.agencies.errorPostAgency }
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

AddAgencyForm = reduxForm({
  form: 'AddAgencyForm',
  validate
})(AddAgencyForm);

const mapStateToProps = (state) => {
  return {
    currentForm: state.form,
    local: state.localization,
    common: state.common,
    register: state.register,
    agencies: state.agencies,
    currentCountry: formValueSelector('AddAgencyForm')(state, 'country'),
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    commonActions: bindActionCreators(commonActions, dispatch),
    registerActions: bindActionCreators(registerActions, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddAgencyForm);