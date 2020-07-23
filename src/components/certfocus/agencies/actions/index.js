import * as types from './types';
import Api from '../../../../lib/api';
import Utils from '../../../../lib/utils';

// SETS
export const setAgenciesListError = (error) => {
  return {
    type: types.SET_AGENCIES_LIST_ERROR,
    payload: error
  };
};
export const setAgenciesList = (list, totalAmount) => {
  return {
    type: types.SET_AGENCIES_LIST,
    payload: {
      list,
      totalAmount
    }
  };
};
export const setFetchingAgencies = () => {
  return {
    type: types.SET_FETCHING_AGENCIES
  };
};
export const setShowModal = (show) => {
  return {
    type: types.SET_SHOW_AGENCIES_MODAL,
    payload: show
  }
}

// FETCH
export const fetchAgencies = (queryParams) => {
  return (dispatch, getState) => {
    const { login, localization, agencies } = getState();
    const { errorDefault, errorConnection } = localization.strings.projectInsureds.errors;
    const { authToken } = login;
    const { agenciesPerPage } = agencies;
    
    dispatch(setFetchingAgencies());

    if (queryParams) {
      if (!queryParams.pageNumber) {
        queryParams.pageNumber = 1;
      }
      queryParams.pageSize = agenciesPerPage;
    } else {
      queryParams = {
        pageNumber: 1,
        pageSize: agenciesPerPage
      };
    }
    const urlParameters = `?${Object.keys(queryParams).map(i => `${i}=${queryParams[i]}`).join('&')}`;
    const urlQuery = `cf/agencies`;
       
    return Api.get(`${urlQuery}${urlParameters}`, authToken)
      .then(response => {
        const { success, data} = response.data;
        if (success) {
          dispatch(setAgenciesList(data.agencies || [], data.totalCount || 0));
        }
        else {
          dispatch(setAgenciesListError(errorDefault));
        }
      })
      .catch(error => {
        dispatch(setAgenciesListError(errorConnection));
      });
  };
};

export const postAgency = (agency, callback) => {
  return (dispatch, getState) => {
    const { login, localization } = getState();
    const {
      error10000,
      error10001,
      error10003,
      error10005,
      error10006,
      error10007,
      error10025,
      errorDefault,
      errorConnection,
    } = localization.strings.certFocusProjects.errors;

    const errors = {
      10000: error10000,
      10001: error10001,
      10003: error10003,
      10005: error10005,
      10006: error10006,
      10007: error10007,
      100025: error10025,
    }
    const token = login.authToken;
    let apiMethod;

    if (agency.agencyId) {
      apiMethod = 'put';
    } else {
      apiMethod = 'post';
    }

    return Api[apiMethod](`cf/agencies`, agency, token)
      .then(response => {
        const { success, data } = response.data;     
        if (success) {
          callback(data);
        } else {
          const errorMsg = errors[data.errorCode] || errorDefault;
          callback(null);
        }
      })
      .catch(() => {
        callback(null);
      });
  };
}


// SETS
export const setAgentsListError = (error) => {
  return {
    type: types.SET_AGENTS_LIST_ERROR,
    payload: error
  };
};
export const setAgentsList = (list, totalAmount) => {
  return {
    type: types.SET_AGENTS_LIST,
    payload: {
      list,
      totalAmount
    }
  };
};
export const setFetchingAgents = () => {
  return {
    type: types.SET_FETCHING_AGENTS
  };
};
export const setShowAgentsModal = (show) => {
  return {
    type: types.SET_SHOW_AGENTS_MODAL,
    payload: show
  }
}
export const setShowAddAgentsModal = (show) => {
  return {
    type: types.SET_SHOW_ADD_AGENTS_MODAL,
    payload: show
  }
}

// FETCH
export const fetchAgents = (queryParams) => {
  return (dispatch, getState) => {
    const { login, localization, agencies } = getState();
    const { errorDefault, errorConnection } = localization.strings.projectInsureds.errors;
    const { authToken } = login;
    const { agentsPerPage } = agencies;
    
    dispatch(setFetchingAgents());

    if (queryParams) {
      if (!queryParams.pageNumber) {
        queryParams.pageNumber = 1;
      }
      queryParams.pageSize = agentsPerPage;
    } else {
      queryParams = {
        pageNumber: 1,
        pageSize: agentsPerPage
      };
    }
    const urlParameters = `?${Object.keys(queryParams).map(i => `${i}=${queryParams[i]}`).join('&')}`;
    const urlQuery = `cf/agents`;
       
    return Api.get(`${urlQuery}${urlParameters}`, authToken)
      .then(response => {     
        const { success, data } = response.data;           
        if (success) {
          dispatch(setAgentsList(data.agents || [], data.totalCount || 0));
        }
        else {
          dispatch(setAgentsListError(errorDefault));
        }
      })
      .catch(error => {
        dispatch(setAgentsListError(errorConnection));
      });
  };
};

export const postAgent = (agent, callback) => {
  return (dispatch, getState) => {
    const { login, localization } = getState();
    const {
      error10000,
      error10001,
      error10003,
      error10005,
      error10006,
      error10007,
      error10025,
      errorDefault,
      errorConnection,
    } = localization.strings.certFocusProjects.errors;

    const errors = {
      10000: error10000,
      10001: error10001,
      10003: error10003,
      10005: error10005,
      10006: error10006,
      10007: error10007,
      100025: error10025,
    }
    const token = login.authToken;
    let apiMethod;

    if (agent.agentId) {
      apiMethod = 'put';
    } else {
      apiMethod = 'post';
    }

    return Api[apiMethod](`cf/agents`, agent, token)
      .then(response => {
        const { success, data } = response.data;        
        if (success) {
          callback(data);
        } else {
          const errorMsg = errors[data.errorCode] || errorDefault;
          callback(null);
        }
      })
      .catch(() => {
        callback(null);
      });
  };
}