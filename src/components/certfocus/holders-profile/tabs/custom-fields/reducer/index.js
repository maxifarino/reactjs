import * as types from '../actions/types';

const INITIAL_STATE = {
  errorPostCustomField: '',
  errorCustomFields: '',
  list: [],
  totalAmountOfCustomFields: 0,
  customFieldsPerPage: 10,
  fetchingCustomFields: true,
  showModal: false,
};

export default (state = INITIAL_STATE, action) => {
  switch(action.type) {
    case types.SET_POST_CUSTOM_FIELD_ERROR:
      return { ...state,
        errorPostCustomField: action.payload,
      };
    case types.SET_CUSTOM_FIELDS_LIST_ERROR:
      return { ...state,
        errorCustomFields: action.payload,
        fetchingCustomFields: false
      };
    case types.SET_CUSTOM_FIELDS_LIST:
      return { ...state,
        list: action.payload.list,
        totalAmountOfCustomFields: action.payload.totalAmount,
        fetchingCustomFields: false
      };
    case types.SET_FETCHING_CUSTOM_FIELDS:
      return { ...state,
        fetchingCustomFields: true,
        totalAmountOfCustomFields: 0,
        list: [],
        errorCustomFields: ''
      };
    case types.SET_SHOW_CUSTOM_FIELDS_MODAL:
      return { ...state, showModal: action.payload }
    default:
      return state;
  }
};
