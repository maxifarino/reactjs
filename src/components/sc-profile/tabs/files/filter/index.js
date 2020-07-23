import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';

import renderField from '../../../../customInputs/renderField';
import FilterActions from '../../../../common/filterActions/FilterActions'
import validate from './validation';

class FilterFiles extends React.Component {
  render() {
    const {
      title,
      keywords,
      startDate,
      endDate
    } = this.props.local.strings.scProfile.files.filter;

    const {handleSubmit} = this.props;

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
                <label htmlFor="date">{startDate}: </label>
                <Field
                  name="dateFrom"
                  type="date"
                  component={renderField}
                />
              </div>
            </div>

            <div className="col-md-3 col-sm-12 no-padd">
              <div className="admin-form-field-wrapper keywords-field">
                <label htmlFor="date">{endDate}: </label>
                <Field
                  name="dateTo"
                  type="date"
                  component={renderField}
                />
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

FilterFiles = reduxForm({
  form: 'FilterFilesForm',
  validate
})(FilterFiles);

const mapStateToProps = (state) => {
  return {
    local: state.localization
  }
};

export default connect(mapStateToProps)(FilterFiles);
