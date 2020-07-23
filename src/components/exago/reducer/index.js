import * as types from '../actions/types';

export default function registerReducer(state = {
    loading: false,
    apiKey: '',
    sessionId: '',
    userId: '',
    error: null,
    isFetchingHiringclients: false
  }, action) {
  switch(action.type) {

    case types.SET_EXAGO_LOADING:
      return Object.assign(state, {
        loading: action.loading
      });

    case types.SET_EXAGO_SESSION:
      return Object.assign(state, {
        apiKey: action.apiKey,
        sessionId: action.sessionId
      });

    case types.SET_EXAGO_ERROR:
      return Object.assign(state, {
        error: action.error
      });
    
    case types.SET_FETCHING_HIRINGCLIENTS:
      return Object.assign(state, {
        isFetchingHiringclients: action.isFetchingHiringclients
      });

    default:
      return state;
  }

}