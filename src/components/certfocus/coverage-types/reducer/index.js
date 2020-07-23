import * as types from '../actions/types';

const INITIAL_STATE = {
  error: '',
  list: [],
  totalAmountOfCoverageTypes: 0,
  coverageTypesPerPage: 10,
  fetching: false,
  showModal: false,
  addCoverageTypesError: '',
  addCoverageTypesFetching: false,
  typeAheadResults: [],
  typeAheadError: '',
  typeAheadFetching: false,
};

export default (state = INITIAL_STATE, action) => {
  switch(action.type) {
    case types.SET_FETCHING_COVERAGE_TYPES:
      return { ...state, fetching: true, list: [], error: '' };
    case types.SET_COVERAGE_TYPES_ERROR:
      return { ...state, error: action.payload, fetching: false };
    case types.SET_COVERAGE_TYPES_LIST:
      return { ...state, list: action.payload, fetching: false };
    case types.SET_TOTAL_AMOUNT_OF_COVERAGE_TYPES:
      return { ...state, totalAmountOfCoverageTypes: action.payload };
    case types.SET_COVERAGE_TYPES_SHOW_MODAL:
      return { ...state, showModal: action.payload };
    case types.SET_COVERAGE_TYPES_ADD_FETCHING:
      return { ...state, addCoverageTypesFetching: true, addCoverageTypesError: '' };
    case types.SET_COVERAGE_TYPES_ADD_SUCCESS:
      return { ...state, addCoverageTypesFetching: false };
    case types.SET_COVERAGE_TYPES_ADD_ERROR:
      return { ...state, addCoverageTypesFetching: false, addCoverageTypesError: action.payload };
    case types.SET_TYPE_AHEAD_FETCHING_COVERAGE_TYPE:
      return { ...state, typeAheadFetching: true, typeAheadResults: [], typeAheadError: '' };
    case types.SET_TYPE_AHEAD_SUCCESS_COVERAGE_TYPE:
      return { ...state, typeAheadFetching: false, typeAheadResults: action.payload };
    case types.SET_TYPE_AHEAD_ERROR_COVERAGE_TYPE:
      return { ...state, typeAheadFetching: false, typeAheadError: action.payload };
    case types.RESET_TYPE_AHEAD_RESULTS_COVERAGE_TYPE:
      return { ...state, typeAheadResults: [], typeAheadError: '' };
    default:
      return state;
  }
};
