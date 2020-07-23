import * as types from '../actions/types';
import * as projectTypes from '../../projects/actions/types';

const INITIAL_STATE = {
  errorProject: '',
  fetching: false,
  projectData: {},
  favoriteError: '',
  favoriteFetching: false
};

export default (state = INITIAL_STATE, action) => {
  switch(action.type) {
    case types.SET_PROJECT_DETAILS_ERROR:
      return { ...state, errorProject: action.payload, fetching: false };
    case types.SET_PROJECT_DETAILS_FETCHING:
      return { ...state, projectData: {}, fetching: true, errorProject: '' };
    case types.SET_PROJECT_DETAILS:
      return { ...state, projectData: action.payload, fetching: false };
    case projectTypes.SET_PROJECT_FAVORITE_FETCHING:
      return { ...state, favoriteFetching: true, favoriteError: '' };
    case projectTypes.SET_PROJECT_FAVORITE:
      return { ...state, favoriteFetching: false, projectData: { ...state.projectData, favorite: action.payload.condition ? 1 : 0 } };
    case projectTypes.SET_PROJECT_FAVORITE_ERROR:
      return { ...state, favoriteFetching: false, favoriteError: action.payload };
    default:
      return state;
  }
};