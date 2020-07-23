import axios from 'axios';

import * as types from './types';
import Api from '../../../../lib/api';
import Utils from '../../../../lib/utils';

export const setProjectsError = (error) => {
  return {
    type: types.SET_PROJECTS_ERROR,
    error
  };
};

export const addProjectError = (error) => {
  return {
    type: types.SET_PROJECT_ADD_ERROR,
    payload: error
  };
};

export const addProjectSuccess = () => {
  return {
    type: types.SET_PROJECT_ADD_SUCCESS,
  };
};

export const addProjectFetching = () => {
  return {
    type: types.SET_PROJECT_ADD_FETCHING,
  };
};

export const setProjectsList = (projects) => {
  return {
    type: types.SET_PROJECTS_LIST,
    projects
  };
};

export const setTotalAmountOfProjects = (total) => {
  return {
    type: types.SET_TOTAL_AMOUNT_OF_PROJECTS,
    total
  };
};

export const setFetchingProjects = (fetchingProjects) => {
  return {
    type: types.SET_FETCHING_PROJECTS,
    fetchingProjects
  };
};

export const setShowModal = (status) => {
  return {
    type: types.SET_SHOW_MODAL,
    showModal: status
  };
};

export const setAddProjectData = (data) => {
  return {
    type: types.SET_ADD_PROJECT_DATA,
    data
  };
};

export const setProjectStatus = (data) => {
  return {
    type: types.SET_PROJECT_STATUS,
    data
  };
};

export const setProjectFavorite = (condition, id) => {
  return {
    type: types.SET_PROJECT_FAVORITE,
    payload: {
      condition,
      id
    }
  };
};

export const setProjectFavoriteError = (error) => {
  return {
    type: types.SET_PROJECT_FAVORITE_ERROR,
    payload: error
  };
};

export const setProjectFavoriteFetching = (projectId) => {
  return {
    type: types.SET_PROJECT_FAVORITE_FETCHING,
    payload: projectId
  };
};

export const fetchProjects = (queryParams) => {
  return (dispatch, getState) => {
    const { login, localization } = getState();
    let {
      error10005,
      error10006,
      error10007,
      error10011,
      error10019,
      errorDefault,
      errorConnection,
    } = localization.strings.hcProfile.projects.actions;
    const token = login.authToken;
    let urlParameters = '';

    dispatch(setFetchingProjects(true));
    dispatch(setTotalAmountOfProjects(0));

    const { projectsPerPage } = getState().projects;
    if (queryParams) {
      if (queryParams.withoutPag) {
        delete queryParams.pageNumber;
        delete queryParams.pageSize;
      }
      else {
        if (!queryParams.pageNumber) {
          queryParams.pageNumber = 1;
        }
        queryParams.pageSize = projectsPerPage;
      }
    }
    else {
      queryParams = {
        pageNumber: 1,
        pageSize: projectsPerPage
      };
    }


    let urlQuery = 'cf/projects';

    urlParameters = `?${Object.keys(queryParams).map(i => `${i}=${queryParams[i]}`).join('&')}`;

    return Api.get(`${urlQuery}${urlParameters}`, token)
      .then(response => {
        const { success, totalCount, data, amountProjectsNonArchive } = response.data;

        let errorMsg = '';
        if (success) {
          dispatch(setTotalAmountOfProjects(totalCount ? totalCount : 0));
          dispatch(setProjectsList(data ? data : []));
          dispatch(setTotalAmountOfProjectsArchive(amountProjectsNonArchive ? amountProjectsNonArchive : 0));
        }
        else {
          switch (data.errorCode) {
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
          dispatch(setProjectsError(errorMsg));
          dispatch(setTotalAmountOfProjects(0));
          dispatch(setProjectsList([]));
        }
        dispatch(setFetchingProjects(false));
      })
      .catch(() => {
        dispatch(setProjectsError(errorConnection));
      });
  };
};

export const fetchProjectStatus = () => {
  return (dispatch, getState) => {
    const { login, localization } = getState();
    let {
      error10005,
      error10006,
      error10007,
      error10011,
      error10019,
      errorDefault,
      errorConnection,
    } = localization.strings.hcProfile.projects.actions;
    const token = login.authToken;

    return Api.get('projects/status', token)
      .then(response => {
        const { success, projectsStatusList, data } = response.data;
        let errorMsg = '';
        if (success) {
          dispatch(setProjectStatus(projectsStatusList));
        }
        else {
          switch (data.errorCode) {
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
          dispatch(setProjectsError(errorMsg));
        }
      })
      .catch(() => {
        dispatch(setProjectsError(errorConnection));
      });
  };
};

export const sendProject = (project, callback) => {
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

    dispatch(addProjectFetching());

    let apiMethod;

    if (project.id) {
      apiMethod = 'put';
    } else {
      apiMethod = 'post';
    }

    return Api[apiMethod](`cf/projects`, project, token)
      .then(response => {
        const { success, data } = response.data;
        if (success) {
          dispatch(addProjectSuccess());
          callback(data);
        } else {
          const errorMsg = errors[data.errorCode] || errorDefault;
          dispatch(addProjectError(errorMsg));
          callback(null);
        }
      })
      .catch(() => {
        dispatch(addProjectError(errorConnection));
        callback(null);
      });
  };
}

export const sendProjectFavorite = (condition, info) => {
  return (dispatch, getState) => {
    const { login, localization } = getState();
    let {
      error10005,
      error10006,
      error10007,
      error10011,
      error10019,
      errorDefault,
      errorConnection,
    } = localization.strings.hcProfile.projects.actions;
    const token = login.authToken;

    dispatch(setProjectFavoriteFetching(info.projectId))

    let apiMethod = null;
    if (condition) {
      apiMethod = 'post';
    } else {
      apiMethod = 'delete';
    }

    return Api[apiMethod]('cf/projects/favorites', info, token)
      .then(response => {
        const { success, data } = response.data;
        let errorMsg = '';
        if (success) {
          dispatch(setProjectFavorite(condition, info.projectId));
        }
        else {
          switch (data.errorCode) {
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
          dispatch(setProjectFavoriteError(errorMsg));
        }
      })
      .catch(() => {
        dispatch(setProjectFavoriteError(errorConnection));
      });
  };
}

// Add Project Holder custom fields
export const setCustomFieldsError = (error) => {
  return {
    type: types.SET_HOLDER_CUSTOM_FIELDS_ERROR,
    payload: error
  };
};
export const setCustomFieldsList = (customFields) => {
  return {
    type: types.SET_HOLDER_CUSTOM_FIELDS_SUCCESS,
    payload: customFields
  };
};
export const setFetchingCustomFields = () => {
  return {
    type: types.SET_HOLDER_CUSTOM_FIELDS_FETCHING,
  };
};
export const fetchHolderCustomFields = (id) => {
  return (dispatch, getState) => {
    const { login, localization, customFields } = getState();
    const { errorDefault, errorConnection } = localization.strings.customFields.errors;
    const { authToken } = login;
    const { customFieldsPerPage } = customFields;

    dispatch(setFetchingCustomFields());
    const queryParams = {
      holderId: id,
      archived: '0',
      orderBy: 'displayOrder',
      orderDirection: 'ASC'
    };

    const urlParameters = Utils.getUrlParameters(queryParams, customFieldsPerPage);
    const urlQuery = `cf/customFields`;
    return Api.get(`${urlQuery}${urlParameters}`, authToken)
      .then(response => {
        const { success, customFields } = response.data;
        if (success) {
          dispatch(setCustomFieldsList(customFields || []));
        }
        else {
          dispatch(setCustomFieldsError(errorDefault));
        }
      })
      .catch(error => {
        dispatch(setCustomFieldsError(errorConnection));
      });
  };
};


// POST Custom Field Values
export const sendCustomFieldValues = (payload, callback) => {
  return (dispatch, getState) => {
    const { login, localization } = getState();
    const { authToken } = login;
    const {
      errorDefault, errorConnection
    } = localization.strings.hcProfile.projects.actions;
    dispatch(addProjectError(null));

    return Api.post(
      'cf/projectCustomFields',
      payload,
      authToken
    ).then(response => {
      const { success } = response.data;
      if (success) {
        if (callback) callback(true);
      }
      else {
        console.log('* error from server');
        dispatch(addProjectError(errorDefault));
        if (callback) callback(null);
      }
    })
      .catch(error => {
        console.log('error', error);
        dispatch(addProjectError(errorConnection));
        if (callback) callback(null);
      });

  };
};

// POST Project-Requirement set relation
export const sendProjectReqSet = (payload, callback) => {
  return (dispatch, getState) => {
    const { login: { authToken }, localization } = getState();
    const {
      errorDefault,
      errorConnection,
    } = localization.strings.hcProfile.projects.actions;

    dispatch(addProjectError(null));

    return Api.post('cf/projectRequirementSets', payload, authToken)
      .then(response => {
        const { success } = response.data;

        if (success) {
          if (callback) callback(true);
        } else {
          console.log('* error from server');
          dispatch(addProjectError(errorDefault));
          if (callback) callback(null);
        }
      })
      .catch(error => {
        console.log('error', error);
        dispatch(addProjectError(errorConnection));
        if (callback) callback(null);
      });
  };
};

// Projects Type Ahead
export const setTypeAheadFetching = () => ({
  type: types.SET_TYPE_AHEAD_FETCHING_PROJECTS,
});
export const setTypeAheadResults = result => ({
  type: types.SET_TYPE_AHEAD_SUCCESS_PROJECTS,
  payload: result
});
export const setTypeAheadError = error => ({
  type: types.SET_TYPE_AHEAD_ERROR_PROJECTS,
  payload: error
});
export const resetTypeAheadResults = () => {
  return {
    type: types.RESET_TYPE_AHEAD_RESULTS_PROJECTS
  }
};

const CancelToken = axios.CancelToken;
let source = null;

export const fetchTypeAhead = (queryParams) => {
  return (dispatch, getState) => {
    const { login: { authToken }, localization } = getState();
    const {
      errorConnection,
    } = localization.strings.common.typeAheadErrors;

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
    Api.get(`cf/projects?${Object.keys(queryParams).map(i => `${i}=${queryParams[i]}`).join('&')}`, authToken, source.token)
      .then(response => {
        const { success, data } = response.data;
        source = null;

        if (success) {
          dispatch(setTypeAheadResults(data ? data : []));
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

// POST Archive Project
export const archiveProject = (payload, callback) => {
  return (dispatch, getState) => {
    const { login: { authToken }, localization } = getState();
    const {
      errorDefault,
      errorConnection,
    } = localization.strings.hcProfile.projects.actions;

    dispatch(addProjectError(null));

    return Api.post('cf/projects/archive', payload, authToken)
      .then(response => {
        const { success } = response.data;

        if (success) {
          if (callback) callback(true);
        } else {
          dispatch(addProjectError(errorDefault));
          if (callback) callback(null);
        }
      })
      .catch(error => {
        console.log('error', error);
        dispatch(addProjectError(errorConnection));
        if (callback) callback(null);
      });
  };
};

export const setTotalAmountOfProjectsArchive = (total) => {
  return {
    type: types.SET_TOTAL_AMOUNT_PROJECT_ARCHIVE,
    total
  };
};
