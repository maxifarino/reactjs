import * as types from '../actions/types';

const INITIAL_STATE = {
  error: '',
  infoForm: null,
};

export default (state = INITIAL_STATE, action) => {
  switch(action.type) {
    case types.SET_PORTAL_ERROR:
      return { ...state, error: action.payload };
    case types.SET_PORTAL_INFO_FORM:
      return { ...state, infoForm: action.payload };
    default:
      return state;
  }
};
