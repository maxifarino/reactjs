import * as types from '../actions/types';

const initialState = {
  showModal: false,
  fetching: {
    agencies: false,
    requirementSetDetail: false,
    dataEntry: false,
    deficiencies: false,
  },

  addDataEntryError: '',
  dataEntryInfo: {},
  agencies: [],
  requirementSetDetail: [],
  requirementSetDetailError: '',
  agenciesError: '',
  selectedAgency: '',
  selectedInsured: '',
  addInsurerError: '',
  insurersTypeAheadResults: [],
  insurersTypeAheadError: '',
  insurersTypeAheadFetching: false,
  
  dataEntryError: '',
  dataEntry: null,
  availableCoverages: [],
  availableEndorsements: [],

  agenciesTypeAheadResults: [],
  agenciesTypeAheadError: '',
  agenciesTypeAheadFetching: false,

  selectedEndorsements: [],
};

export default (state = initialState, action) => {
  switch (action.type) {

    case types.SET_ADD_DATA_ENTRY_SUCCESS:
      return {
        ...state,
        dataEntryInfo: action.payload.data
      };

    case types.SET_ADD_DATA_ENTRY_ERROR:
      return {
        ...state,
        addDataEntryError: action.payload.error
      };

    case types.SET_OTHER_COVERAGES_SHOW_MODAL:
      return {
        ...state,
        showModal: action.payload.status
      };

    // Agencies
    case types.SET_DATAENTRY_FETCHING_AGENCIES:
      return {
        ...state,
        fetching: {
          ...state.fetching,
          agencies: action.payload.isFetching
        }
      };
    case types.SET_DATAENTRY_AGENCIES_LIST:
      return {
        ...state,
        agencies: action.payload.list
      };
    case types.SET_DATAENTRY_AGENCIES_LIST_ERROR:
      return {
        ...state,
        agenciesError: action.payload.error
      };
    case types.SET_DATAENTRY_SELECTED_AGENCY:
      return {
        ...state,
        selectedAgency: action.payload.data
      };

    // Insured
    case types.SET_DATAENTRY_SELECTED_INSURED:
      return {
        ...state,
        selectedInsured: action.payload.data
      };

    // Insurers
    case types.SET_INSURERS_TYPEAHEAD_FETCHING:
      return {
        ...state,
        insurersTypeAheadFetching: true,
        insurersTypeAheadResults: [],
        insurersTypeAheadError: ''
      };
    case types.SET_INSURERS_TYPEAHEAD_RESULTS:
      return {
        ...state,
        insurersTypeAheadFetching: false,
        insurersTypeAheadResults: action.payload,
      };
    case types.SET_INSURERS_TYPEAHEAD_ERROR:
      return {
        ...state,
        insurersTypeAheadFetching: false,
        insurersTypeAheadError: action.payload
      };
    case types.SET_ADD_INSURER_ERROR:
      return {
        ...state,
        addInsurerError: action.payload.error
      };

    // REQUIREMENT SET DETAIL
    case types.SET_PROCESSING_REQUIREMENT_SET_DETAIL_FETCHING:
      return { 
        ...state, 
        requirementSetDetail: [],
        requirementSetDetailError: '', 
        fetching: { 
          ...state.fetching, 
          requirementSetDetail: true 
        } 
      };
    case types.SET_PROCESSING_REQUIREMENT_SET_DETAIL_ERROR:
      return { 
        ...state, 
        requirementSetDetailError: action.payload, 
        fetching: { 
          ...state.fetching, 
          requirementSetDetail: false 
        }
      };
    case types.SET_PROCESSING_REQUIREMENT_SET_DETAIL_SUCCESS:
      return { 
        ...state, 
        requirementSetDetail: action.payload.data,
        fetching: { 
          ...state.fetching, 
          requirementSetDetail: false 
        }
      };

    case types.SET_PROCESSING_AVAILABLE_COVERAGES_SUCCESS:  
      return { 
        ...state, 
        availableCoverages: action.payload.data 
      };
    
    case types.SET_PROCESSING_AVAILABLE_ENDORSEMENTS_SUCCESS:
      return { 
        ...state, 
        availableEndorsements: action.payload.data 
      };  

    // Agencies
    case types.SET_AGENCIES_TYPEAHEAD_FETCHING:
      return {
        ...state,
        agenciesTypeAheadFetching: true,
        agenciesTypeAheadResults: [],
        agenciesTypeAheadError: ''
      };
    case types.SET_AGENCIES_TYPEAHEAD_RESULTS:
      return {
        ...state,
        agenciesTypeAheadFetching: false,
        agenciesTypeAheadResults: action.payload,
      };
    case types.SET_AGENCIES_TYPEAHEAD_ERROR:
      return {
        ...state,
        agenciesTypeAheadFetching: false,
        agenciesTypeAheadError: action.payload
      };
      
    // Insureds
    case types.SET_INSUREDS_TYPEAHEAD_FETCHING:
      return {
        ...state,
        insuredsTypeAheadFetching: true,
        insuredsTypeAheadResults: [],
        insuredsTypeAheadError: ''
      };
    case types.SET_INSUREDS_TYPEAHEAD_RESULTS:
      return {
        ...state,
        insuredsTypeAheadFetching: false,
        insuredsTypeAheadResults: action.payload,
      };
    case types.SET_INSUREDS_TYPEAHEAD_ERROR:
      return {
        ...state,
        insuredsTypeAheadFetching: false,
        insuredsTypeAheadError: action.payload
      };
    case types.SET_DATAENTRY_SELECTED_ENDORSEMENTS:
      return {
        ...state,
        selectedEndorsements: action.payload.data
      };   

    default:
      return state;
  }
};