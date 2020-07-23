import React, { Component } from 'react';
import { reduxForm, Field, formValueSelector, change } from 'redux-form';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import renderField from '../../../../customInputs/renderField';
import renderSelect from '../../../../customInputs/renderSelect';
import renderTypeAhead from '../../../../customInputs/renderTypeAhead';
import renderRemovable from '../../../../customInputs/renderRemovable';
import Utils from '../../../../../lib/utils';

import validation from './endorsementValidation';

class EndorsementForm extends Component {

  renderFormField = (element, idx) => {
    const {
      name,
      label,
      ph,
      type,
      conditional,
      show,
      options,
      onChange,
    } = element;

    const style = {};
    if (conditional && !show) {
      style.display = 'none';
    }

    if (type === 'typeAhead') {
      const { fetching, results, error, handleSearch, onSelect } = element;

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
            onSelect={onSelect}
          />
        </div>
      );
    } else if (type === 'removable') {
      const { valueText, disabled, onRemove } = element;
      return (
        <div key={idx} className="wiz-field admin-form-field-wrapper" style={style}>
          <label htmlFor={name}>{`${label}:`}</label>
          <Field
            name={name}
            valueText={valueText}
            component={renderRemovable}
            onRemove={onRemove}
            disabled={disabled}
          />
        </div>
      );
    }

    if (options) {
      return (
        <div key={idx} className="admin-form-field-wrapper" style={style}>
          <label htmlFor={name}>{`${label}:`}</label>
          <div className="select-wrapper">
            <Field
              name={name}
              component={renderSelect}
              options={options}
              onChange={onChange}
            />
          </div>
        </div>
      );
    }

    return (
      <div key={idx} className="admin-form-field-wrapper" style={style}>
        <label htmlFor={name}>{`${label}:`}</label>
        <Field
          name={name}
          type={type || "text"}
          placeholder={ph}
          component={renderField}
        />
      </div>
    );
  }

  // handleOnChange = (e) => {
  //   this.props.dispatch(change('EndorsementForm', 'endorsement', e.target.value));
  // }

  render() {
    const { handleSubmit, filteredEndorsements, holderId } = this.props;

    const {
      titleText,
      editText,
      nameLabel,
      saveButton,
      cancelButton,
    } = this.props.local.strings.holderRequirementSets.details.addEndorsementModal;

    let endorsementOptions = Utils.getOptionsList(null, filteredEndorsements, 'Name', 'Id', 'Name');
    endorsementOptions.unshift({label: '-- Select an additional requirement --', value:''});    

    const fields = [
      { name: 'endorsement', label: nameLabel, options: endorsementOptions },
    ];

    return (
      <div className="add-item-view add-entity-form-small requirement-group-form-modal">
        <div className="add-item-header">
          <h1>{(this.props.group) ? editText : titleText}</h1>
        </div>
        <section className="white-section">
          <div className="add-item-form-subsection">
            <form
              autoComplete="off"
              className="entity-info-form"
              onSubmit={handleSubmit}
            >
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
                  type="submit"
                >
                  {saveButton}
                </button>
                <a
                  className="cancel-add-item"
                  onClick={() => this.props.close()} >
                  {cancelButton}
                </a>
              </div>

            </form>
          </div>
        </section>
      </div>
    );
  }
}

EndorsementForm = reduxForm({
  form: 'EndorsementForm',
  validate: validation,
})(EndorsementForm);

const mapStateToProps = (state) => {
  return {
    local: state.localization,
    holderRequirementSets: state.holderRequirementSets,
    endorsementId: formValueSelector('EndorsementForm')(state, 'endorsement'),
  };
};

export default connect(mapStateToProps)(EndorsementForm);
