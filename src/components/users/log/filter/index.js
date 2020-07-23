import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';

import Utils from '../../../../lib/utils';
import renderField from '../../../customInputs/renderField';
import renderSelect from '../../../customInputs/renderSelect';

let FilterUsers = props => {
  let {
    title,
    keywordsLabel,
    keywordsPlaceholder,
    usernameLabel,
    usernamePlaceholder,
    systemModuleLabel,
    systemModulePlaceHolder,
    buttonSearch
  } = props.local.strings.logs.filter;

  // user options
  const usersList = Utils.getOptionsList(usernamePlaceholder, props.logUsers, 'name', 'id', 'name');
  // system modules options
  const systemModuleList = Utils.getOptionsList(systemModulePlaceHolder, props.logModules, 'name', 'id', 'name');

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
          <div className="col-md-3 col-sm-12 no-padd" >
            <div className="admin-form-field-wrapper keywords-field">
              <label htmlFor="user">{usernameLabel}: </label>
              <div className="select-wrapper">
                <Field
                  name="user"
                  component={renderSelect}
                  options={usersList}
                />
              </div>
            </div>
          </div>
          <div className="col-md-3 col-sm-12 no-padd" >
            <div className="admin-form-field-wrapper">
              <label htmlFor="systemModule">{systemModuleLabel}: </label>
              <div className="select-wrapper">
                <Field
                  name="systemModule"
                  component={renderSelect}
                  options={systemModuleList}/>
              </div>
            </div>
          </div>
          <div className="col-md-1 col-sm-12 no-padd">
            <button className="filter-bn" type="submit">{buttonSearch}</button>
          </div>
        </div>
      </div>
    </form>
  );
}

FilterUsers = reduxForm({
  form: 'FilterUsers',
})(FilterUsers);

const mapStateToProps = (state, ownProps) => {
  const { logUsers, logModules } = state.users;
  return {
    register: state.register,
    local: state.localization,
    logUsers,
    logModules
  }
};

export default connect(mapStateToProps)(FilterUsers)
