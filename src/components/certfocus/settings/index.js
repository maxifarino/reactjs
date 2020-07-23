import React, { Component } from 'react';
import Tabs from './tabs';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as commonActions from '../../common/actions';

class Settings extends Component {

  componentDidMount() {
  }

  render() {
    return (
      <Tabs />
    );
  }
};

const mapStateToProps = (state) => {
  return {
    local: state.localization    
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    commonActions: bindActionCreators(commonActions, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
