import * as types from '../actions/types';

const INITIAL_STATE = {
  errorPostTag: '',
  errorTags: '',
  list: [],
  totalAmountOfTags: 0,
  tagsPerPage: 10,
  fetchingTags: true,
  showModal: false,
};

export default (state = INITIAL_STATE, action) => {
  switch(action.type) {
    case types.SET_POST_TAG_ERROR:
      return { ...state,
        errorPostTag: action.payload,
      };
    case types.SET_TAGS_LIST_ERROR:
      return { ...state,
        errorTags: action.payload,
        fetchingTags: false
      };
    case types.SET_TAGS_LIST:
      return { ...state,
        list: action.payload.list,
        totalAmountOfTags: action.payload.totalAmount,
        fetchingTags: false
      };
    case types.SET_FETCHING_TAGS:
      return { ...state,
        fetchingTags: true,
        totalAmountOfTags: 0,
        list: [],
        errorTags: ''
      };
    case types.SET_SHOW_TAGS_MODAL:
      return { ...state, showModal: action.payload }
    default:
      return state;
  }
};
