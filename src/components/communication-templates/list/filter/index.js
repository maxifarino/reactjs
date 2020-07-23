import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';

import renderField from '../../../customInputs/renderField';

let FilterCT = props => {

  let {
    title,
    keywordsLabel,
    keywordsPlaceholder,
    searchButton,
  } = props.local.strings.templates.filter;

  const {handleSubmit} = props;

  return (
    <form onSubmit={handleSubmit} className="list-view-filter-form">
      <h2 className="list-view-filter-title">{title}</h2>
      <div className="container-fluid filter-fields">
        <div className="row">
          <div className="col-md-5 col-sm-12 no-padd">
            <div className="admin-form-field-wrapper keywords-field">
              <label htmlFor="keywords">{keywordsLabel}: </label>
              <Field
                name="keywords"
                type="text"
                placeholder={`--${keywordsPlaceholder}--`}
                component={renderField}
                className="tags-input"
              ></Field>
            </div>
          </div>

          <div className="col-md-1 col-sm-12 no-padd">
            <button
              className="filter-bn"
              type="submit">
              {searchButton}
            </button>
          </div>
        </div>
      </div>
    </form>

  );
}

FilterCT = reduxForm({
  form: 'FilterCT',
})(FilterCT);

const mapStateToProps = (state, ownProps) => {
  return {
    // register: state.register,
    local: state.localization
  }
};

export default connect(mapStateToProps)(FilterCT);
