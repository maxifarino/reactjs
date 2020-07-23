import * as types from '../actions/types';

export default function registerReducer(state = {
    loadingBraintree: false,
    braintreeError: null,
    braintreeWarning: null,
    clientToken: null,
    redirectHcId: null, 
    fetchingHC: false,
    hcError: null,
    hcId: "",
    hcLogo: "",
  }, action) {
  switch(action.type) {

    case types.SET_PAYMENTS_LOADING_BRAINTREE:
      return Object.assign({}, state, {
        loadingBraintree: action.loading
      });
    case types.SET_PAYMENTS_BRAINTREE_ERROR:
      return Object.assign({}, state, {
        braintreeError: action.error
      });
    case types.SET_PAYMENTS_BRAINTREE_WARNING:
      return Object.assign({}, state, {
        braintreeWarning: action.warning
      });
    case types.SET_PAYMENTS_BRAINTREE_CLIENT_TOKEN:
      return Object.assign({}, state, {
        clientToken: action.clientToken
      });
    case types.SET_PAYMENTS_REDIRECT_HCID:
      return Object.assign({}, state, {
        redirectHcId: action.redirectHcId
      });

    case types.SET_PAYMENTS_FETCHING_HC:
      return Object.assign({}, state, {
        fetchingHC: action.fetching
      });
    case types.SET_PAYMENTS_HC_INFO:
      return Object.assign({}, state, {
        hcId: action.hcId,
        hcLogo: action.hcLogo,
      });
    case types.SET_PAYMENTS_HC_ERROR:
      return Object.assign({}, state, {
        hcError: action.error
      });

    default:
      return state;
  }

}
