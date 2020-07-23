import * as types from '../actions/types';

export default function registerReducer(state = {
    loading: false,
    error: null,
    successMsg: null,
    form: null,
  }, action) {
  switch(action.type) {

    case types.SET_BUILDER_LOADING:
      return Object.assign({}, state, {
        loading: true,
        error: null,
        successMsg: null,
      });

    case types.ASSIGN_BUILDER_FORM:
      return Object.assign({}, state, {
        loading: false,
        error: null,
        successMsg: null,
        form: action.form
      });

    case types.CLEAR_BUILDER_FORM:
      return Object.assign({}, state, {
        error: null,
        successMsg: null,
        form: null
      });

    case types.CREATE_FORM_START:
      return Object.assign({}, state, {
        loading: true,
        error: null,
        successMsg: null,
        form: null,
      });

    case types.CREATE_FORM_FAILED:
      return Object.assign({}, state, {
        loading: false,
        form: action.form,
        error: action.error,
        successMsg: null
      });

    case types.CREATE_FORM_SUCCESS:
      return Object.assign({}, state, {
        loading: false,
        form: action.form,
        error: '',
        successMsg: 'The form was successfully saved'
      });

    case types.SECTION_DELETE_SUCCESS:
      return Object.assign({}, state, {
        loading: false,
        form: action.form,
        error: null,
        successMsg: null
      });

    case types.SECTION_DELETE_FAILED:
      return Object.assign({}, state, {
        loading: false,
        error: 'There was an error deleting this section, please try again',
        successMsg: null
      });

    case types.FIELD_DELETE_SUCCESS:
      return Object.assign({}, state, {
        loading: false,
        form: action.form,
        error: null,
        successMsg: null
      });

    case types.FIELD_DELETE_FAILED:
      return Object.assign({}, state, {
        loading: false,
        error: 'There was an error deleting this field, please try again',
        successMsg: null
      });

    default:
      return state;
  }

}
