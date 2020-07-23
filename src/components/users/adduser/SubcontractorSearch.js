import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import renderField from '../../customInputs/renderField';

class SubcontractorSearch extends Component {

  constructor(props){
    super(props)
    // this.state = {
      // selected: false,
      // readyClose: false,
      // hide: false
    // }
    // this.renderSubcontractorResults = this.renderSubcontractorResults.bind(this)
    // this.handleButtonClick = this.handleButtonClick.bind(this)
  }
  
  // This handleItemClick needs to remain in this "functionName = () =>" syntax
  // handleItemClick = (value) => {
  //   this.props.additionSCTag(value)
  //   this.setState({
  //     selected: value,
  //     hide: true
  //   })
  // }

  // handleButtonClick(value) {
  //   this.setState({
  //     hide: false
  //   }, () => {
  //     this.props.handleSubmit(value)
  //   })
  // }

  // renderSubcontractorResults(subOptions) {
  //   console.log('subOptions = ', subOptions)
  //   const { selected } = this.state
  //   if (subOptions.length > 0) {
  //     const results = subOptions.map( (subOption) => 
  //       <li className={`subOptions ${selected == subOption.value ? 'selected' : ''}`} key={subOption.value + Math.floor(Math.random(10000))} value={subOption.value} onClick={this.handleItemClick.bind(null, { id: subOption.value, name: subOption.label })}>{subOption.label}</li>
  //     )

  //   return ( <ul className="subList">{ results }</ul> )
  //   }
  // }

  // hiring clients options
  // const hiringClients = props.hiringClients.slice(1, props.hiringClients.length);
  // const hcOptionsList = Utils.getOptionsList(HCPlaceholder, hiringClients, 'label', 'value', 'label');

  
  render() {
    const { handleSubmit, placeholder } = this.props;
    // const { readyClose } = this.state
    return (
      <div className="subSearchWrapperWrapper">
  
        <label htmlFor="subcontractors">{this.props.label}: </label>
        <div className="subSearchWrapper">
          <Field
            name="subcontractors"
            type="text"
            placeholder={`--${placeholder}--`}
            component={renderField}
            className="tags-input floatLeft col-lg-10 col-md-10 col-sm-10"
          ></Field>
         <button className="subSearchBtn col-lg-2 col-md-2 col-sm-2" type="submit" onClick={ handleSubmit } >
           <div className='searchIcon linear-icon-magnifier' />
           <div></div>
          </button>
        </div>
      </div>
    );
  }
}

SubcontractorSearch = reduxForm({
  form: 'SubcontractorSearch',
})(SubcontractorSearch);

// const mapStateToProps = (state, ownProps) => {
//   return {
//     // register: state.register,
//     // local: state.localization
//     // PQRole: state.login.profile.Role,
//     // CFRole: state.login.profile.CFRole
//   }
// };

// export default connect(mapStateToProps)(SubcontractorSearch)
export default SubcontractorSearch
