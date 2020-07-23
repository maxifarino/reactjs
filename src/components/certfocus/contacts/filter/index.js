import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';

import Utils from '../../../../lib/utils';
import renderField from '../../../customInputs/renderField';
import FilterActions from '../../../common/filterActions/FilterActions'
import renderSelect from '../../../customInputs/renderSelect';

let FilterContacts = props => {
  let {
    title,
    firstNameLabel,
    lastNameLabel,
    entityLabel,
    contactTypeLabel,
  } = props.local.strings.contacts.contactsList.filter;

  const { handleSubmit, holderId, insuredId, contacts } = props;

  const contactTypesOptions = Utils.getOptionsList('-- Contact Types --', contacts.contactTypes, 'description', 'id', 'description');

  return (
    <form onSubmit={handleSubmit} className="list-view-filter-form">
      <h2 className="list-view-filter-title">{title}</h2>
      <div className="container-fluid filter-fields">
        <div className="row">

          <div className="col-md no-padd">
            <div className="admin-form-field-wrapper keywords-field">
              <label htmlFor="firstNameTerm">{firstNameLabel}: </label>
              <Field
                name="firstNameTerm"
                placeholder={firstNameLabel}
                type="text"
                component={renderField}
                className="tags-input"
              />
            </div>
          </div>

          <div className="col-md no-padd">
            <div className="admin-form-field-wrapper keywords-field">
              <label htmlFor="lastNameTerm">{lastNameLabel}: </label>
              <Field
                name="lastNameTerm"
                type="text"
                placeholder={lastNameLabel}
                component={renderField}
                className="tags-input"
              />
            </div>
          </div>

          {(!holderId && !insuredId) && (
            <div className="col-md no-padd">
              <div className="admin-form-field-wrapper keywords-field">
                <label htmlFor="entityTerm">{entityLabel}: </label>
                <Field
                  name="entityTerm"
                  type="text"
                  placeholder={entityLabel}
                  component={renderField}
                  className="tags-input"
                />
              </div>
            </div>
          )}

          {(insuredId || holderId) && (
            <div className="col-md no-padd">
              <div className="admin-form-field-wrapper keywords-field">
                <label htmlFor="typeId">{contactTypeLabel}: </label>
                <div className="select-wrapper">
                  <Field
                    name="typeId"
                    type="text"
                    placeholder={contactTypeLabel}
                    component={renderSelect}
                    options={contactTypesOptions}
                    className="tags-input" />
                </div>
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

FilterContacts = reduxForm({
  form: 'FilterContacts',
})(FilterContacts);

const mapStateToProps = (state, ownProps) => {
  return {
    local: state.localization,
    login: state.login,
    contacts: state.contacts,
  }
};

export default connect(mapStateToProps)(FilterContacts);
