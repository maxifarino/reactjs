import * as types from '../actions/types';

export default function referencesReducer(state = {
  error: '',
  list: [],
  referencesTypesPossibleValues: [],
  questions: [],
  submissions: [],
  referenceModalData: {},
  answers: [],
  totalAmountOfReferences: 0,
  referencesPerPage: 10,
  fetchingReferences: false
}, action) {
  switch(action.type) {

    case types.SET_FETCHING_REFERENCES:
      return Object.assign({}, state, {
        fetchingReferences: action.isFetching
      });

    case types.SET_REFERENCES:
      return Object.assign({}, state, {
        list: action.references
      });

    case types.SET_REFERENCES_ERROR:
      return Object.assign({}, state, {
        error: action.error
      });

    case types.SET_TOTAL_AMOUNT_OF_REFERENCES:
      return Object.assign({}, state, {
        totalAmountOfReferences: action.filesLength
      });

    case types.SET_REFERENCES_MODAL_DATA:
      return Object.assign({}, state, action.payload);

    case types.SET_MODAL_REFERENCE_DATA_TO_SEND:
      return Object.assign({}, state, {
        referenceModalData: Object.assign({}, state.referenceModalData, action.payload)
      });

    default:
      return state;
  }
};
