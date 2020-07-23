import * as types from '../actions/types'

const INITIAL_STATE = {
  error: '',
  fetching: false,
  showModal: false,
  showUsersModal: false,
  itemsPerPage: 10,
  totalCount: 0,
  list: [],
  roles: [],
  currentDepartmentUsers: [],
  currentDepartmentRoles: [],
}

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case types.SET_DEPARTMENT_LIST_FETCHING:
      return {...state, error: '', fetching: action.payload};
    case types.SET_DEPARTMENT_SHOW_MODAL:
      return {...state, showModal: action.payload};
    case types.SET_DEPARTMENT_ERROR:
      return {...state, error: action.payload};
    case types.SET_DEPARTMENT_LIST:
      return {...state, list: action.payload};
    case types.SET_DEPARTMENT_ROLES:
      return {...state, currentDepartmentRoles: action.payload};
    case types.SET_DEPARTMENT_USERS:
      return {...state, currentDepartmentUsers: action.payload};
    case types.SET_DEPARTMENT_LIST_TOTAL:
      return {...state, totalCount: action.payload};
    case types.SET_DEPARTMENT_SHOW_USERS_MODAL:
      return {...state, showUsersModal: action.payload};
    case types.SET_DEPARTMENT_AVAILABLE_ROLES:
      return {...state, roles: action.payload};
    default:
      return state;
  }
}