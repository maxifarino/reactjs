import * as types from '../actions/types';

const INITIAL_STATE = {
  error: '',
  list: [],
  fetching: false,
  showModal: false,
  requirementSets: [],
  attachments: [],
  endorsements: [],
  allEndorsements: [],
};

export default (state = INITIAL_STATE, action) => {  
  switch(action.type) {
    case types.SET_REQUIREMENT_SETS_ERROR:
      return { ...state, error: action.payload.error, fetching: false };
    case types.SET_REQUIREMENT_SETS:
      return { ...state, requirementSets: action.payload.requirementSets, fetching: false };
    case types.SET_ATTACHMENTS:
      return { ...state, attachments: action.payload.attachments, fetching: false };
    case types.SET_ENDORSEMENTS:
      return { ...state, endorsements: action.payload.endorsements, fetching: false };
    case types.SET_ALL_ENDORSEMENTS:
      return { ...state, allEndorsements: action.payload.endorsements, fetching: false };
    case types.SET_FETCHING_DOCUMENTS:
      return { ...state, fetching: action.isFetching };
    case types.SET_DOCUMENTS_ERROR:
      return { ...state, error: action.payload.error, fetching: false };
    case types.SET_DOCUMENTS_LIST:
      return { ...state, list: action.payload.list, fetching: false };

    default:
      return state;
  }
}
