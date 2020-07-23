import axios from 'axios';

import * as types from './types';
import Api from '../../../../lib/api';
import Utils from '../../../../lib/utils';

export const setFetchingInsureds = (fetching) => {
  return {
    type: types.SET_FETCHING_INSUREDS,
    payload: fetching
  };
};

export const setInsuredsError = (error) => {
  return {
    type: types.SET_INSUREDS_ERROR,
    payload: error
  };
};

export const setInsuredsList = (list) => {
  return {
    type: types.SET_INSUREDS_LIST,
    payload: list
  };
};

export const setTotalAmountOfInsureds = (total) => {
  return {
    type: types.SET_TOTAL_AMOUNT_OF_INSUREDS,
    payload: total
  };
};

export const addInsuredsError = (error) => {
  return {
    type: types.SET_INSUREDS_ADD_ERROR,
    payload: error
  };
};

export const addInsuredsSuccess = () => {
  return {
    type: types.SET_INSUREDS_ADD_SUCCESS,
  };
};

export const addInsuredsFetching = () => {
  return {
    type: types.SET_INSUREDS_ADD_FETCHING,
  };
};


export const setShowModal = (status) => {
  return {
    type: types.SET_INSUREDS_SHOW_MODAL,
    payload: status
  };
};

export const fetchInsureds = (queryParams) => {
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

    dispatch(setFetchingInsureds(true));
    dispatch(setTotalAmountOfInsureds(0));

    const { insuredsPerPage } = getState().insureds;

    if (queryParams) {
      if (!queryParams.pageNumber) {
        queryParams.pageNumber = 1;
      }
      queryParams.pageSize = insuredsPerPage;
    } else {
      queryParams = {
        pageNumber: 1,
        pageSize: insuredsPerPage
      };
    }

    let urlQuery = 'cf/insureds';

    urlParameters = `?${Object.keys(queryParams).map(i => `${i}=${queryParams[i]}`).join('&')}`;

    return Api.get(`${urlQuery}${urlParameters}`, token)
      .then(response => {
        const { success, totalCount, data } = response.data;

        let errorMsg = '';
        if (success) {
          dispatch(setTotalAmountOfInsureds(totalCount ? totalCount : 0));
          dispatch(setInsuredsList(data ? data : []));
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
          dispatch(setInsuredsError(errorMsg));
          dispatch(setTotalAmountOfInsureds(0));
        }
      })
      .catch(() => {
        dispatch(setInsuredsError(errorConnection));
      });
  };
};

export const sendInsureds = (input, callback) => {
  return (dispatch, getState) => {
    const { login: { authToken }, localization } = getState();

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
    };

    dispatch(addInsuredsFetching());

    let apiMethod;

    if (input.insuredId) {
      apiMethod = 'put';
    } else {
      apiMethod = 'post';
    }

    return Api[apiMethod](`cf/insureds`, input, authToken)
      .then(response => {
        const { success, data } = response.data;

        if (success) {
          dispatch(addInsuredsSuccess());
          if (callback) callback(true);
        } else {
          const errorMsg = errors[data.errorCode] || errorDefault;
          dispatch(addInsuredsError(errorMsg));
          if (callback) callback(false);
        }
      })
      .catch(() => {
        dispatch(addInsuredsError(errorConnection));
        if (callback) callback(false);
      });
  };
};

// Type Ahead and search
export const setTypeAheadFetching = () => ({
  type: types.SET_TYPE_AHEAD_INSURED_FETCHING
});
export const setTypeAheadResults = result => ({
  type: types.SET_TYPE_AHEAD_INSURED_SUCCESS,
  payload: result
});
export const setTypeAheadError = error => ({
  type: types.SET_TYPE_AHEAD_INSURED_ERROR,
  payload: error
});
export const resetTypeAheadResults = () => {
  return {
    type: types.RESET_TYPE_AHEAD_INSURED_RESULTS
  }
};

const CancelToken = axios.CancelToken;
let source = null;

export const fetchTypeAhead = (keywords) => {
  return (dispatch, getState) => {
    const { login, localization } = getState();
    const {
      errorConnection,
    } = localization.strings.common.typeAheadErrors;
    const token = login.authToken;

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

    const queryParams = {
      insuredName: keywords,
      pageSize: 15, //limit results to 15
      pageNumber: 1,
      orderBy: 'insuredName',
    };
    const urlParameters = Utils.getUrlParameters(queryParams);
    const urlQuery ='cf/insureds';
    //get subcontractors
    Api.get(`${urlQuery}${urlParameters}`, token, source.token)
      .then(response => {
        const { success, data } = response.data;
        source = null;

        if (success) {
          if(data.length > 0){
            dispatch(setTypeAheadResults(data ? data : []));
          }else{
            dispatch(setTypeAheadError('No results found.'));
          }
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

export const fetchInsuredArchive = (insuredId, status, callback) => {
  return (dispatch, getState) => {
    const { authToken } = getState().login;
    Api.post(`cf/insureds/archive`, { insuredId, status }, authToken).then((response) => {      
      if (callback) callback(true);
    })
  }
}

export const fetchInsuredsByHolder = (queryParams) => {
  return (dispatch, getState) => {
    const { login, localization } = getState();
    const {
      errorConnection,
    } = localization.strings.common.typeAheadErrors;
    const token = login.authToken;

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

    let urlQuery = 'cf/insureds/holder';
    let urlParameters = `?${Object.keys(queryParams).map(i => `${i}=${queryParams[i]}`).join('&')}`;
    
    Api.get(`${urlQuery}${urlParameters}`, token, source.token)
      .then(response => {
        const { success, data } = response.data;
        source = null;
        if (success) {
          if(data.length > 0){
            dispatch(setTypeAheadResults(data ? data : []));
          }else{
            dispatch(setTypeAheadError('No results found.'));
          }
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