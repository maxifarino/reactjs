import * as types from '../actions/types';

const INITIAL_STATE = {
  error: '',
  list: [],
  totalAmountOfRecords: 0,
  recordsPerPage: 10,
  fetching: false,
};

export default (state = INITIAL_STATE, action) => {
  switch(action.type) {
    case types.SET_FETCHING_FINANCE:
      return { ...state, fetching: true, list: [], error: '' };
    case types.SET_FINANCE_ERROR:
      return { ...state, error: action.payload, fetching: false };
    case types.SET_FINANCE_LIST:
      return { ...state, list: action.payload, fetching: false };
    case types.SET_TOTAL_AMOUNT_OF_FINANCE:
      return { ...state, totalAmountOfRecords: action.payload };
    default:
      return state;
  }
};
