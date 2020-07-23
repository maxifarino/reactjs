import * as types from '../actions/types';

export default function applyReducer(state = {
    titleOptions: [],
    timezoneOptions: [],
    tradeOptions: [],
    roleOptions: [],
    cfRoleOptions: [],
    countryOptions: [],
    geoStates: [],
    processingEndpoint: false,
    registrationError: null,
    registrationSuccess: null,
    redirectOnError: false,
    subcontractorId: '',
    hiringClientId: '',
    applyError: '',
    applyPayload: {},
    hcLogo: null,
    tempToken: null,
    userExists: null
  }, action) {
  switch(action.type) {
    case types.SET_APPLY_ERROR_MESSAGE:
      return Object.assign({}, state, {
        applyError: action.error
      });
    case types.SET_TITLE_OPTIONS:
      return Object.assign({}, state, {
        titleOptions: action.options.map(opt => {
          return {
            label: opt.Title || opt.title,
            value: opt.Id || opt.id
          };
        })
      });
    case types.SET_TIMEZONE_OPTIONS:
      return Object.assign({}, state, {
        timezoneOptions: action.options.map(opt => {
          return {
            label: opt.Value || opt.value,
            value: opt.Id || opt.id
          };
        })
      });
    case types.SET_TRADE_OPTIONS:
      return Object.assign({}, state, {
        tradeOptions: action.options.map(opt => {
          return {
            //label: `${opt.Value || opt.value} - ${opt.Description || opt.description}`,
            label: `${opt.Description || opt.description}`,
            value: opt.Id || opt.id,
            code: opt.Value || opt.value,
            description: opt.Description || opt.description
          };
        })
      });
    case types.SET_ROLE_OPTIONS:
      const firstOption = {
        value: 0, label: `--${action.rolesData.allUsersLabel}--`
      };
      const PQRoles = [
        firstOption,
        ...action.rolesData.PQRoles.map(role => {
          return { label: role.Name, value: role.Id }
        })
      ];
      const CFRoles = [
        firstOption,
        ...action.rolesData.CFRoles.map(role => {
          return { label: role.Name, value: role.Id }
        })
      ];
      return Object.assign({}, state, {
        roleOptions: PQRoles, cfRoleOptions: CFRoles
      });
    case types.SET_COUNTRY_OPTIONS:
      return Object.assign({}, state, {
        countryOptions: action.options.map(opt => {
          return {
            label: opt.name || opt.Name,
            value: opt.id || opt.Id
          };
        })
      });
    case types.SET_GEO_STATES:
      return Object.assign({}, state, {
        geoStates: action.geoStates
      });

    case types.SET_PROCESSING_REGISTRATION_EP:
      return {
        ...state,
        processingEndpoint: action.processing
      }
    case types.SET_REGISTRATION_ERROR:
      return {
        ...state,
        registrationError: action.error
      }
    case types.SET_REGISTRATION_SUCCESS:
      return {
        ...state,
        registrationSuccess: action.success
      }
    case types.SET_REGISTRATION_REDIRECT_ON_ERROR:
      return {
        ...state,
        redirectOnError: action.redirect
      }
    case types.SET_REGISTRATION_SC_ID:
      return {
        ...state,
        subcontractorId: action.subcontractorId
      }
    case types.SET_REGISTRATION_HC_ID:
      return {
        ...state,
        hiringClientId: action.hiringClientId
      }
    case types.SET_APPLY_PAYLOAD:
      return {
        ...state,
        applyPayload: action.applyPayload
      }
    case types.SET_APPLY_PAYLOAD_FIELD:
      return {
        ...state,
        applyPayload: {...state.applyPayload, [action.fieldName]: action.fieldValue}
      }
    case types.SET_REGISTRATION_HC_LOGO:
      return {
        ...state,
        hcLogo: action.hcLogo
      }
    case types.SET_REGISTRATION_TEMP_TOKEN:
      return {
        ...state,
        tempToken: action.tempToken
      }
    case types.SET_USER_EXISTS:
      return {
        ...state,
        userExists: action.data
      }
    default:
      return state;
  }
}
