import React, { Fragment } from 'react';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';

import renderField from '../../customInputs/renderField';
import FilterActions from '../../common/filterActions/FilterActions'
import renderSelect from '../../customInputs/renderSelect';

let FilterHC = props => {
  let {
    title,
    keywordsLabel,
    keywordsPlaceholder
  } = props.local.strings.hiringClients.filter;

  let {
    nameLabel,
    namePlaceholder,
    contactNameLabel,
    contactNamePlaceholder,
  } = props.local.strings.holders.filter;

  const { handleSubmit, profile } = props;

  const archivedOptions = [
    { label: 'N/A', value: '', selected: true },
    { label: 'True', value: 1 },
    { label: 'False', value: 0 },
  ];

  return (
    <form onSubmit={handleSubmit} className="list-view-filter-form">
      <h2 className="list-view-filter-title">{title}</h2>
      <div className="container-fluid filter-fields">
        <div className="row">

          {profile.CFRole && (
            <Fragment>
              <div className="col-md no-padd">
                <div className="admin-form-field-wrapper keywords-field">
                  <label htmlFor="nameTerm">{nameLabel}: </label>
                  <Field
                    name="nameTerm"
                    placeholder={namePlaceholder}
                    type="text"
                    component={renderField}
                    className="tags-input"
                  />
                </div>
              </div>
              <div className="col-md no-padd">
                <div className="admin-form-field-wrapper keywords-field">
                  <label htmlFor="contactNameTerm">{contactNameLabel}: </label>
                  <Field
                    name="contactNameTerm"
                    type="text"
                    placeholder={contactNamePlaceholder}
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
            </Fragment>
          )}

          {profile.Role && (
            <div className="col-md col-sm-12 no-padd">
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
          )}
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

FilterHC = reduxForm({
  form: 'FilterHC',
})(FilterHC);

const mapStateToProps = (state, ownProps) => {
  return {
    // register: state.register,
    local: state.localization,
    login: state.login
  }
};

export default connect(mapStateToProps)(FilterHC);
