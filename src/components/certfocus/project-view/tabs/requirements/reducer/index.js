import * as types from '../actions/types';

const INITIAL_STATE = {
  error: '',
  list: [],
  totalAmountOfRequirements: 0,
  requirementsPerPage: 10,
  fetching: false,
};

export default (state = INITIAL_STATE, action) => {
  switch(action.type) {
    case types.SET_FETCHING_PROJECT_REQUIREMENTS:
      return { ...state, fetching: true, list: [], error: '' };
    case types.SET_PROJECT_REQUIREMENTS_ERROR:
      return { ...state, error: action.payload, fetching: false };
    case types.SET_PROJECT_REQUIREMENTS_LIST:
      return { ...state, list: action.payload, fetching: false };
    case types.SET_TOTAL_AMOUNT_OF_PROJECT_REQUIREMENTS:
      return { ...state, totalAmountOfRequirements: action.payload };
    default:
      return state;
  }
};
