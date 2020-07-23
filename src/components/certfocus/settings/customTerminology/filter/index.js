import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';

import renderField from '../../../../customInputs/renderField';
import FilterActions from '../../../../common/filterActions/FilterActions';

let FilterCustomTerminology = props => {
  const {
    title,
    holderNameLabel,
    originalTermLabel,
    customTermLabel,
  } = props.local.strings.certFocusSettings.customTerminology.filter;

  const { handleSubmit } = props;

  return (
    <form onSubmit={handleSubmit} className="list-view-filter-form">
      <h2 className="list-view-filter-title">{title}</h2>
      <div className="container-fluid filter-fields">
        <div className="row">

          <div className="col-md no-padd">
            <div className="admin-form-field-wrapper keywords-field">
              <label htmlFor="holderName">{holderNameLabel}: </label>
              <Field
                name="holderName"
                placeholder={holderNameLabel}
                component={renderField}
                className="tags-input"
              />
            </div>
          </div>

          <div className="col-md no-padd">
            <div className="admin-form-field-wrapper keywords-field">
              <label htmlFor="originalTerm">{originalTermLabel}: </label>
              <Field
                name="originalTerm"
                placeholder={originalTermLabel}
                component={renderField}
                className="tags-input"
              />
            </div>
          </div>

          <div className="col-md no-padd">
            <div className="admin-form-field-wrapper keywords-field">
              <label htmlFor="customTerm">{customTermLabel}: </label>
              <Field
                name="customTerm"
                placeholder={customTermLabel}
                component={renderField}
                className="tags-input"
              />
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

FilterCustomTerminology = reduxForm({
  form: 'FilterCustomTerminology',
})(FilterCustomTerminology);

const mapStateToProps = (state) => {
  return {
    register: state.register,
    local: state.localization,
    common: state.common
  };
};

export default connect(mapStateToProps)(FilterCustomTerminology);
