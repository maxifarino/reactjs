import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';

import renderField from '../../../../customInputs/renderField';
import renderSelect from '../../../../customInputs/renderSelect';
import FilterActions from '../../../../common/filterActions/FilterActions'

class FilterReferences extends React.Component {
  render() {
    const {
      title,
      keywords,
      type
    } = this.props.local.strings.scProfile.references.filter;

    const { handleSubmit, typeOptions} = this.props;
    console.log(this.props)

    return (
      <form onSubmit={handleSubmit} className="list-view-filter-form files-filter-form">
        <h2 className="list-view-filter-title">{title}</h2>
        <div className="container-fluid filter-fields">
          <div className="row">
            <div className="col-md-5 col-sm-12 no-padd">
              <div className="admin-form-field-wrapper keywords-field">
                <label htmlFor="keywords">{keywords}: </label>
                <Field
                  name="keywords"
                  type="text"
                  placeholder={`--${keywords}--`}
                  component={renderField}
                />
              </div>
            </div>

            <div className="col-md-3 col-sm-12 no-padd">
              <div className="admin-form-field-wrapper keywords-field">
                <label htmlFor="date">{type}: </label>
                <div className="select-wrapper">
                  <Field
                    className="select-wrapper"
                    name="type"
                    component={renderSelect}
                    options={typeOptions}
                  />
                </div>
              </div>
            </div>

            <FilterActions
              formName={this.props.form}
              dispatch={this.props.dispatch} />

          </div>
        </div>
      </form>

    );
  }
}

FilterReferences = reduxForm({
  form: 'FilterReferencesForm'
})(FilterReferences);

const mapStateToProps = (state) => {
  return {
    local: state.localization
  }
};

export default connect(mapStateToProps)(FilterReferences);
