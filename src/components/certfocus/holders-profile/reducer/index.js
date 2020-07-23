import * as types from '../actions/types';

const INITIAL_STATE = {
  errorHolderProfile: '',
  fetching: false,
  profileData: {},
  searchText: '',
  languagesError: '',
  languagesList: [],
  fetchingLanguages: false,
  languageItems: 0,
  modifiedItems: [],
  scListForSelectComponent: [],
  message: { visible: false, type: '', text: '' },
  accountProjectsNonArchived: 0
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case types.SET_HOLDER_PROFILE_ERROR:
      return { ...state, errorHolderProfile: action.error, fetching: false };
    case types.SET_HOLDER_PROFILE_FETCHING:
      return { ...state, profileData: {}, fetching: true };
    case types.SET_HOLDER_PROFILE:
      return { ...state, profileData: action.hcprofile, fetching: false };
    case types.SET_SEARCH_TEXT:
      return { ...state, searchText: action.str };
    case types.SET_LANGUAGES_ERROR:
      return { ...state, languagesError: action.err };
    case types.SET_FETCHING_LANGUAGES:
      return { ...state, fetchingLanguages: action.isFetching };
    case types.SET_LANGUAGES_LIST:
      return { ...state, languagesList: action.dictionary, languageItems: action.totalCount };
    case types.EDIT_LANGUAGES:
      return { ...state, modifiedItems: action.modifiedItems };
    case types.SHOW_MESSAGE:
      return { ...state, message: action.message };
    case types.SET_SC_LIST_FOR_SELECT_COMPONENT:
      return { ...state, scListForSelectComponent: action.scList };
    case types.SET_ACCOUNT_PROJECT_NON_ARCHIVED:
      return { ...state, accountProjectsNonArchived: action.account };
    default:
      return state;
  }
};