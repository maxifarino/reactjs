import * as types from './types';
import Api from '../../../../lib/api';

export const setPasswords = (passwords) => {
  return {
    type: types.SET_PASSWORDS,
    passwords
  };
};

export const setErrorReset = (errorReset) => {
  return {
    type: types.SET_ERROR_RESET,
    errorReset
  };
};

export const sendResetData = (passwords, history) => {
  return (dispatch, getState) => {
    let resetStrings = getState().localization.strings.auth.forgot.actions;
    dispatch(setPasswords(passwords));
    const token = getState().login.authToken;
    return Api.post(
      `/users/change-password`,
      {
        oldPassword: passwords.oldPassword,
        newPassword: passwords.newPassword
      },
      token
    )
    .then(response => {
      let errorMsj = '';
      const {success, data } = response.data;
      if(success && data.passwordChanged) {
        dispatch({
          type: 'SET_ISLOGGEDIN',
          isLoggedIn: false
        });
        dispatch({
          type: 'SET_AUTH_TOKEN',
          authToken: ''
        });
        localStorage.removeItem('auth-token');
        sessionStorage.removeItem('auth-token');
        history.push('/login');
      }
      else {
        switch(data.errorCode) {
          case 10005:
            errorMsj = resetStrings.actions.error10005;
            break;
          case 10006:
            errorMsj = resetStrings.actions.error10006;
            break;
          case 10007:
            errorMsj = resetStrings.actions.error10007;
            break;
          case 10008:
            errorMsj = resetStrings.actions.error10008;
            break;
          case 10009:
            errorMsj = resetStrings.actions.error10009;
            break;
          case 10011:
            errorMsj = resetStrings.actions.error10011;
            break;
          case 10012:
            errorMsj = resetStrings.actions.error10012;
            break;
          default:
            errorMsj = resetStrings.actions.errorDefault;
        }
        dispatch(setErrorReset(errorMsj));
      }
    })
    .catch(error => {
      dispatch(setErrorReset(resetStrings.actions));
    });
  };
};
