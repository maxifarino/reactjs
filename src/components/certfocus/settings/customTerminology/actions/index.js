import Api from '../../../../../lib/api';
import * as types from './types';

export const setFetchingCustomTerminology = (fetching) => {
  return {
    type: types.SET_FETCHING_CUSTOM_TERMINOLOGY_SETTINGS,
    payload: fetching
  };
};

export const setCustomTerminologyError = (error) => {
  return {
    type: types.SET_CUSTOM_TERMINOLOGY_SETTINGS_ERROR,
    payload: error
  };
};

export const setCustomTerminologyList = (list) => {
  return {
    type: types.SET_CUSTOM_TERMINOLOGY_SETTINGS_LIST,
    payload: list
  };
};

export const setTotalAmountOfCustomTerminology = (total) => {
  return {
    type: types.SET_TOTAL_AMOUNT_OF_CUSTOM_TERMINOLOGY_SETTINGS,
    payload: total
  };
};

export const addCustomTerminologyError = (error) => {
  return {
    type: types.SET_CUSTOM_TERMINOLOGY_SETTINGS_ADD_ERROR,
    payload: error
  };
};

export const addCustomTerminologySuccess = () => {
  return {
    type: types.SET_CUSTOM_TERMINOLOGY_SETTINGS_ADD_SUCCESS,
  };
};

export const addCustomTerminologyFetching = () => {
  return {
    type: types.SET_CUSTOM_TERMINOLOGY_SETTINGS_ADD_FETCHING,
  };
};


export const setShowModal = (status) => {
  return {
    type: types.SET_CUSTOM_TERMINOLOGY_SETTINGS_SHOW_MODAL,
    payload: status
  };
};

export const fetchCustomTerminology = (queryParams) => {
  return (dispatch, getState) => {
    const { login, localization } = getState();
    let {
      error10005,
      error10006,
      error10007,
      error10011,
      error10019,
      errorDefault,
      errorConnection,
    } = localization.strings.hcProfile.projects.actions; //TODO: ADD LOCALIZATION
    const token = login.authToken;
    let urlParameters = '';

    dispatch(setFetchingCustomTerminology(true));
    dispatch(setTotalAmountOfCustomTerminology(0));

    const { customTerminologyPerPage } = getState().customTerminologySettings;

    if (queryParams) {
      if (!queryParams.pageNumber) {
        queryParams.pageNumber = 1;
      }
      queryParams.pageSize = customTerminologyPerPage;
    } else {
      queryParams = {
        pageNumber: 1,
        pageSize: customTerminologyPerPage
      };
    }

    let urlQuery = 'cf/customTerms';

    urlParameters = `?${Object.keys(queryParams).map(i => `${i}=${queryParams[i]}`).join('&')}`;

    return Api.get(`${urlQuery}${urlParameters}`, token)
      .then(response => {
        const { success, data, totalCount } = response.data;        
        let errorMsg = '';
        if (success) {
          dispatch(setTotalAmountOfCustomTerminology(totalCount ? totalCount : 0));
          dispatch(setCustomTerminologyList(data ? data : []));
        } else {
          switch (data.errorCode) {
            case 10005:
              errorMsg = error10005;
              break;
            case 10006:
              errorMsg = error10006;
              break;
            case 10007:
              errorMsg = error10007;
              break;
            case 10011:
              errorMsg = error10011;
              break;
            case 10019:
              errorMsg = error10019;
              break;
            default:
              errorMsg = errorDefault;
              break;
          }
          dispatch(setCustomTerminologyError(errorMsg));
          dispatch(setTotalAmountOfCustomTerminology(0));
        }
      })
      .catch(() => {
        dispatch(setCustomTerminologyError(errorConnection));
      });
  };
};

export const sendCustomTerminology = (input, closeModal) => {
  return (dispatch, getState) => {
    const { login: { authToken }, localization } = getState();

    const {
      errorDefault,
      errorConnection,
    } = localization.strings.certFocusProjects.errors;

    dispatch(addCustomTerminologyFetching());

    let apiMethod;
    
    if (input.customTermId) {
      apiMethod = 'put';
    } else {
      apiMethod = 'post';
    }

    return Api[apiMethod](`cf/customTerms`, input, authToken)
      .then(response => {
        const { success } = response.data;

        if (success) {
          dispatch(addCustomTerminologySuccess());
          closeModal(true);
        } else {
          dispatch(addCustomTerminologyError(errorDefault));
        }
      })
      .catch(() => {
        dispatch(addCustomTerminologyError(errorConnection));
      });
  };
};

export const deleteCustomTerminology = (input, callback) => {
  return (dispatch, getState) => {
    const { login: { authToken }, localization } = getState();

    const {
      errorDefault,
      errorConnection,
    } = localization.strings.certFocusProjects.errors;

    dispatch(addCustomTerminologyFetching());
    
    return Api.delete(`cf/customTerms`, input, authToken)
      .then(response => {
        const { success } = response.data;

        if (success) {
          dispatch(addCustomTerminologySuccess());
          callback(true);
        } else {
          dispatch(addCustomTerminologyError(errorDefault));
          callback(false);
        }
      })
      .catch(() => {
        dispatch(addCustomTerminologyError(errorConnection));
        callback(false);
      });
  };
};
