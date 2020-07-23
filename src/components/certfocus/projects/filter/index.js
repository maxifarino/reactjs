import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';

import renderField from '../../../customInputs/renderField';
import FilterActions from '../../../common/filterActions/FilterActions'
import renderSelect from '../../../customInputs/renderSelect';
import Utils from '../../../../lib/utils';

let FilterProjects = props => {

  const {
    title,
    projectLabel,
    stateLabel,
    holderLabel,
    myListLabel,
    keywordsLabel,
    archivedLabel,
  } = props.local.strings.certFocusProjects.projectsList.filter;

  const { handleSubmit, fromHolderTab } = props;

  const stateOptions = Utils.getOptionsList(stateLabel, props.common.usStates, 'Name', 'ShortName');

  const myListOptions = [
    {
      label: 'N/A',
      value: ''
    },
    {
      label: 'Only on my list',
      value: '1'
    },
    {
      label: 'Not on my list',
      value: '2'
    }
  ];

  const archivedOptions = [
    { label: 'N/A', value: '' },
    { label: 'True', value: 1 },
    { label: 'False', value: 0, selected: true },
  ];

  return (
    <form onSubmit={handleSubmit} className="list-view-filter-form">
      <h2 className="list-view-filter-title">{title}</h2>
      <div className="container-fluid filter-fields">
        <div className="row">

          <div className="col-md no-padd">
            <div className="admin-form-field-wrapper keywords-field">
              <label htmlFor="keywords">{keywordsLabel}: </label>
              <Field
                name="keywords"
                type="text"
                placeholder={keywordsLabel}
                component={renderField}
                className="tags-input"
              />
            </div>
          </div>

          <div className="col-md no-padd">
            <div className="admin-form-field-wrapper keywords-field">
              <label htmlFor="name">{projectLabel}: </label>
              <Field
                name="name"
                placeholder={projectLabel}
                component={renderField}
                className="tags-input"
              />
            </div>
          </div>

          <div className="col-md no-padd">
            <div className="admin-form-field-wrapper keywords-field">
              <label htmlFor="name">{stateLabel}: </label>
              <Field
                name="state"
                placeholder={stateLabel}
                component={renderField}
                className="tags-input"
              />
            </div>
          </div>

          <div className="col-md no-padd">
            <div className="admin-form-field-wrapper keywords-field">
              <label htmlFor="holder">{holderLabel}: </label>
              <Field
                name="holder"
                type="text"
                placeholder={holderLabel}
                component={renderField}
                className="tags-input"
              />
            </div>
          </div>

          <div className="col-md no-padd">
            <div className="admin-form-field-wrapper keywords-field">
              <label htmlFor="myList">{myListLabel}: </label>
              <div className="select-wrapper">
                <Field
                  name="myList"
                  placeholder={myListLabel}
                  component={renderSelect}
                  options={myListOptions}
                  className="tags-input"
                />
              </div>
            </div>
          </div>

          <div className="col-md no-padd">
            <div className="admin-form-field-wrapper keywords-field">
              <label htmlFor="archived">{archivedLabel}: </label>
              <div className="select-wrapper">
                <Field
                  name="archived"
                  component={renderSelect}
                  options={archivedOptions}
                />
              </div>
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

FilterProjects = reduxForm({
  form: 'FilterProjects',
})(FilterProjects);

const mapStateToProps = (state) => {
  return {
    register: state.register,
    local: state.localization,
    common: state.common
  }
};

export default connect(mapStateToProps)(FilterProjects);
