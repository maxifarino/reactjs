import React from 'react';

class SelectHC extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      selection: ''
    }
    this.handleSelection = this.handleSelection.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    
    let oldSelection = this.props.hcIdInitialSelection
    let newSelection = nextProps.hcIdInitialSelection
    let selection = newSelection ? newSelection : oldSelection

    this.setState({
      selection
    })
  }

  handleSelection(e) {
    this.setState({
      selection: e.target.value
    })
    this.props.onChangeHCSelect(e)
  }

  render() {
    const hcOptions = this.props.options.map((opt,idx) => <option value={opt.id} key={idx}>{opt.name}</option>);
    return (
      <div className="select-wrapper add-sc-select">
        <select
          value={this.state.selection}
          className={''}
          onChange={this.handleSelection}
        >
          {hcOptions}
        </select>
      </div>
    );
  }
};

export default SelectHC;