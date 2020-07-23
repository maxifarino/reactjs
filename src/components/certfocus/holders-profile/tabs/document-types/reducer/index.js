import * as types from '../actions/types';

const INITIAL_STATE = {
  error: '',
  list: [],
  totalAmountOfDocuments: 0,
  documentsPerPage: 10,
  fetchingDocuments: false,
  showModal: false,
  addDocumentError: '',
  addDocumentFetching: false
};

export default (state = INITIAL_STATE, action) => {
  switch(action.type) {
    case types.SET_FETCHING_DOCUMENT_TYPES:
      return { ...state, fetchingDocuments: true, list: [], error: '' };
    case types.SET_DOCUMENT_TYPES_ERROR:
      return { ...state, error: action.payload, fetchingDocuments: false };
    case types.SET_DOCUMENT_TYPES_LIST:
      return { ...state, list: action.payload, fetchingDocuments: false };
    case types.SET_TOTAL_AMOUNT_OF_DOCUMENT_TYPES:
      return { ...state, totalAmountOfDocuments: action.payload };
    case types.SET_DOCUMENT_TYPES_SHOW_MODAL:
      return { ...state, showModal: action.payload };
    case types.SET_DOCUMENT_TYPES_ADD_FETCHING:
      return { ...state, addDocumentFetching: true, addDocumentError: '' };
    case types.SET_DOCUMENT_TYPES_ADD_SUCCESS:
      return { ...state, addDocumentFetching: false };
    case types.SET_DOCUMENT_TYPES_ADD_ERROR:
      return { ...state, addDocumentError: action.payload, addDocumentFetching: false };
    default:
      return state;
  }
}
