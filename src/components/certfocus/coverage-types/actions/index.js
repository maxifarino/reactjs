import axios from 'axios';
import Api from '../../../../lib/api';
import * as types from './types';

export const setFetchingCoverageTypes = (fetching) => {
  return {
    type: types.SET_FETCHING_COVERAGE_TYPES,
    payload: fetching
  };
};

export const setCoverageTypesError = (error) => {
  return {
    type: types.SET_COVERAGE_TYPES_ERROR,
    payload: error
  };
};

export const setCoverageTypesList = (list) => {
  return {
    type: types.SET_COVERAGE_TYPES_LIST,
    payload: list
  };
};

export const setTotalAmountOfCoverageTypes = (total) => {
  return {
    type: types.SET_TOTAL_AMOUNT_OF_COVERAGE_TYPES,
    payload: total
  };
};

export const addCoverageTypesError = (error) => {
  return {
    type: types.SET_COVERAGE_TYPES_ADD_ERROR,
    payload: error
  };
};

export const addCoverageTypesSuccess = () => {
  return {
    type: types.SET_COVERAGE_TYPES_ADD_SUCCESS,
  };
};

export const addCoverageTypesFetching = () => {
  return {
    type: types.SET_COVERAGE_TYPES_ADD_FETCHING,
  };
};


export const setShowModal = (status) => {
  return {
    type: types.SET_COVERAGE_TYPES_SHOW_MODAL,
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

    let urlQuery = 'cf/holderCoverageTypes';

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

export const sendCoverageTypesAndHolder = (input, closeModal) => {
  return (dispatch, getState) => {
    const { login: { authToken }, localization } = getState();

    const {
      errorDefault,
      errorConnection,
    } = localization.strings.certFocusProjects.errors;

    dispatch(addCoverageTypesFetching());

    return Api.post(`cf/holderCoverageTypes`, input, authToken)
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
    const { login: { authToken } } = getState();

    return Api.delete(`cf/holderCoverageTypes`, input, authToken)
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

export const toggleArchivedCoverageTypesAndHolder = (input, callback) => {
  return (dispatch, getState) => {
    const { login: { authToken } } = getState();

    return Api.put(`cf/holderCoverageTypes`, input, authToken)
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

// Type Ahead
export const setTypeAheadFetching = () => ({
  type: types.SET_TYPE_AHEAD_FETCHING_COVERAGE_TYPE,
});
export const setTypeAheadResults = result => ({
  type: types.SET_TYPE_AHEAD_SUCCESS_COVERAGE_TYPE,
  payload: result
});
export const setTypeAheadError = error => ({
  type: types.SET_TYPE_AHEAD_ERROR_COVERAGE_TYPE,
  payload: error
});
export const resetTypeAheadResults = () => {
  return {
    type: types.RESET_TYPE_AHEAD_RESULTS_COVERAGE_TYPE
  }
};

const CancelToken = axios.CancelToken;
let source = null;

export const fetchTypeAhead = (queryParams) => {
  return (dispatch, getState) => {
    const { login: { authToken }, localization } = getState();
    const {
      errorConnection,
    } = localization.strings.common.typeAheadErrors;

    dispatch(setTypeAheadFetching(true));

    // cancel current request if any
    if (source) {
      source.cancel("typeAheadCanceled");
      source = null;
    }
    // create new token
    if(!source){
      source = CancelToken.source();
    }

    const urlParameters = `?${Object.keys(queryParams).map(i => `${i}=${queryParams[i]}`).join('&')}`;

    // get user id
    Api.get(`cf/coverageTypes${urlParameters}`, authToken, source.token)
      .then(response => {
        const { success, data } = response.data;
        source = null;

        if (success) {
          dispatch(setTypeAheadResults(data ? data : []));
        } else {
          const errorMsg = getTypeAheadErrors(data.errorCode, localization);
          dispatch(setTypeAheadError(errorMsg));
        }
      })
      .catch((err) => {
        if(err.message !== 'typeAheadCanceled'){
          dispatch(setTypeAheadError(errorConnection));
        }
      });
  };
};

const getTypeAheadErrors = (errorCode, localization) => {
  let {
    error10005, error10006, error10007,
    error10011, error10019, errorDefault,
  } = localization.strings.common.typeAheadErrors;
  let errorMsg = '';

  switch(errorCode) {
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

  return errorMsg;
}

