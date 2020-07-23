import React, { Component } from 'react';
import './loader.css'
import {connect} from "react-redux";

class Loader extends Component {
  render(){
    return  (
      this.props.common.loading ?
        <div className="common-spinner-wrapper">
          <div className="common-spinner"/>
        </div>
        :
        null
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const { common } = state;
  return {
    common
  };
};

export default connect(mapStateToProps)(Loader);