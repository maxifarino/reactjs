import * as types from '../actions/types';

export default function HoldersReducer(state = {
  errorHolders: '',
  fetchingParents: false,
  parentsList: [],
  fetchingAccountManagers: false,
  accountManagersList: [],
}, action) {
  switch(action.type) {
    case types.SET_HOLDERS_ERROR:
      return Object.assign({}, state, {
        errorHolders: action.error
      });

    case types.SET_FETCHING_PARENT_HOLDERS:
      return Object.assign({}, state, {
        fetchingParents: action.fetching
      });
    case types.SET_PARENT_HOLDERS:
      return Object.assign({}, state, {
        parentsList: action.parents
      });

    case types.SET_FETCHING_ACCOUNT_MANAGERS:
      return Object.assign({}, state, {
        fetchingAccountManagers: action.fetching
      });
    case types.SET_ACCOUNT_MANAGERS:
      return Object.assign({}, state, {
        accountManagersList: action.managers
      });
    default:
      return state;
  }
};
