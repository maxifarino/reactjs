import React, { Component } from 'react';
import Toggle from 'react-toggle';

import "react-toggle/style.css";

class renderToggle extends Component {
  render() {
    const {
      input,
      className,
      label,
      name,
      disabled,
      meta: { touched, error, warning, asyncValidating }
    } = this.props;
    if(warning)console.log(warning);

    return (
      <div className={`${asyncValidating ? 'async-validating form-toggle-container' : 'form-toggle-container'}`}>
        {
          label? <label htmlFor={name}>{label}</label>:null
        }
        <span className="field-validation-message">
          {touched &&
            (error && <span>{error}</span>)}
        </span>
        <Toggle
          checked={input.value}
          className={className}
          onChange={input.onChange}
          disabled={disabled}
          icons={false}
        />
      </div>
    );
  }
}

export default renderToggle;
