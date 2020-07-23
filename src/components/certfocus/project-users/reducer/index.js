import * as types from '../actions/types';

const projectUsers = (state = {
  errorProjectUsers: '',
  projectUsersPerPage: 10,
  availableUsers: [],
}, action) => {
  switch (action.type) {
    case types.SET_PROJECT_USERS_LIST_ERROR:
      return Object.assign({}, state, {
        errorProjectUsers: action.error
      });
    case types.SET_PROJECT_USERS_LIST:
      return {...state, list: action.payload};
    case types.SET_TOTAL_AMOUNT_OF_PROJECT_USERS:
      return {...state, totalAmountOfProjectUsers: action.payload};
    case types.SET_AVAILABLE_PROJECT_USERS_LIST:
      return {...state, availableUsers: action.payload};
    case types.SET_FETCHING_PROJECT_USERS:
      return {...state, isFetching: action.payload};
    default:
      return state;
  }
}

export default projectUsers;