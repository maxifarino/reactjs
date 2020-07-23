import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import _ from 'lodash';

import Sidebar from '../components/common/sidebar';
import Header from '../components/common/header';
import Overlay from '../components/common/overlay';
import Loader from '../components/common/loader';
import RedirectByRole from './redirectByRole';

import * as loginActions from '../components/auth/login/actions';

const PrivateRoute = ({ component: Component, onlyHeader, hasSidebar, title, cfTitle, store, fromhc, ...rest }) => {
  //console.log('title', title);
  const { isLoggedIn, profile } = store.getState().login;
  const requests = async () => {
    await store.dispatch(loginActions.getProfile());
  };

  if (_.isEmpty(profile)) {
    requests();
  }

  const renderTitle = () => {
    const { profile } = store.getState().login
    const { Role, CFRole } = profile

    const isOnlyPrequal = Role && !CFRole && title
    const isOnlyCertFocus = !Role && CFRole && cfTitle
    //const isBoth = Role && CFRole && title && cfTitle

    let titleTxt = ''

    if (isOnlyPrequal) {
      titleTxt = title
    } else if (isOnlyCertFocus) {
      titleTxt = cfTitle
    } else {
      let _cfTitle = cfTitle ? cfTitle : '';
      let _title = title ? title : '';

      titleTxt = `${_title} - ${_cfTitle}`
      if (!cfTitle || !title) {
        titleTxt = titleTxt.replace('-', '');
      }
    }

    if (rest.path.indexOf('hiringclients') !== -1) {
      return rest.common.headerTitle || titleTxt || ''
    }
    return titleTxt
  }

  const renderPrivateRoute = (props) => {

    let mainStyle = {};
    if (onlyHeader) {
      mainStyle = {
        left: 0,
        width: '100%'
      }
    }

    if (isLoggedIn) {

      const { Role, multipleSubcontractors, multipleStrictHCs, HCuserMultipleStrictSubs } = profile;

      // console.log('multipleStrictHCs ==',rest.multipleStrictHCs);
      // console.log('multipleSubcontractors ==',rest.multipleSubcontractors);
      // console.log('roleID ==',rest.roleID);

      // console.log('profile = ', profile)

      let routeAllowed = false;
      const urlPath = window.location.pathname.split('/');
      // console.log('rest = ', rest)
      // console.log('The URL the Server is working with = ', window.location.pathname)
      if (Array.isArray(urlPath) && Role) {
        const currentRoute = urlPath[1];
        const currentURLId = parseInt(urlPath[2]);

        switch (currentRoute) {
          case 'subcontractors':
            if (!isNaN(currentURLId) && Role.Id === 4) {
              if (Array.isArray(multipleSubcontractors)) {
                routeAllowed = multipleSubcontractors && multipleSubcontractors.includes(currentURLId);

                if (!routeAllowed) {
                  return <Redirect to={{
                    pathname: '/profile',
                    state: {
                      from: props.location
                    }
                  }} />
                }
              }
            } else if (!isNaN(currentURLId) && (Role.Id === 3 || Role.Id === 6)) {
              if (Array.isArray(HCuserMultipleStrictSubs)) {
                routeAllowed = HCuserMultipleStrictSubs && HCuserMultipleStrictSubs.includes(currentURLId);

                // console.log("currentRoute for HC user", currentRoute);
                // console.log("currentURLId for HC user", currentURLId);
                // console.log("multipleSubcontractors for HC user", multipleSubcontractors);
                // console.log("routeAllowed for HC user", routeAllowed);

                if (!routeAllowed) {
                  return <Redirect to={{
                    pathname: '/profile',
                    state: {
                      from: props.location
                    }
                  }} />
                }
              }
            }
            break;
          case 'hiringclients':
            if (!isNaN(currentURLId) && (Role.Id === 3 || Role.Id === 6)) {
              if (Array.isArray(multipleStrictHCs)) {
                routeAllowed = multipleStrictHCs && multipleStrictHCs.includes(currentURLId);

                // console.log("location", currentRoute, currentURLId, routeAllowed, multipleStrictHCs);

                if (!routeAllowed) {
                  return <Redirect to={{
                    pathname: '/profile',
                    state: {
                      from: props.location
                    }
                  }} />
                }
              }
            }
            break;
          default:
          // console.log('Router without control');
        }

      }

      const withSidebar = (
        <div>
          <Loader />
          <RedirectByRole location={props.location} path={rest.path} />
          <div>
            <div className="sidebar-root">
              {
                onlyHeader ? null :
                  <div className="sidebar-col" id="sidebar-menu">
                    <Sidebar ref="sidebar" />
                  </div>
              }
              <div id="main" className={`body-col ${props.match.params.hcId ? 'profile-body' : ''}`} style={mainStyle}>
                <Overlay style={{ height: '100%' }} />
                <Header className="header" title={renderTitle()} hcId={props.match.params.hcId} onlyHeader={onlyHeader} />
                <Component {...props} fromhc={!!fromhc} />
              </div>
            </div>
          </div>
        </div>
      );


      // if (Role) {
      return hasSidebar || onlyHeader ? withSidebar : (
        <div>
          <RedirectByRole location={props.location} path={rest.path} />
          <Component {...props} />
        </div>
      );
      // } else {
      //   return (<div></div>);
      // }

    } else {
      return <Redirect to={{
        pathname: '/login',
        state: {
          from: props.location
        }
      }} />;
    }
  };
  return (
    <Route {...rest} etv={true} render={renderPrivateRoute} />
  );
};

const mapStateToProps = (state, ownProps) => {
  return {
    common: state.common,
    multipleStrictHCs: state.login.profile.multipleStrictHCs,
    multipleSubcontractors: state.login.profile.multipleSubcontractors,
    roleID: state.login.profile.RoleID
  };
};

export default connect(mapStateToProps)(PrivateRoute);