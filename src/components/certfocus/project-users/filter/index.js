import React from 'react';
import {Field, reduxForm} from 'redux-form';
import {connect} from 'react-redux';

import Utils from '../../../../lib/utils';
import renderField from "../../../customInputs/renderField";
import renderSelect from "../../../customInputs/renderSelect";
import FilterActions from "../../../common/filterActions/FilterActions";

const FilterProjectUsers = props => {

  let {
    title,
    keywordsLabel,
    keywordsPlaceholder,
    userTypeLabel,
    userTypePlaceholder
  } = props.local.strings.projectUsers.filter;
  const {PQRole, CFRole, handleSubmit} = props;
  const roleOptions = props.register.roleOptions.slice(1, props.register.roleOptions.length);
  const cfRoleOptions = props.register.cfRoleOptions.slice(1, props.register.cfRoleOptions.length);
  const userTypeList = Utils.getOptionsList(userTypePlaceholder, roleOptions, 'label', 'value', 'label');
  const cfUserTypeList = Utils.getOptionsList(userTypePlaceholder, cfRoleOptions, 'label', 'value', 'label');

  const archivedOptions = [
    {label: 'N/A', value: '', selected: true},
    {label: 'True', value: 1},
    {label: 'False', value: 0},
  ];

  return (
    <form onSubmit={handleSubmit} className="list-view-filter-form">
      <h2 className="list-view-filter-title">{title}</h2>
      <div className="container-fluid filter-fields">
        <div className="row">
          <div className="col-md-8 col-sm-12 no-padding">
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
          <div className="col-md-3 col-sm-12 no-padding">
            <div className="admin-form-field-wrapper keywords-field">
              <label htmlFor="archived">{'Archive'}: </label>
              <div className="select-wrapper">
                <Field
                  name="Archived"
                  component={renderSelect}
                  options={archivedOptions}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          {
            PQRole &&
            <div className="col-md-4 col-sm-12 no-padding">
              <div className="admin-form-field-wrapper hiring-client-field">
                <label htmlFor="userType">
                  {CFRole ? 'PQ' : ''} {userTypeLabel}
                </label>
                <div className="select-wrapper">
                  <Field
                    name="userType"
                    component={renderSelect}
                    options={userTypeList}
                  ></Field>
                </div>
              </div>
            </div>
          }

          {
            CFRole &&
            <div className="col-md-4 col-sm-12 no-padding">
              <div className="admin-form-field-wrapper hiring-client-field">
                <label htmlFor="userType">
                  {PQRole ? 'CF' : ''} {userTypeLabel}
                </label>
                <div className="select-wrapper">
                  <Field
                    name="CFUserType"
                    component={renderSelect}
                    options={cfUserTypeList}
                  ></Field>
                </div>
              </div>
            </div>
          }
          <div className="col-md-4 col-sm-12 no-padding>">
            <FilterActions
              formName={props.form}
              dispatch={props.dispatch}/>
          </div>
        </div>
      </div>
    </form>
  );
};

const FilterProjectUsersForm = reduxForm({
  form: 'FilterProjectUsers',
})(FilterProjectUsers);

const mapStateToProps = (state, ownProps) => {
  return {
    register: state.register,
    local: state.localization,
    PQRole: state.login.profile.Role,
    CFRole: state.login.profile.CFRole
  }
};

export default connect(mapStateToProps)(FilterProjectUsersForm);