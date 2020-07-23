import * as types from './actions/types';
import Utils from '../../lib/utils';

export default function commonReducer(state = {
  checkingAuthorizations: true,
  usersAuth: false,
  formBuilderAuth: false,
  commTempAuth: false,
  toggled: false,
  functions: [],
  loading: false,
  headerTitle: '',
  notifications: 0,
  fetchingUserHCs: false,
  lastHiringClientId: null,
  lastSubcontractorId: null,
  userHiringClients: [],
  timezones: [],
  timezoneOptions: [],
  countries: [],
  usStates: [],
  typeAheadResults: [],
  typeAheadError: '',
  typeAheadFetching: false,
  projectStatus: [],
  complianceStatus: [],
  certificateOptions: [],
  dataEntryOptions: [],
  breadcrumb: {},
  breadcrumbItems: []
}, action) {
  switch (action.type) {
    case types.TOGGLE_SIDEBAR:
      return Object.assign({}, state, {
        toggled: action.toggled
      });
    case types.SET_FUNCTIONS:
      return Object.assign({}, state, {
        functions: action.functions
      });
    case types.SET_LOADING:
      return Object.assign({}, state, {
        loading: action.loading
      });
    case types.SET_CHECKING_AUTHORIZATIONS:
      return Object.assign({}, state, {
        checkingAuthorizations: action.checkingAuthorizations
      });
    case types.SET_AUTHORIZATIONS:
      return Object.assign({}, state, {
        usersAuth: action.usersAuth,
        formBuilderAuth: action.formBuilderAuth,
        commTempAuth: action.commTempAuth
      });
    case types.SET_HEADER_TITLE:
      return Object.assign({}, state, {
        headerTitle: action.headerTitle
      });
    case types.SET_HEADER_NOTIFICATIONS:
      return Object.assign({}, state, {
        notifications: action.notifications
      });
    case types.SET_FETCHING_USER_HCS:
      return Object.assign({}, state, {
        fetchingUserHCs: action.fetchingUserHCs
      });
    case types.SET_USER_HIRING_CLIENTS:
      return Object.assign({}, state, {
        userHiringClients: action.userHiringClients
      });
    case types.SET_TIMEZONES:
      return Object.assign({}, state, {
        timezones: action.timezones,
        timezoneOptions: Utils.getOptionsList('', action.timezones, 'Description', 'Id', 'Description')
      });
    case types.SET_LAST_HIRING_CLIENT_ID:
      return Object.assign({}, state, {
        lastHiringClientId: action.hiringClientId
      });
    case types.SET_LAST_SUBCONTRACTOR_ID:
      return Object.assign({}, state, {
        lastSubcontractorId: action.subcontractorId
      });

    case types.SET_COUNTRIES:
      return Object.assign({}, state, {
        countries: action.countries
      });
    case types.SET_US_STATES:
      return Object.assign({}, state, {
        usStates: action.usStates
      });
    case types.SET_TYPE_AHEAD_FETCHING:
      return Object.assign({}, state, {
        typeAheadFetching: true,
        typeAheadResults: [],
        typeAheadError: ''
      });
    case types.SET_TYPE_AHEAD_SUCCESS:
      return Object.assign({}, state, {
        typeAheadFetching: false,
        typeAheadResults: action.payload,
      });
    case types.SET_TYPE_AHEAD_ERROR:
      return Object.assign({}, state, {
        typeAheadFetching: false,
        typeAheadError: action.payload,
      });
    case types.RESET_TYPE_AHEAD_RESULTS:
      return Object.assign({}, state, {
        typeAheadResults: [],
      });
    case types.SET_COMMON_PROJECT_STATUS:
      return Object.assign({}, state, {
        projectStatus: action.payload,
      });
    case types.SET_COMMON_COMPLIANCE_STATUS:
      return Object.assign({}, state, {
        complianceStatus: action.payload,
      });
    case types.SET_COMMON_HOLDER_CERTIFICATE_OPTIONS:
      return Object.assign({}, state, {
        certificateOptions: action.payload,
      });
    case types.SET_COMMON_HOLDER_DATA_ENTRY_OPTIONS:
      return Object.assign({}, state, {
        dataEntryOptions: action.payload,
      });

    case types.SET_INIT_CURRENT_PAGE:
      return Object.assign({}, state, {
        breadcrumb: action.payload,
      });

    case types.SET_CHILD_TO_PARENT:
      let breadcrumbItems = { ...state.breadcrumbItems, child: action.payload };
      return Object.assign({}, state, { ...breadcrumbItems });


    case types.ADD_CURRENT_PAGE:

      if (action.payload.pathName == undefined) {
        return Object.assign({}, state, {
          breadcrumbItems: [...state.breadcrumbItems],
        });
      }
      else {
        let index = state.breadcrumbItems.findIndex(element => element.pathName == action.payload.pathName);
        if (index != -1) {
          state.breadcrumbItems.splice(index + 1, state.breadcrumbItems.length);
          return Object.assign({}, state, {
            breadcrumbItems: [...state.breadcrumbItems],
          });
        } else {
          state.breadcrumbItems = [...state.breadcrumbItems, action.payload];
        }

        if (state.breadcrumbItems.length > 4) {
          state.breadcrumbItems.splice(0, 1);
        }

      }

      return Object.assign({}, state, {
        breadcrumbItems: [...state.breadcrumbItems],
      });

    case types.SET_BREADCRUMB_ITEMS:      
      return Object.assign({}, state, {
        breadcrumbItems: action.payload,
      });

    default:
      return state;
  }
};
