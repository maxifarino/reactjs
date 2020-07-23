import * as types from '../actions/types';

export default function projectsReducer(state = {
    error: '',
    list: [],
    contracts: [],
    totalAmountOfProjects: 0,
    totalAmountOfContracts: 0,
    projectsPerPage: 10,
    fetchingProjects: true,
    fetchingContracts: false,
    projectStatusOptions: [],
    showModal: false,
    addProjectData: {},
}, action) {
  switch(action.type) {
    case types.SET_PROJECTS_ERROR:
      return Object.assign({}, state, {
        error: action.error
      });
    case types.SET_PROJECTS_LIST:
      return Object.assign({}, state, {
        list: action.projects
      });
    case types.SET_TOTAL_AMOUNT_OF_PROJECTS:
      return Object.assign({}, state, {
        totalAmountOfProjects: action.total
      });
    case types.SET_FETCHING_PROJECTS:
      return Object.assign({}, state, {
        fetchingProjects: action.fetchingProjects
      });
    case types.SET_CONTRACTS_ERROR:
      return Object.assign({}, state, {
        error: action.error
      });
    case types.SET_CONTRACTS_LIST:
      return Object.assign({}, state, {
        contracts: action.contracts
      });
    case types.SET_TOTAL_AMOUNT_OF_CONTRACTS:
      return Object.assign({}, state, {
        totalAmountOfProjects: action.total
      });
    case types.SET_FETCHING_CONTRACTS:
      return Object.assign({}, state, {
        fetchingContracts: action.isFetching
      });
    case types.SET_SHOW_MODAL:
      return Object.assign({}, state, {
        showModal: action.showModal
      });
    case types.SET_PROJECT_STATUS:
      return Object.assign({}, state, {
        projectStatusOptions: action.data
      });
    case types.SET_ADD_PROJECT_DATA:
      return Object.assign({}, state, {
        addProjectData: Object.assign({}, state.addProjectData, action.data)
      });
    default:
      return state;
  }
}
