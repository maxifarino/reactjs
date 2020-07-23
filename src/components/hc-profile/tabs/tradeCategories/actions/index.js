import * as types from './types';
import Api from '../../../../../lib/api';
import { showMessage } from '../../../actions'

export const setTradeCategoriesError = (error) => {
  return {
    type: types.SET_TRADE_CATEGORIES_ERROR,
    error
  };
};

export const setTradeCategoriesList = (tradeCategories) => {
  return {
    type: types.SET_TRADE_CATEGORIES_LIST,
    tradeCategories
  };
};

export const setTotalAmountOfTradeCategories = (total) => {
  return {
    type: types.SET_TOTAL_AMOUNT_OF_TRADE_CATEGORIES,
    total
  };
};

export const setFetchingTradeCategories = (fetchingTradeCategories) => {
  return {
    type: types.SET_FETCHING_TRADE_CATEGORIES,
    fetchingTradeCategories
  };
};

export const fetchTradeCategories = (queryParams) => {
  return (dispatch, getState) => {
    const {login, localization} = getState();
    let {
      error10005,
      error10006,
      error10007,
      error10011,
      error10019,
      errorDefault,
      errorConnection,
    } = localization.strings.hcProfile.tradeCategories.actions;
    const token = login.authToken;
    let urlParameters = '';

    dispatch(setFetchingTradeCategories(true));

    const { tradeCategoriesPerPage } = getState().tradeCategories;
    if (queryParams) {
      if (queryParams.withoutPag) {
        delete queryParams.pageNumber;
        delete queryParams.pageSize;
      }
      else {
        if (!queryParams.pageNumber) {
          queryParams.pageNumber = 1;
        }
        queryParams.pageSize = tradeCategoriesPerPage;
      }
    }
    else {
      queryParams = {
        pageNumber: 1,
        pageSize: tradeCategoriesPerPage
      };
    }

    const url = 'tradesbyhc';

    urlParameters = `?${Object.keys(queryParams).map(i => `${i}=${queryParams[i]}`).join('&')}`;

    return Api.get(`${url}${urlParameters}`, token)
      .then(response => {

        const {success, tradesList, totalCount, data} = response.data;
        let errorMsg = '';
        if (success) {
          dispatch(setTradeCategoriesList(tradesList));
          dispatch(setTotalAmountOfTradeCategories(totalCount));
        }
        else {
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
          dispatch(setTradeCategoriesError(errorMsg));
          dispatch(setTotalAmountOfTradeCategories(0));
          dispatch(setTradeCategoriesList([]));
        }
        dispatch(setFetchingTradeCategories(false));
      })
      .catch(error => {
        dispatch(setTradeCategoriesError(errorConnection));
      });
  };
};

export const saveTradeOrder = (payload, callback) => {
  return (dispatch, getState) => {
    const token = getState().login.authToken;
    dispatch(setFetchingTradeCategories(true));
    return Api.post('trades', payload, token)
      .then(response => {
        const { success } = response.data;
        if (success) {
          dispatch(showMessage('success', 'Save changes succesfully!'));

          if (callback) {
            callback();
          }
        }
        else {
          dispatch(showMessage('error', 'There was an error while trying to save the changes, please try again later'));
          dispatch(setFetchingTradeCategories(false));
        }
      })
      .catch(error => {
        dispatch(showMessage('error', 'Connection error - Please, check your Internet service.'));
        dispatch(setFetchingTradeCategories(false));
      });
  };
}
