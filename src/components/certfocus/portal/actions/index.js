import Api from '../../../../lib/api';
import * as types from './types';

export const setPortalError = (error) => {
  return {
    type: types.SET_PORTAL_ERROR,
    payload: error,
  };
};

export const setPortalFormInfo = (data) => {
  return {
    type: types.SET_PORTAL_INFO_FORM,
    payload: data,
  };
};

export const sendPortalForm = (input, callback) => {
  return (dispatch, getState) => {
    const { localization } = getState();

    const {
      errorDefault,
      errorConnection,
    } = localization.strings.certFocusProjects.errors;

    return Api.post(`cf/portal`, input)
      .then(response => {
        const { success, data } = response.data;

        if (success) {
          callback(true);
          dispatch(setPortalFormInfo(data));
        } else {
          callback(true); // TODO: set to false
          dispatch(setPortalError(errorDefault));
        }
      })
      .catch(() => {
        callback(true); // TODO: set to false
        dispatch(setPortalError(errorConnection));
      });
  };
};

export const sendPortalPayment = (input, callback) => {
  return (dispatch, getState) => {
    const { localization } = getState();

    const {
      errorDefault,
      errorConnection,
    } = localization.strings.certFocusProjects.errors;

    return Api.post(`cf/portal/payment`, input)
      .then(response => {
        const { success } = response.data;

        if (success) {
          callback(true);
        } else {
          callback(true); // TODO: set to false
          dispatch(setPortalError(errorDefault));
        }
      })
      .catch(() => {
        callback(true); // TODO: set to false
        dispatch(setPortalError(errorConnection));
      });
  };
};
