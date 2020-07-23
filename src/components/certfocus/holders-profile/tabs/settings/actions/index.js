import * as types from './types';
import Api from '../../../../../../lib/api';

export const setFetchingSettings = (condition) => {
  return {
    type: types.SET_FETCHING_HOLDER_SETTINGS,
    payload: condition,
  };
};
export const setSettingsError = (error) => {
  return {
    type: types.SET_HOLDER_SETTINGS_ERROR,
    payload: error
  };
};
export const setSendSettingsError = (error) => {
  return {
    type: types.SET_HOLDER_SEND_SETTINGS_ERROR,
    payload: error
  };
};
export const fetchSettings = (holderId, callback) => {
  return (dispatch, getState) => {
    const { login: { authToken }, localization } = getState();
    const { errorDefault, errorConnection } = localization.strings.holderSettings.errors;

    dispatch(setFetchingSettings(true));

    return Api.get(`cf/holderSettings?holderId=${holderId}`, authToken)
    .then(response => {
      const { success, data } = response.data;
      if(success) {
        dispatch(setFetchingSettings(false));
        if (callback) callback((data && data.length > 0) ? data[0] : []);
      } else {
        dispatch(setSettingsError(errorDefault));
      }
    })
    .catch(() => {
      dispatch(setSettingsError(errorConnection));
    });
  };
};

export const sendSettings = (settings, callback) => {
  return (dispatch, getState) => {
    const { login: { authToken }, localization } = getState();
    const { errorDefault, errorConnection } = localization.strings.holderSettings.errors;

    dispatch(setFetchingSettings(true));

    return Api.put(`cf/holderSettings`, settings, authToken)
    .then(response => {
      const { success } = response.data;
      if(success) {
        dispatch(setFetchingSettings(false));
        if (callback) callback();
      } else {
        dispatch(setSendSettingsError(errorDefault));
      }
    })
    .catch(() => {
      dispatch(setSendSettingsError(errorConnection));
    });
  };
};
