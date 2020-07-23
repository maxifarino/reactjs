import * as types from '../actions/types'; 

export default function forgotReducer(state = {
  user: '',
  errorUser: ''
  }, action) {
  switch(action.type) {
    case types.SET_USER:
      return Object.assign({}, state, {
        user: action.user
      });
    case types.SET_ERROR_FORGOT:
      return Object.assign({}, state, {
        errorUser: action.errorUser
      });
    default:
      return state;
  }
}