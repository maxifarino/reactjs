import React, { Component } from 'react';
import TypeAhead from '../common/typeAheadComponent';
import './styles.css';


class renderTypeAhead extends Component {
  constructor(props) {
    super(props);
    this.state = {
      touched: false
    }
    this.onBlur = this.onBlur.bind(this);
    this.onSearch = this.onSearch.bind(this);
    this.onResultClicked = this.onResultClicked.bind(this);
  }

  onBlur () {
    this.setState({touched: true})
  }

  onResultClicked (result) {
    const { input, onSelect } = this.props;
    input.onChange(result);

    if (onSelect) {
      onSelect(result);
    }
  }

  onSearch (value) {
    const { handleSearch, input } = this.props;
    input.onChange('');
    handleSearch(value);
  }

  render() {
    const {
      placeholder,
      fetching,
      results,
      fetchError,
      label,
      noIcon,
      noContainer,
      resetOnClick,
      name,
      onFocusSelect,
      childRef,
      meta: { touched, error, warning }
    } = this.props;
    if(warning)console.log(warning);

    const componentTouched = this.state.touched || touched;
    const containerClass = `form-type-ahead-container ${componentTouched && error ? 'invalid' : ''}`;

    return (
      <div className={noContainer ? null : containerClass}>
        {
          label? <label htmlFor={name}>{label}</label>:null
        }
        <span className="field-validation-message">
          {componentTouched &&
            (error && <span>{error}</span>)}
        </span>
        <TypeAhead
          hasBorder
          ref={childRef}
          resetOnClick={resetOnClick}
          placeholder={placeholder}
          fetching={fetching}
          results={results}
          handleSearch={this.onSearch}
          onResultClicked={this.onResultClicked}
          onBlur={this.onBlur}
          onFocusSelect={onFocusSelect}
          error={fetchError}
          noIcon={noIcon}
        />
      </div>
    );
  }
}

export default renderTypeAhead;
