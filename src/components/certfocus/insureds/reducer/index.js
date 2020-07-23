import * as types from '../actions/types';

const INITIAL_STATE = {
  error: '',
  list: [],
  totalAmountOfInsureds: 0,
  insuredsPerPage: 10,
  fetchingInsureds: false,
  showModal: false,
  addInsuredError: '',
  addInsuredFetching: false,
  typeAheadResults: [],
  typeAheadError: '',
  typeAheadFetching: false,
};

export default (state = INITIAL_STATE, action) => {
  switch(action.type) {
    case types.SET_FETCHING_INSUREDS:
      return { ...state, fetchingInsureds: true, list: [], error: '' };
    case types.SET_INSUREDS_ERROR:
      return { ...state, error: action.payload, fetchingInsureds: false };
    case types.SET_INSUREDS_LIST:
      return { ...state, list: action.payload, fetchingInsureds: false };
    case types.SET_TOTAL_AMOUNT_OF_INSUREDS:
      return { ...state, totalAmountOfInsureds: action.payload };
    case types.SET_INSUREDS_SHOW_MODAL:
      return { ...state, showModal: action.payload };
    case types.SET_INSUREDS_ADD_FETCHING:
      return { ...state, addInsuredFetching: true, addInsuredError: '' };
    case types.SET_INSUREDS_ADD_SUCCESS:
      return { ...state, addInsuredFetching: false };
    case types.SET_INSUREDS_ADD_ERROR:
      return { ...state, addInsuredFetching: false, addInsuredError: action.payload };

    case types.SET_TYPE_AHEAD_INSURED_FETCHING:
      return { ...state, typeAheadFetching: true, typeAheadResults: [], typeAheadError: '' };
    case types.SET_TYPE_AHEAD_INSURED_ERROR:
      return { ...state, typeAheadFetching: false, typeAheadError: action.payload };
    case types.SET_TYPE_AHEAD_INSURED_SUCCESS:
      return { ...state, typeAheadFetching: false, typeAheadResults: action.payload };
    case types.RESET_TYPE_AHEAD_INSURED_RESULTS:
      return { ...state, typeAheadResults: [] };

    default:
      return state;
  }
}
