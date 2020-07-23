import * as types from '../actions/types';

const INITIAL_STATE = {
  errorPostProjectInsured: '',
  errorProjectInsureds: '',
  list: [],
  totalAmountOfProjectInsureds: 0,
  projectInsuredsPerPage: 10,
  fetchingProjectInsureds: false,
  showModal: false,
  favoriteFetching: null,
  totalProjectNonArchived: 0
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case types.SET_POST_PROJECT_INSURED_ERROR:
      return { ...state, errorPostProjectInsured: action.payload };
    case types.SET_PROJECT_INSUREDS_LIST_ERROR:
      return {
        ...state,
        errorProjectInsureds: action.payload,
        fetchingProjectInsureds: false
      };
    case types.SET_PROJECT_INSUREDS_LIST:
      return {
        ...state,
        list: action.payload.list,
        totalAmountOfProjectInsureds: action.payload.totalAmount,
        totalProjectNonArchived: action.payload.totalProjectNonArchived,
        fetchingProjectInsureds: false
      };
    case types.SET_FETCHING_PROJECT_INSUREDS:
      return {
        ...state,
        fetchingProjectInsureds: true,
        totalAmountOfProjectInsureds: 0,
        list: [],
        errorProjectInsureds: ''
      };
    case types.SET_SHOW_PROJECT_INSUREDS_MODAL:
      return { ...state, showModal: action.payload }
    case types.SET_PROJECT_INSUREDS_FAVORITE_FETCHING:
      return { ...state, favoriteFetching: action.payload };
    case types.SET_PROJECT_INSUREDS_FAVORITE:
      return {
        ...state, favoriteFetching: null,
        list: state.list.map((element) => {
          if (element.ProjectID === action.payload.id) {
            return {
              ...element,
              mylist: action.payload.condition ? "yes" : null,
            };
          }

          return element;
        })
      };
    default:
      return state;
  }
};
