import React from 'react';
import {connect} from "react-redux";

class Overlay extends React.Component {
  render() {
    return (
      <div id="overlay" className={this.props.common.toggled ? 'overlay-empty' : ''}>
      </div>
    );
  };
};

const mapStateToProps = (state, ownProps) => {
  return {
    common: state.common
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(Overlay);