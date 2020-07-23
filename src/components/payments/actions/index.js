import * as types from './types';
import { setLastPayment } from '../../sc-profile/actions';
import Api from '../../../lib/api';

export const setLoadingBraintree = (loading) => {
  return {
    type: types.SET_PAYMENTS_LOADING_BRAINTREE,
    loading
  };
};
export const setBraintreeError = (error) => {
  return {
    type: types.SET_PAYMENTS_BRAINTREE_ERROR,
    error
  };
};
export const setBraintreeWarning = (warning) => {
  return {
    type: types.SET_PAYMENTS_BRAINTREE_WARNING,
    warning
  };
};
export const setBraintreeClientToken = (clientToken) => {
  return {
    type: types.SET_PAYMENTS_BRAINTREE_CLIENT_TOKEN,
    clientToken
  };
};
export const getBraintreeClientToken = (customerId) => {
  return (dispatch, getState) => {
    const token = getState().login.authToken;
    dispatch(setLoadingBraintree(true));
    dispatch(setBraintreeError(null));
    dispatch(setBraintreeClientToken(null));
    return Api.post(
      `braintree/get-client-token`,
      {customerId},
      token
    ).then(response => {
      //console.log(response.data);
      const { success, data } = response.data;
      if (success) {
        //console.log(data);
        dispatch(setBraintreeClientToken(data.clientToken));
      } else {
        dispatch(setBraintreeError("There was a problem starting the session, please try again."));
      }
      dispatch(setLoadingBraintree(false));
    })
    .catch(error => {
      console.log(error);
      dispatch(setBraintreeError("Connection error - Please, check your Internet service."));
      dispatch(setLoadingBraintree(false));
    });
  }
}

export const setRedirectHcId = (redirectHcId) => {
  return {
    type: types.SET_PAYMENTS_REDIRECT_HCID,
    redirectHcId
  };
}
export const sendNonceToBackend = (payment_method_nonce, history) => {
  let subcontractorId = ''
  let hiringClientId = ''
  return (dispatch, getState) => {
    const token = getState().login.authToken;
    const { hcId, redirectData } = getState().payments;
    const { profile } = getState().login;
    const { lastPayment } = getState().SCProfile;
    subcontractorId = profile.FirstSubcontractorId
    hiringClientId  = hcId 

    dispatch(setLoadingBraintree(true));
    dispatch(setBraintreeError(null));
    dispatch(setBraintreeWarning(null));
    return Api.post(
      `braintree/checkout`,
      {
        payment_method_nonce,
        hiringClientId,
        subcontractorId
      },
      token
    ).then(response => {
      const { success, data } = response.data;
      if (success && data.success) {
        /*console.log(data.transaction);
        console.log(data.transaction.creditCard);
        console.log(data.transaction.processorResponseText);
        console.log(data.transaction.status);*/
        let redirectUrl = `/subcontractors/${subcontractorId}`;
        // console.log('payments/actions subcontractorId = ', subcontractorId)
        // console.log('payments/actions hiringClientId = ', hiringClientId)
        // dispatch(
        //   setRedirectHcId({
        //     shouldResetHC: hiringClientId,
        //     url: redirectUrl
        //   })
        // )
        // let scId = ''
        // WHAT IS THE PURPOSE OF THIS CONDITIONAL?  WHO ELSE PAYS BESIDES SUBS?
        // if (profile.Role.IsSCRole) {
          // scId = profile.FirstSubcontractorId ? profile.FirstSubcontractorId : ''
          // redirectUrl = `/subcontractors/${scId}`;
        // }
     
        // console.log('> payments - redirectUrl = ', redirectUrl)
        dispatch(setRedirectHcId(hiringClientId));
        dispatch(setLastPayment({ ...lastPayment, done: true }));
        history.push(redirectUrl);
      } else {
        dispatch(setBraintreeWarning("There was a problem with the checkout, please try again."));
      }
      dispatch(setLoadingBraintree(false));
    })
    .catch(error => {
      console.log(error);
      dispatch(setBraintreeError("Connection error - Please, check your Internet service."));
      dispatch(setLoadingBraintree(false));
    });
  }
}

export const setFetchingHCInfo = (fetching) => {
  return {
    type: types.SET_PAYMENTS_FETCHING_HC,
    fetching
  };
};
export const setHCError = (error) => {
  return {
    type: types.SET_PAYMENTS_HC_ERROR,
    error
  };
};
export const setHCInfo = (info) => {
  return {
    type: types.SET_PAYMENTS_HC_INFO,
    hcId: info.id || "",
    hcLogo: info.logo || "",
  };
};
export const fetchHCInfo = (id) => {
  return (dispatch, getState) => {
    dispatch(setFetchingHCInfo(true));
    dispatch(setHCError(null));
    dispatch(setHCInfo({}));
    const { login } = getState();
    const token = login.authToken;
    let urlQuery = `hiringclientdetail?hiringClientId=${id}`;
    return Api.get(urlQuery, token)
    .then(response => {
      const { success, data } = response.data;
      if(success && data.length >= 1) {
        dispatch(setHCInfo(data[0]));
      } else {
        dispatch(setHCError("There was a problem fetching the Hiring Client information, please try again."));
      }
      dispatch(setFetchingHCInfo(false));
    })
    .catch(error => {
      console.log(error);
      dispatch(setHCError("Connection error - Please, check your Internet service."));
      dispatch(setFetchingHCInfo(false));
    });
  };
};
