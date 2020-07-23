import * as types from '../actions/types';
//import Utils from '../../../lib/utils';
import * as helper from './helper'

export default function usersReducer(state = {
    errorUsers: '',
    list: [],
    nPQlist: [],
    totalAmountOfUsers: 0,
    usersPerPage: 10,
    hiringClientsOptions: [],
    subContractorsOptions: [],
    fetchingUsers: true,
    fetchingPopOverHC: false,
    fetchingPopOverSC: false,
    fetchingPopOverLogs: false,
    popoverHiringClients: [],
    popoverSubContractors: [],
    popoverLogs: [],
    HiringClientsTags: [],
    SubContractorsTags: [],
    logUsers: [],
    logModules: [],
    logs: [],
    totalAmountOfLogs: 0,
    fetchingLogs: false,
    logsPerPage: 10,
    showOverlayAddUser: false
  }, action) {
  switch(action.type) {

    case types.SET_USERS_LIST_ERROR:
      return Object.assign({}, state, {
        errorUsers: action.error
      });

    case types.SET_USERS_LIST:
    return Object.assign({}, state, {
      list: action.usersData.list.map((user,idx) => {
        let status = helper.determineStatus(user, action)

        return helper.MapUserPropsToState(user, status)
      })
    });

    case types.SET_USERS_N_PQ_LIST:
    return Object.assign({}, state, {
      nPQlist: action.usersData.nPQlist.map((user,idx) => {
        let status = helper.determineStatus(user, action)

        return helper.MapUserPropsToState(user, status)
      })
    })

    case types.SET_HIRING_CLIENTS_OPTIONS:
      let hiringClientsOptions = [{
        value: 0,
        label: `--${action.HCData.allLabel}--`
      }];
      const fetchedHC = action.HCData.options;
      for (let i = 0; i < fetchedHC.length; i++) {
        hiringClientsOptions.push({
          label: fetchedHC[i].name,
          value: fetchedHC[i].id
        });
      }
      return Object.assign({}, state, {
        hiringClientsOptions
      });

    case types.SET_SUBCONTRACTOR_OPTIONS:
      let subContractorsOptions = [{
        value: 0,
        label: `--${action.SCData.allLabel}--`
      }];
      const fetchedSC = action.SCData.options;
      for (let i = 0; i < fetchedSC.length; i++) {
        subContractorsOptions.push({
          label: fetchedSC[i].name,
          value: fetchedSC[i].id,
          name: fetchedSC[i].name, 
          id: `${fetchedSC[i].id}`,
          text: fetchedSC[i].name
        });
      }
      return Object.assign({}, state, {
        subContractorsOptions
      });

    case types.SET_POPOVER_HIRINGCLIENTS:
      return Object.assign({}, state, {
        popoverHiringClients: action.list
        // ,
        // HiringClientsTags: action.list.map(item => {
        //   return {
        //     id: item.id + '',
        //     text: item.name
        //   };
        // })
      });

    case types.SET_POPOVER_SUBCONTRACTORS:
      return Object.assign({}, state, {
        popoverSubContractors: action.list
        // ,
        // SubContractorsTags: action.list.map(item => {
        //   return {
        //     id: item.id + '',
        //     text: item.name
        //   };
        // })
      });

    case types.SET_POPOVER_LOGS:
      return Object.assign({}, state, {
        popoverLogs: action.list,
      });

    case types.SET_HIRING_CLIENTS_TAGS:
      return Object.assign({}, state, {
        HiringClientsTags: action.list.map(item => {
          return {
            id: item.id + '',
            text: item.name
          };
        })
      });

    case types.SET_SUBCONTRACTORS_TAGS:
      return Object.assign({}, state, {
        SubContractorsTags: action.list.map(item => {
          return {
            name: item.name, 
            label: item.name, 
            value: item.id, 
            id: `${item.id}`,
            text: item.name
          };
        })
      });

    case types.SET_FETCHING_USERS:
      return Object.assign({}, state, {
        fetchingUsers: action.isFetching
      });

    case types.SET_FETCHING_POPOVER_HC:
      return Object.assign({}, state, {
        fetchingPopOverHC: action.isFetching
      });

    case types.SET_FETCHING_POPOVER_SC:
      return Object.assign({}, state, {
        fetchingPopOverSC: action.isFetching
      });

    case types.SET_FETCHING_POPOVER_LOGS:
      return Object.assign({}, state, {
        fetchingPopOverLogs: action.isFetching
      });

    case types.SET_TOTAL_AMOUNT_OF_USERS:
      return Object.assign({}, state, {
        totalAmountOfUsers: action.usersLength
      });

    case types.SET_LOG_USERS:
      return Object.assign({}, state, {
          logUsers: action.logUsers
        }
      );

    case types.SET_LOG_MODULES:
      return Object.assign({}, state, {
          logModules: action.logModules
        }
      );

    case types.SET_LOGS:
      return Object.assign({}, state, {
          logs: action.logs
        }
      );

    case types.SET_TOTAL_LOGS:
      return Object.assign({}, state, {
        totalAmountOfLogs: action.total
      });

    case types.SET_FETCHING_LOGS:
      return Object.assign({}, state, {
          fetchingLogs: action.isFetching
        }
      );

    case types.SET_SHOW_OVERLAY_ADDUSER:
      return Object.assign({}, state, {
        showOverlayAddUser: action.flag
      });

    // add and delete

    case types.ADD_HIRINGCLIENT_TAG:
      return Object.assign({}, state,
        {
          HiringClientsTags: [
            ...state.HiringClientsTags,
            {
              id: `${action.id}`,
              text: action.value
            }
          ]
        }
      );

    case types.ADD_SUBCONTRACTOR_TAG:
      return Object.assign({}, state,
        {
          SubContractorsTags: [
            ...state.SubContractorsTags,
            {
              id: `${action.id}`,
              text: action.value
            }
          ]
        }
      );

    case types.DELETE_SUBCONTRACTOR_TAG:
      return Object.assign({}, state,
        {
          SubContractorsTags: state.SubContractorsTags.filter(tag => tag.id !== action.id )
        }
      );

    case types.DELETE_HIRINGCLIENT_TAG:
      return Object.assign({}, state,
        {
          HiringClientsTags: state.HiringClientsTags.filter(tag => tag.id !== action.id )
        }
      );

    case types.SET_CURRENT_EDITING_USER:
      return {...state, currentEditingUser: action.payload}

    default:
      return state;
  }
}
