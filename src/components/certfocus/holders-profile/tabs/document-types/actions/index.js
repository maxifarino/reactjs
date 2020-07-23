import * as types from './types';
import Api from '../../../../../../lib/api';

export const setFetchingDocumentTypes = (fetching) => {
  return {
    type: types.SET_FETCHING_DOCUMENT_TYPES,
    payload: fetching
  };
};

export const setDocumentTypesError = (error) => {
  return {
    type: types.SET_DOCUMENT_TYPES_ERROR,
    payload: error
  };
};

export const setDocumentTypesList = (list) => {
  return {
    type: types.SET_DOCUMENT_TYPES_LIST,
    payload: list
  };
};

export const setTotalAmountOfDocumentTypes = (total) => {
  return {
    type: types.SET_TOTAL_AMOUNT_OF_DOCUMENT_TYPES,
    payload: total
  };
};

export const addDocumentTypesError = (error) => {
  return {
    type: types.SET_DOCUMENT_TYPES_ADD_ERROR,
    payload: error
  };
};

export const addDocumentTypesSuccess = () => {
  return {
    type: types.SET_DOCUMENT_TYPES_ADD_SUCCESS,
  };
};

export const addDocumentTypesFetching = () => {
  return {
    type: types.SET_DOCUMENT_TYPES_ADD_FETCHING,
  };
};


export const setShowModal = (status) => {
  return {
    type: types.SET_DOCUMENT_TYPES_SHOW_MODAL,
    payload: status
  };
};

export const fetchDocumentTypes = (queryParams) => {
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
    } = localization.strings.hcProfile.projects.actions;
    const token = login.authToken;
    let urlParameters = '';

    dispatch(setFetchingDocumentTypes(true));
    dispatch(setTotalAmountOfDocumentTypes(0));

    const { documentsPerPage } = getState().documentTypes;

    if (queryParams) {
      if (!queryParams.pageNumber) {
        queryParams.pageNumber = 1;
      }
      queryParams.pageSize = documentsPerPage;
    } else {
      queryParams = {
        pageNumber: 1,
        pageSize: documentsPerPage
      };
    }

    let urlQuery = 'cf/doctypes';

    urlParameters = `?${Object.keys(queryParams).map(i => `${i}=${queryParams[i]}`).join('&')}`;

    return Api.get(`${urlQuery}${urlParameters}`, token)
      .then(response => {
        const { success, totalCount, data } = response.data;

        let errorMsg = '';
        if (success) {
          dispatch(setTotalAmountOfDocumentTypes(totalCount ? totalCount : 0));
          dispatch(setDocumentTypesList(data ? data : []));
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
          dispatch(setDocumentTypesError(errorMsg));
          dispatch(setDocumentTypesList([]));
          dispatch(setTotalAmountOfDocumentTypes(0));
        }
      })
      .catch(() => {
        dispatch(setDocumentTypesError(errorConnection));
        dispatch(setDocumentTypesList([]));
        dispatch(setTotalAmountOfDocumentTypes(0));
      });
  };
};

export const sendDocumentTypes = (input, closeModal) => {
  return (dispatch, getState) => {
    const { login, localization } = getState();

    const {
      error10000,
      error10001,
      error10003,
      error10005,
      error10006,
      error10007,
      error10025,
      errorDefault,
      errorConnection,
    } = localization.strings.certFocusProjects.errors;

    const errors = {
      10000: error10000,
      10001: error10001,
      10003: error10003,
      10005: error10005,
      10006: error10006,
      10007: error10007,
      100025: error10025,
    }
    const token = login.authToken;

    dispatch(addDocumentTypesFetching());

    let apiMethod;

    if (input.documentTypeId) {
      apiMethod = 'put';
    } else {
      apiMethod = 'post';
    }

    return Api[apiMethod](`cf/doctypes`, input, token)
      .then(response => {
        const { success, data } = response.data;

        if (success) {
          dispatch(addDocumentTypesSuccess());
          closeModal(true);
        } else {
          const errorMsg = errors[data.errorCode] || errorDefault;
          dispatch(addDocumentTypesError(errorMsg));
        }
      })
      .catch(() => {
        dispatch(addDocumentTypesError(errorConnection));
      });
  };
}
