import React from 'react';

class renderField extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      initialized: true
    }
  }

  componentWillMount() {
    if (this.props.defaultValue) {
      this.props.input.onChange(this.props.defaultValue);
    }
    this.setState({initialized: true});
  }

  componentWillUnmount() {
    this.setState({initialized: false});
  }

  render() {
    const {
      className,
      placeholder,
      input,
      type,
      id,
      disabled,
      checked,
      meta: { touched, error, warning, asyncValidating }
    } = this.props;

    if(warning)console.log(warning);

    if(type === 'checkbox') {
      if (this.props.callback) {
        this.props.callback(input.value)
      }
      return (
        <input
          {...input}
          id={id}
          placeholder={placeholder}
          type={type}
          disabled={ !!disabled }
          className={`${className ? className : '' } agree pretty-checkbox ${touched && error ? 'invalid' : ''}`}
        />
      );
    }
    else if(type === 'textarea') {
      return (
        <div className={`${asyncValidating ? 'async-validating' : ''}`}>
          <textarea
            {...input}
            id={id}
            placeholder={placeholder}
            type={type}
            disabled={ !!disabled }
            className={`${className ? className : '' } ${touched && error ? 'invalid' : ''}`}
          />
          <span className="field-validation-message">
            {touched &&
              (error && <span>{error}</span>)}
          </span>
        </div>
      );
    }
    else {      
      return (
        <div className={`${asyncValidating ? 'async-validating' : ''}`}>
          <input
            {...input}
            id={id}
            placeholder={placeholder}
            type={type}
            disabled={ !!disabled }
            className={`${className ? className : '' } ${touched && error ? 'invalid' : ''}`}
            max={(type === 'date') ? "2999-12-31" : undefined}
          />
          <span className="field-validation-message">
            {touched &&
              (error && <span>{error}</span>)}
          </span>
        </div>
      );
    }
  }
}

export default renderField;
