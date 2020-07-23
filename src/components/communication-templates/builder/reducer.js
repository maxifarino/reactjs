import * as types from './actions/types';
const _ = require('lodash');

export default function templateBuilderReducer(state = {
  editorState: null,
  hc: false,
  commPlaceholders: [],
  template: {
    id: "",
    templateName: "",
    subject: "",
    bodyHTML:  '',
    bodyText: '',
    templateActivityId: "",
    communicationTypeId: "",
    fromAddress: "",
    ownerId: "",
    templateCreator: "",
    dateCreation: ""
  },
  savingTemplate: false,
  errorMsg: null,
  successMsg: null,
}, action) {
  switch(action.type) {
    case types.FROM_HC:
      return {
        ...state,
        hc: action.hc
      };
    case types.SET_TEMPLATE_BUILDER_TEMPLATE:
      return {
        ...state,
        template: action.template
      }
    case types.SET_TEMPLATE_EDITOR_STATE:
      return {
        ...state,
        editorState: action.editorState,
        template: {
          ...state.template,
          bodyText: action.text,
          bodyHTML: action.html
        }
      }
    case types.SET_TEMPLATE_FIELD:
      return {
        ...state,
        template: {...state.template, [action.fieldName]: action.fieldValue}
      }
    case types.SET_TEMPLATE_HIRING_CLIENT:
      return {
        ...state,
        template: {...state.template, ownerId: action.hiringClientId}
      }
    case types.SET_COMM_PLACEHOLDERS:
      return {
        ...state,
        commPlaceholders: action.commPlaceholders.map(ph => {
          return {
            id: ph.id,
            name: _.startCase(ph.placeholder.replace(/_/g, ' ')),
            placeholder: ph.placeholder
          };
        })
      }

    case types.SET_SAVING_TEMPLATE:
      return {
        ...state,
        savingTemplate: action.savingTemplate
      }
    case types.SET_TEMPLATE_ERROR_MSG:
      return {
        ...state,
        errorMsg: action.errorMsg
      }
    case types.SET_TEMPLATE_SUCCESS_MSG:
      return {
        ...state,
        successMsg: action.successMsg
      }
    default:
      return state;
  }
}
