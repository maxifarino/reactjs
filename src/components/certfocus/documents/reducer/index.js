import * as types from '../actions/types';

const INITIAL_STATE = {
  errorDocuments: '',
  list: [],
  totalAmountOfDocuments: 0,
  documentsPerPage: 10,
  fetchingDocuments: false,
  showModal: false,
  favoriteFetching: null,
  fetchingDocumentStatus: false,
  documentStatusError: '',
  documentStatusList: [],
  fetchingDocumentTypes: false,
  documentTypesError: '',
  documentTypesList: [],
};

export default (state = INITIAL_STATE, action) => {
  switch(action.type) {
    case types.SET_DOCUMENTS_LIST_ERROR:
      return { 
        ...state,
        errorDocuments: action.payload,
        fetchingDocuments: false
      };
    case types.SET_DOCUMENTS_LIST:      
      return { 
        ...state,
        list: action.payload.list,
        totalAmountOfDocuments: action.payload.totalAmount,
        fetchingDocuments: false
      };
    case types.SET_FETCHING_DOCUMENTS:
      return { 
        ...state,
        fetchingDocuments: true,
        totalAmountOfDocuments: 0,
        list: [],
        errorDocuments: ''
      };
    case types.SET_SHOW_DOCUMENTS_MODAL:
      return { 
        ...state, 
        showModal: action.payload 
      }

    case types.SET_DOCUMENT_STATUS_ERROR:
      return { 
        ...state,
        documentStatusError: action.payload,
        fetchingDocumentStatus: false
      };
    case types.SET_DOCUMENT_STATUS_LIST:      
      return { 
        ...state,
        documentStatusList: action.payload.list,
        fetchingDocumentStatus: false
      };
    case types.SET_FETCHING_DOCUMENT_STATUS:
      return { 
        ...state,
        fetchingDocumentStatus: true,
        documentStatusList: [],
        documentStatusError: ''
      };
      
    case types.SET_DOCUMENT_TYPES_ERROR:
      return { 
        ...state,
        documentTypesError: action.payload,
        fetchingDocumentTypes: false
      };
    case types.SET_ALL_DOCUMENT_TYPES_LIST:
      return { 
        ...state,
        documentTypesList: action.payload.list,
        fetchingDocumentTypes: false
      };
    case types.SET_FETCHING_DOCUMENT_TYPES:
      return { 
        ...state,
        fetchingDocumentTypes: true,
        documentTypesList: [],
        documentTypesError: ''
      };

    default:
      return state;
  }
};
