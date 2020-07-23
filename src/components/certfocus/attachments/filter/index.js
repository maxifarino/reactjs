import React from 'react';
import { Field, reduxForm, formValueSelector } from 'redux-form';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Utils from '../../../../lib/utils';
import renderField from '../../../customInputs/renderField';
import renderRemovable from '../../../customInputs/renderRemovable';
import renderTypeAhead from '../../../customInputs/renderTypeAhead';
import FilterActions from '../../../common/filterActions/FilterActions'

import * as commonActions from '../../../common/actions';
import * as projectActions from '../../projects/actions';

class FilterDocuments extends React.Component {
  renderFormField = (element, idx) => {
    const {
      name,
      label,
      ph,
      type,
      conditional,
      show,
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
          <Field
            name={name}
            type={type || "text"}
            placeholder={ph}
            component={renderField}
            className="tags-input"
          />
        </div>
      </div>
    );
  }

  handleSearch = (filterTerm) => {
    this.props.commonActions.fetchTypeAhead({ nameTerm: filterTerm });
  }

  handleProjectSearch = (filterTerm) => {
    const { insuredId } = this.props;
    const query = {
      projectName: filterTerm,
      insuredId: insuredId,
    };

    this.props.projectActions.fetchTypeAhead(query);
  }

  render() {
    const {
      title,
      fileNameLabel,
      holderLabel,
      dateCreatedLabel,
      projectLabel,
    } = this.props.local.strings.attachments.filter;

    const {
      handleSubmit,
      insuredId,
      holderIdCurrentValue,
      projectIdCurrentValue,
      holdersProjects,
    } = this.props;

    const {
      typeAheadResults,
      typeAheadFetching,
      typeAheadError,
    } = this.props.common;

    const holderOptions = Utils.getOptionsList(null, typeAheadResults, 'name', 'id', 'name');
    const projectOptions = Utils.getOptionsList(null, holdersProjects.typeAheadResults, 'name', 'id', 'name');

    const fields = [
      { name: 'fileName', label: fileNameLabel, ph: `-- ${fileNameLabel} --` },
      {
        name:'holderId', label: holderLabel, ph: `-- Search ${holderLabel} --`, type: 'typeAhead',
        handleSearch: this.handleSearch, fetching: typeAheadFetching, results: holderOptions,
        error: typeAheadError, conditional: true, show: !holderIdCurrentValue && insuredId
      },
      {
        name:'holderId', label: holderLabel, type: 'removable',
        valueText: holderIdCurrentValue ? holderIdCurrentValue.label : '',
        conditional: true, show: holderIdCurrentValue && insuredId,
      },
      {
        name:'projectId', label: projectLabel, ph: `-- Search ${projectLabel} --`, type: 'typeAhead',
        handleSearch: this.handleProjectSearch, fetching: holdersProjects.typeAheadFetching, results: projectOptions,
        error: holdersProjects.typeAheadError, conditional: true, show: !projectIdCurrentValue && insuredId
      },
      {
        name:'projectId', label: projectLabel, type: 'removable',
        valueText: projectIdCurrentValue ? projectIdCurrentValue.label : '',
        conditional: true, show: projectIdCurrentValue && insuredId,
      },
      { name: 'dateCreated', label: dateCreatedLabel, ph: `-- ${dateCreatedLabel} --`, type: 'date' },
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

FilterDocuments = reduxForm({
  form: 'FilterDocuments',
})(FilterDocuments);

const mapStateToProps = (state) => {
  return {
    local: state.localization,
    login: state.login,
    contacts: state.contacts,
    common: state.common,
    holdersProjects: state.holdersProjects,
    holderIdCurrentValue: formValueSelector('FilterDocuments')(state, 'holderId'),
    projectIdCurrentValue: formValueSelector('FilterDocuments')(state, 'projectId'),
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    commonActions: bindActionCreators(commonActions, dispatch),
    projectActions: bindActionCreators(projectActions, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(FilterDocuments);
