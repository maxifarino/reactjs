import React, { Component } from 'react';
import { reduxForm, Field, formValueSelector } from 'redux-form';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Utils from '../../../lib/utils';
import renderTypeAhead from '../../customInputs/renderTypeAhead';
import renderRemovable from '../../customInputs/renderRemovable';

import * as commonActions from '../actions';

class SearchForm extends Component {
  handleSearch = (filterTerm) => {
    this.props.commonActions.fetchTypeAhead({ nameTerm: filterTerm });
  }

  render() {
    const {
      holdersPlaceholder,
      keywordsPlaceholder
    } = this.props.local.strings.common.typeAheadAndSearch;

    const {
      typeAheadResults,
      typeAheadFetching,
      typeAheadError } = this.props.common;

    const { typeAheadFieldValue } = this.props;

    const optionsList = Utils.getOptionsList(null, typeAheadResults, 'name', 'id');

    return (
      <form className="type-ahead-search-form" onSubmit={this.props.handleSubmit}>
        {typeAheadFieldValue ? (
          <div className="type-ahead-search-input-removable">
            <div className="search-removable">
              <Field
                name="typeAhead"
                valueText={typeAheadFieldValue ? typeAheadFieldValue.label : ''}
                component={renderRemovable}
              />
            </div>
          </div>
        ) : (
          <div className="type-ahead-search-input">
            <div className="search-typeAhead">
              <Field
                name="typeAhead"
                placeholder={holdersPlaceholder}
                fetching={typeAheadFetching}
                results={optionsList}
                handleSearch={this.handleSearch}
                fetchError={typeAheadError}
                component={renderTypeAhead}
                noIcon
                noContainer
              />
            </div>
          </div>
        )}

        <div className="type-ahead-search-input">
          <div className="input-group">
            <Field
              placeholder={keywordsPlaceholder}
              type="text"
              component="input"
              className="form-control"
              name="searchBar"
            />
            <button className="input-group-append" type="submit">
              <div className="icon-search_icon" />
            </button>
          </div>
        </div>
      </form>
    );
  }
}

SearchForm = reduxForm({
  form: 'GeneralSearchForm',
})(SearchForm);

const mapStateToProps = (state) => ({
  common: state.common,
  local: state.localization,
  typeAheadFieldValue: formValueSelector('GeneralSearchForm')(state, 'typeAhead'),
});

const mapDispatchToProps = (dispatch) => ({
  commonActions: bindActionCreators(commonActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(SearchForm);