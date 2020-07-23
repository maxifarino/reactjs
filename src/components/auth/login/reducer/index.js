import * as types from '../actions/types';

export default function loginReducer(state = {
  loginProcessing: false,
  username: '',
  password: '',
  remember: false,
  errorCredentials: '',
  isLoggedIn: localStorage.getItem('auth-token') || sessionStorage.getItem('auth-token') ? true : false,
  extraMessage: '',
  authToken: localStorage.getItem('auth-token') || sessionStorage.getItem('auth-token') || '',
  userId: localStorage.getItem('user-id'),
  profile: {},
  rolesAccessPermissions: [],
  currentSystem: localStorage.getItem('currentSystem') || ''

}, action) {
  switch (action.type) {
    case types.SET_LOGIN_PROCESSING:
      return Object.assign({}, state, {
        loginProcessing: action.processing
      });
    case types.SET_LOGIN_EXTRA_MSG:
      return Object.assign({}, state, {
        extraMessage: action.extraMessage
      });
    case types.SET_CREDENTIALS:
      return Object.assign({}, state, action.credentials);
    case types.SET_ERROR_CREDENTIALS:
      return Object.assign({}, state, {
        errorCredentials: action.msj
      });
    case types.SET_ISLOGGEDIN:
      return Object.assign({}, state, {
        isLoggedIn: action.isLoggedIn
      });
    case types.SET_AUTH_TOKEN:
      return Object.assign({}, state, {
        authToken: action.authToken
      });
    case types.SET_USER_PROFILE:
      return Object.assign({}, state, {
        profile: action.profile,
        userId: action.profile.Id,
        rolesAccessPermissions: action.profile.rolesAccessPermissions
      });    
    case types.SET_CURRENT_SYSTEM:
      return { ...state, currentSystem: action.payload}
    default:
      return state;
  }
}


