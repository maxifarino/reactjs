import * as types from './types';
import Api from '../../../../lib/api';

export const setUser = (user) => {
  return {
    type: types.SET_USER,
    user
  };
};

export const setErrorForgot = (errorUser) => {
  return {
    type: types.SET_ERROR_FORGOT,
    errorUser
  };
};

export const sendUser = (user, history) => {
  return (dispatch, getState) => {
    let forgotStrings = getState().localization.strings.auth.forgot.actions;
    dispatch(setUser(user));
    return Api.post(
      `/users/reset-password`,
      {
        email: user
      }
    )
    .then(response => {
      let errorMsj = '';
      const {success, data } = response.data;
      if(success) {
        if(!data.emailSent) {
          errorMsj = forgotStrings.errorMsjBase;
        }
        if(!data.passwordChanged) {
          errorMsj = errorMsj + forgotStrings.errorMsjPassword;
        }
        errorMsj = errorMsj + forgotStrings.errorMsjPlease;
        if(data.emailSent && data.passwordChanged) {
          dispatch({
            type: 'SET_LOGIN_EXTRA_MSG',
            extraMessage: forgotStrings.loginExtraMessage
          });
          history.push('/login');
        }
        
      }
      else {
        switch(data.errorCode) {
          case 10003: 
            errorMsj = forgotStrings.error10003;
          break;
          case 10008:
            errorMsj = forgotStrings.error10008;
          break;
          case 10011: 
            errorMsj = forgotStrings.error10011;
          break;
          case 10013:
            errorMsj = forgotStrings.error10013;
          break;
          default:
            errorMsj = forgotStrings.errorDefault;
          break;
        }
        dispatch(setErrorForgot(errorMsj));
      }
    })
    .catch(error => {
      dispatch(setErrorForgot(forgotStrings.errorConnection));
    });
  };
};