import * as types from '../actions/types';

const INITIAL_STATE = {
  error: '',
  list: [],
  totalAmountOfCoverages: 0,
  coveragesPerPage: 10,
  fetching: false,
  showModal: false,
  addError: '',
  agencyError: '',
  agencyFetching: '',
  agency: {},
  layersError: '',
  layersList: [],
  totalAmountOfCoveragesLayers: 0,
  fetchingLayers: false,
};

export default (state = INITIAL_STATE, action) => {
  switch(action.type) {
    case types.SET_FETCHING_COVERAGES:
      return { ...state, fetching: true, list: [], error: '' };
    case types.SET_COVERAGES_ERROR:
      return { ...state, error: action.payload, fetching: false };
    case types.SET_COVERAGES_LIST:
      return { ...state, list: action.payload, fetching: false };
    case types.SET_TOTAL_AMOUNT_OF_COVERAGES:
      return { ...state, totalAmountOfCoverages: action.payload };
    case types.SET_COVERAGES_SHOW_MODAL:
      return { ...state, showModal: action.payload };
    case types.SET_COVERAGES_ADD_ERROR:
      return { ...state, addError: action.payload };
    case types.SET_FETCHING_COVERAGES_AGENCY:
      return { ...state, agencyFetching: true, agencyError: '', agency: {} };
    case types.SET_COVERAGES_AGENCY:
      return { ...state, agencyFetching: false, agency: action.payload };
    case types.SET_COVERAGES_AGENCY_ERROR:
      return { ...state, agencyFetching: false, agencyError: action.payload };
    case types.SET_FETCHING_COVERAGES_LAYERS:
      return { ...state, fetchingLayers: true, layersList: [], layersError: '' };
    case types.SET_COVERAGES_ERROR_LAYERS:
      return { ...state, layersError: action.payload, fetchingLayers: false };
    case types.SET_COVERAGES_LIST_LAYERS:
      return { ...state, layersList: action.payload, fetchingLayers: false };
    case types.SET_TOTAL_AMOUNT_OF_COVERAGES_LAYERS:
      return { ...state, totalAmountOfCoveragesLayers: action.payload };
    default:
      return state;
  }
};
