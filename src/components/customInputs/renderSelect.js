import React from 'react';

class renderSelect extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      initialized: true
    }

    this.handleSelect = this.handleSelect.bind(this)
    this.renderSelect = this.renderSelect.bind(this)
  }

  componentWillMount() {
    if (this.props.defaultValue) {
      this.props.input.onChange(this.props.defaultValue);
    }
    this.setState({initialized: true});
  }

  handleSelect(e) {
    const value = e.target.value
    
    if (this.props.callback) {
      this.props.callback(value)
    }
    // console.log('value = ', value)
    this.props.input.onChange(e)
  }

  renderSelect(input, disabled, className, touched, error, options, isValueAnObject) {
    let select = ''
    let opts = ''

    const renderOptions = () => {   
      let opts = options.map((opt,idx) => {
        const val = isValueAnObject ? `${opt.value}_${opt.label}` : opt.value
        
        return <option value={val} key={idx}>
                {opt.label} 
               </option>
      });

      return opts
    }

    opts   = renderOptions()
    select =  <div>
                <select
                  {...input}
                  onChange={this.handleSelect}
                  disabled={!!disabled}
                  className={`${className ? className : ''} ${touched && error ? 'invalid' : ''}`}
                >
                  {opts}
                </select>
                { 
                  touched && error 
                    ? <span className="select-error-message field-validation-message">
                        {error}
                      </span>
                    : null
                }
              </div>
  
    return select
  }

  componentWillUnmount() {
    this.setState({initialized: false});
  }

  render() {
    const {
      options,
      input,
      className,
      disabled,
      isValueAnObject,
      meta: { touched, error, warning }
    } = this.props;
    if(warning)console.log(warning);

    return this.renderSelect(input, disabled, className, touched, error, options, isValueAnObject)
  }
}

export default renderSelect;
