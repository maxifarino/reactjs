import * as types from '../actions/types';

const INITIAL_STATE = {
  error: '',
  list: [],
  totalAmountOfAttachments: 0,
  attachmentsPerPage: 5,
  fetching: false,
  showModal: false,
  addError: '',
  addFetching: false,
};

export default (state = INITIAL_STATE, action) => {
  switch(action.type) {
    case types.SET_FETCHING_ATTACHMENTS:
      return { ...state, fetching: true, list: [], error: '' };
    case types.SET_ATTACHMENTS_ERROR:
      return { ...state, error: action.payload, fetching: false };
    case types.SET_ATTACHMENTS_LIST:
      return { ...state, list: action.payload, fetching: false };
    case types.SET_TOTAL_AMOUNT_OF_ATTACHMENTS:
      return { ...state, totalAmountOfAttachments: action.payload };
    case types.SET_ATTACHMENTS_SHOW_MODAL:
      return { ...state, showModal: action.payload };

    case types.SET_ATTACHMENTS_ADD_FETCHING:
      return { ...state, addFetching: true, addError: '' };
    case types.SET_ATTACHMENTS_ADD_SUCCESS:
      return { ...state, addFetching: false };
    case types.SET_ATTACHMENTS_ADD_ERROR:
      return { ...state, addFetching: false, addError: action.payload };
    default:
      return state;
  }
};
