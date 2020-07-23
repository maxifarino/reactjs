import * as types from '../actions/types'; 

export default function resetReducer(state = {
  oldPassword: '',
  newPassword: '',
  errorReset: ''
  }, action) {
  switch(action.type) {
    case types.SET_PASSWORDS:
      const {oldPassword, newPassword} = action.passwords;
      return Object.assign({}, state, {
        oldPassword,
        newPassword
      });
    case types.SET_ERROR_RESET:
      return Object.assign({}, state, {
        errorReset: action.errorReset
      });
    default:
      return state;
  }
}