import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {  withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';

import * as formActions from '../actions';

class FormView extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      form: this.props.form,
    };
    
    let hcId = props.form.hiringClientId;
    // props.hcProfileActions.fetchHCProfile(hcId)
  }

  
  render () {
    return;
  }
}

FormView.defaultProps = {
};

FormView.propTypes = {
};

const mapStateToProps = (state, ownProps) => {
  return {
    local: state.localization,
    login: state.login,
    files: state.files
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(formActions, dispatch),
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(FormView));
