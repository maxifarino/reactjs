import React, { Component } from 'react';

import './TypeAhead.css';

class TypeAhead extends Component {
  _focusTimeout;
  _typingTimeout;

  constructor(props) {
    super(props);

    this.state = {
      searchTerm: this.props.initialValue||"",
      focused: false,
    }

    this.onInputChange = this.onInputChange.bind(this);
    this.onInputFocus = this.onInputFocus.bind(this);
    this.onInputBlur = this.onInputBlur.bind(this);
    this.renderResult = this.renderResult.bind(this);
  }

  resetTypeahead = () => {
    this.setState({searchTerm: ''})
  }


  componentWillUnmount() {
    clearTimeout(this._focusTimeout);
  }

  onInputChange(e) {
    const value = e.target.value;
    this.setState({ searchTerm: value });

    clearTimeout(this._typingTimeout);

    //if (value.length >= 3 && !this.props.fetching) {
    if (value.length >= 3) {
      this._typingTimeout = setTimeout(() => {
        this.props.handleSearch(this.state.searchTerm);
      }, 1000); // Await user to stop typing
    }
  }

  onInputFocus() {

    const {onFocusSelect} = this.props;
    this.setState({ searchTerm: '' });
    clearTimeout(this._focusTimeout);
    this.setState({ focused: true });
    if(onFocusSelect) onFocusSelect();
  }

  onInputBlur() {
    const { onBlur } = this.props;
    clearTimeout(this._focusTimeout);
    this._focusTimeout = setTimeout(() => {
      if(onBlur)onBlur();
      if (this.state.focused) {
        this.setState({ focused: false });
      }
    }, 300);

  }

  resultClicked = (result) => {
    const { onResultClicked, dontOverwriteOnClick, resetOnClick } = this.props;

    if (resetOnClick){
      this.setState({ searchTerm: '' });
    } else if(!dontOverwriteOnClick){
      this.setState({ searchTerm: result.label });
    }

    onResultClicked(result);
  }

  renderLoader () {
    return (
      <div className="spinner-wrapper">
        <div className="spinner"></div>
      </div>
    );
  }

  renderResult(result, idx) {
    return (
      <div key={idx}>
        <div className="searchResults" onClick={() => this.resultClicked(result)} >
          {result.label}
        </div>
      </div>
    );
  }

  render() {
    const {
      placeholder,
      disabled,
      hasBorder,
      fetching,
      results,
      error,
      noIcon } = this.props;
    const { focused, searchTerm } = this.state;

    const mainClass = focused ? 'type-ahead-search-bar focused':'type-ahead-search-bar';
    const inputContainerClass = hasBorder ? 'input-container grey-border':'input-container';
    const ph = placeholder;

    return (
      <div className="type-ahead-search-bar-container">
        <div className={mainClass}>
          <div className={inputContainerClass}>
            <input
              placeholder={ph}
              onChange={this.onInputChange}
              onFocus={this.onInputFocus}
              onBlur={this.onInputBlur}
              disabled={disabled}
              value={searchTerm}
            />
            {!noIcon &&
              <span className="icon-search_icon" />
            }
          </div>
          {
            focused && searchTerm.length >= 2 &&
            <div className="results-container">
              {fetching && this.renderLoader()}
              {!fetching && error ? error : results.map(this.renderResult)}
            </div>
          }
        </div>
      </div>
    );
  };
}

export default TypeAhead;
