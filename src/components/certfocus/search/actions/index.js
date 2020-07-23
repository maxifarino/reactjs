import * as types from './types';
import Api from '../../../../lib/api';
import Utils from '../../../../lib/utils';

/* STATES */
export const setFetchingStates = (isFetching) => {
  return {
    type: types.SET_FETCHING_STATES,
    payload: {
      isFetching
    }
  };
};
export const setStatesList = (list) => {
  return {
    type: types.SET_STATES_LIST,
    payload: {
      list
    }
  };
};
export const setStatesListError = (error) => {
  return {
    type: types.SET_STATES_LIST_ERROR,
    payload: {
      error
    }
  };
};
export const fetchStates = () => {
  return (dispatch, getState) => {
    const { login, localization } = getState();
    const { errorDefault, errorConnection } = localization.strings.hiringClients.actions;
    const { authToken } = login;
    const queryParams = {}

    dispatch(setFetchingStates(true));
    dispatch(setStatesListError(null));
    dispatch(setStatesList([]));

    const urlParameters = Utils.getUrlParameters(queryParams);
    let urlQuery = `cf/states`;
    return Api.get(`${urlQuery}${urlParameters}`, authToken)
      .then(response => {
        const { success, data } = response.data;
        if(success) {
          dispatch(setStatesList(data.states));
        }
        else {
          dispatch(setStatesListError(errorDefault));
        }
        dispatch(setFetchingStates(false));
      })
      .catch(error => {
        dispatch(setStatesListError(errorConnection));
        dispatch(setFetchingStates(false));
      });
  };
};

/* COVERAGE TYPES */
export const setFetchingCoverageTypes = (isFetching) => {
  return {
    type: types.SET_FETCHING_COVERAGE_TYPES,
    payload: {
      isFetching
    }
  };
};
export const setCoverageTypesList = (list) => {
  return {
    type: types.SET_COVERAGE_TYPES_LIST,
    payload: {
      list
    }
  };
};
export const setCoverageTypesListError = (error) => {
  return {
    type: types.SET_COVERAGE_TYPES_LIST_ERROR,
    payload: {
      error
    }
  };
};
export const fetchCoverageTypes = () => {
  return (dispatch, getState) => {
    const { login, localization } = getState();
    const { errorDefault, errorConnection } = localization.strings.hiringClients.actions;
    const { authToken } = login;
    const queryParams = {}

    dispatch(setFetchingCoverageTypes(true));
    dispatch(setCoverageTypesListError(null));
    dispatch(setCoverageTypesList([]));

    const urlParameters = Utils.getUrlParameters(queryParams);
    let urlQuery = `cf/coverageTypes`;
    return Api.get(`${urlQuery}${urlParameters}`, authToken)
      .then(response => {
        const { success, data } = response.data;        
        if(success) {
          dispatch(setCoverageTypesList(data));
        }
        else {
          dispatch(setCoverageTypesListError(errorDefault));
        }
        dispatch(setFetchingCoverageTypes(false));
      })
      .catch(error => {
        dispatch(setCoverageTypesListError(errorConnection));
        dispatch(setFetchingCoverageTypes(false));
      });
  };
};


/* SEARCH INSUREDS */
export const setFetchingSearchInsureds = (isFetching) => {
  return {
    type: types.SET_FETCHING_SEARCH_INSUREDS,
    payload: {
      isFetching
    }
  };
};
export const setSearchInsuredsList = (list, total) => {
  return {
    type: types.SET_SEARCH_INSUREDS_LIST,
    payload: {
      list,
      total
    }
  };
};
export const setSearchInsuredsListError = (error) => {
  return {
    type: types.SET_SEARCH_INSUREDS_LIST_ERROR,
    payload: {
      error
    }
  };
};
export const fetchSearchInsureds = (queryParams) => {
  return (dispatch, getState) => {
    const { login, localization, search } = getState();
    const { errorDefault, errorConnection } = localization.strings.hiringClients.actions;
    const { authToken } = login;
    const { itemsPerPage } = search;
    queryParams = {...queryParams, section: 'insureds'};
    console.log(queryParams);

    dispatch(setFetchingSearchInsureds(true));
    dispatch(setSearchInsuredsListError(null));
    dispatch(setSearchInsuredsList([]));

    const urlParameters = Utils.getPaginatedUrlParameters(queryParams, itemsPerPage);
    let urlQuery = `cf/search`;
    return Api.get(`${urlQuery}${urlParameters}`, authToken)
      .then(response => {
        const { success, data, totalCount } = response.data;
        if(success) {
          dispatch(setSearchInsuredsList(data, totalCount));
        }
        else {
          dispatch(setSearchInsuredsListError(errorDefault));
        }
        dispatch(setFetchingSearchInsureds(false));
      })
      .catch(error => {
        dispatch(setSearchInsuredsListError(errorConnection));
        dispatch(setFetchingSearchInsureds(false));
      });
  };
};


/* SEARCH PROJECTS */
export const setFetchingSearchProjects = (isFetching) => {
  return {
    type: types.SET_FETCHING_SEARCH_PROJECTS,
    payload: {
      isFetching
    }
  };
};
export const setSearchProjectsList = (list, total) => {
  return {
    type: types.SET_SEARCH_PROJECTS_LIST,
    payload: {
      list,
      total
    }
  };
};
export const setSearchProjectsListError = (error) => {
  return {
    type: types.SET_SEARCH_PROJECTS_LIST_ERROR,
    payload: {
      error
    }
  };
};
export const fetchSearchProjects = (queryParams) => {
  return (dispatch, getState) => {
    const { login, localization, search } = getState();
    const { errorDefault, errorConnection } = localization.strings.hiringClients.actions;
    const { authToken } = login;
    const { itemsPerPage } = search;
    queryParams = {...queryParams, section: 'projects'};
    console.log(queryParams);

    dispatch(setFetchingSearchProjects(true));
    dispatch(setSearchProjectsListError(null));
    dispatch(setSearchProjectsList([]));

    const urlParameters = Utils.getPaginatedUrlParameters(queryParams, itemsPerPage);
    let urlQuery = `cf/search`;
    return Api.get(`${urlQuery}${urlParameters}`, authToken)
      .then(response => {
        const { success, data, totalCount } = response.data;
        console.log(data);
        if(success) {
          dispatch(setSearchProjectsList(data, totalCount));
        }
        else {
          dispatch(setSearchProjectsListError(errorDefault));
        }
        dispatch(setFetchingSearchProjects(false));
      })
      .catch(error => {
        dispatch(setSearchProjectsListError(errorConnection));
        dispatch(setFetchingSearchProjects(false));
      });
  };
};


/* SEARCH HOLDERS */
export const setFetchingSearchHolders = (isFetching) => {
  return {
    type: types.SET_FETCHING_SEARCH_HOLDERS,
    payload: {
      isFetching
    }
  };
};
export const setSearchHoldersList = (list, total) => {
  return {
    type: types.SET_SEARCH_HOLDERS_LIST,
    payload: {
      list,
      total
    }
  };
};
export const setSearchHoldersListError = (error) => {
  return {
    type: types.SET_SEARCH_HOLDERS_LIST_ERROR,
    payload: {
      error
    }
  };
};
export const fetchSearchHolders = (queryParams) => {
  return (dispatch, getState) => {
    const { login, localization, search } = getState();
    const { errorDefault, errorConnection } = localization.strings.hiringClients.actions;
    const { authToken } = login;
    const { itemsPerPage } = search;
    queryParams = {...queryParams, section: 'holders'};
    console.log(queryParams);

    dispatch(setFetchingSearchHolders(true));
    dispatch(setSearchHoldersListError(null));
    dispatch(setSearchHoldersList([]));

    const urlParameters = Utils.getPaginatedUrlParameters(queryParams, itemsPerPage);
    let urlQuery = `cf/search`;
    return Api.get(`${urlQuery}${urlParameters}`, authToken)
      .then(response => {
        const { success, data, totalCount } = response.data;
        //console.log(data);
        const processedData = data.map((e) => ({...e, 'TopHolder': e.TopHolder.slice(e.TopHolder.indexOf(">") + 1)}));
        console.log(processedData);
        if(success) {
          dispatch(setSearchHoldersList(processedData, totalCount));
        }
        else {
          dispatch(setSearchHoldersListError(errorDefault));
        }
        dispatch(setFetchingSearchHolders(false));
      })
      .catch(error => {
        dispatch(setSearchHoldersListError(errorConnection));
        dispatch(setFetchingSearchHolders(false));
      });
  };
};


/* SEARCH CONTACTS */
export const setFetchingSearchContacts = (isFetching) => {
  return {
    type: types.SET_FETCHING_SEARCH_CONTACTS,
    payload: {
      isFetching
    }
  };
};
export const setSearchContactsList = (list, total) => {
  return {
    type: types.SET_SEARCH_CONTACTS_LIST,
    payload: {
      list,
      total
    }
  };
};
export const setSearchContactsListError = (error) => {
  return {
    type: types.SET_SEARCH_CONTACTS_LIST_ERROR,
    payload: {
      error
    }
  };
};
export const fetchSearchContacts = (queryParams) => {
  return (dispatch, getState) => {
    const { login, localization, search } = getState();
    const { errorDefault, errorConnection } = localization.strings.hiringClients.actions;
    const { authToken } = login;
    const { itemsPerPage } = search;
    queryParams = {...queryParams, section: 'contacts'};
    console.log(queryParams);

    dispatch(setFetchingSearchContacts(true));
    dispatch(setSearchContactsListError(null));
    dispatch(setSearchContactsList([]));

    const urlParameters = Utils.getPaginatedUrlParameters(queryParams, itemsPerPage);
    let urlQuery = `cf/search`;
    return Api.get(`${urlQuery}${urlParameters}`, authToken)
      .then(response => {
        const { success, data, totalCount } = response.data;
        console.log(data)
        if(success) {
          dispatch(setSearchContactsList(data, totalCount));
        }
        else {
          dispatch(setSearchContactsListError(errorDefault));
        }
        dispatch(setFetchingSearchContacts(false));
      })
      .catch(error => {
        dispatch(setSearchContactsListError(errorConnection));
        dispatch(setFetchingSearchContacts(false));
      });
  };
};


/* SEARCH AGENCIES */
export const setFetchingSearchAgencies = (isFetching) => {
  return {
    type: types.SET_FETCHING_SEARCH_AGENCIES,
    payload: {
      isFetching
    }
  };
};
export const setSearchAgenciesList = (list, total) => {
  return {
    type: types.SET_SEARCH_AGENCIES_LIST,
    payload: {
      list,
      total
    }
  };
};
export const setSearchAgenciesListError = (error) => {
  return {
    type: types.SET_SEARCH_AGENCIES_LIST_ERROR,
    payload: {
      error
    }
  };
};
export const fetchSearchAgencies = (queryParams) => {
  return (dispatch, getState) => {
    const { login, localization, search } = getState();
    const { errorDefault, errorConnection } = localization.strings.hiringClients.actions;
    const { authToken } = login;
    const { itemsPerPage } = search;
    queryParams = {...queryParams, section: 'agencies'};
    console.log(queryParams);

    dispatch(setFetchingSearchAgencies(true));
    dispatch(setSearchAgenciesListError(null));
    dispatch(setSearchAgenciesList([]));

    const urlParameters = Utils.getPaginatedUrlParameters(queryParams, itemsPerPage);
    let urlQuery = `cf/search`;
    return Api.get(`${urlQuery}${urlParameters}`, authToken)
      .then(response => {
        const { success, data, totalCount } = response.data;
        console.log(data);
        if(success) {
          dispatch(setSearchAgenciesList(data, totalCount));
        }
        else {
          dispatch(setSearchAgenciesListError(errorDefault));
        }
        dispatch(setFetchingSearchAgencies(false));
      })
      .catch(error => {
        dispatch(setSearchAgenciesListError(errorConnection));
        dispatch(setFetchingSearchAgencies(false));
      });
  };
};
