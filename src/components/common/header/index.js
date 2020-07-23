import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import { Link } from 'react-router-dom';

import UserNotifications from './UserNotifications';
import logo from '../../../assets/img/VertikalLogo.png';
import utils from '../../../lib/utils'
import * as commonActions from '../actions';
import './header.css';
import Breadcrumb from './../breadcrumb';

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editPermission: false,
      editHC: false,
      HCname: ''
    }
    this.setEditHC = this.setEditHC.bind(this)
    this.onChangeName = this.onChangeName.bind(this)
    this.handleNameChange = this.handleNameChange.bind(this)
    this.renderBrandLink = this.renderBrandLink.bind(this)

    if (props.loginProfile.Id) {
      this.props.commonActions.checkUserAuthorizations();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.loginProfile.Id !== this.props.loginProfile.Id) {
      this.props.commonActions.checkUserAuthorizations();
    }
    let newRole = nextProps.loginProfile.RoleID
    let newhcId = nextProps.hcId

    if (!newhcId) {
      this.setState({
        editPermission: false,
        editHC: false
      })
    }

    if (newRole && newhcId) {
      this.setState({
        HCname: this.props.hcName
      })
      const allowedRoles = new Set([1, 2, 5])
      const currentRole = Number(newRole)

      if (allowedRoles.has(currentRole)) {
        this.setState({
          editPermission: true
        })
      }
    }



  }

  setEditHC() {
    if (this.state.editPermission) {
      this.setState({
        editHC: !this.state.editHC
      })
    }
  }

  onChangeName(e) {
    this.setState({ HCname: e });
  }

  handleNameChange(e) {
    const hcId = this.props.hcId
    const newHCname = this.state.HCname
    const payload = {
      hcId,
      newHCname: utils.replaceQuotes(newHCname)
    }
    this.props.commonActions.changeHCname(payload, (success) => {
      window.location.reload();
    });
  }

  renderBrandLink() {
    const { RoleID, FirstHiringClientId, FirstSubcontractorId } = this.props.loginProfile
    let brand = <img
      className="prequal-logo"
      src={logo}
      alt="logo"
    />
    let url = ''

    if (RoleID == 4 && FirstSubcontractorId) {
      url = `/subcontractors/${FirstSubcontractorId}`
    } else if (RoleID && RoleID != 4 && FirstHiringClientId) {
      url = `/hiringclients/${FirstHiringClientId}`
    }

    if (url) {
      brand = <Link to={`${url}`}>
        <img
          className="prequal-logo"
          src={logo}
          alt="logo"
        />
      </Link>
    }
    return brand
  }

  render() {

    let displayTitle = utils.displayQuotes(this.props.title);

    return (
      <header>
        {
          this.props.onlyHeader ?
            <div className="row header-frame only-header-style">
              <div className="col-sm-2 col-md-2 prequal-logo-container">
                {this.renderBrandLink()}
              </div>
              <div className="col-sm-3 col-md-3 no-padd titleContainer">
                {
                  this.state.editHC && this.state.editPermission
                    ? <div>
                      <input
                        className="nameChangeInput"
                        placeholder={displayTitle}
                        onChange={(e) => this.onChangeName(e.target.value)}
                        type="text"
                      />
                      <div
                        className='nameChangeBtn'
                        onClick={this.handleNameChange}>
                        <span className='linear-icon-pencil-alt2'></span>
                      </div>
                    </div>
                    : <p className={`screen-title ${this.state.editPermission ? 'edit' : ''}`} onClick={this.setEditHC}>{displayTitle}</p>
                }
              </div>
              <div className="col-sm-7 col-md-7 only-header-notifications">
                <UserNotifications />
              </div>
            </div>
            :
            <div className="row header-frame">
              <div className="col-sm-4 col-md-4 no-padd titleContainer">
                <p className="screen-title">{displayTitle}</p>
              </div>
              <div className="col-sm-8 col-md-8 no-padd">
                <UserNotifications />
              </div>
            </div>
        }
        <Breadcrumb /> 
        
      </header>
    );
  }
};

const mapStateToProps = (state) => {
  return {
    loginProfile: state.login.profile,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    commonActions: bindActionCreators(commonActions, dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Header);
