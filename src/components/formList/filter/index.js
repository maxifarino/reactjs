import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';

import Utils from '../../../lib/utils';
import renderField from '../../customInputs/renderField';
import renderSelect from '../../customInputs/renderSelect';
import FilterActions from '../../common/filterActions/FilterActions'

let FilterForms = props => {
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
  const formCreatorUsersList = [
    {
      label: `--${formCreatorPlaceholder}--`,
      value: ''
    }
  ];
  props.forms.formCreatorUsers.forEach((creator) => {
    formCreatorUsersList.push({
      label: `${creator.FormCreator} - ${creator.RoleName}`,
      value: creator.CreatorUserId.toString()
    })
  });

  // formSCSentTo
  const formSCSentToList = Utils.getOptionsList(formSCSentToPlaceholder, props.forms.formSCSentTo, 'Name', 'Id', 'Name');

  const {handleSubmit} = props;

  return (
    <form onSubmit={handleSubmit} className="list-view-filter-form">
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

          <FilterActions
            formName={props.form}
            dispatch={props.dispatch} />

        </div>
      </div>
    </form>
  );
}

FilterForms = reduxForm({
  form: 'FilterForms',
})(FilterForms);

const mapStateToProps = (state, ownProps) => {
  return {
    forms: state.forms,
    register: state.register,
    local: state.localization
  }
};

export default connect(mapStateToProps)(FilterForms)
