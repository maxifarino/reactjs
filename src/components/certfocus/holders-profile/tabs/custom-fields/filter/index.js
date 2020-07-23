import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';

import renderField from '../../../../../customInputs/renderField';
import renderSelect from '../../../../../customInputs/renderSelect';
import FilterActions from '../../../../../common/filterActions/FilterActions';

let FilterCustomFields = props => {

  const {
    title,
    nameLabel,
    inputTypeLabel,
    archivedLabel,
    archivedPlaceholder
  } = props.local.strings.customFields.customFieldsList.filter;

  const { handleSubmit } = props;

  const typeOptions = [
    {label: archivedPlaceholder, value:''},
    {label: 'Text', value:1},
    {label: 'Dropdown', value:2},
    {label: 'Decimal', value:3},
  ];
  const archivedOptions = [
    {label: archivedPlaceholder, value:''},
    {label: 'True', value:1},
    {label: 'False', value:0},
  ];

  return (
    <form onSubmit={handleSubmit} className="list-view-filter-form">
      <h2 className="list-view-filter-title">{title}</h2>
      <div className="container-fluid filter-fields">
        <div className="row">

          <div className="col-md no-padd">
            <div className="admin-form-field-wrapper keywords-field">
              <label htmlFor="name">{nameLabel}: </label>
              <Field
                name="name"
                type="text"
                placeholder={nameLabel}
                component={renderField}
              />
            </div>
          </div>

          <div className="col-md no-padd">
            <div className="admin-form-field-wrapper keywords-field">
              <label htmlFor="inputType">{inputTypeLabel}: </label>
              <div className="select-wrapper">
                <Field
                  name="inputType"
                  component={renderSelect}
                  options={typeOptions}
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

FilterCustomFields = reduxForm({
  form: 'FilterCustomFields',
})(FilterCustomFields);

const mapStateToProps = (state) => {
  return {
    register: state.register,
    local: state.localization,
    common: state.common,
    initialValues: {
      name:'',
      inputType: '',
      archived: ''
    }
  }
};

export default connect(mapStateToProps)(FilterCustomFields);
