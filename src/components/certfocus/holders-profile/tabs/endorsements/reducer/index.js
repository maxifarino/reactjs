import * as types from '../actions/types';

const INITIAL_STATE = {
  error: '',
  list: [],
  totalAmountOfEndorsements: 0,
  endorsementsPerPage: 10,
  fetching: false,
  showModal: false,
  addEndorsementsError: '',
  addEndorsementsFetching: false,
};

export default (state = INITIAL_STATE, action) => {
  switch(action.type) {
    case types.SET_FETCHING_ENDORSEMENTS:
      return { ...state, fetching: true, list: [], error: '' };
    case types.SET_ENDORSEMENTS_ERROR:
      return { ...state, error: action.payload, fetching: false };
    case types.SET_ENDORSEMENTS_LIST:
      return { ...state, list: action.payload, fetching: false };
    case types.SET_TOTAL_AMOUNT_OF_ENDORSEMENTS:
      return { ...state, totalAmountOfEndorsements: action.payload };
    case types.SET_ENDORSEMENTS_SHOW_MODAL:
      return { ...state, showModal: action.payload };
    case types.SET_ENDORSEMENTS_ADD_FETCHING:
      return { ...state, addEndorsementsFetching: true, addEndorsementsError: '' };
    case types.SET_ENDORSEMENTS_ADD_SUCCESS:
      return { ...state, addEndorsementsFetching: false };
    case types.SET_ENDORSEMENTS_ADD_ERROR:
      return { ...state, addEndorsementsFetching: false, addEndorsementsError: action.payload };
    default:
      return state;
  }
};
