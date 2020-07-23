import _ from 'lodash';
import * as types from './types';
import Api from '../../../../lib/api';
import * as customActions from "../../../../localization/custom";

export const setLoginProcessing = (processing) => {
  return {
    type: types.SET_LOGIN_PROCESSING,
    processing
  };
};

export const setCredentials = (credentials) => {
  return {
    type: types.SET_CREDENTIALS,
    credentials
  };
};

export const setErrorCredentials = (msj) => {
  return {
    type: types.SET_ERROR_CREDENTIALS,
    msj
  }
};

export const setIsLoggedIn = (isLoggedIn) => {
  return {
    type: types.SET_ISLOGGEDIN,
    isLoggedIn
  };
};

export const setLoginExtraMsj = (extraMessage) => {
  return {
    type: types.SET_LOGIN_EXTRA_MSG,
    extraMessage
  };
};

export const setAuthToken = (authToken) => {
  return {
    type: types.SET_AUTH_TOKEN,
    authToken: authToken
  };
};

export const setProfile = (profile) => {
  return {
    type: types.SET_USER_PROFILE,
    profile
  };
};

export const sendCredentials = (credentials, history, from) => {
  // console.log(`from.pathname == "/dashboard" => ${from.pathname == "/dashboard"}`)
  return (dispatch, getState) => {
    let actionStrings = getState().localization.strings.auth.login.actions;

    dispatch(setLoginProcessing(true));
    dispatch(setCredentials(credentials));
    return Api.post(
      `users/gettoken`,
      {
        email: credentials.username,
        password: credentials.password
      }
    )
    .then(response => {
      const errors = {
        10008: actionStrings.error10009,
        10009: actionStrings.error10009
      };
      const { success, data } = response.data;

      if(success) {
        sessionStorage.setItem('auth-token', data.token);

        if(credentials.remember) {
          localStorage.setItem('auth-token', data.token);
        } else {
          localStorage.removeItem('auth-token');
        }

        dispatch(setProfile(data.profile));

        let system = 'pq'
        if (data.profile.CFRole) {
          system = 'cf';
        } else {
        }
        dispatch(setCurrentSystem(system));
        localStorage.setItem('currentSystem',system)

        dispatch(setIsLoggedIn(true));
        dispatch(setAuthToken(data.token));
        dispatch(setLoginExtraMsj(''));

        // Custom Terms
        if (data.profile.customTerms && data.profile.customTerms.length > 0) {
          dispatch(customActions.setCustomTerms(data.profile.customTerms));
        }

        let redirectUrl = '';
        const IsPrequalRole = _.get(data, 'profile.Role.IsPrequalRole');
        const IsHCRole = _.get(data, 'profile.Role.IsHCRole');
        const IsSCRole = _.get(data, 'profile.Role.IsSCRole');

        // console.log('sendCredentials data.profile = ', data.profile)
        // console.log('data.profile = ', data.profile)
        if (IsPrequalRole) {
          redirectUrl= '/tasks';
          if (data.profile.RoleID == 1) {
            redirectUrl= '/hiringclients/';
          }
        } else if (IsHCRole) {
          let hcId = ""

          if (data.profile.multipleStrictHCs && data.profile.multipleStrictHCs.length && data.profile.multipleStrictHCs.length > 1) {
            redirectUrl= '/hiringclients/';
          } else if (data.profile.relatedHc && data.profile.relatedHc.id) {
            hcId = data.profile.relatedHc.id;
            redirectUrl = `/hiringclients/${hcId}`;
          }
          
        } else if (IsSCRole) {
          let scId = ""
          if (data.profile.FirstSubcontractorId && data.profile.FirstSubcontractorId) {
            scId = data.profile.FirstSubcontractorId;
          }
          redirectUrl = `/subcontractors/${scId}`;
        }

        if (from.pathname != "/profile") {
          redirectUrl = from.pathname;
        }

        

        const url = data.profile.MustRenewPass ? '/reset' : redirectUrl

        // console.log('redirectUrl in login/actions = ', redirectUrl)
        // console.log('url = ', url)

        history.push(url);

      } else {
        let errorMsj = errors[data.errorCode] || actionStrings.errorDefault;
        dispatch(setErrorCredentials(errorMsj));
        history.push('/login');
      }
      dispatch(setLoginProcessing(false));
    })
    .catch(error => {
      dispatch(setLoginProcessing(false));
      dispatch(setErrorCredentials(actionStrings.errorDefault));
      history.push('/login');
    });
  };
};

export const getProfile = () => {
  return (dispatch, getState) => {

    let actionStrings = getState().localization.strings.auth.forgot.actions;
    const token = getState().login.authToken;
    return Api.get(`users/profile`, token)
    .then(response => {
      let errorMsj = '';
      const {success, data } = response.data;

      if(success) {
        if(data.profile && data.profile.Id)localStorage.setItem('user-id', data.profile.Id);
        //console.log('getProfile data.profile = ', data.profile)
        dispatch(setProfile(data.profile));

        if (data.profile.CFRole) {
          dispatch(setCurrentSystem('cf'));
        } else {
          dispatch(setCurrentSystem('pq'));
        }

        // Custom Terms
        if (data.profile.customTerms && data.profile.customTerms.length > 0) {          
          dispatch(customActions.setCustomTerms(data.profile.customTerms));
        }
      }
      else {
        switch(data.errorCode) {
          case 10005:
            errorMsj = actionStrings.error10005;
            break;
          case 10006:
            errorMsj = actionStrings.error10006;
            break;
          case 10007:
            errorMsj = actionStrings.error10007;
            break;
          case 10011:
            errorMsj = actionStrings.error10011;
            break;
          default:
            errorMsj = actionStrings.errorDefault;
            break;
        }
        dispatch(setErrorCredentials(errorMsj));
      }
    })
    .catch(error => {
      dispatch(setErrorCredentials(actionStrings.errorConnection));
    });
  };
};

export const setCurrentSystem = (system) => {
  return {
    type: types.SET_CURRENT_SYSTEM,
    payload: system,
  }
}