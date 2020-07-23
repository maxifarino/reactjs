import * as types from '../actions/types';

const initialState = {
  error: '',
  states: [],
  statesError: '',
  coverageTypes: [],
  coverageTypesError: '',
  insureds: {
    list: [],
    total: 0
  },
  insuredsError: '',
  projects: {
    list: [],
    total: 0
  },  
  projectsError: '',
  holders: {
    list: [],
    total: 0
  },
  holdersError: '',
  contacts: {
    list: [],
    total: 0
  },
  contactsError: '',
  agencies: {
    list: [],
    total: 0
  },
  agenciesError: '',
  itemsPerPage: 10,
  fetching: {
    states: false,
    coverageTypes: false,
    insureds: false,
    projects: false,
    holders: false,
    contacts: false,
    agencies: false,
  }
};

export default (state = initialState, action) => {  
  switch (action.type) {
    
    case types.SET_FETCHING_STATES:
      return {
        ...state,
        fetching: {
          ...state.fetching,
          states: action.payload.isFetching
        }
      };
    case types.SET_STATES_LIST:
      return {
        ...state,
        states: {
          list: action.payload.list
        }
      };
    case types.SET_STATES_LIST_ERROR:
      return {
        ...state,
        statesError: action.payload.error
      };
    
    case types.SET_FETCHING_COVERAGE_TYPES:
      return {
        ...state,
        fetching: {
          ...state.fetching,
          coverageTypes: action.payload.isFetching
        }
      };
    case types.SET_COVERAGE_TYPES_LIST:
      return {
        ...state,
        coverageTypes: {
          list: action.payload.list
        }
      };
    case types.SET_COVERAGE_TYPES_LIST_ERROR:
      return {
        ...state,
        coverageTypesError: action.payload.error
      };  

    case types.SET_FETCHING_SEARCH_INSUREDS:
      return {
        ...state,
        fetching: {
          ...state.fetching,
          insureds: action.payload.isFetching
        } 
      };
    case types.SET_SEARCH_INSUREDS_LIST:
      return {
        ...state,
        insureds: {
          list: action.payload.list,
          total: action.payload.total,
        }  
      };
    case types.SET_SEARCH_INSUREDS_LIST_ERROR:
      return {
        ...state,
        insuredsError: action.payload.error
      };

    case types.SET_FETCHING_SEARCH_PROJECTS:
      return {
        ...state,
        fetching: {
          ...state.fetching,
          projects: action.payload.isFetching
        }
      };
    case types.SET_SEARCH_PROJECTS_LIST:
      return {
        ...state,
        projects: {
          list: action.payload.list,
          total: action.payload.total,
        }
      };
    case types.SET_SEARCH_PROJECTS_LIST_ERROR:
      return {
        ...state,
        projectsError: action.payload.error
      };

    case types.SET_FETCHING_SEARCH_HOLDERS:
      return {
        ...state,
        fetching: {
          ...state.fetching,
          holders: action.payload.isFetching
        }
      };
    case types.SET_SEARCH_HOLDERS_LIST:
      return {
        ...state,
        holders: {
          list: action.payload.list,
          total: action.payload.total,
        }
      };
    case types.SET_SEARCH_HOLDERS_LIST_ERROR:
      return {
        ...state,
        holdersError: action.payload.error
      };
      
    case types.SET_FETCHING_SEARCH_CONTACTS:
      return {
        ...state,
        fetching: {
          ...state.fetching,
          contacts: action.payload.isFetching
        }
      };
    case types.SET_SEARCH_CONTACTS_LIST:
      return {
        ...state,
        contacts: {
          list: action.payload.list,
          total: action.payload.total,
        }
      };
    case types.SET_SEARCH_CONTACTS_LIST_ERROR:
      return {
        ...state,
        contactsError: action.payload.error
      };
      
    case types.SET_FETCHING_SEARCH_AGENCIES:
      return {
        ...state,
        fetching: {
          ...state.fetching,
          agencies: action.payload.isFetching
        }
      };
    case types.SET_SEARCH_AGENCIES_LIST:
      return {
        ...state,
        agencies: {
          list: action.payload.list,
          total: action.payload.total,
        }
      };
    case types.SET_SEARCH_AGENCIES_LIST_ERROR:
      return {
        ...state,
        agenciesError: action.payload.error
      };  

    default:
      return state;
  }
};