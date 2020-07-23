import React, { Component } from 'react';

class FileInput extends Component {
  adaptFileEventToValue = (delegate) => {
    const { multiple } = this.props;

    return e => {
      if (multiple) {
        return delegate(e.target.files);
      }

      return delegate(e.target.files[0]);
    }
  }

  render() {
    const {
      input: {
        value: omitValue,
        onChange,
        onBlur,
        ...inputProps
      },
      meta: { touched, error },
      multiple,
      ...props
    } = this.props;

    return (
      <div>
        <input
          onChange={this.adaptFileEventToValue(onChange)}
          onBlur={this.adaptFileEventToValue(onBlur)}
          type="file"
          multiple={multiple}
          {...inputProps}
          {...props}
        />
        <span className="field-validation-message">
          {touched &&
            (error && <span>{error}</span>)}
        </span>
      </div>
    );
  }
}

export default FileInput;
