import * as types from './actions/types';

export default function templateListReducer(state = {
    errorTemplates: '',
    list: [],
    totalAmountOfTemplates: 0,
    templatesPerPage: 10,
    fetchingTemplates: true,
    currentTemplate: {},
    communicationTypesPossibleValues: [],
    templateActivitiesPossibleValues: [],
  }, action) {
  switch(action.type) {
    case types.SET_TEMPLATES_LIST_ERROR:
      return Object.assign({}, state, {
        errorTemplates: action.error
      });

    case types.SET_CURRENT_TEMPLATE:
      return Object.assign({}, state, {
        currentTemplate: action.currentTemplate
    });

    case types.SET_TEMPLATES_LIST:
      return Object.assign({}, state, {
        list: action.list
      });

    case types.SET_FETCHING_TEMPLATES:
      return Object.assign({}, state, {
        fetchingTemplates: action.isFetching
      });

    case types.SET_TOTAL_AMOUNT_OF_TEMPLATES:
      return Object.assign({}, state, {
        totalAmountOfTemplates: action.templatesLength
      });

    case types.SET_POSSIBLE_COMM_TYPES:
      return Object.assign({}, state, {
        communicationTypesPossibleValues: action.communicationTypesPossibleValues
      });

    case types.SET_POSSIBLE_ACTIVITIES:
      return Object.assign({}, state, {
        templateActivitiesPossibleValues: action.templateActivitiesPossibleValues
      });

    default:
      return state;
  }
}
