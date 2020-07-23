import * as types from './types';
import Api from '../../../../lib/api';
import Utils from '../../../../lib/utils';

// SETS
export const setDocumentsListError = (error) => {
  return {
    type: types.SET_DOCUMENTS_LIST_ERROR,
    payload: error
  };
};
export const setDocumentsList = (list, totalAmount) => {
  return {
    type: types.SET_DOCUMENTS_LIST,
    payload: {
      list,
      totalAmount
    }
  };
};
export const setFetchingDocuments = () => {
  return {
    type: types.SET_FETCHING_DOCUMENTS
  };
};
export const setShowModal = (show) => {
  return {
    type: types.SET_SHOW_DOCUMENTS_MODAL,
    payload: show
  }
}

// FETCH
export const fetchDocuments = (queryParams) => {
  return (dispatch, getState) => {
    const { login, localization, documents } = getState();
    const { errorDefault, errorConnection } = localization.strings.projectInsureds.errors;
    const { authToken } = login;
    const { documentsPerPage } = documents;

    dispatch(setFetchingDocuments());
    
    // documentsPage param to get the new document format data
    queryParams.documentsPage = true;    
    const urlParameters = Utils.getPaginatedUrlParameters(queryParams, documentsPerPage);
    const urlQuery = `cf/documents`;
       
    return Api.get(`${urlQuery}${urlParameters}`, authToken)
      .then(response => {     
        const { success, documents, totalCount } = response.data;
        if (success) {
          dispatch(setDocumentsList(documents || [], totalCount || 0));
        }
        else {
          dispatch(setDocumentsListError(errorDefault));
        }
      })
      .catch(error => {
        dispatch(setDocumentsListError(errorConnection));
      });
  };
};

export const postDocument = (document, callback) => {
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
    let apiMethod;

    if (document.documentId) {
      apiMethod = 'put';
    } else {
      apiMethod = 'post';
    }

    return Api[apiMethod](`cf/documents`, document, token)
      .then(response => {
        const { success, data } = response.data;
        if (success) {
          callback(false, data);
        } else {
          const errorMsg = errors[data.errorCode] || errorDefault;
          callback(true, errorMsg);
        }
      })
      .catch(() => {
        callback(true, errorConnection);
      });
  };
}

export const setFetchingDocumentStatus = () => {
  return {
    type: types.SET_FETCHING_DOCUMENT_STATUS
  };
};
export const setDocumentStatusError = (error) => {
  return {
    type: types.SET_DOCUMENT_STATUS_ERROR,
    payload: error
  };
};
export const setDocumentStatus = (list) => {
  return {
    type: types.SET_DOCUMENT_STATUS_LIST,
    payload: {
      list,
    }
  };
};

export const fetchDocumentStatus = (queryParams) => {
  return (dispatch, getState) => {
    const { login, localization } = getState();
    const { errorDefault, errorConnection } = localization.strings.projectInsureds.errors;
    const { authToken } = login;

    dispatch(setFetchingDocumentStatus());
    
    const urlQuery = `cf/documents/status`;       
    return Api.get(`${urlQuery}`, authToken)
      .then(response => {     
        const { success, documentStatus } = response.data;
        if (success) {
          dispatch(setDocumentStatus(documentStatus || []));
        }
        else {
          dispatch(setDocumentStatusError(errorDefault));
        }
      })
      .catch(error => {
        dispatch(setDocumentStatusError(errorConnection));
      });
  };
};

export const setFetchingDocumentTypes = () => {
  return {
    type: types.SET_FETCHING_DOCUMENT_TYPES
  };
};
export const setDocumentTypesError = (error) => {
  return {
    type: types.SET_DOCUMENT_TYPES_ERROR,
    payload: error
  };
};
export const setDocumentTypes = (list) => {
  return {
    type: types.SET_ALL_DOCUMENT_TYPES_LIST,
    payload: {
      list,
    }
  };
};

export const fetchDocumentTypes = (queryParams) => {
  return (dispatch, getState) => {
    const { login, localization } = getState();
    const { errorDefault, errorConnection } = localization.strings.projectInsureds.errors;
    const { authToken } = login;

    dispatch(setFetchingDocumentTypes());
    
    const urlQuery = `cf/documents/types`;       
    return Api.get(`${urlQuery}`, authToken)
      .then(response => {     
        const { success, documentTypes } = response.data;
        if (success) {
          dispatch(setDocumentTypes(documentTypes || []));
        }
        else {
          dispatch(setDocumentTypesError(errorDefault));
        }
      })
      .catch(error => {
        dispatch(setDocumentTypesError(errorConnection));
      });
  };
};

export const fetchDocumentData = (queryParams, callback) => {
  return (dispatch, getState) => {
    const { login, localization } = getState();
    const { errorDefault, errorConnection } = localization.strings.projectInsureds.errors;
    const { authToken } = login;

    // documentsPage param to get the new document format data
    queryParams.documentsPage = false;
    queryParams.getOne = true;
    const urlParameters = Utils.getPaginatedUrlParameters(queryParams);
    const urlQuery = `cf/documents`;
       
    return Api.get(`${urlQuery}${urlParameters}`, authToken)
      .then(response => {     
        const { success, documents } = response.data;
        if (success) {
          callback(false, documents[0] || {});
        }
        else {
          callback(true, errorDefault);
        }
      })
      .catch(error => {
        callback(true, errorConnection);
      });
  };
};