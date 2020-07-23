import Api from '../../../../../lib/api';
import * as types from './types';

export const setFetchingCoverageTypes = (fetching) => {
  return {
    type: types.SET_FETCHING_COVERAGE_SETTINGS_TYPES,
    payload: fetching
  };
};

export const setCoverageTypesError = (error) => {
  return {
    type: types.SET_COVERAGE_SETTINGS_TYPES_ERROR,
    payload: error
  };
};

export const setCoverageTypesList = (list) => {
  return {
    type: types.SET_COVERAGE_SETTINGS_TYPES_LIST,
    payload: list
  };
};

export const setTotalAmountOfCoverageTypes = (total) => {
  return {
    type: types.SET_TOTAL_AMOUNT_OF_COVERAGE_SETTINGS_TYPES,
    payload: total
  };
};

export const addCoverageTypesError = (error) => {
  return {
    type: types.SET_COVERAGE_SETTINGS_TYPES_ADD_ERROR,
    payload: error
  };
};

export const addCoverageTypesSuccess = () => {
  return {
    type: types.SET_COVERAGE_SETTINGS_TYPES_ADD_SUCCESS,
  };
};

export const addCoverageTypesFetching = () => {
  return {
    type: types.SET_COVERAGE_SETTINGS_TYPES_ADD_FETCHING,
  };
};


export const setShowModal = (status) => {
  return {
    type: types.SET_COVERAGE_SETTINGS_TYPES_SHOW_MODAL,
    payload: status
  };
};

export const fetchCoverageTypes = (queryParams) => {
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

    dispatch(setFetchingCoverageTypes(true));
    dispatch(setTotalAmountOfCoverageTypes(0));

    const { coverageTypesPerPage } = getState().coverageTypes;

    if (queryParams) {
      if (!queryParams.pageNumber) {
        queryParams.pageNumber = 1;
      }
      queryParams.pageSize = coverageTypesPerPage;
    } else {
      queryParams = {
        pageNumber: 1,
        pageSize: coverageTypesPerPage
      };
    }

    let urlQuery = 'cf/coverageTypes';

    urlParameters = `?${Object.keys(queryParams).map(i => `${i}=${queryParams[i]}`).join('&')}`;

    return Api.get(`${urlQuery}${urlParameters}`, token)
      .then(response => {
        const { success, data, totalCount } = response.data;

        let errorMsg = '';
        if (success) {
          dispatch(setTotalAmountOfCoverageTypes(totalCount ? totalCount : 0));
          dispatch(setCoverageTypesList(data ? data : []));
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
          dispatch(setCoverageTypesError(errorMsg));
          dispatch(setTotalAmountOfCoverageTypes(0));
        }
      })
      .catch(() => {
        dispatch(setCoverageTypesError(errorConnection));
      });
  };
};

export const sendCoverageTypes = (input, closeModal) => {
  return (dispatch, getState) => {
    const { login: { authToken }, localization } = getState();

    const {
      errorDefault,
      errorConnection,
    } = localization.strings.certFocusProjects.errors;

    dispatch(addCoverageTypesFetching());

    let apiMethod;

    if (input.coverageTypeId) {
      apiMethod = 'put';
    } else {
      apiMethod = 'post';
    }

    return Api[apiMethod](`cf/coverageTypes`, input, authToken)
      .then(response => {
        const { success } = response.data;

        if (success) {
          dispatch(addCoverageTypesSuccess());
          closeModal(true);
        } else {
          dispatch(addCoverageTypesError(errorDefault));
        }
      })
      .catch(() => {
        dispatch(addCoverageTypesError(errorConnection));
      });
  };
};

export const sendCoverageTypesAndHolder = (input, closeModal) => {
  return (dispatch, getState) => {
    const { login: { authToken }, localization } = getState();

    const {
      errorDefault,
      errorConnection,
    } = localization.strings.certFocusProjects.errors;

    dispatch(addCoverageTypesFetching());

    return Api.post(`cf/coverageTypes`, input, authToken)
      .then(response => {
        const { success } = response.data;

        if (success) {
          dispatch(addCoverageTypesSuccess());
          closeModal(true);
        } else {
          dispatch(addCoverageTypesError(errorDefault));
        }
      })
      .catch(() => {
        dispatch(addCoverageTypesError(errorConnection));
      });
  };
};

export const deleteCoverageTypesAndHolder = (input, callback) => {
  return (dispatch, getState) => {
    const { login: { authToken }, localization } = getState();

    const {
      errorDefault,
      errorConnection,
    } = localization.strings.certFocusProjects.errors;

    dispatch(addCoverageTypesFetching());

    return Api.delete(`cf/coverageTypes`, input, authToken)
      .then(response => {
        const { success } = response.data;

        if (success) {
          dispatch(addCoverageTypesSuccess());
          callback(true);
        } else {
          dispatch(addCoverageTypesError(errorDefault));
          callback(false);
        }
      })
      .catch(() => {
        dispatch(addCoverageTypesError(errorConnection));
        callback(false);
      });
  };
};

/* Attributes */
export const setAttributesListError = (error) => {
  return {
    type: types.SET_ATTRIBUTES_LIST_ERROR,
    payload: error
  };
};
export const setAttributesList = (list, totalAmount) => {
  return {
    type: types.SET_ATTRIBUTES_LIST,
    payload: {
      list,
      totalAmount
    }
  };
};
export const setFetchingAttributes = () => {
  return {
    type: types.SET_FETCHING_ATTRIBUTES
  };
};
export const setShowAttributesModal = (show) => {
  return {
    type: types.SET_SHOW_ATTRIBUTES_MODAL,
    payload: show
  }
}
export const setShowAddAttributesModal = (show) => {
  return {
    type: types.SET_SHOW_ADD_ATTRIBUTES_MODAL,
    payload: show
  }
}

// FETCH
export const fetchAttributes = (queryParams) => {
  return (dispatch, getState) => {
    const { login, localization, coverageTypesSettings } = getState();
    const { errorDefault, errorConnection } = localization.strings.projectInsureds.errors;
    const { authToken } = login;
    const { attributesPerPage } = coverageTypesSettings;
    
    dispatch(setFetchingAttributes());

    if (queryParams) {
      if (!queryParams.pageNumber) {
        queryParams.pageNumber = 1;
      }
      queryParams.pageSize = attributesPerPage;
    } else {
      queryParams = {
        pageNumber: 1,
        pageSize: attributesPerPage
      };
    }
    const urlParameters = `?${Object.keys(queryParams).map(i => `${i}=${queryParams[i]}`).join('&')}`;
    const urlQuery = `cf/attributes`;
       
    return Api.get(`${urlQuery}${urlParameters}`, authToken)
      .then(response => {     
        const { success, attributes, totalCount } = response.data;
        if (success) {
          dispatch(setAttributesList(attributes || [], totalCount || 0));
        }
        else {
          dispatch(setAttributesListError(errorDefault));
        }
      })
      .catch(error => {
        dispatch(setAttributesListError(errorConnection));
      });
  };
};

export const postAttribute = (attribute, callback) => {
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

    if (attribute.attributeId) {
      apiMethod = 'put';
    } else {
      apiMethod = 'post';
    }

    return Api[apiMethod](`cf/attributes`, attribute, token)
      .then(response => {
        const { success, data } = response.data;        
        if (success) {
          callback(data);
        } else {
          const errorMsg = errors[data.errorCode] || errorDefault;
          callback(null);
        }
      })
      .catch(() => {
        callback(null);
      });
  };
}
