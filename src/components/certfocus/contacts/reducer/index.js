import * as types from '../actions/types';

const INITIAL_STATE = {
  errorPostContact: '',
  errorContacts: '',
  list: [],
  totalAmountOfContacts: 0,
  contactsPerPage: 10,
  fetchingContacts: true,
  showModal: false,
  contactTypes: [],
};

export default (state = INITIAL_STATE, action) => {
  switch(action.type) {
    case types.SET_POST_CONTACT_ERROR:
      return { ...state,
        errorPostContact: action.payload,
      };
    case types.SET_CONTACTS_LIST_ERROR:
      return { ...state,
        errorContacts: action.payload,
        fetchingContacts: false
      };
    case types.SET_CONTACTS_LIST:
      return { ...state,
        list: action.payload.list,
        totalAmountOfContacts: action.payload.totalAmount,
        fetchingContacts: false
      };
    case types.SET_FETCHING_CONTACTS:
      return { ...state,
        fetchingContacts: true,
        totalAmountOfContacts: 0,
        list: [],
        errorContacts: ''
      };
    case types.SET_CONTACTS_TYPES:
      return { ...state,
        contactTypes: action.payload,
      };
    case types.SET_SHOW_CONTACTS_MODAL:
      return { ...state, showModal: action.payload }
    default:
      return state;
  }
};
