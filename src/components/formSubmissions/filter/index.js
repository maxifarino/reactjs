import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';

import Utils from '../../../lib/utils';
import renderField from '../../customInputs/renderField';
import renderSelect from '../../customInputs/renderSelect';
import FilterActions from '../../common/filterActions/FilterActions'

let FilterFormSubmissions = props => {
  let {
    title,
    keywordsLabel,
    keywordsPlaceholder,
    formCreatorLabel,
    formCreatorPlaceholder,
    formSCSentToPlaceholder,
    sentToLabel
  } = props.local.strings.formList.filter;

  // formCreatorUsers
  const creatorOptions = props.formSubmissions.formCreatorUsers;
  const formCreatorUsersList = Utils.getOptionsList(formCreatorPlaceholder, creatorOptions, 'creatorUserName', 'creatorUserId', 'creatorUserName')

  // formSCSentTo
  const scOptions = props.formSubmissions.formSCSentTo;
  const formSCSentToList = Utils.getOptionsList(formSCSentToPlaceholder, scOptions, 'subContractorName', 'subContractorId', 'subContractorName');

  const {handleSubmit} = props;

  return (
    <form onSubmit={handleSubmit} className="list-view-filter-form" style={{backgroundColor: 'white'}}>
      <h2 className="list-view-filter-title">{title}</h2>
      <div className="container-fluid filter-fields">
        <div className="row">
          <div className="col-md-5 col-sm-12 no-padd">
            <div className="admin-form-field-wrapper keywords-field">
              <label htmlFor="keywords">{keywordsLabel}:</label>
              <Field
                name="keywords"
                type="text"
                placeholder={`--${keywordsPlaceholder}--`}
                component={renderField}
                className="tags-input"/>
            </div>
          </div>
          <div className="col-md-3 col-sm-12 no-padd">
            <div className="admin-form-field-wrapper keywords-field">
              <label htmlFor="formCreator">{formCreatorLabel}: </label>
                <div className="select-wrapper">
                  <Field
                    name="formCreator"
                    component={renderSelect}
                    options={formCreatorUsersList} />
                </div>
            </div>
          </div>
          {
            props.hideSentTo?
              null:
              <div className="col-md-3 col-sm-12 no-padd">
                <div className="admin-form-field-wrapper">
                  <label htmlFor="sentTo">{sentToLabel}: </label>
                  <div className="select-wrapper">
                    <Field
                      name="sentTo"
                      component={renderSelect}
                      options={formSCSentToList} />
                  </div>
                </div>
              </div>
          }

          <FilterActions
            formName={props.form}
            dispatch={props.dispatch} />

        </div>
      </div>
    </form>
  );
}

FilterFormSubmissions = reduxForm({
  form: 'FilterFormSubmissions',
})(FilterFormSubmissions);

const mapStateToProps = (state, ownProps) => {
  return {
    formSubmissions: state.formSubmissions,
    register: state.register,
    local: state.localization
  }
};

export default connect(mapStateToProps)(FilterFormSubmissions)
