import * as types from '../actions/types';

const INITIAL_STATE = {
  error: '',
  list: [],
  totalAmountOfDocumentQueueDefinitions: 0,
  documentQueueDefinitionsPerPage: 10,
  fetching: false,
  showModal: false,
  addDocumentQueueDefinitionsError: '',
  addDocumentQueueDefinitionsFetching: false,
  typeAheadResults: [],
  typeAheadError: '',
  typeAheadFetching: false,
  documentQueueUsersError: '',
  documentQueueUsersList: [],
  totalAmountOfDocumentQueueUsers: 0,
  documentQueueUsersPerPage: 10,
  fetchingDocumentQueueUsers: false,
  showDocumentQueueUsersModal: false,
  showAddDocumentQueueUsersModal: false,
};

export default (state = INITIAL_STATE, action) => {
  switch(action.type) {
    case types.SET_FETCHING_DOCUMENT_QUEUE_DEFINITIONS:
      return { ...state, fetching: true, list: [], error: '' };
    case types.SET_DOCUMENT_QUEUE_DEFINITIONS_ERROR:
      return { ...state, error: action.payload, fetching: false };
    case types.SET_DOCUMENT_QUEUE_DEFINITIONS_LIST:
      return { ...state, list: action.payload, fetching: false };
    case types.SET_TOTAL_AMOUNT_OF_DOCUMENT_QUEUE_DEFINITIONS:
      return { ...state, totalAmountOfDocumentQueueDefinitions: action.payload };
    case types.SET_DOCUMENT_QUEUE_DEFINITIONS_SHOW_MODAL:
      return { ...state, showModal: action.payload };
    case types.SET_DOCUMENT_QUEUE_DEFINITIONS_ADD_FETCHING:
      return { ...state, addDocumentQueueDefinitionsFetching: true, addDocumentQueueDefinitionsError: '' };
    case types.SET_DOCUMENT_QUEUE_DEFINITIONS_ADD_SUCCESS:
      return { ...state, addDocumentQueueDefinitionsFetching: false };
    case types.SET_DOCUMENT_QUEUE_DEFINITIONS_ADD_ERROR:
      return { ...state, addDocumentQueueDefinitionsFetching: false, addDocumentQueueDefinitionsError: action.payload };

    case types.SET_DOCUMENT_QUEUE_USERS_LIST_ERROR:
      return { 
        ...state,
        documentQueueUsersError: action.payload,
        fetchingDocumentQueueUsers: false
      };
    case types.SET_DOCUMENT_QUEUE_USERS_LIST:      
      return { 
        ...state,
        documentQueueUsersList: action.payload.list,
        totalAmountOfDocumentQueueUsers: action.payload.totalAmount,
        fetchingDocumentQueueUsers: false
      };
    case types.SET_FETCHING_DOCUMENT_QUEUE_USERS:
      return { 
        ...state,
        fetchingDocumentQueueUsers: true,
        totalAmountOfDocumentQueueUsers: 0,
        documentQueueUsersList: [],
        documentQueueUsersError: ''
      };
    case types.SET_SHOW_DOCUMENT_QUEUE_USERS_MODAL:
      return { 
        ...state, 
        showDocumentQueueUsersModal: action.payload 
      }
    case types.SET_SHOW_ADD_DOCUMENT_QUEUE_USERS_MODAL:
      return { 
        ...state, 
        showAddDocumentQueueUsersModal: action.payload 
      }

    default:
      return state;
  }
};
