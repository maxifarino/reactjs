import React from 'react';
import { connect } from 'react-redux';

import logo from '../../../assets/img/VertikalLogo.png';

class AuthFormHeader extends React.Component {
  constructor(props) {
    let headerStrings = props.local.strings.auth.common.AuthFormHeader;
    super(props);
    this.subTitle = this.props.subtitle || headerStrings.subtitle;
  }

  render() {
    let headerStrings = this.props.local.strings.auth.common.AuthFormHeader;
    return (
      <div className="form-header">
        <div className="logo-link">
          <img src={logo} alt="logo"/>
        </div>
        <h4 className="title-login-fom">{headerStrings.title}</h4>
        <h5 className="subtitle-login-fom">{this.subTitle}</h5> 
      </div>
    );
  };
}

const mapStateToProps = (state) => {
  return {
    local: state.localization
  };
};

export default connect(mapStateToProps)(AuthFormHeader);