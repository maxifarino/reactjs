import * as types from '../actions/types';

export default function tradeCategoriesReducer(state = {
    error: '',
    list: [],
    tradeCategoriesPerPage: 10,
    totalAmountOfTradeCategories: 0,
    fetchingTradeCategories: true,
  }, action) {
  switch(action.type) {
    case types.SET_TRADE_CATEGORIES_ERROR:
      return Object.assign({}, state, {
        error: action.error
      });
    case types.SET_TRADE_CATEGORIES_LIST:
      return Object.assign({}, state, {
        list: action.tradeCategories
      });
    case types.SET_TOTAL_AMOUNT_OF_TRADE_CATEGORIES:
      return Object.assign({}, state, {
        totalAmountOfTradeCategories: action.total
      });
    case types.SET_FETCHING_TRADE_CATEGORIES:
      return Object.assign({}, state, {
        fetchingTradeCategories: action.fetchingTradeCategories
      });
    default:
      return state;
  }
}
