import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';

import Utils from '../../../../lib/utils';
import renderField from '../../../customInputs/renderField';
import renderSelect from '../../../customInputs/renderSelect';
import FilterActions from '../../../common/filterActions/FilterActions';

let FilterInsureds = props => {
  const {
    title,
    insuredLabel,
    projectLabel,
    holderLabel,
    stateLabel,
  } = props.local.strings.insured.insuredList.filter;

  const { handleSubmit } = props;

  const archivedOptions = [
    { label: '-- Select option --', value: '' },
    { label: 'False', value: 0, selected: true },
    { label: 'True', value: 1 },
    { label: 'N/A', value: '' },
  ];
  
  return (
    <form onSubmit={handleSubmit} className="list-view-filter-form">
      <h2 className="list-view-filter-title">{title}</h2>
      <div className="container-fluid filter-fields">
        <div className="row">

          <div className="col-md no-padd">
            <div className="admin-form-field-wrapper keywords-field">
              <label htmlFor="insuredName">{insuredLabel}: </label>
              <Field
                name="insuredName"
                placeholder={insuredLabel}
                component={renderField}
                className="tags-input"
              />
            </div>
          </div>

          <div className="col-md no-padd">
            <div className="admin-form-field-wrapper keywords-field">
              <label htmlFor="projectName">{projectLabel}: </label>
              <Field
                name="projectName"
                placeholder={projectLabel}
                component={renderField}
                className="tags-input"
              />
            </div>
          </div>

          <div className="col-md no-padd">
            <div className="admin-form-field-wrapper keywords-field">
              <label htmlFor="holderName">{holderLabel}: </label>
              <Field
                name="holderName"
                placeholder={holderLabel}
                component={renderField}
                className="tags-input"
              />
            </div>
          </div>

          <div className="col-md no-padd">
            <div className="admin-form-field-wrapper keywords-field">
              <label htmlFor="state">{stateLabel}: </label>
              <Field
                name="state"
                placeholder={stateLabel}
                component={renderField}
                className="tags-input"
              />
            </div>
          </div>
          <div className="col-md no-padd">
            <div className="admin-form-field-wrapper keywords-field">
              <label htmlFor="archived">{'Archive'}: </label>
              <div className="select-wrapper">
                <Field
                  name="archive"
                  component={renderSelect}
                  options={archivedOptions}
                />
              </div>
            </div>
          </div>

        </div>

        <div className="row">
          <div className="col-md-12 d-flex justify-content-end">
            <FilterActions
              formName={props.form}
              dispatch={props.dispatch}
            />
          </div>
        </div>

      </div>
    </form>

  );
}

FilterInsureds = reduxForm({
  form: 'FilterInsureds',
})(FilterInsureds);

const mapStateToProps = (state) => {
  return {
    register: state.register,
    local: state.localization,
    common: state.common
  }
};

export default connect(mapStateToProps)(FilterInsureds);
