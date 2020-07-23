import * as types from '../actions/types';

const INITIAL_STATE = {
  error: '',
  list: [],
  totalAmountOfProjects: 0,
  projectsPerPage: 10,
  fetchingProjects: true,
  projectStatusOptions: [],
  showModal: false,
  addProjectData: {},
  favoriteError: '',
  favoriteFetching: null,
  addProjectError: '',
  addProjectFetching: false,
  addProjectCustomFields: [],
  addProjectCustomFieldsFetching: false,
  addProjectCustomFieldsError: '',
  typeAheadResults: [],
  typeAheadFetching: false,
  typeAheadError: '',
  totalAmountProjectArchive: 0
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case types.SET_PROJECTS_ERROR:
      return { ...state, error: action.error };
    case types.SET_PROJECTS_LIST:
      return { ...state, list: action.projects };
    case types.SET_TOTAL_AMOUNT_OF_PROJECTS:
      return { ...state, totalAmountOfProjects: action.total };
    case types.SET_FETCHING_PROJECTS:
      return { ...state, fetchingProjects: action.fetchingProjects };
    case types.SET_CONTRACTS_ERROR:
      return { ...state, error: action.error };
    case types.SET_CONTRACTS_LIST:
      return { ...state, contracts: action.contracts };
    case types.SET_TOTAL_AMOUNT_OF_CONTRACTS:
      return { ...state, totalAmountOfProjects: action.total };
    case types.SET_FETCHING_CONTRACTS:
      return { ...state, fetchingContracts: action.isFetching };
    case types.SET_SHOW_MODAL:
      return { ...state, showModal: action.showModal };
    case types.SET_PROJECT_STATUS:
      return { ...state, projectStatusOptions: action.data };
    case types.SET_ADD_PROJECT_DATA:
      return { ...state, addProjectData: { ...state.addProjectData, ...action.data } };
    case types.SET_PROJECT_FAVORITE_FETCHING:
      return { ...state, favoriteFetching: action.payload, favoriteError: '' };
    case types.SET_PROJECT_FAVORITE:
      return {
        ...state, favoriteFetching: null,
        list: state.list.map((element) => {
          if (element.id === action.payload.id) {
            return {
              ...element,
              mylist: action.payload.condition ? "yes" : null
            };
          }

          return element;
        })
      };
    case types.SET_PROJECT_FAVORITE_ERROR:
      return { ...state, favoriteError: action.payload, favoriteFetching: null };
    case types.SET_PROJECT_ADD_FETCHING:
      return { ...state, addProjectFetching: true, addProjectError: '' };
    case types.SET_PROJECT_ADD_SUCCESS:
      return { ...state, addProjectFetching: false };
    case types.SET_PROJECT_ADD_ERROR:
      return { ...state, addProjectError: action.payload, addProjectFetching: false };
    case types.SET_HOLDER_CUSTOM_FIELDS_FETCHING:
      return { ...state, addProjectCustomFieldsFetching: true, addProjectCustomFieldsError: '', addProjectCustomFields: [] };
    case types.SET_HOLDER_CUSTOM_FIELDS_SUCCESS:
      return { ...state, addProjectCustomFieldsFetching: false, addProjectCustomFields: action.payload };
    case types.SET_HOLDER_CUSTOM_FIELDS_ERROR:
      return { ...state, addProjectCustomFieldsFetching: false, addProjectCustomFieldsError: action.payload };
    case types.SET_TYPE_AHEAD_FETCHING_PROJECTS:
      return { ...state, typeAheadFetching: true, typeAheadResults: [], typeAheadError: '' };
    case types.SET_TYPE_AHEAD_SUCCESS_PROJECTS:
      return { ...state, typeAheadFetching: false, typeAheadResults: action.payload };
    case types.SET_TYPE_AHEAD_ERROR_PROJECTS:
      return { ...state, typeAheadFetching: false, typeAheadError: action.payload };
    case types.RESET_TYPE_AHEAD_RESULTS_PROJECTS:
      return { ...state, typeAheadResults: [] };
    case types.SET_TOTAL_AMOUNT_PROJECT_ARCHIVE:
      console.log('SET_TOTAL_AMOUNT_PROJECT_ARCHIVE', action.total);
      return { ...state, totalAmountProjectArchive: action.total };
    default:
      return state;
  }
}
