import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';

import SearchForm from './SearchForm';

import * as commonActions from '../actions';

import './index.css';

class TypeAheadAndSearch extends Component {
  handleSubmitSearch = (data) => {
    const { typeAhead, searchBar } = data;

    this.props.commonActions.resetTypeAheadResults();
    this.props.history.push({
      pathname: '/certfocus/searchResults',
      state: {
        holder: typeAhead,
        keyword: searchBar,
      },
    });
  }

  render() {
    return (
      <SearchForm onSubmit={this.handleSubmitSearch} />
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  commonActions: bindActionCreators(commonActions, dispatch)
});

export default withRouter(connect(null, mapDispatchToProps)(TypeAheadAndSearch));
