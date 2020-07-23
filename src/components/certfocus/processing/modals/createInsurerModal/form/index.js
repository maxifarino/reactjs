import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { Field, reduxForm, change } from 'redux-form';
import { connect } from 'react-redux';
import Utils from '../../../../../../lib/utils';

import renderField from '../../../../../customInputs/renderField';
import renderSelect from '../../../../../customInputs/renderSelect';
import validate from './validation';
import * as registerActions from '../../../../../register/actions';

class InsurerForm extends Component {
  componentDidMount() {
    const { insurer, dispatch } = this.props;    
    this.props.registerActions.fetchGeoStates();

    if (insurer) {
      dispatch(change('InsurerForm', 'insurerName', insurer.Name || ''));
      dispatch(change('InsurerForm', 'NAICCompanyNumber', insurer.NAICCompanyNumber || ''));
    }
  }

  renderFormField(element, idx) {
    const {
      name,
      label,
      ph,
      type,
      conditional,
      show,
      options,
    } = element;

    const style = {};
    if (conditional && !show) {
      style.display = 'none';
    }

    return (
      <div className="col-md no-padd" key={idx} style={style}>
        <div className="admin-form-field-wrapper keywords-field">
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
      </div>
    );
  }

  render() {
    const { 
      handleSubmit,
      register
    } = this.props;

    const {
      cancelButton,
      saveButton
    } = this.props.local.strings.processing.dataEntry;

    const {
      nameLabel,
      AMBestCompanyNumberLabel,
      NAICCompanyNumberLabel,
      cityLabel,
      stateLabel,
      zipCodeLabel,
    } = this.props.local.strings.processing.dataEntry.insurer;

    const stateOptionsList = Utils.getOptionsList(`-- Select ${stateLabel} --`, register.geoStates, 'Name', 'ShortName', 'Name');

    const fields = [
      { name: 'insurerName', label: nameLabel, ph: `-- ${nameLabel} --` },
      { name: 'NAICCompanyNumber', label: NAICCompanyNumberLabel, ph: `-- ${NAICCompanyNumberLabel} --` },
    ];
    
    return (
      <form
        autoComplete="off"
        className="entity-info-form"
        onSubmit={handleSubmit} >
        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              {fields.map(this.renderFormField)}
            </div>
          </div>
        </div>

        {this.props.processing.addInsurerError &&
          <div className="error-item-form">
            {this.props.processing.addInsurerError}
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

InsurerForm = reduxForm({
  form: 'InsurerForm',
  validate,
})(InsurerForm);

const mapStateToProps = (state) => {
  return {
    local: state.localization,
    common: state.common,
    processing: state.processing,
    register: state.register,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    registerActions: bindActionCreators(registerActions, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(InsurerForm);
