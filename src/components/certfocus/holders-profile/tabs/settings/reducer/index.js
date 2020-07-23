import * as types from '../actions/types';

const INITIAL_STATE = {
  fetchingSettings: false,
  errorSendSettings: '',
  errorSettings: '',
};

export default (state = INITIAL_STATE, action) => {
  switch(action.type) {
    case types.SET_HOLDER_SEND_SETTINGS_ERROR:
      return { ...state, errorSendSettings: action.payload, fetchingSettings: false };

    case types.SET_FETCHING_HOLDER_SETTINGS:
      return { ...state, fetchingSettings: action.payload, errorSendSettings: '', errorSettings: '' };

    case types.SET_HOLDER_SETTINGS_ERROR:
      return { ...state, fetchingSettings: false, errorSettings: action.payload };
    default:
      return state;
  }
};
