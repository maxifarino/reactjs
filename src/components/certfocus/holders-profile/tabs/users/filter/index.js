import React from 'react';
import {Field, reduxForm} from 'redux-form';
import {connect} from 'react-redux';


import Utils from '../../../../../../../src/lib/utils';
import FilterActions from '../../../../../common/filterActions/FilterActions'
import renderField from '../../../../../customInputs/renderField';
import renderSelect from '../../../../../customInputs/renderSelect';

let FilterHolderUsers = props => {

  let {
    title,
    keywordsLabel,
    keywordsPlaceholder,
    HClabel,
    HCPlaceholder,
    userTypeLabel,
    userTypePlaceholder
  } = props.local.strings.users.filter;
  const {PQRole, CFRole} = props;
  const {fromHCtab, fromSCtab, fromHolderTab, fromProjectTab} = props;
  //const fromPQTab = fromHCtab || fromSCtab;
  //const fromCFTab = fromHolderTab || fromProjectTab;

  // hiring clients options
  const hiringClients = props.hiringClients.slice(1, props.hiringClients.length);
  const hcOptionsList = Utils.getOptionsList(HCPlaceholder, hiringClients, 'label', 'value', 'label');
  // user types options
  const roleOptions = props.register.roleOptions.slice(1, props.register.roleOptions.length);
  const cfRoleOptions = props.register.cfRoleOptions.slice(1, props.register.cfRoleOptions.length);
  const userTypeList = Utils.getOptionsList(userTypePlaceholder, roleOptions, 'label', 'value', 'label');
  const cfUserTypeList = Utils.getOptionsList(userTypePlaceholder, cfRoleOptions, 'label', 'value', 'label');

  const archivedOptions = [
    {label: 'N/A', value: '', selected: true},
    {label: 'True', value: 1},
    {label: 'False', value: 0},
  ];

  const {handleSubmit} = props;
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
              <label htmlFor="holderUsersArchived">{'Archived'}: </label>
              <div className="select-wrapper">
                <Field
                  name="holderUsersArchived"
                  component={renderSelect}
                  options={archivedOptions}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          {
            !fromHCtab && !fromSCtab && !fromHolderTab && !fromProjectTab && (
              <div className="col-md-4 col-sm-12 no-padding">
                <div className="admin-form-field-wrapper hiring-client-field">
                  <label htmlFor="hiringClient">{HClabel}: </label>
                  <div className="select-wrapper">
                    <Field
                      name="hiringClient"
                      component={renderSelect}
                      options={hcOptionsList}
                    ></Field>
                  </div>
                </div>
              </div>
            )
          }

          {
            !fromSCtab && PQRole &&
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

          <FilterActions
            formName={props.form}
            dispatch={props.dispatch}/>

        </div>
      </div>
    </form>
  );
}

FilterHolderUsers = reduxForm({
  form: 'FilterHolderUsers',
})(FilterHolderUsers);

const mapStateToProps = (state, ownProps) => {
  return {
    register: state.register,
    local: state.localization,
    PQRole: state.login.profile.Role,
    CFRole: state.login.profile.CFRole
  }
};

export default connect(mapStateToProps)(FilterHolderUsers)
