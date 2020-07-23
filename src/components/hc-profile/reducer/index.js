import * as types from '../actions/types';

export default function HCProfileReducer(state = {
  errorHCProfile: '',
  profileData: {},
  searchText: '',
  languagesError: '',
  languagesList: [],
  fetchingLanguages: false,
  languageItems: 0,
  modifiedItems: [],
  scListForSelectComponent: [],
  message: {visible: false, type: '', text: ''}
}, action) {
  switch(action.type) {
    case types.SET_HC_PROFILE_ERROR:
      return Object.assign({}, state, {
        errorHCProfile: action.error
      });
    case types.SET_HC_PROFILE:
      return Object.assign({}, state, {
        profileData: action.hcprofile
      });
    case types.SET_SEARCH_TEXT:
      return Object.assign({}, state, {
        searchText: action.str
    });
    case types.SET_LANGUAGES_ERROR:
      return Object.assign({}, state, {
        languagesError: action.err
    });
    case types.SET_FETCHING_LANGUAGES:
      return Object.assign({}, state, {
        fetchingLanguages: action.isFetching
    });
    case types.SET_LANGUAGES_LIST:
      return Object.assign({}, state, {
        languagesList: action.dictionary,
        languageItems: action.totalCount
    });
    case types.EDIT_LANGUAGES:
      return Object.assign({}, state, {
        modifiedItems: action.modifiedItems
    });
    case types.SHOW_MESSAGE:
      return Object.assign({}, state, {
        message: action.message
      });
    case types.SET_SC_LIST_FOR_SELECT_COMPONENT:
      return Object.assign({}, state, {
        scListForSelectComponent: action.scList
      });
    default:
      return state;
  }
};