import * as types from '../actions/types';

const INITIAL_STATE = {
  error: '',
  list: [],
  totalAmountOfRequirementSets: 0,
  requirementSetsPerPage: 10,
  fetching: false,
  showModal: false,
  addRequirementSetError: '',
  addRequirementSetFetching: false,
  rulesGroupsError: '',
  rulesGroups: [],
  rules: [],
  attachments: [],
  endorsements: [],
  reqSetEndorsements: [],
  endorsementsFetching: [],
  attributeTypeAheadResults: [],
  attributeTypeAheadError: '',
  attributeTypeAheadFetching: false,
  possibleValuesResults: [],
  possibleValuesError: '',
  possibleValuesFetching: false,
  holderSetIdsPossibleValuesResults: [],
  holderSetIdsPossibleValuesError: '',
  holderSetIdsPossibleValuesFetching: false,
  conditionPossibleValues: [
    { label: '-- Condition --', value: '' },
    { label: '= (Checked or unchecked)', value: 1 },
    { label: '= (AM Best Rating)', value: 2 },
    { label: '>= (AM Best Rating)', value: 3 },
    { label: '=', value: 4 },
    { label: '>=', value: 5 },
    { label: '>', value: 6 },
  ],
  valueStatusOptions: [
    { label: '-- Status --', value: '' },
    { label: 'UNCHECKED', value: 'UNCHECKED' },
    { label: 'CHECKED', value: 'CHECKED' },
  ],
  deficiencyTypeOptions: [
    { label: '-- Deficiency Type --', value: '' },
    { label: 'Major', value: 1 },
    { label: 'Minor', value: 2 },
  ],
  valueRatingOptions: [
    { label: '-- Rating --', value: '' },
    { label: 'A++', value: 'A++' },
    { label: 'A+', value: 'A+' },
    { label: 'A', value: 'A' },
    { label: 'A-', value: 'A-' },
    { label: 'B++', value: 'B++' },
    { label: 'B+', value: 'B+' },
    { label: 'B', value: 'B' },
    { label: 'B-', value: 'B-' },
    { label: 'C++', value: 'C++' },
    { label: 'C+', value: 'C+' },
    { label: 'C', value: 'C' },
    { label: 'C-', value: 'C-' },
    { label: 'D', value: 'D' },
    { label: 'E', value: 'E' },
    { label: 'F', value: 'F' },
    { label: 'S', value: 'S' },
  ],
};

export default (state = INITIAL_STATE, action) => {
  switch(action.type) {
    // REQ SETS
    case types.SET_FETCHING_HOLDER_REQUIREMENT_SETS:
      return { ...state, fetching: true, list: [], error: '' };
    case types.SET_HOLDER_REQUIREMENT_SETS_ERROR:
      return { ...state, error: action.payload, fetching: false };
    case types.SET_HOLDER_REQUIREMENT_SETS_LIST:
      return { ...state, list: action.payload, fetching: false };
    case types.SET_TOTAL_AMOUNT_OF_HOLDER_REQUIREMENT_SETS:
      return { ...state, totalAmountOfRequirementSets: action.payload };
    case types.SET_HOLDER_REQUIREMENT_SETS_SHOW_MODAL:
      return { ...state, showModal: action.payload };
    case types.SET_HOLDER_REQUIREMENT_SETS_ADD_FETCHING:
      return { ...state, addRequirementSetFetching: true, addRequirementSetError: '' };
    case types.SET_HOLDER_REQUIREMENT_SETS_ADD_SUCCESS:
      return { ...state, addRequirementSetFetching: false };
    case types.SET_HOLDER_REQUIREMENT_SETS_ADD_ERROR:
      return { ...state, addRequirementSetFetching: false, addRequirementSetError: action.payload };

    // REQ SETS DETAILS
    case types.SET_HOLDER_REQUIREMENT_SETS_RULES_GROUPS:
      return { ...state, rulesGroups: action.payload, rules: [] };
    case types.SET_HOLDER_REQUIREMENT_SETS_RULES_GROUPS_ERROR:
      return { ...state, rulesGroupsError: action.payload };
    case types.SET_HOLDER_REQUIREMENT_SETS_RULES:
      return { ...state, rules: [ ...state.rules, ...action.payload ]};
    case types.ADD_HOLDER_REQUIREMENT_SETS_RULES_GROUP:
      return { ...state, rulesGroups: [ ...state.rulesGroups, action.payload ] };
    case types.EDIT_HOLDER_REQUIREMENT_SETS_RULES_GROUP:
      return {
        ...state,
        rulesGroups: state.rulesGroups.map((group) => {
          if (group.RuleGroupID === action.payload.RuleGroupID) {
            return action.payload;
          }
          return group;
        }
      )};
    case types.DELETE_HOLDER_REQUIREMENT_SETS_RULES_GROUP:
      return { ...state, rulesGroups: state.rulesGroups.filter((el) => el.RuleGroupID !== action.payload) };
    case types.SET_REQUIREMENT_SETS_ATTRIBUTES_TYPE_AHEAD_FETCHING:
      return { ...state, attributeTypeAheadFetching: true, attributeTypeAheadError: '', attributeTypeAheadResults: [] };
    case types.SET_REQUIREMENT_SETS_ATTRIBUTES_TYPE_AHEAD:
      return { ...state, attributeTypeAheadFetching: false, attributeTypeAheadResults: action.payload };
    case types.SET_REQUIREMENT_SETS_ATTRIBUTES_TYPE_AHEAD_ERROR:
      return { ...state, attributeTypeAheadFetching: false, attributeTypeAheadError: action.payload };
    case types.SET_REQUIREMENT_SETS_ATTRIBUTES_TYPE_AHEAD_RESET:
        return { ...state, attributeTypeAheadError: '', attributeTypeAheadResults: [] };
    case types.ADD_HOLDER_REQUIREMENT_SETS_RULES:
      return { ...state, rules: [ ...state.rules, action.payload ] };
    case types.EDIT_HOLDER_REQUIREMENT_SETS_RULES:
      return {
        ...state,
        rules: state.rules.map((rule) => {
          if (rule.RuleID === action.payload.RuleID) {
            return action.payload;
          }
          return rule;
        }
      )};
    case types.DELETE_HOLDER_REQUIREMENT_SETS_RULES:
      return { ...state, rules: state.rules.filter((rule) => rule.RuleID !== action.payload) };
    case types.SET_HOLDER_REQUIREMENT_SETS_DOCUMENTS:
      return { ...state, attachments: action.payload };
    case types.DELETE_HOLDER_REQUIREMENT_SETS_ATTACHMENTS:
      return { ...state, attachments: state.attachments.filter((document) => document.RequirementSets_DocumentID !== action.payload)};
    case types.ADD_HOLDER_REQUIREMENT_SETS_ATTACHMENTS:
      return { ...state, attachments: [ ...state.attachments, action.payload ] };
    case types.SET_HOLDER_REQUIREMENT_SETS_ENDORSEMENTS:
      return { ...state, endorsements: action.payload };
    case types.SET_HOLDER_REQUIREMENT_SETS_REQ_SET_ENDORSEMENTS:
      return { ...state, reqSetEndorsements: action.payload };
    case types.SET_REQUIREMENT_SETS_ENDORSEMENT_FETCHING:
      return { ...state, endorsementsFetching: [ ...state.endorsementsFetching, action.payload ] };
    case types.SET_REQUIREMENT_SETS_ENDORSEMENT_SUCCESS:
      if (action.payload.checked) {
        return {
          ...state,
          endorsementsFetching: state.endorsementsFetching.filter(endorsement => endorsement !== action.payload.endorsementId),
          reqSetEndorsements: [
            ...state.reqSetEndorsements,
            { 
              EndorsementID: action.payload.endorsementId, 
              RequirementSet_EndorsementID: action.payload.requirementSetEndorsementId, 
              EndorsementName: action.payload.name,
              AlwaysVisible: action.payload.alwaysVisible,
            }
          ],
        };
      } else {
        return {
          ...state,
          endorsementsFetching: state.endorsementsFetching.filter(endorsement => endorsement !== action.payload.endorsementId),
          reqSetEndorsements: state.reqSetEndorsements.filter(endorsement => endorsement.EndorsementID !== action.payload.endorsementId),
        };
      }
    case types.SET_REQUIREMENT_SETS_ENDORSEMENT_ERROR:
      return { ...state, endorsementsFetching: state.endorsementsFetching.filter(endorsement => endorsement !== action.payload) };

    // POSSIBLE VALUES FOR DROPDOWN OR TYPE AHEAD
    case types.SET_HOLDER_REQUIREMENT_SETS_POSSIBLE_VALUES_FETCHING:
      return { ...state, possibleValuesResults: [], possibleValuesError: '', possibleValuesFetching: action.payload };
    case types.SET_HOLDER_REQUIREMENT_SETS_POSSIBLE_VALUES_LIST:
      return { ...state, possibleValuesResults: action.payload, possibleValuesFetching: false };
    case types.SET_HOLDER_REQUIREMENT_SETS_POSSIBLE_VALUES_ERROR:
      return { ...state, possibleValuesError: action.payload, possibleValuesFetching: false };
      
    case types.SET_HOLDER_SET_IDS_POSSIBLE_VALUES_FETCHING:
      return { ...state, holderSetIdsPossibleValuesResults: [], holderSetIdsPossibleValuesError: '', holderSetIdsPossibleValuesFetching: action.payload };
    case types.SET_HOLDER_SET_IDS_POSSIBLE_VALUES_LIST:
      return { ...state, holderSetIdsPossibleValuesResults: action.payload, holderSetIdsPossibleValuesFetching: false };
    case types.SET_HOLDER_SET_IDS_POSSIBLE_VALUES_ERROR:
      return { ...state, holderSetIdsPossibleValuesError: action.payload, holderSetIdsPossibleValuesFetching: false };  
    default:
      return state;
  }
};
