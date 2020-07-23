import * as types from '../actions/types';

export default function HCProfileReducer(state = {
  fetchingHeader: false,
  headerDetails: {},
  fetchingHC: false,
  hcList: {},
  hcId: "",
  paymentStatus: null,
  paymentError: '',
  lastPayment: {},
  locations: [],
  totalAmountOfLocations: 0,
  fetchingLocations: false,
  fetchingLocationsError: null,
  states: [],
  provAndTerr: [],
  countries: [],
  savingLocation: false,
  savingLocationsError: null,
  primaryWasChanged: null
}, action) {
  switch(action.type) {
    case types.SET_FETCHING_SC_HEADER:
      return Object.assign({}, state, {
        fetchingHeader: action.isFetching
      });
    case types.SET_SC_HEADER_DETAILS:
      return Object.assign({}, state, {
        headerDetails: action.headerDetails
      });
    case types.SET_FETCHING_SC_HIRINGCLIENTS:
      return Object.assign({}, state, {
        fetchingHC: action.isFetching
      });
    case types.SET_SC_HIRINGCLIENTS:
      return Object.assign({}, state, {
        hcList: action.hcList
      });
    case types.SET_SC_HC_ID:
      return Object.assign({}, state, {
        hcId: action.hcId
      });
    case types.SET_SC_PAYMENT_STATUS:
      return Object.assign({}, state, {
        paymentStatus: action.payload,
      });
    case types.SET_SC_PAYMENT_STATUS_ERROR:
      return Object.assign({}, state, {
        paymentError: action.payload,
      });
    case types.SET_SC_LAST_PAYMENT:
      return Object.assign({}, state, {
        lastPayment: action.payload,
      });
    case types.SET_FETCHING_LOCATIONS:
      return Object.assign({}, state, {
        fetchingLocations: action.isFetching
      });
    case types.SET_TOTAL_AMOUNT_OF_LOCATIONS:
      return Object.assign({}, state, {
        totalAmountOfLocations: action.locationsLength,
      });
    case types.SET_LOCATIONS_LIST:
      return Object.assign({}, state, {
        locations: action.list,
      });
    case types.SET_LOCATIONS_LIST_ERROR:
      return Object.assign({}, state, {
        fetchingLocationsError: action.error,
      });
    case types.SET_US_STATES_LIST:
      return Object.assign({}, state, {
        states: action.list,
      });
    case types.SET_CANADIAN_PROVINCES_AND_TERRITORIES_LIST:
      return Object.assign({}, state, {
        provAndTerr: action.list,
      });
    case types.SET_COUNTRIES_LIST:
      return Object.assign({}, state, {
        countries: action.list,
      });
    case types.SET_LOCATIONS_ERROR:
      return Object.assign({}, state, {
        savingLocationsError: action.error,
      });
    case types.SET_SAVING_LOCATION:
      return Object.assign({}, state, {
        savingLocation: action.saving,
      });
    case types.SET_CHANGING_PRIMARY:
      return Object.assign({}, state, {
        primaryWasChanged: action.isChanged,
      });
    default:
      return state;
  }
};
