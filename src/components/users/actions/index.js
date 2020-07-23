import * as types from './types';
import Api from '../../../lib/api';
import Utils from '../../../lib/utils';
import sizeof from 'object-sizeof'

// sets

export const setCurrentEditingUser = (user = {}) => {
  return {
    type: types.SET_CURRENT_EDITING_USER,
    payload: user
  }
}

export const setUsersListError = (error) => {
  return {
    type: types.SET_USERS_LIST_ERROR,
    error
  };
};

export const setUsersList = (list, errors) => {
  return {
    type: types.SET_USERS_LIST,
    usersData: {
      list,
      statusInactive: errors.statusInactive,
      statusChangePassword: errors.statusChangePassword,
      statusActive: errors.statusActive
    }
  };
};

export const setUsersNpqList = (nPQlist, errors) => {
  return {
    type: types.SET_USERS_N_PQ_LIST,
    usersData: {
      nPQlist,
      statusInactive: errors.statusInactive,
      statusChangePassword: errors.statusChangePassword,
      statusActive: errors.statusActive
    }
  };
};

export const setHiringClientsOptions = (options, allLabel) => {
  return {
    type: types.SET_HIRING_CLIENTS_OPTIONS,
    HCData: {
      options,
      allLabel
    }
  };
};

export const setSubcontractorOptions = (options, allLabel) => {
  return {
    type: types.SET_SUBCONTRACTOR_OPTIONS,
    SCData: {
      options,
      allLabel
    }
  };
};

export const setPopoverHiringClients = (list) => {
  return {
    type: types.SET_POPOVER_HIRINGCLIENTS,
    list
  };
};

export const setPopoverSubcontractors = (list) => {
  return {
    type: types.SET_POPOVER_SUBCONTRACTORS,
    list
  };
};

export const setPopoverLogs = (list) => {
  return {
    type: types.SET_POPOVER_LOGS,
    list
  };
};

export const setHiringClientsTags = (list) => {
  return {
    type: types.SET_HIRING_CLIENTS_TAGS,
    list
  };
};

  export const setSubContractorsTags = (list) => {
    return {
      type: types.SET_SUBCONTRACTORS_TAGS,
      list
    };
  };

export const setFetchingUsers = (isFetching) => {
  return {
    type: types.SET_FETCHING_USERS,
    isFetching
  };
};

export const setFetchingPopOverHC = (isFetching) => {
  return {
    type: types.SET_FETCHING_POPOVER_HC,
    isFetching
  };
};

export const setFetchingPopOverSC = (isFetching) => {
  return {
    type: types.SET_FETCHING_POPOVER_SC,
    isFetching
  };
};

export const setFetchingPopOverLogs = (isFetching) => {
  return {
    type: types.SET_FETCHING_POPOVER_LOGS,
    isFetching
  };
};

export const setTotalAmountOfUsers = (usersLength) => {
  return {
    type: types.SET_TOTAL_AMOUNT_OF_USERS,
    usersLength
  };
};

export const setUserLogs = (logs)=> {
  return {
    type: types.SET_LOGS,
    logs
  }
};

export const setTotalAmountOfLogs = (total)=> {
  return {
    type: types.SET_TOTAL_LOGS,
    total
  }
};

export const setFetchingLogs = (isFetching)=> {
  return {
    type: types.SET_FETCHING_LOGS,
    isFetching
  }
};

export const setShowOverlayAddUser = (flag) => {
  return {
    type: types.SET_SHOW_OVERLAY_ADDUSER,
    flag
  }
};

// add and delete

export const addHiringClientTag = (tag) => {
  return {
    type: types.ADD_HIRINGCLIENT_TAG,
    value: tag.text,
    id: tag.id
  };
};

export const addSubContractorTag = (tag) => {
  return {
    type: types.ADD_SUBCONTRACTOR_TAG,
    value: tag.text,
    id: tag.id
  };
};

export const deleteHCTag = (id) => {
  return {
    type: types.DELETE_HIRINGCLIENT_TAG,
    id
  };
};

export const deleteSCTag = (id) => {
  return {
    type: types.DELETE_SUBCONTRACTOR_TAG,
    id
  };
};

export const fetchUsersHiringClientsAndOrSubcontractors = (userId) => {
  return (dispatch, getState) => {
    const { login, localization } = getState();
    let {
      error10005,
      error10006,
      error10007,
      error10011,
      errorDefault,
      errorConnection,
    } = localization.strings.users.actions;

    dispatch(setFetchingPopOverHC(true));

    const token = login.authToken;
    let urlQuery = `users/hiringClientsAndOrSubcontractors?userId=${userId}`;
    return Api.get(urlQuery, token)
    .then(response => {
      const { success, data } = response.data;
      let errorMsg = '';
      if(success) {
        // console.log('fetchUsersHiringClientsAndOrSubcontractors response.data = ', response.data)

        if (data.hiringClients && data.hiringClients.length > 0) {
          dispatch(setHiringClientsTags(data.hiringClients));
        }
        if (data.subContractors && data.subContractors.length > 0) {
          dispatch(setSubContractorsTags(data.subContractors));
        }
      }
      else {
        switch(data.errorCode) {
          case 10005:
            errorMsg = error10005;
          break;
          case 10006:
            errorMsg = error10006;
            break;
          case 10007:
            errorMsg = error10007;
            break;
          case 10011:
            errorMsg = error10011;
            break;
          default:
            errorMsg = errorDefault;
            break;
        }
        console.log('line 238 errorMsg = ', errorMsg)
        dispatch(setUsersListError(errorMsg));
      }
      dispatch(setFetchingPopOverHC(false));
    })
    .catch(error => {
      console.log('line 238 error = ', error)
      dispatch(setUsersListError(errorConnection));
    });
  };
};

export const fetchHiringClients = (id, subcontractorId) => {
  return (dispatch, getState) => {
    const { login, localization } = getState();
    let {
      error10005,
      error10006,
      error10007,
      error10011,
      errorDefault,
      errorConnection,
    } = localization.strings.users.actions;
    const {allHC} = localization.strings.users.reducer;
    const token = login.authToken;
    let urlQuery = 'hiringclients';
    if(id) {
      dispatch(setFetchingPopOverHC(true));
      urlQuery = `${urlQuery}?userId=${id}`
    }
    return Api.get(urlQuery, token)
    .then(response => {
      const {success, data } = response.data;
      let errorMsg = '';
      if(success) {
        if(id) {
          dispatch(setPopoverHiringClients(data.hiringClients));
        }
        else {
          dispatch(setHiringClientsOptions(data.hiringClients, allHC));
        }
      }
      else {
        switch(data.errorCode) {
          case 10005:
            errorMsg = error10005;
          break;
          case 10006:
            errorMsg = error10006;
            break;
          case 10007:
            errorMsg = error10007;
            break;
          case 10011:
            errorMsg = error10011;
            break;
          default:
            errorMsg = errorDefault;
            break;
        }
        console.log('line 238 errorMsg = ', errorMsg)
        dispatch(setUsersListError(errorMsg));
        if(id) {
          dispatch(setPopoverHiringClients([]));
        }
      }
      dispatch(setFetchingPopOverHC(false));
    })
    .catch(error => {
      console.log('line 238 error = ', error)
      dispatch(setUsersListError(errorConnection));
    });
  };
};

export const fetchSubContractorsByKeyword = (keyword) => {
  return (dispatch, getState) => {
    const { login, localization } = getState();
    let {
      error10005,
      error10006,
      error10007,
      error10011,
      errorDefault,
      errorConnection,
    } = localization.strings.users.actions;
    const { select } = localization.strings.users.reducer;
    const token = login.authToken;
  
    return Api.get(`subcontractors_by_keyword?keyword=${keyword}`, token)
    .then(response => {
      const { success, data } = response.data;
      console.log('data = ', data)
      let errorMsg = '';
      if(success) {
        dispatch(setSubcontractorOptions(data.subContractors, select))  ;
      }
      else {
        switch(data.errorCode) {
          case 10005:
            errorMsg = error10005;
          break;
          case 10006:
            errorMsg = error10006;
            break;
          case 10007:
            errorMsg = error10007;
            break;
          case 10011:
            errorMsg = error10011;
            break;
          default:
            errorMsg = errorDefault;
            break;
        }
        console.log('line 238 errorMsg = ', errorMsg)
        dispatch(setUsersListError(errorMsg));
      }
      dispatch(setFetchingPopOverSC(false));
    })
    .catch(error => {
      console.log('line 309 error = ', error)
      dispatch(setUsersListError(errorConnection));
    });
  };
};

export const fetchSubContractorsForPopover = (id) => {
  return (dispatch, getState) => {
    const { login, localization } = getState();
    let {
      error10005,
      error10006,
      error10007,
      error10011,
      errorDefault,
      errorConnection,
    } = localization.strings.users.actions;
    const token = login.authToken;

    dispatch(setFetchingPopOverSC(true));

    return Api.get(`subcontractors/popover?userId=${id}`, token)
    .then(response => {
      const {success, data } = response.data;
      let errorMsg = '';
      if(success) {
        dispatch(setPopoverSubcontractors(data.subContractors));
      }
      else {
        switch(data.errorCode) {
          case 10005:
            errorMsg = error10005;
          break;
          case 10006:
            errorMsg = error10006;
            break;
          case 10007:
            errorMsg = error10007;
            break;
          case 10011:
            errorMsg = error10011;
            break;
          default:
            errorMsg = errorDefault;
            break;
        }
        console.log('line 405 errorMsg = ', errorMsg)
        dispatch(setUsersListError(errorMsg));
        dispatch(setPopoverSubcontractors([]));
      }
      dispatch(setFetchingPopOverSC(false));
    })
    .catch(error => {
      console.log('line 412 error = ', error)
      dispatch(setUsersListError(errorConnection));
    });
  };
};

export const fetchSubContractors = (id) => {
  return (dispatch, getState) => {
    const { login, localization } = getState();
    let {
      error10005,
      error10006,
      error10007,
      error10011,
      errorDefault,
      errorConnection,
    } = localization.strings.users.actions;
    const {allSC} = localization.strings.users.reducer;
    const token = login.authToken;
    let urlQuery = 'subcontractors';
    if(id) {
      dispatch(setFetchingPopOverSC(true));
      urlQuery = `${urlQuery}?userId=${id}`
    }
    return Api.get(urlQuery, token)
    .then(response => {
      const {success, data } = response.data;
      let errorMsg = '';
      if(success) {
        if(id) {
          dispatch(setPopoverSubcontractors(data.subContractors));
        }
        else {
          dispatch(setSubcontractorOptions(data.subContractors, allSC))  ;
        }
      }
      else {
        switch(data.errorCode) {
          case 10005:
            errorMsg = error10005;
          break;
          case 10006:
            errorMsg = error10006;
            break;
          case 10007:
            errorMsg = error10007;
            break;
          case 10011:
            errorMsg = error10011;
            break;
          default:
            errorMsg = errorDefault;
            break;
        }
        console.log('line 238 errorMsg = ', errorMsg)
        dispatch(setUsersListError(errorMsg));
        if(id) {
          dispatch(setPopoverSubcontractors([]));
        }
      }
      dispatch(setFetchingPopOverSC(false));
    })
    .catch(error => {
      console.log('line 309 error = ', error)
      dispatch(setUsersListError(errorConnection));
    });
  };
};

export const fetchLogs = (query_params) => {
  return (dispatch, getState) => {
    const { login, localization } = getState();
    let {
      error10005,
      error10006,
      error10007,
      error10011,
      errorDefault,
      errorConnection,
    } = localization.strings.users.actions;
    const token = login.authToken;
    let queryParams = {...query_params};
    if(queryParams.userId) {
      dispatch(setFetchingPopOverLogs(true));
    } else {
      dispatch(setTotalAmountOfLogs(0));
      dispatch(setFetchingLogs(true))
    }

    if(queryParams) {
      if(!queryParams.pageNumber) {
        queryParams.pageNumber = 1;
      }
    }
    else {
      queryParams = {
        pageNumber: 1
      };
    }
    queryParams.pageSize = getState().users.logsPerPage;


    let payload = queryParams
    return Api.post(
      'getLog',
      payload,
      token)
    .then(response => {
      const { data } = response.data;
      let errorMsg = '';
      if(data.totalCount === 0) {
        dispatch(setPopoverLogs(data.logEntries));
      } else if(data.totalCount > 0) {
        dispatch(setTotalAmountOfLogs(data.totalCount));
        dispatch(setUserLogs(data.logEntries));
      }
      else {
        switch(data.errorCode) {
          case 10005:
            errorMsg = error10005;
          break;
          case 10006:
            errorMsg = error10006;
            break;
          case 10007:
            errorMsg = error10007;
            break;
          case 10011:
            errorMsg = error10011;
            break;
          default:
            errorMsg = errorDefault;
            break;
        }
        dispatch(setUsersListError(errorMsg));
        dispatch(setTotalAmountOfLogs(0));
        dispatch(setUserLogs([]));
      }
      dispatch(setFetchingPopOverLogs(false));
      dispatch(setFetchingLogs(false));
    })
    .catch(error => {
      dispatch(setUsersListError(errorConnection));
    });
  };
};

export const fetchUsers = (queryParams) => {
  return (dispatch, getState) => {
    const { login, localization } = getState();
    let {
      error10003,
      error10005,
      error10006,
      error10007,
      error10011,
      errorDefault,
      errorConnection
    } = localization.strings.users.actions;
    const labels = localization.strings.users.reducer;
    const token = login.authToken;
    let urlParameters = '';

    dispatch(setFetchingUsers(true));
    dispatch(setTotalAmountOfUsers(0));
    // console.log('data.totalCount in Actions (407) = ', 0)

    if(queryParams) {
      if (queryParams.withoutPagination) {
        delete queryParams.pageNumber;
        delete queryParams.pageSize;
      } else {
        queryParams.withoutPagination = false;
        if(!queryParams.pageNumber) {
          queryParams.pageNumber = 1;
        }
        if(!queryParams.orderBy) {
          queryParams.orderBy = 'name';
        }
        queryParams.pageSize = getState().users.usersPerPage;
      }
    }
    else {
      queryParams = {
        pageNumber: 1,
        orderBy: 'name',
        pageSize: getState().users.usersPerPage
      };
    }
    urlParameters = `?${Object.keys(queryParams).map(i => `${i}=${queryParams[i]}`).join('&')}`;
    return Api.get(`users${urlParameters}`, token)
    .then(response => {
      const { success, data } = response.data;
      let errorMsg = '';
      if(success) {

        if (queryParams.associatedOnly || queryParams.admin) {
          dispatch(setTotalAmountOfUsers(data.totalCount));
          // console.log('data.totalCount in Actions (441) = ', data.totalCount)
          dispatch(setUsersList(data.users, labels));
        } else {
          dispatch(setUsersNpqList(data.users, labels));
        }
      }
      else {
        switch(data.errorCode) {
          case 10003:
            errorMsg = error10003;
            break;
          case 10005:
            errorMsg = error10005;
            break;
          case 10006:
            errorMsg = error10006;
            break;
          case 10007:
            errorMsg = error10007;
            break;
          case 10011:
            errorMsg = error10011;
            break;
          default:
            errorMsg = errorDefault;
            break;
        }
        dispatch(setUsersListError(errorMsg));
        if (queryParams.associatedOnly) {
          dispatch(setTotalAmountOfUsers(0));
          dispatch(setUsersList([], labels));
        } else {
          dispatch(setUsersNpqList([], labels));
        }

      }
      dispatch(setFetchingUsers(false));
    })
    .catch(error => {
      dispatch(setUsersListError(errorConnection));
    });
  };
};

export const setNPQlistToZero = () => {
  return (dispatch, getState) => {
    const { localization } = getState();
    const labels = localization.strings.users.reducer;
    dispatch(setUsersNpqList([], labels));
  }
}

// submits

export const sendUser = (values, closeModal, editUserId) => {

  return (dispatch, getState) => {
    const { login, localization } = getState();

    let {
      error10001,
      error10003,
      error10004,
      error10005,
      error10006,
      error10007,
      error10008,
      error10011,
      error10013,
      error10014,
      errorDefault,
      errorConnection,
    } = localization.strings.users.actions;

    const token = login.authToken;
    let method = 'post';
    dispatch(setUsersListError(''));

    let payload = {
      roleId: `${values.role}`,
      CFRoleId: `${values.cfRole}`,
      firstName: values.firstName,
      lastName: values.lastName,
      mail: values.email,
      password: values.password,
      phone: Utils.normalizePhoneNumber(values.phone),
      mustRenewPass: (values.changeuponlogin ? 1 : 0) + '',
      timeZoneId: (parseInt(values.timezone, 10) || 0) + '',
      subContractorId: values.subContractorId,
      HiringClientId: values.HiringClientId,
      HiringClientsMultiple: values.HiringClientsMultiple,
      SubcontractorsMultiple: values.SubcontractorsMultiple
      // HiringClientsMultiple[i].id
    };

    if(editUserId) {
      payload.id = editUserId + '';
      method = 'put';
    }

    // console.log('payload = ', payload)
    // console.log('method = ', method)

    return Api[method](
      `users/profile`,
      payload,
      token)
    .then(response => {
      // console.log('response = ', response)
      const { success, data } = response.data;
      let errorMsg = '';
      if(success) {
        closeModal(success, data);
      } else {
        switch(data.errorCode) {
          case 10000:
          case 10001:
            errorMsg = error10001;
          break;
          case 10003:
            errorMsg = error10003;
          break;
          case 10004:
            errorMsg = error10004;
          break;
          case 10005:
            errorMsg = error10005;
          break;
          case 10006:
            errorMsg = error10006;
            break;
          case 10007:
            errorMsg = error10007;
            break;
          case 10008:
            errorMsg = error10008;
            break;
          case 10011:
            errorMsg = error10011;
            break;
          case 10013:
            errorMsg = error10013;
            break;
          case 10014:
            errorMsg = error10014;
            break;
          default:
            errorMsg = errorDefault;
            break;
        }
        dispatch(setUsersListError(errorMsg));
        console.log('success -> false, err: ', errorMsg)
        closeModal();
      }
    })
    .catch(error => {
      dispatch(setUsersListError(errorConnection));
      console.log('success -> false, err: ', error)
      closeModal();
    });
  };
}

/* Support log user */
export const setLogUsers = (logUsers) => {
  return {
    type: types.SET_LOG_USERS,
    logUsers
  };
};
export const fetchLogUsers = () => {
  return (dispatch, getState) => {
    const token = getState().login.authToken;
    return Api.get(
      `log/users`,
      token
    ).then(response => {
      const {success, data } = response.data;
      if (success && data) {
        dispatch(setLogUsers(data));
      }
    })
    .catch(error => {
      console.log(error);
    });
  };
}

/* Support log modules */
export const setLogModules = (logModules) => {
  return {
    type: types.SET_LOG_MODULES,
    logModules
  };
};
export const fetchLogModules = () => {
  return (dispatch, getState) => {
    const token = getState().login.authToken;
    return Api.get(
      `log/modules`,
      token
    ).then(response => {
      const {success, data } = response.data;
      if (success && data) {
        dispatch(setLogModules(data));
      }
    })
    .catch(error => {
      console.log(error);
    });
  };
}

export const toggleHolderUserStatus = (params) => {
  return (dispatch, getState) => {
    const token = getState().login.authToken;
    const method = 'put';
    const payload = {
      holderId: params.holderId,
      userId: params.userId,
    };
    return Api[method](`cf/holders/user/status`, payload, token)
      .then(response => {
        const {success, data} = response.data;
        if (success) {
          return data.statusChanged;
        }
        return false;
      })
      .catch(error => {
        return false;
      });
  }
};