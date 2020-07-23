import * as types from '../actions/types';

const INITIAL_STATE = {
  error: '',
  list: [],
  totalAmountOfRules: 0,
  rulesPerPage: 10,
  fetching: false,
  showModal: false,
  addRequirementSetError: '',

  allEndorsementsError: '',
  allEndorsementsFetching: false,
  allEndorsements: [],
  reqSetEndorsements: [],
  endorsementsFetching: [],
};

export default (state = INITIAL_STATE, action) => {
  switch(action.type) {
    case types.SET_FETCHING_HOLDER_REQUIREMENT_SETS_VIEW:
      return { ...state, fetching: true, list: [], error: '' };
    case types.SET_HOLDER_REQUIREMENT_SETS_ERROR_VIEW:
      return { ...state, error: action.payload, fetching: false };
    case types.SET_HOLDER_REQUIREMENT_SETS_LIST_VIEW:
      return { ...state, list: action.payload, fetching: false };
    case types.SET_TOTAL_AMOUNT_OF_HOLDER_REQUIREMENT_SETS_VIEW:
      return { ...state, totalAmountOfRules: action.payload };
    case types.SET_HOLDER_REQUIREMENT_SETS_SHOW_MODAL_VIEW:
      return { ...state, showModal: action.payload };
    case types.SET_HOLDER_REQUIREMENT_SETS_ADD_ERROR_VIEW:
      return { ...state, addRequirementSetError: action.payload };

    // ENDORSEMENTS
    case types.SET_HOLDER_REQUIREMENT_SETS_VIEW_ENDORSEMENTS_ERROR:
      return { ...state, allEndorsementsError: action.payload };
    case types.SET_HOLDER_REQUIREMENT_SETS_VIEW_ALL_ENDORSEMENTS:
      return { ...state, allEndorsements: action.payload };
    case types.SET_HOLDER_REQUIREMENT_SETS_VIEW_ENDORSEMENTS:
      return { ...state, reqSetEndorsements: action.payload };
    case types.SET_HOLDER_REQUIREMENT_SETS_VIEW_ENDORSEMENTS_FETCHING:
      return { ...state, allEndorsementsFetching: action.payload };
    case types.SET_HOLDER_REQUIREMENT_SETS_VIEW_ENDORSEMENTS_SELECT_FETCHING:
      return { ...state, endorsementsFetching: [ ...state.endorsementsFetching, action.payload ] };
    case types.SET_REQUIREMENT_SETS_VIEW_ENDORSEMENT_SELECT_SUCCESS:
      if (action.payload.checked) {
        return {
          ...state,
          endorsementsFetching: state.endorsementsFetching.filter(endorsement => endorsement !== action.payload.endorsementId),
          reqSetEndorsements: [
            ...state.reqSetEndorsements,
            { EndorsementID: action.payload.endorsementId, RequirementSet_EndorsementID: action.payload.requirementSetEndorsementId }
          ],
        };
      } else {
        return {
          ...state,
          endorsementsFetching: state.endorsementsFetching.filter(endorsement => endorsement !== action.payload.endorsementId),
          reqSetEndorsements: state.reqSetEndorsements.filter(endorsement => endorsement.EndorsementID !== action.payload.endorsementId),
        };
      }
    case types.SET_REQUIREMENT_SETS_VIEW_ENDORSEMENT_SELECT_ERROR:
      return { ...state, endorsementsFetching: state.endorsementsFetching.filter(endorsement => endorsement !== action.payload) };
    default:
      return state;
  }
};
