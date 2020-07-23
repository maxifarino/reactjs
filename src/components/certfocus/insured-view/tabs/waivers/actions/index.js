import Api from '../../../../../../lib/api';
import * as types from './types';

export const setFetching = (fetching) => {
  return {
    type: types.SET_FETCHING_WAIVERS,
    payload: fetching
  };
};

export const setError = (error) => {
  return {
    type: types.SET_WAIVERS_ERROR,
    payload: error
  };
};

export const setList = (list) => {
  return {
    type: types.SET_WAIVERS_LIST,
    payload: list
  };
};

export const setTotalAmount = (total) => {
  return {
    type: types.SET_TOTAL_AMOUNT_OF_WAIVERS,
    payload: total
  };
};

export const fetchWaivers = (queryParams) => {
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

    dispatch(setFetching(true));
    dispatch(setTotalAmount(0));

    const { recordsPerPage } = getState().finance;

    if (queryParams) {
      if (!queryParams.pageNumber) {
        queryParams.pageNumber = 1;
      }
      queryParams.pageSize = recordsPerPage;
    } else {
      queryParams = {
        pageNumber: 1,
        pageSize: recordsPerPage
      };
    }

    let urlQuery = 'cf/waiversDetail';

    urlParameters = `?${Object.keys(queryParams).map(i => `${i}=${queryParams[i]}`).join('&')}`;

    return Api.get(`${urlQuery}${urlParameters}`, token)
      .then(response => {
        const { success, data, totalCount } = response.data;
        let errorMsg = '';
        if (success) {
          dispatch(setTotalAmount(totalCount ? totalCount : 0));
          dispatch(setList(data ? data : []));
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
          dispatch(setError(errorMsg));
          dispatch(setTotalAmount(0));
        }
      })
      .catch(() => {
        dispatch(setError(errorConnection));
      });
  };
};

export const changeWaiverStatus = (payload, callback) => {
  return (dispatch, getState) => {
    const { login: { authToken } } = getState();    
    const urlQuery = `cf/waiverLineItems`;
    return Api.put(`${urlQuery}`, payload, authToken)
      .then(response => {
        const { success } = response.data;
        if (success) {
          callback(true)
        } else {
          callback(false)
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
}
