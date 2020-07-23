import * as types from '../actions/types';

export default function registerReducer(state = {
    loading: false,
    error: null,
    FilesError: null,
    form: null,
    formFiles: [],
    fetchingFormFiles: false,
    formFieldsLists: [],
    scorecardsSourcesList: [],
    companiesTypesList: [],
    turnOverRatesList: [],
    tableOfContentItems: [],
    page: 0,
  }, action) {
  switch(action.type) {

    case types.ASSIGN_PREVIEW_FORM:
      return Object.assign({}, state, {
        loading: false,
        error: null,
        form: action.form
      });

    case types.CLEAR_PREVIEW_FORM:
      return Object.assign({}, state, {
        error: null,
        form: null
      });

    case types.SET_FORM_PREVIEW_DROP_DOWN_LISTS:
      return Object.assign({}, state, {
        formFieldsLists: action.formFieldsLists,
        scorecardsSourcesList: action.scorecardsSourcesList,
        companiesTypesList: action.companiesTypesList,
        turnOverRatesList: action.turnOverRatesList,
      });

    case types.SET_FORM_TABLE_OF_CONTENTS:
      return Object.assign({}, state, {
        tableOfContentItems: action.tableOfContentItems,
      });

    case types.SET_FORM_PREVIEWER_PAGE:
      return Object.assign({}, state, {
        page: action.page,
      });
    
      case types.SET_FORM_FILES_ERROR:
      return Object.assign({}, state, {
        FilesError: action.error
      });

    case types.SET_FETCHING_FORM_FILES:
      return Object.assign({}, state, {
        fetchingFormFiles: action.isFetching
      });

    case types.SET_FORM_FILES:
      return Object.assign({}, state, {
        formFiles: action.formFiles
      });

    default:
      return state;
  }

}
