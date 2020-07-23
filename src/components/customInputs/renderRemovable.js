import React, { Component } from 'react';
import './styles.css';

class renderRemovable extends Component {
  constructor(props) {
    super(props);
    this.onRemove = this.onRemove.bind(this);
  }

  onRemove () {
    const { input, onRemove } = this.props;
    if(onRemove) {
      onRemove(input.value);
    }

    input.onChange('');
  }

  render() {
    const {
      input,
      label,
      valueText,
      disabled,
      name,
    } = this.props;
    let inputValue = '';
    if(input.value)inputValue = input.value.toString();
    return (
      <div className='form-removable-container'>
        {
          label? <label htmlFor={name}>{label}</label>:null
        }
        <div className="value-container">
          <div className="value-label">
            {valueText || inputValue}
          </div>
          {
            !disabled &&
            <div className="remove-btn linear-icon-circle-cross" onClick={this.onRemove} />
          }
        </div>
      </div>
    );
  }
}

export default renderRemovable;
