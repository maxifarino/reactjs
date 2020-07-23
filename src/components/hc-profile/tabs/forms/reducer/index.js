// import * as types from '../actions/types'; 

export default function templatesReducer(state = {
  error: ''
}, action) {
  switch(action.type) {
    // case types.SET_LOGIN_EXTRA_MSG:
    //   return Object.assign({}, state, {
    //     extraMessage: action.extraMessage
    //   });
    // case types.SET_CREDENTIALS:
    //   return Object.assign({}, state, action.credentials);
    // case types.SET_ERROR_CREDENTIALS:
    //   return Object.assign({}, state, {
    //     errorCredentials: action.msj
    //   });
    // case types.SET_ISLOGGEDIN:
    //   return Object.assign({}, state, {
    //     isLoggedIn: action.isLoggedIn
    //   });
    // case types.SET_AUTH_TOKEN:
    //   return Object.assign({}, state, {
    //     authToken: action.authToken
    //   });
    // case types.SET_USER_PROFILE: 
    //   return Object.assign({}, state, {
    //     profile: action.profile
    //   });
    default:
      return state;
  }
}