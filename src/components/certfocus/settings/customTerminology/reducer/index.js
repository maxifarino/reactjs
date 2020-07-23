import * as types from '../actions/types';

const INITIAL_STATE = {
  error: '',
  list: [],
  totalAmountOfCustomTerminology: 0,
  customTerminologyPerPage: 10,
  fetching: false,
  showModal: false,
  addCustomTerminologyError: '',
  addCustomTerminologyFetching: false,
  typeAheadResults: [],
  typeAheadError: '',
  typeAheadFetching: false,
};

export default (state = INITIAL_STATE, action) => {
  switch(action.type) {
    case types.SET_FETCHING_CUSTOM_TERMINOLOGY_SETTINGS:
      return { ...state, fetching: true, list: [], error: '' };
    case types.SET_CUSTOM_TERMINOLOGY_SETTINGS_ERROR:
      return { ...state, error: action.payload, fetching: false };
    case types.SET_CUSTOM_TERMINOLOGY_SETTINGS_LIST:
      return { ...state, list: action.payload, fetching: false };
    case types.SET_TOTAL_AMOUNT_OF_CUSTOM_TERMINOLOGY_SETTINGS:
      return { ...state, totalAmountOfCustomTerminology: action.payload };
    case types.SET_CUSTOM_TERMINOLOGY_SETTINGS_SHOW_MODAL:
      return { ...state, showModal: action.payload };
    case types.SET_CUSTOM_TERMINOLOGY_SETTINGS_ADD_FETCHING:
      return { ...state, addCustomTerminologyFetching: true, addCustomTerminologyError: '' };
    case types.SET_CUSTOM_TERMINOLOGY_SETTINGS_ADD_SUCCESS:
      return { ...state, addCustomTerminologyFetching: false };
    case types.SET_CUSTOM_TERMINOLOGY_SETTINGS_ADD_ERROR:
      return { ...state, addCustomTerminologyFetching: false, addCustomTerminologyError: action.payload };
    default:
      return state;
  }
};
