import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';

import Utils from '../../../../lib/utils';
import renderField from '../../../customInputs/renderField';
import renderSelect from '../../../customInputs/renderSelect';
import FilterActions from '../../../common/filterActions/FilterActions';

class FilterProjectInsureds extends Component {
  renderField = (element, idx) => {
    const {
      name, label, ph, options, conditional, show,defaultValue
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
            options ?
              <div className="select-wrapper">
                <Field
                  name={name}
                  component={renderSelect}
                  defaultValue={defaultValue}
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
      statusLabel,
      statusPlaceholder,
      insuredNameLabel,
      projectNameLabel,
      holderNameLabel,
      myListLabel,
      keywordNameLabel,
      archivedLabel
    } = this.props.local.strings.projectInsureds.projectInsuredsList.filter;

    const { handleSubmit, projectId, insuredId } = this.props;

    const complianceStatusOptions = Utils.getOptionsList(statusPlaceholder, this.props.common.complianceStatus, 'StatusName', 'ProjectInsuredComplianceStatusID', 'StatusName');
    const myListOptions = [
      { label: 'N/A', value: '' },
      { label: 'Only on my list', value: '1' },
      { label: 'Not on my list', value: '2' },
    ];

    const archivedOptions = [
      { label: 'N/A', value: '' },
      { label: 'True', value: 1 },
      { label: 'False', value: 0 },
    ];

    const fields = [
      { name: 'keyword', label: keywordNameLabel, ph: `-- ${keywordNameLabel} --`, conditional: true, show: projectId },
      { name: 'insuredName', label: insuredNameLabel, ph: `-- ${insuredNameLabel} --`, conditional: true, show: projectId },
      { name: 'projectName', label: projectNameLabel, ph: `-- ${projectNameLabel} --`, conditional: true, show: insuredId },
      { name: 'holderName', label: holderNameLabel, ph: `-- ${holderNameLabel} --`, conditional: true, show: insuredId },
      { name: 'myList', label: myListLabel, options: myListOptions, conditional: true, show: insuredId },
      { name: 'status', label: statusLabel, options: complianceStatusOptions },
      { name: 'archived', label: archivedLabel, options: archivedOptions,defaultValue:'0' }
    ];

    return (
      <form onSubmit={handleSubmit} className="list-view-filter-form">
        <h2 className="list-view-filter-title">{title}</h2>
        <div className="container-fluid filter-fields">
          <div className="row">
            {fields.map(this.renderField)}
          </div>

          <div className="row">
            <FilterActions
              formName={this.props.form}
              dispatch={this.props.dispatch}
            />
          </div>
        </div>
      </form>
    );
  }
}

FilterProjectInsureds = reduxForm({
  form: 'FilterProjectInsureds',
})(FilterProjectInsureds);

const mapStateToProps = (state) => {
  return {
    register: state.register,
    local: state.localization,
    common: state.common,
    initialValues: {
      name: '',
      status: '',
    }
  }
};

export default connect(mapStateToProps)(FilterProjectInsureds);
