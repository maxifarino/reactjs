import React from 'react';
import { connect } from 'react-redux';

import logo from '../../assets/img/logo-nav.svg';

const RegisterSidebar = (props) => {
  const hcLogo = props.hcLogo ? `data:image/jpeg;base64,${props.hcLogo}` : null;
  const hcLogoStyle = {
    maxWidth: '40%',
    width: 'auto',
    height: 'auto',
  }
  const slogan =  props.local.strings.register.registerSidebar.slogan;
  return (
    <div className="col-sm-12 col-md-4 bg-blue-gradient register-sidebar">
      <div className="logos-wrapper">
        <img className="prequal-img register-sidebar-img" src={logo} alt="Prequal"/>
        {
          hcLogo?
            <img className="skender-img register-sidebar-img" style={hcLogoStyle} src={hcLogo} alt="Skender"/>
            :null
        }
      </div>
      <p className="register-slogan">{slogan}</p>
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    local: state.localization,
  };
};

export default connect(mapStateToProps)(RegisterSidebar);
