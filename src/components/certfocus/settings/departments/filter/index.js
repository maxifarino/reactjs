import React from 'react';
import {Field, reduxForm} from "redux-form";
import renderField from "../../../../customInputs/renderField";
import renderSelect from "../../../../customInputs/renderSelect";
import FilterActions from "../../../../common/filterActions/FilterActions";

let FilterDepartments = (props) => {
  const {
    title,
    nameLabel,
    archivedLabel,
  } = props.locale.filter;

  const {handleSubmit} = props;

  const archivedOptions = [
    {label: 'False', value: 0, selected: true},
    {label: 'True', value: 1},
    {label: 'Any', value: '-1'},
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
                placeholder={nameLabel}
                component={renderField}
                className="tags-input"
              />
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
};

FilterDepartments = reduxForm({
  form: 'FilterDepartments',
})(FilterDepartments)

export default FilterDepartments;