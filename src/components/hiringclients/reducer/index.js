import * as types from '../actions/types';

export default function HCReducer(state = {
  successHC: '',
  errorHC: '',
  list: [],
  parentsList: [],
  totalAmountOfHC: 0,
  HCPerPage: 10,
  fetchingHC: true,
  hcUsers: [],
  operators: [],
  showModal: false,
  showHoldersModal: false,
  associatingHCUser: false,
  associatingOperator: false,
  serializedHcObj:  {},
  unlinkedUsers: [],
}, action) {
  switch(action.type) {
    case types.SET_HC_LIST_SUCCESS:
      return Object.assign({}, state, {
        successHC: action.success
      });
    case types.SET_HC_LIST_ERROR:
      return Object.assign({}, state, {
        errorHC: action.error
      });
    case types.SET_HC_LIST:
      return Object.assign({}, state, {
        list: action.list
      });
    case types.SET_PARENTS_HC_LIST:
      return Object.assign({}, state, {
        parentsList: action.list
      });
    case types.SET_HC_USERS:
      return Object.assign({}, state, {
        hcUsers: action.list
      });
    case types.SET_OPERATORS:
      return Object.assign({}, state, {
        operators: action.list
      });
    case types.SET_FETCHING_HC:
      return Object.assign({}, state, {
        fetchingHC: action.isFetching
      });
    case types.SET_TOTAL_AMOUNT_OF_HC:
      return Object.assign({}, state, {
        totalAmountOfHC: action.HClength
      });
    case types.SET_SHOW_MODAL:
      return Object.assign({}, state, {
        showModal: action.showModal
    });
    case types.SET_SHOW_HOLDERS_MODAL:
      return Object.assign({}, state, {
        showHoldersModal: action.showModal
    });
    case types.SET_ASSOCIATING_HCUSER:
      return Object.assign({}, state, {
        associatingHCUser: action.associating
    });
    case types.SET_ASSOCIATING_OPERATOR:
      return Object.assign({}, state, {
        associatingOperator: action.associating
    });
    case types.ADD_SERIALIZED_HC_DATA:
      let _state = Object.assign({}, state);
      _state.serializedHcObj = Object.assign( _state.serializedHcObj, action.serializedHcObj);
      return _state;
    default:
      return state;
  }
};
