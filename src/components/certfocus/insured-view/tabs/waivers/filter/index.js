import React from 'react';
import { Field, reduxForm, formValueSelector } from 'redux-form';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import renderField from '../../../../../customInputs/renderField';
import renderSelect from '../../../../../customInputs/renderSelect';
import renderRemovable from '../../../../../customInputs/renderRemovable';
import renderTypeAhead from '../../../../../customInputs/renderTypeAhead';
import FilterActions from '../../../../../common/filterActions/FilterActions'

import * as commonActions from '../../../../../common/actions';

class FilterWaivers extends React.Component {
  renderFormField = (element, idx) => {
    const {
      name,
      label,
      ph,
      type,
      conditional,
      show,
      options,
    } = element;

    const style = {};
    if (conditional && !show) {
      style.display = 'none';
    }

    if (type === 'typeAhead') {
      const { fetching, results, error, handleSearch, onSelect } = element;

      return (
        <div className="col-md no-padd" key={idx} style={style}>
          <div className="admin-form-field-wrapper keywords-field">
            <label htmlFor={name}>{`${label}:`}</label>
            <Field
              resetOnClick
              name={name}
              placeholder={ph}
              fetching={fetching}
              results={results}
              handleSearch={handleSearch}
              fetchError={error}
              component={renderTypeAhead}
              onSelect={onSelect}
            />
          </div>
        </div>
      );
    } else if (type === 'removable') {
      const { valueText, disabled, onRemove } = element;
      return (
        <div className="col-md no-padd" key={idx} style={style}>
          <div className="admin-form-field-wrapper keywords-field">
            <label htmlFor={name}>{`${label}:`}</label>
            <Field
              name={name}
              valueText={valueText}
              component={renderRemovable}
              onRemove={onRemove}
              disabled={disabled}
            />
          </div>
        </div>
      );
    }

    return (
      <div className="col-md no-padd" key={idx} style={style}>
        <div className="admin-form-field-wrapper keywords-field">
          <label htmlFor={name}>{`${label}:`}</label>
          {
          options?
          <div className="select-wrapper">
            <Field
              name={name}
              component={renderSelect}
              options={options}
            />
          </div>
          :
          <Field
            name={name}
            type="text"
            placeholder={ph}
            component={renderField}
          />
        }
        </div>
      </div>
    );
  }

  handleSearch = (filterTerm) => {
    this.props.commonActions.fetchTypeAhead({ nameTerm: filterTerm });
  }

  render() {
    const {
      title,
      keywordsLabel,
      waiverStatusLabel,
      waiverDateLabel,
    } = this.props.local.strings.waivers.filter;

    const {
      handleSubmit,
      insuredId,
    } = this.props;

    const waiverStatusOptions = [
      { label: `-- ${waiverStatusLabel} --`, value: '' },
      { label: 'Pending', value: 0 },
      { label: 'Accepted', value: 1 },
      { label: 'Rejected', value: 2 }
    ];

    const fields = [
      { name: 'keywords', label: keywordsLabel, ph: `-- ${keywordsLabel} --` },
      { name: 'waiverStatusId', label: waiverStatusLabel, options: waiverStatusOptions },
      { name: 'waiverDate', label: waiverDateLabel, ph: `-- ${waiverDateLabel} --`, type: 'date' },
    ];

    return (
      <form onSubmit={handleSubmit} className="list-view-filter-form">
        <h2 className="list-view-filter-title">{title}</h2>
        <div className="container-fluid filter-fields">
          <div className="row">
            {fields.map(this.renderFormField)}
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

FilterWaivers = reduxForm({
  form: 'FilterWaivers',
})(FilterWaivers);

const mapStateToProps = (state) => {
  return {
    local: state.localization,
    login: state.login,
    contacts: state.contacts,
    common: state.common,
    holdersProjects: state.holdersProjects,
    holderIdCurrentValue: formValueSelector('FilterWaivers')(state, 'holderId'),
    projectIdCurrentValue: formValueSelector('FilterWaivers')(state, 'projectId'),
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    commonActions: bindActionCreators(commonActions, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(FilterWaivers);
