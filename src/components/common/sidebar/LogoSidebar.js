import React from 'react';
import logo from '../../../assets/img/logo-icon-only.svg';
import logo2 from '../../../assets/img/logo-nav.svg';
import { Link } from 'react-router-dom';

class LogoSidebar extends React.Component {
  render() {
    return (
      <div
        className={`logo-sidebar-wrapper ${this.props.toggled ? 'img-extended' : 'img-not-extended'}`}
        id="img-wrapper"
      >
        <Link to='/'>
          <img
            src={this.props.toggled ? logo2 : logo}
            alt="logo"
          />
        </Link>
      </div>
    );
  };
};

export default LogoSidebar;