import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';

import renderField from '../../../customInputs/renderField';
import renderSelect from '../../../customInputs/renderSelect';
import FilterActions from '../../../common/filterActions/FilterActions';

class FilterRequirementSets extends React.Component {
  renderField = (element, idx) => {
    const {
      name, label, ph, options, conditional, show, defaultValue,
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
                defaultValue={defaultValue}
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

  getAvailableSetIdOptions (holderSetIdPlaceholder) {
    const holderSetIdOptions =  [{ label: holderSetIdPlaceholder, value:'' }];
    this.props.availableHolderSetIds && this.props.availableHolderSetIds.map((holderSetId) => ( holderSetIdOptions.push({ label: holderSetId, value: holderSetId })));
    return holderSetIdOptions;
  }

  render() {
    const {
      title,
      labelName,
      labelDescription,
      labelHolder,
      labelArchived,
      labelHolderSetId,
      holderPlaceholder,
      archivedPlaceholder,
      holderSetIdPlaceholder,

    } = this.props.local.strings.holderRequirementSets.list.filter;

    const { handleSubmit, fromHolderTab } = this.props;

    const holders = this.props.hiringClients.slice(1, this.props.hiringClients.length);
    const holderOptions = [
      {label: holderPlaceholder, value:''},
      ...holders
    ]
    const holderSetIdOptions = this.getAvailableSetIdOptions(holderSetIdPlaceholder);

    const archivedOptions = [
      {label: archivedPlaceholder, value:''},
      {label: 'True', value: 1},
      {label: 'False', value: 0}
    ];

    const fields = [
      {name:'name', label: labelName, ph: `-- ${labelName} --`},
      {name:'description', label: labelDescription, ph: `-- ${labelDescription} --`, conditional: true, show: fromHolderTab },
      {name:'holderId', label:labelHolder, options:holderOptions, conditional: true, show: !fromHolderTab},
      {name:'archived', label:labelArchived, options:archivedOptions, defaultValue: '0'}, //, conditional: true, show: !fromHolderTab
      {name:'holderSetId', label:labelHolderSetId, options:holderSetIdOptions, conditional: true, show: !fromHolderTab}
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
  form: 'FilterRequirementSets',
})(FilterRequirementSets);

const mapStateToProps = (state) => {
  return {
    register: state.register,
    local: state.localization,
    common: state.common
  };
};

export default connect(mapStateToProps)(FilterRequirementSets);
