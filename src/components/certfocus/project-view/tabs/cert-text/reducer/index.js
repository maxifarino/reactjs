import * as types from '../actions/types';

const INITIAL_STATE = {
  fetching: false,
  editError: '',
  editFetching: false,
  error: '',
  data: {},
};

export default (state = INITIAL_STATE, action) => {
  switch(action.type) {
    case types.SET_FETCHING_PROJECT_CERTTEXT:
      return { ...state, fetching: true, data: {}, error: '', editError: '' };
    case types.SET_PROJECT_CERTTEXT:
      return { ...state, fetching: false, data: action.payload };
    case types.SET_PROJECT_CERTTEXT_ERROR:
      return { ...state, error: action.payload, fetching: false };

    case types.SET_EDIT_PROJECT_CERTTEXT:
      return { ...state, editError: '', editFetching: true };
    case types.SET_EDIT_PROJECT_CERTTEXT_ERROR:
      return { ...state, editError: action.payload, editFetching: false };
    case types.SET_EDIT_PROJECT_CERTTEXT_SUCCESS:
      return { ...state, editFetching: false };
    default:
      return state;
  }
};
