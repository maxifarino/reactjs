import * as types from '../actions/types';

export default function templateBuilderReducer(state = {
  editorState: null,
  hiringClientId: '',
  possibleRecipients: [],
  recipients: [],
  possibleSubcontractors: [],
  possibleProjects: [],
  subcontractorId: '',
  dueDate: '',
  taskDetail: '',
  template: {
    id: '',
    templateName: '',
    subject: '',
    bodyHTML:  '',
    bodyText: '',
    templateActivityId: '',
    communicationTypeId: '',
    fromAddress: '',
    ownerId: '',
    templateCreator: '',
    dateCreation: ''
  },
  mail: {
    subject: '',
    bodyHTML:  null,
    bodyText: null,
  },
  sendingMail: false,
  errorMsg: null,
  successMsg: null,
  emailTemplates: [],
  totalAmountOfTemplates: 0
}, action) {
  switch(action.type) {
    case types.SET_MAIL_HC_ID:
      return {
        ...state,
        hiringClientId: action.hiringClientId
      }
    case types.SET_MAIL_TEMPLATE:
      return {
        ...state,
        template: action.template,
        mail: {
          ...state.mail,
          subject: action.subject
        }
      }
    case types.SET_MAIL_EDITOR_STATE:
      return {
        ...state,
        editorState: action.editorState,
        mail: {
          ...state.mail,
          bodyText: action.text,
          bodyHTML: action.html
        }
      }
    case types.SET_MAIL_SUBJECT:
      return {
        ...state,
        mail: {
          ...state.mail,
          subject: action.subject
        }
      }
    case types.SET_MAIL_POSSIBLE_RECIPIENTS:
      return {
        ...state,
        possibleRecipients: action.possibleRecipients
      }
    case types.SET_MAIL_RECIPIENTS:
      return {
        ...state,
        recipients: action.recipients
      }

    case types.SET_MAIL_POSSIBLE_SC:
      return {
        ...state,
        possibleSubcontractors: action.possibleSubcontractors
      }

    case types.SET_MAIL_POSSIBLE_PROJECTS:
      return {
        ...state,
        possibleProjects: action.payload,
      }

    case types.SET_MAIL_SC:
      return {
        ...state,
        subcontractorId: action.subcontractorId
      }

    case types.SET_MAIL_DUE_DATE:
      const taskDetail = action.dueDate === ''? '':state.taskDetail;
      return {
        ...state,
        dueDate: action.dueDate,
        taskDetail
      }

    case types.SET_MAIL_TASK_DETAIL:
      return {
        ...state,
        taskDetail: action.taskDetail
      }

    case types.SET_SENDING_MAIL:
      return {
        ...state,
        sendingMail: action.sendingMail
      }
    case types.SET_MAIL_ERROR_MSG:
      return {
        ...state,
        errorMsg: action.errorMsg
      }
    case types.SET_MAIL_SUCCESS_MSG:
      return {
        ...state,
        successMsg: action.successMsg
      }
    case types.SET_MAIL_TEMPLATES:
      return {
        ...state,
        emailTemplates: action.emailTemplates
      }
    case types.SET_TOTAL_AMOUNT_OF_TEMPLATES:
      return Object.assign({}, state, {
        totalAmountOfTemplates: action.TemplatesLength
      });
    default:
      return state;
  }
}
