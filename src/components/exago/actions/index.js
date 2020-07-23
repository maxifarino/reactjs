import * as types from './types';
import Api from '../../../lib/api';

export const setExagoLoading = (loading) => {
  return {
    type: types.SET_EXAGO_LOADING,
    loading
  };
};

export const setExagoError = (error) => {
  return {
    type: types.SET_EXAGO_ERROR,
    error
  };
};

export const setExagoSession = (apiKey, sessionId) => {
  return {
    type: types.SET_EXAGO_SESSION,
    apiKey,
    sessionId
  };
};

export const setFetchingHiringclients = (isFetchingHiringclients) => {
  return {
    type: types.SET_FETCHING_HIRINGCLIENTS,
    isFetchingHiringclients
  };
};

export const initSession = (callback) => {
  return (dispatch, getState) => {
    const
      { login } = getState(),
      token     = login.authToken

    dispatch(setExagoLoading(true));
    dispatch(setExagoError(null));
    return Api.post('get-exago-session', {}, token)
      .then(response => {
        const {success, data } = response.data;
        if (success && data) {
          dispatch(setExagoSession(data.ApiKey, data.Id));
          if (callback) {
            callback();
          }
        } else {
          dispatch(setExagoError("There was a problem starting the session, please try again."));
        }
        dispatch(setExagoLoading(false));
      })
      .catch(error => {
        console.log(error);
        dispatch(setExagoError("Connection error - Please, check your Internet service."));
        dispatch(setExagoLoading(false));
      });
  }
}

export const setParameter = (prefix, key, data, callback, RoleID) => {
  return (dispatch, getState) => {

    const
      { login } = getState(),
      token     = login.authToken,
      rolesNoF = new Set([1,2,5]),  // roles without folders
      payload   = {
        sessionId: getState().exago.sessionId,
        prefix,
        key,
        data
      }

    if (data && data.Value) {
      console.log('data.Value = ', data.Value)
    } else {
      console.log('data = ', data)
    }

    if (RoleID && rolesNoF.has(RoleID)) {
      console.log(`This RoleID doesn't get to see the folders. rolesNoF.has(RoleID) = `, rolesNoF.has(RoleID))
      callback()
      return
    } else if (data.Value === 'NA') {
      // console.log('callback called immediately')
      callback()
      return
    }
      // console.log('payload = ', payload)
    dispatch(setFetchingHiringclients(true));
    dispatch(setExagoError(null));
    // let url = key == 'params' ? 'set-exago-parameter2' : 'set-exago-parameter'
    let url = 'set-exago-parameter'
    return Api.post(url, payload, token)
      .then(response => {
        const {success } = response.data;
        console.log('setParameter response.data = ', response.data);
        if (success) {
          if (callback) {
            console.log('callback called in setParameter')
            callback();
          }
        } else {
          dispatch(setExagoError("There was an error please refresh the page and try again."));
        }
        dispatch(setFetchingHiringclients(false));
      })
      .catch(error => {
        console.log(error);
        dispatch(setExagoError("Connection error - Please, check your Internet service."));
        dispatch(setFetchingHiringclients(false));
      });
  }
}
