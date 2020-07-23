import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';

import renderField from '../../../../../customInputs/renderField';
import renderSelect from '../../../../../customInputs/renderSelect';
import FilterActions from '../../../../../common/filterActions/FilterActions';

let FilterTags = props => {

  const {
    title,
    nameLabel,
    namePlaceholder,
    archivedLabel,
    archivedPlaceholder
  } = props.local.strings.tags.tagsList.filter;

  const {handleSubmit} = props;

  const archivedOpts = [
    {label: archivedPlaceholder, value:''},
    {label: 'True', value:1},
    {label: 'False', value:0}
  ];

  return (
    <form onSubmit={handleSubmit} className="list-view-filter-form">
      <h2 className="list-view-filter-title">{title}</h2>
      <div className="container-fluid filter-fields">
        <div className="row">

          <div className="col-md-4 col-sm-12 no-padd">
            <div className="admin-form-field-wrapper keywords-field">
              <label htmlFor="name">{nameLabel}: </label>
              <Field
                name="name"
                type="text"
                placeholder={namePlaceholder}
                component={renderField}
              />
            </div>
          </div>

          <div className="col-md-3 col-sm-12 no-padd">
            <div className="admin-form-field-wrapper keywords-field">
              <label htmlFor="archived">{archivedLabel}: </label>
                <div className="select-wrapper">
                  <Field
                    name="archived"
                    component={renderSelect}
                    options={archivedOpts} />
                </div>
            </div>
          </div>

          <FilterActions
            formName={props.form}
            dispatch={props.dispatch}
          />

        </div>

      </div>
    </form>

  );
}

FilterTags = reduxForm({
  form: 'FilterTags',
})(FilterTags);

const mapStateToProps = (state, ownProps) => {
  return {
    register: state.register,
    local: state.localization,
    initialValues: {
      name:'',
      archived: ''
    }
  }
};

export default connect(mapStateToProps)(FilterTags);
