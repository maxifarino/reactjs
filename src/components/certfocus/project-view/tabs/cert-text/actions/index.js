import * as types from './types';
import Api from '../../../../../../lib/api';

export const setFetching = () => {
  return {
    type: types.SET_FETCHING_PROJECT_CERTTEXT,
  };
};
export const setError = (error) => {
  return {
    type: types.SET_PROJECT_CERTTEXT_ERROR,
    payload: error,
  };
};
export const setCertText = (data) => {
  return {
    type: types.SET_PROJECT_CERTTEXT,
    payload: data,
  };
};

export const setEditFetching = () => {
  return {
    type: types.SET_EDIT_PROJECT_CERTTEXT,
  };
};
export const setEditError = (error) => {
  return {
    type: types.SET_EDIT_PROJECT_CERTTEXT_ERROR,
    payload: error,
  };
};
export const setEditSuccess = (data) => {
  return {
    type: types.SET_EDIT_PROJECT_CERTTEXT_SUCCESS,
    payload: data,
  };
};

export const fetchCertText = (projectId) => {
  return (dispatch, getState) => {
    const { login: { authToken }, localization } = getState();
    const { errorDefault, errorConnection } = localization.strings.holderSettings.errors;

    dispatch(setFetching());

    return Api.get(`cf/projectCertTexts?projectId=${projectId}`, authToken)
    .then(response => {
      const { success, data } = response.data;
      if(success) {
        dispatch(setCertText((data && data.length > 0) ? data[0] : {}));
      } else {
        dispatch(setError(errorDefault));
      }
    })
    .catch(() => {
      dispatch(setError(errorConnection));
    });
  };
};

export const editCertText = (payload, callback) => {
  return (dispatch, getState) => {
    const { login: { authToken }, localization } = getState();

    const {
      errorDefault,
      errorConnection,
    } = localization.strings.certFocusProjects.errors;

    dispatch(setEditFetching());

    let apiMethod = 'post';
    if (payload.projectCertTextId) {
      apiMethod = 'put';
    }

    return Api[apiMethod]('cf/projectCertTexts', payload, authToken)
      .then(response => {
        const { success } = response.data;

        if (success) {
          dispatch(setEditSuccess());
          if (callback) callback(true);
        } else {
          dispatch(setEditError(errorDefault));
          if (callback) callback(false);
        }
      })
      .catch(() => {
        dispatch(setEditError(errorConnection));
        if (callback) callback(false);
      });
  };
};

