import * as types from '../actions/types';

export default function registerReducer(state = {
    errorForms: '',
    list: [],
    discreetAccountsSelected:[],
    totalAmountOfForms: 0,
    formsPerPage: 10,
    fetchingForms: false,
    formCreatorUsers: [],
    formSCSentTo: [],
    formId: null,
    submissionLink: null,
  }, action) {
  switch(action.type) {

    case types.SET_FORM_DISCREET_ACCOUNT_SELECTED:          
      return Object.assign({}, state, {
        discreetAccountsSelected: action.list
      });

    /*case types.SET_SAVED_FORMS_LIST:
      return Object.assign({}, state, {
        discreetAccountsSelected: action.list
      });*/

    case types.SET_SAVED_FORMS_LIST_ERROR:
      return Object.assign({}, state, {
        errorForms: action.error
      });

    case types.SET_SAVED_FORMS_LIST:      
      return Object.assign({}, state, {
        list: action.list
      });

    case types.SET_FETCHING_SAVED_FORMS:
      return Object.assign({}, state, {
        fetchingForms: action.isFetching
      });

    case types.SET_TOTAL_AMOUNT_OF_SAVED_FORMS:
      return Object.assign({}, state, {
        totalAmountOfForms: action.formsLength
      });

    case types.SET_SAVED_FORM_CREATOR_USERS:
      return Object.assign({}, state, {
        formCreatorUsers: action.formCreatorUsers
      });

    case types.SET_SAVED_FORM_SC_SENT_TO:
      return Object.assign({}, state, {
        formSCSentTo: action.formSCSentTo
      });

    case types.SET_FORM_ID_FOR_FETCHING:
      return Object.assign({}, state, {
        formId: action.formId
      });

    case types.SET_FORM_SUBMISSION_LINK:
      return Object.assign({}, state, {
        submissionLink: action.submissionLink
      });

    default:
      return state;
  }
}
