import * as types from '../actions/types';

export default function registerReducer(state = {
    loading: true,
    redirect: false,
    error: null,
    successMsg: null,
    form: null,
    savedFormId: null,
    savedValues: null,
    subcontractorId: null,
    savedFormStatus: null
  }, action) {
  switch(action.type) {
    case types.SET_LINK_LOADING:
      return Object.assign({}, state, {
        loading: true,
        redirect: false,
        error: null,
        successMsg: null,
      });

    case types.SET_LINK_ERROR:
      return Object.assign({}, state, {
        loading: false,
        redirect: action.redirect,
        error: action.error,
        successMsg: null,
      });

    case types.SET_LINK_RETRIEVING:
      return Object.assign({}, state, {
        loading: true,
        redirect: false,
        error: null,
        successMsg: null,
        form: null,
        savedFormId: null,
        savedValues: null,
        subcontractorId: null,
        savedFormStatus: null
      });

    case types.ASSIGN_LINK_SC:
      return Object.assign({}, state, {
        subcontractorId: action.subcontractorId
      });

    case types.ASSIGN_LINK_FORM:
      return Object.assign({}, state, {
        loading: false,
        redirect: false,
        error: null,
        successMsg: null,
        form: action.form,
        savedFormId: action.savedFormId,
        savedValues: action.savedValues,
        savedFormStatus: action.savedFormStatus
      });

    case types.CLEAR_LINK_FORM:
      return Object.assign({}, state, {
        redirect: false,
        form: null,
        savedFormId: null,
        savedValues: null,
        savedFormStatus: null
      });

    case types.VALUES_SUCCESSFULLY_SAVED:
      return Object.assign({}, state, {
        loading: false,
        redirect: action.redirect,
        error: null,
        savedValues: action.savedValues,
        successMsg: action.successMsg,
      });

    default:
      return state;
  }

}
