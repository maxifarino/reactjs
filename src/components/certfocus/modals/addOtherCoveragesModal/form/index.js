import React from 'react';
import { Field, reduxForm, change } from 'redux-form';
import { connect } from 'react-redux';
//import { bindActionCreators } from 'redux';

import renderField from '../../../../customInputs/renderField';
import renderSelect from '../../../../customInputs/renderSelect';

//import asyncValidate from './asyncValidation';
import validate from './validation';

class OtherCoverageForm extends React.Component {
  constructor(props) {
    super(props);    
  }

  renderFormField = (element, idx) => {
    const { name, label, ph, type, options } = element;
    return (
      <div key={idx} className="admin-form-field-wrapper">
        <label htmlFor={name}>{`${label}:`}</label>
        <Field
          name={name}
          type={type || "text"}
          placeholder={ph}
          component={type === 'select' ? renderSelect : renderField}
          options={type === 'select' ? options : ''}
          />
      </div>
    );
  }

  handleSaveAndAddMore = () => {

  }

  render() {
    const {handleSubmit} = this.props;
    const {
      labelAttribute,
      labelValue,
      cancelButton,
      saveButton,
      saveAndAddMoreButton
    } = this.props.local.strings.processing.dataEntry;

    const attributeOptions = [
      {label: "A", value: "A"},
      {label: "B", value: "B"}
    ];

    const fields = [
      {name:'attribute', label:labelAttribute, ph:'-- Attribute --', type:'select', options: attributeOptions},
      {name:'value', label:labelValue, ph:'-- Value --', type:'text'},
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

        <div className="add-item-bn">
          
          <button
            className="bn bn-small bg-green-dark-gradient create-item-bn icon-save"
            type="submit">
            {saveButton}
          </button>
          <a
            className="cancel-add-item"
            onClick={this.handleSaveAndAddMore}>
            {saveAndAddMoreButton}
          </a>
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

OtherCoverageForm = reduxForm({
  form: 'OtherCoverageForm',
  validate,
  //asyncValidate,
})(OtherCoverageForm);

const mapStateToProps = (state, ownProps) => {
  return {
    local: state.localization,
    common: state.common,
  };
};

export default connect(mapStateToProps)(OtherCoverageForm);
