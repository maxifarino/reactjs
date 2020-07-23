import Api from '../../../../../lib/api';
import * as types from './types';

export const setFetchingDocumentQueueDefinitions = (fetching) => {
  return {
    type: types.SET_FETCHING_DOCUMENT_QUEUE_DEFINITIONS,
    payload: fetching
  };
};

export const setDocumentQueueDefinitionsError = (error) => {
  return {
    type: types.SET_DOCUMENT_QUEUE_DEFINITIONS_ERROR,
    payload: error
  };
};

export const setDocumentQueueDefinitionsList = (list) => {
  return {
    type: types.SET_DOCUMENT_QUEUE_DEFINITIONS_LIST,
    payload: list
  };
};

export const setTotalAmountOfDocumentQueueDefinitions = (total) => {
  return {
    type: types.SET_TOTAL_AMOUNT_OF_DOCUMENT_QUEUE_DEFINITIONS,
    payload: total
  };
};

export const addDocumentQueueDefinitionsError = (error) => {
  return {
    type: types.SET_DOCUMENT_QUEUE_DEFINITIONS_ADD_ERROR,
    payload: error
  };
};

export const addDocumentQueueDefinitionsSuccess = () => {
  return {
    type: types.SET_DOCUMENT_QUEUE_DEFINITIONS_ADD_SUCCESS,
  };
};

export const addDocumentQueueDefinitionsFetching = () => {
  return {
    type: types.SET_DOCUMENT_QUEUE_DEFINITIONS_ADD_FETCHING,
  };
};

export const setShowModal = (status) => {
  return {
    type: types.SET_DOCUMENT_QUEUE_DEFINITIONS_SHOW_MODAL,
    payload: status
  };
};

export const fetchDocumentQueueDefinitions = (queryParams) => {
  return (dispatch, getState) => {
    const { login, localization } = getState();
    const { documentQueueDefinitionsPerPage } = getState().documentQueueDefinitions;
    const {
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

    dispatch(setFetchingDocumentQueueDefinitions(true));
    dispatch(setTotalAmountOfDocumentQueueDefinitions(0));

    if (queryParams) {
      if (!queryParams.withoutPag) {
        if (!queryParams.pageNumber) {
          queryParams.pageNumber = 1;
        }
        queryParams.pageSize = documentQueueDefinitionsPerPage;
      }
    } else {
      queryParams = {
        pageNumber: 1,
        pageSize: documentQueueDefinitionsPerPage
      };
    }

    let urlQuery = 'cf/documentQueueDefinitions';

    urlParameters = `?${Object.keys(queryParams).map(i => `${i}=${queryParams[i]}`).join('&')}`;

    return Api.get(`${urlQuery}${urlParameters}`, token)
      .then(response => {
        const { success, data, totalCount } = response.data;

        let errorMsg = '';
        if (success) {
          dispatch(setTotalAmountOfDocumentQueueDefinitions(totalCount ? totalCount : 0));
          dispatch(setDocumentQueueDefinitionsList(data ? data : []));
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
          dispatch(setDocumentQueueDefinitionsError(errorMsg));
          dispatch(setTotalAmountOfDocumentQueueDefinitions(0));
        }
      })
      .catch(() => {
        dispatch(setDocumentQueueDefinitionsError(errorConnection));
      });
  };
};

export const postDocumentQueueDefinitions = (input, closeModal) => {
  return (dispatch, getState) => {
    const { login: { authToken }, localization } = getState();
    const {
      errorDefault,
      errorConnection,
    } = localization.strings.certFocusProjects.errors;

    dispatch(addDocumentQueueDefinitionsFetching());

    let apiMethod;

    if (input.queueId) {
      apiMethod = 'put';
    } else {
      apiMethod = 'post';
    }

    return Api[apiMethod](`cf/documentQueueDefinitions`, input, authToken)
      .then(response => {
        const { success } = response.data;

        if (success) {
          dispatch(addDocumentQueueDefinitionsSuccess());
          closeModal(true);
        } else {
          dispatch(addDocumentQueueDefinitionsError(errorDefault));
        }
      })
      .catch(() => {
        dispatch(addDocumentQueueDefinitionsError(errorConnection));
      });
  };
};

/* DocumentQueueUsers */
export const setDocumentQueueUsersListError = (error) => {
  return {
    type: types.SET_DOCUMENT_QUEUE_USERS_LIST_ERROR,
    payload: error
  };
};
export const setDocumentQueueUsersList = (list, totalAmount) => {
  return {
    type: types.SET_DOCUMENT_QUEUE_USERS_LIST,
    payload: {
      list,
      totalAmount
    }
  };
};
export const setFetchingDocumentQueueUsers = () => {
  return {
    type: types.SET_FETCHING_DOCUMENT_QUEUE_USERS
  };
};
export const setShowDocumentQueueUsersModal = (show) => {
  return {
    type: types.SET_SHOW_DOCUMENT_QUEUE_USERS_MODAL,
    payload: show
  }
}
export const setShowAddDocumentQueueUsersModal = (show) => {
  return {
    type: types.SET_SHOW_ADD_DOCUMENT_QUEUE_USERS_MODAL,
    payload: show
  }
}

// FETCH
export const fetchDocumentQueueUsers = (queryParams) => {
  return (dispatch, getState) => {
    const { login, localization, documentQueueDefinitions } = getState();
    const { errorDefault, errorConnection } = localization.strings.projectInsureds.errors;
    const { authToken } = login;
    const { documentQueueUsersPerPage } = documentQueueDefinitions;
    
    dispatch(setFetchingDocumentQueueUsers());

    if (queryParams) {
      if (!queryParams.pageNumber) {
        queryParams.pageNumber = 1;
      }
      queryParams.pageSize = documentQueueUsersPerPage;
    } else {
      queryParams = {
        pageNumber: 1,
        pageSize: documentQueueUsersPerPage
      };
    }
    const urlParameters = `?${Object.keys(queryParams).map(i => `${i}=${queryParams[i]}`).join('&')}`;
    const urlQuery = `cf/documentQueueDefinitions/users`;
       
    return Api.get(`${urlQuery}${urlParameters}`, authToken)
      .then(response => {     
        const { success, data, totalCount } = response.data;
        if (success) {
          dispatch(setDocumentQueueUsersList(data || [], totalCount || 0));
        }
        else {
          dispatch(setDocumentQueueUsersListError(errorDefault));
        }
      })
      .catch(error => {
        dispatch(setDocumentQueueUsersListError(errorConnection));
      });
  };
};

export const postDocumentQueueUser = (payload, callback) => {
  return (dispatch, getState) => {
    const { login } = getState();
    const token = login.authToken;

    return Api.post(`cf/documentQueueDefinitions/users`, payload, token)
      .then(response => {
        const { success } = response.data;
        callback(success);
      })
      .catch(() => {
        callback(null);
      });
  };
}

export const deleteDocumentQueueUser = (input, callback) => {
  return (dispatch, getState) => {
    const { login: { authToken } } = getState();
    return Api.delete(`cf/documentQueueDefinitions/users`, input, authToken)
      .then(response => {
        const { success } = response.data;
        if (success) {
          callback(true);
        } else {
          callback(false);
        }
      })
      .catch(() => {
        callback(false);
      });
  };
};

export const fetchAvailableUsersByRole = (queryParams, callback) => {
  return (dispatch, getState) => {
    const { login: { authToken } } = getState();

    const urlParameters = `?${Object.keys(queryParams).map(i => `${i}=${queryParams[i]}`).join('&')}`;
    const urlQuery = `cf/documentQueueDefinitions/availableUsersPerRole`;
           
    return Api.get(`${urlQuery}${urlParameters}`, authToken)
      .then(response => {
        const { success, data } = response.data;
        return (success) 
          ? callback(data)
          : callback();
      })
      .catch(() => {
        return callback();
      });
    };
};