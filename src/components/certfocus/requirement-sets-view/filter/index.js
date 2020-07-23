import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';

import renderField from '../../../customInputs/renderField';
import renderSelect from '../../../customInputs/renderSelect';
import FilterActions from '../../../common/filterActions/FilterActions';

class FilterRequirementSets extends Component {
  renderField = (element, idx) => {
    const {
      name, label, ph, options, conditional, show
    } = element;
    const style = {};
    if (conditional && !show) {
      return null
    }

    return (
      <div className="col-md-6 no-padd" key={idx}>
        <div key={idx} className="admin-form-field-wrapper keywords-field" style={style}>
          <label htmlFor={name}>{`${label}:`}</label>
          {
            options?
            <div className="select-wrapper">
              <Field
                name={name}
                component={renderSelect}
                options={options} />
            </div>
            :
            <Field
              name={name}
              type="text"
              placeholder={ph}
              component={renderField}
              className="tags-input" />
          }
        </div>
      </div>
    );
  }

  render() {
    const {
      title,
      conditionLabel,
      deficiencyTypeLabel,
      coverageLabel,
      attributeLabeL,
    } = this.props.local.strings.holderRequirementSetsView.filter;

    const { deficiencyTypeOptions, conditionPossibleValues } = this.props.holderRequirementSets;

    const { handleSubmit } = this.props;

    const fields = [
      { name:'coverage', label: coverageLabel, ph: `-- ${coverageLabel} --` },
      { name:'attribute', label: attributeLabeL, ph: `-- ${attributeLabeL} --` },
      { name:'condition', label: conditionLabel, options: conditionPossibleValues },
      { name:'type', label: deficiencyTypeLabel, options: deficiencyTypeOptions },
    ]

    return (
      <form onSubmit={handleSubmit} className="list-view-filter-form">
        <h2 className="list-view-filter-title">{title}</h2>
        <div className="container-fluid filter-fields">
          <div className="row">
            {fields.map(this.renderField)}
          </div>

          <div className="row">
            <div className="col-md-12 d-flex justify-content-end">
              <FilterActions
                formName={this.props.form}
                dispatch={this.props.dispatch}
              />
            </div>
          </div>

        </div>
      </form>
    );

  }
}

FilterRequirementSets = reduxForm({
  form: 'FilterRequirementSetsView',
})(FilterRequirementSets);

const mapStateToProps = (state) => {
  return {
    register: state.register,
    local: state.localization,
    common: state.common,
    holderRequirementSets: state.holderRequirementSets,
  };
};

export default connect(mapStateToProps)(FilterRequirementSets);
