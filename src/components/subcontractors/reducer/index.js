import _ from 'lodash';
import * as types from '../actions/types';

export default function HCReducer(state = {
  errorSC: '',
  errorSCsearch: '',
  displayFileName: '',
  list: [],
  hcIdForAddSCmodal: '', 
  listForSelectComponent: [],
  showModal: false,
  showSearchModal: false,
  listOfSCFromParsedFile: [],
  listOfSCManually: [],
  fetchingSC: true,
  fetchingSCsearch: true,
  forms: [],
  SCPerPage: 10,
  totalAmountOfSC: 0,
  totalAmountOfSCsearch: 0,
  isZero: false,
  searchTerm: '',
  subcontratorStatus: [],
  subcontratorStatusWithCounts: [],
  subcontratorTierRates: [],
  tradesForFilterList: [],
  sendingScList: false,
  errorMsg: null,
  successMsg: null,
  subcontractorSearchResults: []
}, action) {
  switch(action.type) {
    case types.SET_HC_SELECTION_FOR_ADD_SC_MODAL:
      return Object.assign({}, state, {
        hcIdForAddSCmodal: action.hcIdForAddSCmodal
      })

    case types.SET_SUBCONTRACTOR_SEARCH_RESULTS:
      return Object.assign({}, state, {
        subcontractorSearchResults: action.subcontractorSearchResults
      })

    case types.SET_SC_LIST_ERROR:
      return Object.assign({}, state, {
        errorSC: action.error
      });
    
    case types.SET_SC_SEARCH_ERROR:
      return Object.assign({}, state, {
        errorSCsearch: action.error
      });

    case types.SET_ADD_SC_SHOW_MODAL:
      return Object.assign({}, state, {
        showModal: action.showModal
      });

    case types.SET_SEARCH_SC_SHOW_MODAL:
      return Object.assign({}, state, {
        showSearchModal: action.showModal
      });
    
    case types.SET_SEARCH_TERM:
      return Object.assign({}, state, {
        searchTerm: action.searchTerm
      });
      
    case types.SET_LIST_OF_SC_FROM_PARSED_FILE:
      return Object.assign({}, state, {
        listOfSCFromParsedFile: action.list
      });

    case types.SET_LIST_OF_SC_MANUALLY:
      return Object.assign({}, state, {
        listOfSCManually: action.list
      });

    case types.SET_SC_LIST:
      return Object.assign({}, state, {
        list: action.list,
        listForSelectComponent: _.isEmpty(state.listForSelectComponent) ? action.list : state.listForSelectComponent
      });

    case types.SET_FETCHING_SC:
      return Object.assign({}, state, {
        fetchingSC: action.isFetching
      });
    
    case types.SET_FETCHING_SC_SEARCH:
      return Object.assign({}, state, {
        fetchingSCsearch: action.isFetching
      });

    case types.SET_TOTAL_AMOUNT_OF_SC:
      return Object.assign({}, state, {
        totalAmountOfSC: action.SClength
      });

    case types.SET_TOTAL_AMOUNT_OF_SC_SEARCH:
      return Object.assign({}, state, {
        totalAmountOfSCsearch: action.SClengthSearch
      });

    case types.SET_COUNT_OF_ZERO:
      return Object.assign({}, state, {
        isZero: action.isZero
      });

    case types.SET_SC_STATUS:
      return Object.assign({}, state, {
        subcontratorStatus: action.subcontratorStatus     
      });

    case types.SET_FORMS:
        action.forms.push({value: 0, label: "--Select Form (Optional)--"})
        action.forms.reverse()
      return Object.assign({}, state, {
        forms: action.forms     
      });

    case types.SET_SC_STATUS_WITH_COUNTS:
      return Object.assign({}, state, {
        subcontratorStatusWithCounts: action.subcontratorStatusWithCounts     
      });

    case types.SET_SC_TIER_RATES:
      return Object.assign({}, state, {
        subcontratorTierRates: action.subcontratorTierRates
      });
    
    case types.SET_DISPLAY_FILE_NAME:
      return Object.assign({}, state, {
        displayFileName: action.displayFileName
      });

    case types.SET_TRADES_FOR_FILTER_LIST:
      return Object.assign({}, state, {
        tradesForFilterList: action.data
      });

    case types.SET_SENDING_SC_LIST:
      return {
        ...state,
        sendingScList: action.sendingScList
      }
    case types.SET_SENDING_SC_LIST_SUCCESS:
      return {
        ...state,
        successMsg: action.successMsg
      }
    case types.SET_SENDING_SC_LIST_ERROR:
      return {
        ...state,
        errorMsg: action.errorMsg
      }
    default:
      return state;
  }
};
