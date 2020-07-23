import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';

import renderField from '../../../../customInputs/renderField';
import FilterActions from '../../../../common/filterActions/FilterActions'

let FilterProjects = props => {

  const {
    title,
    keywordsLabel,
    keywordsPlaceholder
  } = props.local.strings.hcProfile.projects.filter;

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
              />
            </div>
          </div>

          <FilterActions
            formName={props.form}
            dispatch={props.dispatch} />

        </div>
      </div>
    </form>

  );
}

FilterProjects = reduxForm({
  form: 'FilterProjects',
})(FilterProjects);

const mapStateToProps = (state, ownProps) => {
  return {
    register: state.register,
    local: state.localization
  }
};

export default connect(mapStateToProps)(FilterProjects);
