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
  attributesError: '',
  attributesList: [],
  totalAmountOfAttributes: 0,
  attributesPerPage: 10,
  fetchingAttributes: false,
  showAttributesModal: false,
  showAddAttributesModal: false,
};

export default (state = INITIAL_STATE, action) => {
  switch(action.type) {
    case types.SET_FETCHING_COVERAGE_SETTINGS_TYPES:
      return { ...state, fetching: true, list: [], error: '' };
    case types.SET_COVERAGE_SETTINGS_TYPES_ERROR:
      return { ...state, error: action.payload, fetching: false };
    case types.SET_COVERAGE_SETTINGS_TYPES_LIST:
      return { ...state, list: action.payload, fetching: false };
    case types.SET_TOTAL_AMOUNT_OF_COVERAGE_SETTINGS_TYPES:
      return { ...state, totalAmountOfCoverageTypes: action.payload };
    case types.SET_COVERAGE_SETTINGS_TYPES_SHOW_MODAL:
      return { ...state, showModal: action.payload };
    case types.SET_COVERAGE_SETTINGS_TYPES_ADD_FETCHING:
      return { ...state, addCoverageTypesFetching: true, addCoverageTypesError: '' };
    case types.SET_COVERAGE_SETTINGS_TYPES_ADD_SUCCESS:
      return { ...state, addCoverageTypesFetching: false };
    case types.SET_COVERAGE_SETTINGS_TYPES_ADD_ERROR:
      return { ...state, addCoverageTypesFetching: false, addCoverageTypesError: action.payload };

    case types.SET_ATTRIBUTES_LIST_ERROR:
      return { 
        ...state,
        attributesError: action.payload,
        fetchingAttributes: false
      };
    case types.SET_ATTRIBUTES_LIST:      
      return { 
        ...state,
        attributesList: action.payload.list,
        totalAmountOfAttributes: action.payload.totalAmount,
        fetchingAttributes: false
      };
    case types.SET_FETCHING_ATTRIBUTES:
      return { 
        ...state,
        fetchingAttributes: true,
        totalAmountOfAttributes: 0,
        attributesList: [],
        attributesError: ''
      };
    case types.SET_SHOW_ATTRIBUTES_MODAL:
      return { 
        ...state, 
        showAttributesModal: action.payload 
      }
    case types.SET_SHOW_ADD_ATTRIBUTES_MODAL:
      return { 
        ...state, 
        showAddAttributesModal: action.payload 
      }

    default:
      return state;
  }
};
