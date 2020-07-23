import axios from 'axios';
import * as types from './types';
import Api from '../../../lib/api';

export const toggleSideBar = (toggled) => {
  return {
    type: types.TOGGLE_SIDEBAR,
    toggled
  };
};

export const setLoading = (loading) => {
  return {
    type: types.SET_LOADING,
    loading
  }
}

export const setHeaderTitle = (headerTitle) => {
  return {
    type: types.SET_HEADER_TITLE,
    headerTitle
  }
}

export const changeHCname = (payload, callback) => {
  return (dispatch, getState) => {
    const token = getState().login.authToken;

    return Api.post(
      `/hiringclients/updateName`,
      payload,
      token
    ).then(response => {
      //console.log(response.data);
      const {success} = response.data;
      if (callback) callback(success);
    })
      .catch(error => {
        console.log(error);
        if (callback) callback(false);
      });
  };
}

export const fetchFunctions = () => {
  return (dispatch, getState) => {
    const token = getState().login.authToken;
    return Api.get(`functions`, token)
      .then(response => {
        const {success, data} = response.data;
        let errorMsg = '';
        if (success) {
          dispatch({type: types.SET_FUNCTIONS, functions: data.functions})
        } else {
          switch (data.errorCode) {
            case 10003:
              errorMsg = 'Error: invalid filter data. Please, adjust the filters values and try again.';
              break;
            case 10005:
              errorMsg = 'Error: This is an invalid session. Please, sign in again.';
              break;
            case 10006:
              errorMsg = 'Error: You are not logged in. Please, sign in and try again.';
              break;
            case 10007:
              errorMsg = 'Error: Session expired. Please, sign in and try again.';
              break;
            case 10011:
              errorMsg = 'Error: your current form is disabled. Please, contact an admin to enable this account and login again to continue.';
              break;
            default:
              errorMsg = '';
              break;
          }
          console.log(errorMsg);
          //dispatch(setFormsListError(errorMsg));
        }
      })
      .catch(error => {
        // dispatch(setFormsListError('Connection error - Please, check your Internet service.'));
      });
  };
};

export const checkPermission = (permissionId, history) => {
  return (dispatch, getState) => {
    const token = getState().login.authToken;
    dispatch(setLoading(true));
    Api.get(`functions/authorization?userId=${getState().login.profile.Id}&functionId=${permissionId}`, token).then((response) => {
      dispatch(setLoading(false));
      const {isAuthorized, success} = response.data;
      if (!isAuthorized || !success) {
        history.push('/dashboard')
      }
    })
  }
}

export const checkUserPermission = (functionName, callback) => {
  return (dispatch, getState) => {

    const token = getState().login.authToken;
    const {userId} = getState().login

    if (functionName && userId) {
      dispatch(setLoading(true));
      Api.get(`functions/check?userId=${userId}&functionName=${functionName}`, token).then((response) => {
        dispatch(setLoading(false));
        const {isAuthorized, success} = response.data;
        callback(isAuthorized);
      })
    }
    return false
  }
}

/* authorizations support */
export const setCheckingAuthorizations = (checkingAuthorizations) => {
  return {
    type: types.SET_CHECKING_AUTHORIZATIONS,
    checkingAuthorizations
  }
}

export const setAuthorizations = (authorizations) => {
  const {usersAuth, formBuilderAuth, commTempAuth} = authorizations;
  return {
    type: types.SET_AUTHORIZATIONS,
    usersAuth,
    formBuilderAuth,
    commTempAuth
  }
}

export const checkUserAuthorizations = () => {
  return (dispatch, getState) => {
    const token = getState().login.authToken;
    const userId = getState().login.profile.Id;
    dispatch(setCheckingAuthorizations(true));
    dispatch(setLoading(true));
    const usersFuncId = 32;
    const formBuilderFuncId = 17;
    const commTempFuncId = 35;
    let usersAuth = false;
    let formBuilderAuth = false;
    let commTempAuth = false;
    Api.get(`functions/authorization?userId=${userId}&functionId=${usersFuncId}`, token).then((uRes) => {
      //console.log(uRes.data);
      usersAuth = uRes.data.isAuthorized;
      Api.get(`functions/authorization?userId=${userId}&functionId=${formBuilderFuncId}`, token).then((fbRes) => {
        //console.log(fbRes.data);
        formBuilderAuth = fbRes.data.isAuthorized;
        Api.get(`functions/authorization?userId=${userId}&functionId=${commTempFuncId}`, token).then((ctRes) => {
          //console.log(ctRes.data);
          commTempAuth = ctRes.data.isAuthorized;
          dispatch(setAuthorizations({usersAuth, formBuilderAuth, commTempAuth}));
          dispatch(setCheckingAuthorizations(false));
          dispatch(setLoading(false));
        });
      });
    });
  }
}

/* Notifications support */
export const setHeaderNotifications = (notifications) => {
  return {
    type: types.SET_HEADER_NOTIFICATIONS,
    notifications
  };
};
export const fetchNotifications = () => {
  return (dispatch, getState) => {
    const {login} = getState();
    const token = login.authToken;

    return Api.get('notifications', token)
      .then(response => {
        const {success, notificationsCount} = response.data;
        if (success) {
          dispatch(setHeaderNotifications(notificationsCount || 0));
        }
      })
      .catch(error => {
        console.log(error);
      });
  };
};
export const updateNotificationsStatus = (payload = {}) => {
  return (dispatch, getState) => {
    const token = getState().login.authToken;

    return Api.post(
      `notifications`,
      payload,
      token
    ).then(response => {
      const {success} = response.data;

      if (success) {
        dispatch(setHeaderNotifications(0));
      }

    }).catch(error => {
      console.log(error);
    });

  };
}

/* User HC support */
export const setFetchingUserHCs = (fetchingUserHCs) => {
  return {
    type: types.SET_FETCHING_USER_HCS,
    fetchingUserHCs
  };
};
export const setUserHiringClients = (userHiringClients) => {
  return {
    type: types.SET_USER_HIRING_CLIENTS,
    userHiringClients
  };
};
export const fetchUserHiringClients = (system) => {
  return (dispatch, getState) => {
    const {login} = getState();
    const token = login.authToken;
    dispatch(setFetchingUserHCs(true));
    dispatch(setUserHiringClients([]));

    let params = 'summary=true';
    if (system) params += `&system=${system}`

    return Api.get(`hiringclients?${params}`, token)
      .then(response => {
        //console.log(response.data);
        const {success, data} = response.data;
        if (success) {
          dispatch(setUserHiringClients(data.hiringClients || []));
        }
        dispatch(setFetchingUserHCs(false));
      })
      .catch(error => {
        console.log(error);
        dispatch(setFetchingUserHCs(false));
      });
  };
};

//Timezones
export const setTimezones = (timezones) => {
  return {
    type: types.SET_TIMEZONES,
    timezones
  };
};
export const fetchTimezones = () => {
  return (dispatch, getState) => {
    const {login} = getState();
    const token = login.authToken;

    return Api.get('/timezones', token)
      .then(response => {
        const {success, data} = response.data;
        if (success) {
          dispatch(setTimezones(data.timeZones || []));
        }
      })
      .catch(error => {
        console.log(error);
      });
  };
};

/* Save last HC and SC */
export const setLastHiringClient = (hiringClientId) => {
  return {
    type: types.SET_LAST_HIRING_CLIENT_ID,
    hiringClientId
  };
}

export const setLastSubcontractor = (subcontractorId) => {
  return {
    type: types.SET_LAST_SUBCONTRACTOR_ID,
    subcontractorId
  };
}

/* Support for Countries */
export const setCountries = (countries) => {
  return {
    type: types.SET_COUNTRIES,
    countries
  };
};
export const fetchCountries = () => {
  return (dispatch, getState) => {
    const token = getState().login.authToken;
    return Api.get(
      `cf/countries`,
      token
    ).then(response => {
      const {success, data} = response.data;
      if (success && data) {
        dispatch(setCountries(data.countries || []));
      }
    })
      .catch(error => {
        console.log(error);
      });
  };
}

/* Support for US Sates */
export const setUSStates = (usStates) => {
  return {
    type: types.SET_US_STATES,
    usStates
  };
};
export const fetchUSStates = () => {
  return (dispatch, getState) => {
    const token = getState().login.authToken;
    return Api.get(
      `cf/states`,
      token
    ).then(response => {
      const {success, data} = response.data;
      if (success && data) {
        dispatch(setUSStates(data.states || []));
      }
    })
      .catch(error => {
        console.log(error);
      });
  };
}

// Projects statuses
export const setProjectStatus = (data) => {
  return {
    type: types.SET_COMMON_PROJECT_STATUS,
    payload: data
  };
};
export const fetchProjectStatus = () => {
  return (dispatch, getState) => {
    const {login: {authToken}} = getState();

    return Api.get('projects/status', authToken)
      .then(response => {
        const {success, projectsStatusList} = response.data;
        if (success) {
          dispatch(setProjectStatus(projectsStatusList ? projectsStatusList : []));
        }
      })
      .catch(error => {
        console.log(error);
      });
  };
};

// Compliance statuses
export const setComplianceStatus = (data) => {
  return {
    type: types.SET_COMMON_COMPLIANCE_STATUS,
    payload: data
  };
};
export const fetchComplianceStatus = () => {
  return (dispatch, getState) => {
    const {login: {authToken}} = getState();

    return Api.get('cf/projectInsuredComplianceStatus', authToken)
      .then(response => {
        const {success, data} = response.data;
        if (success) {
          dispatch(setComplianceStatus(data ? data : []));
        }
      })
      .catch(error => {
        console.log(error);
      });
  };
};

// Data Entry Options
export const setDataEntryOptions = (data) => {
  return {
    type: types.SET_COMMON_HOLDER_DATA_ENTRY_OPTIONS,
    payload: data
  };
};
export const fetchDataEntryOptions = () => {
  return (dispatch, getState) => {
    const {login: {authToken}} = getState();

    return Api.get('cf/holderSettingsDataEntryOptions', authToken)
      .then(response => {
        const {success, data} = response.data;
        if (success) {
          dispatch(setDataEntryOptions(data ? data : []));
        }
      })
      .catch(error => {
        console.log(error);
      });
  };
};

// Certificate Options
export const setCertificateOptions = (data) => {
  return {
    type: types.SET_COMMON_HOLDER_CERTIFICATE_OPTIONS,
    payload: data
  };
};
export const fetchCertificateOptions = () => {
  return (dispatch, getState) => {
    const {login: {authToken}} = getState();

    return Api.get('cf/holderSettingsCertificateOptions', authToken)
      .then(response => {
        const {success, data} = response.data;
        if (success) {
          dispatch(setCertificateOptions(data ? data : []));
        }
      })
      .catch(error => {
        console.log(error);
      });
  };
};

// Type Ahead and search
export const setTypeAheadFetching = () => ({
  type: types.SET_TYPE_AHEAD_FETCHING
});
export const setTypeAheadResults = result => ({
  type: types.SET_TYPE_AHEAD_SUCCESS,
  payload: result
});
export const setTypeAheadError = error => ({
  type: types.SET_TYPE_AHEAD_ERROR,
  payload: error
});
export const resetTypeAheadResults = () => {
  return {
    type: types.RESET_TYPE_AHEAD_RESULTS
  }
};
const CancelToken = axios.CancelToken;
let source = null;

export const fetchTypeAhead = (queryParams) => {
  return (dispatch, getState) => {
    const {login, localization} = getState();
    const {
      errorConnection,
    } = localization.strings.common.typeAheadErrors;
    const token = login.authToken;

    dispatch(setTypeAheadFetching(true));

    // cancel current request if any
    if (source) {
      source.cancel("typeAheadCanceled");
      source = null;
    }
    // create new token
    if (!source) {
      source = CancelToken.source();
    }

    // get user id
    return Api.get(`users/profile`, token, source.token).then((response) => {
      const id = response.data.data.profile.Id;
      //get hiring clients
      Api.get(`cf/holders?userId=${id}&${Object.keys(queryParams).map(i => `${i}=${queryParams[i]}`).join('&')}`, token, source.token)
        .then(response => {
          const {success, data} = response.data;
          source = null;

          if (success) {
            dispatch(setTypeAheadResults(data.holders));
          } else {
            const errorMsg = getTypeAheadErrors(data.errorCode, localization);
            dispatch(setTypeAheadError(errorMsg));
          }
        })
        .catch((err) => {
          if (err.message !== 'typeAheadCanceled') {
            dispatch(setTypeAheadError(errorConnection));
          }
        });
    }).catch((err) => {
      if (err.message !== 'typeAheadCanceled') {
        dispatch(setTypeAheadError(errorConnection));
      }
    });
  };
};

const getTypeAheadErrors = (errorCode, localization) => {
  let {
    error10005, error10006, error10007,
    error10011, error10019, errorDefault,
  } = localization.strings.common.typeAheadErrors;
  let errorMsg = '';

  switch (errorCode) {
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
    case 10019:
      errorMsg = error10019;
      break;
    default:
      errorMsg = errorDefault;
      break;
  }

  return errorMsg;
}


export const setCurrentPage = (currentPage) => {
  return {
    type: types.SET_INIT_CURRENT_PAGE,
    payload: currentPage
  };
};

export const addChildToParent = (child) => {
  return {
    type: types.SET_CHILD_TO_PARENT,
    payload: child
  };
}

export const addPage = (page) => {
  return {
    type: types.ADD_CURRENT_PAGE,
    payload: page
  };
}

export const setBreadcrumbItems = (breadcrumbItems) => {
  return {
    type: types.SET_BREADCRUMB_ITEMS,
    payload: breadcrumbItems
  };
}

export const fetchUsersTypeAhead = (queryParams) => {
  console.log('search users')
  return (dispatch, getState) => {
    const {login, localization} = getState();
    const {
      errorConnection,
    } = localization.strings.common.typeAheadErrors;
    const token = login.authToken;

    dispatch(setTypeAheadFetching(true));

    // cancel current request if any
    if (source) {
      source.cancel("typeAheadCanceled");
      source = null;
    }
    // create new token
    if (!source) {
      source = CancelToken.source();
    }

    //get hiring clients
    Api.get(`users/?${Object.keys(queryParams).map(i => `${i}=${queryParams[i]}`).join('&')}`, token, source.token)
      .then(response => {
        const {success, data} = response.data;
        source = null;
        if (success) {
          dispatch(setTypeAheadResults(data.users));
        } else {
          const errorMsg = getTypeAheadErrors(data.errorCode, localization);
          dispatch(setTypeAheadError(errorMsg));
        }
      })
      .catch((err) => {
        if (err.message !== 'typeAheadCanceled') {
          dispatch(setTypeAheadError(errorConnection));
        }
      });
  };
}

export const fetchInsuredsTypeAhead = (queryParams) => {
  return (dispatch, getState) => {
    const {login, localization} = getState();
    const {
      errorConnection,
    } = localization.strings.common.typeAheadErrors;
    const token = login.authToken;

    dispatch(setTypeAheadFetching(true));

    // cancel current request if any
    if (source) {
      source.cancel("typeAheadCanceled");
      source = null;
    }
    // create new token
    if (!source) {
      source = CancelToken.source();
    }

    const urlParameters = `?${Object.keys(queryParams).map(i => `${i}=${queryParams[i]}`).join('&')}`;
    const urlQuery = 'cf/insureds';

    return Api.get(`${urlQuery}${urlParameters}`, token)
      .then(response => {
        const {success, data} = response.data;
        source = null;

        if (success) {
          dispatch(setTypeAheadResults(data));
        } else {
          const errorMsg = getTypeAheadErrors(data.errorCode, localization);
          dispatch(setTypeAheadError(errorMsg));
        }
      })
      .catch((err) => {
        if (err.message !== 'typeAheadCanceled') {
          dispatch(setTypeAheadError(errorConnection));
        }
      });
  };
}

export const fetchProjectInsuredTypeAhead = (queryParams) => {
  return (dispatch, getState) => {
    const {login, localization} = getState();
    const {
      errorConnection,
    } = localization.strings.common.typeAheadErrors;
    const token = login.authToken;

    dispatch(setTypeAheadFetching(true));

    // cancel current request if any
    if (source) {
      source.cancel("typeAheadCanceled");
      source = null;
    }
    // create new token
    if (!source) {
      source = CancelToken.source();
    }

    const urlParameters = `?${Object.keys(queryParams).map(i => `${i}=${queryParams[i]}`).join('&')}`;
    const urlQuery = 'cf/projectInsureds';

    return Api.get(`${urlQuery}${urlParameters}`, token)
      .then(response => {
        const {success, projectInsureds} = response.data;
        source = null;

        if (success) {
          dispatch(setTypeAheadResults(projectInsureds));
        } else {
          const errorMsg = getTypeAheadErrors(projectInsureds.errorCode, localization);
          dispatch(setTypeAheadError(errorMsg));
        }
      })
      .catch((err) => {
        if (err.message !== 'typeAheadCanceled') {
          dispatch(setTypeAheadError(errorConnection));
        }
      });
  };
}