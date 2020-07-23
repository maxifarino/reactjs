import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

const prequalRoutes = [
  '/form-link', '/form-submission', '/forms', '/communication-templates', '/subcontractors', '/video', '/hiringclients/:hcId'
];
const certFocusRoutes = [
  '/certfocus',
];

class RedirectByRole extends React.Component {

  isInForbiddenRoute = (routes) => {
    const { path } = this.props;
    let inForbiddenRoute = false;
    //console.log(path);
    for (var i=0; i<routes.length; i++) {
      if(path.includes(routes[i])){
        inForbiddenRoute = true;
        break;
      }
    }

    return inForbiddenRoute;
  }

  render() {
    const { Role, CFRole } = this.props.loginProfile;
    const isOnlyPrequal = Role && !CFRole;
    const isOnlyCertFocus = !Role && CFRole;

    if( (isOnlyPrequal && this.isInForbiddenRoute(certFocusRoutes)) ||
        (isOnlyCertFocus && this.isInForbiddenRoute(prequalRoutes)) ){
      return (
        <Redirect to={{
          pathname: '/profile',
          state: {
            from: this.props.location
          }
        }} />
      );
    }

    return null;
  }
};

const mapStateToProps = (state) => {
  return {
    loginProfile: state.login.profile,
  };
};

export default connect(mapStateToProps)(RedirectByRole);
