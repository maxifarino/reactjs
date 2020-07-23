import * as types from '../actions/types';

const INITIAL_STATE = {
  errorAgencies: '',
  list: [],
  totalAmountOfAgencies: 0,
  agenciesPerPage: 10,
  fetchingAgencies: false,
  showModal: false,
  agentsError: '',
  agentsList: [],
  totalAmountOfAgents: 0,
  agentsPerPage: 5,
  fetchingAgents: false,
  showAgentsModal: false,
  showAddAgentsModal: false,
};

export default (state = INITIAL_STATE, action) => {
  switch(action.type) {
    case types.SET_AGENCIES_LIST_ERROR:
      return { 
        ...state,
        errorAgencies: action.payload,
        fetchingAgencies: false
      };
    case types.SET_AGENCIES_LIST:      
      return { 
        ...state,
        list: action.payload.list,
        totalAmountOfAgencies: action.payload.totalAmount,
        fetchingAgencies: false
      };
    case types.SET_FETCHING_AGENCIES:
      return { 
        ...state,
        fetchingAgencies: true,
        totalAmountOfAgencies: 0,
        list: [],
        errorAgencies: ''
      };
    case types.SET_SHOW_AGENCIES_MODAL:
      return { 
        ...state, 
        showModal: action.payload 
      }

    case types.SET_AGENTS_LIST_ERROR:
      return { 
        ...state,
        agentsError: action.payload,
        fetchingAgents: false
      };
    case types.SET_AGENTS_LIST:      
      return { 
        ...state,
        agentsList: action.payload.list,
        totalAmountOfAgents: action.payload.totalAmount,
        fetchingAgents: false
      };
    case types.SET_FETCHING_AGENTS:
      return { 
        ...state,
        fetchingAgents: true,
        totalAmountOfAgents: 0,
        agentsList: [],
        agentsError: ''
      };
    case types.SET_SHOW_AGENTS_MODAL:
      return { 
        ...state, 
        showAgentsModal: action.payload 
      }
    case types.SET_SHOW_ADD_AGENTS_MODAL:
      return { 
        ...state, 
        showAddAgentsModal: action.payload 
      }

    default:
      return state;
  }
};
