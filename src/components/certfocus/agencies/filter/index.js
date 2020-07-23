import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Utils from '../../../../lib/utils';
import renderField from '../../../customInputs/renderField';
import renderSelect from '../../../customInputs/renderSelect';
import renderRemovable from '../../../customInputs/renderRemovable';
import renderTypeAhead from '../../../customInputs/renderTypeAhead';
import FilterActions from '../../../common/filterActions/FilterActions'

import * as commonActions from '../../../common/actions';
import * as registerActions from '../../../register/actions';

class FilterAgencies extends React.Component {
  componentDidMount() {
    this.props.registerActions.fetchGeoStates();
  }

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

  render() {
    const {
      title,
      agencyNameLabel,
      cityLabel,
      stateLabel,
      zipCodeLabel,
    } = this.props.local.strings.agencies.agenciesList.filter;

    const {
      handleSubmit,
      register
    } = this.props;
    
    const fields = [
      { name: 'name', label: agencyNameLabel, ph: `-- Select ${agencyNameLabel} --` },
      { name: 'city', label: cityLabel, ph: `-- Select ${cityLabel} --`  },
      { name: 'state', label: stateLabel, ph: `-- Select ${stateLabel} --`  },
      { name: 'zipCode', label: zipCodeLabel, ph: `-- Select ${zipCodeLabel} --`  },
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

FilterAgencies = reduxForm({
  form: 'FilterAgencies',
})(FilterAgencies);

const mapStateToProps = (state) => {
  return {
    local: state.localization,
    login: state.login,
    common: state.common,
    register: state.register,
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    commonActions: bindActionCreators(commonActions, dispatch),
    registerActions: bindActionCreators(registerActions, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(FilterAgencies);
