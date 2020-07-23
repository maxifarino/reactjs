import * as types from './types';
import Api from '../../../../lib/api';
import Utils from '../../../../lib/utils';

// SETS
export const setProjectInsuredsListError = (error) => {
  return {
    type: types.SET_PROJECT_INSUREDS_LIST_ERROR,
    payload: error
  };
};
export const setProjectInsuredsList = (list, totalAmount, totalProjectNonArchived = 0) => {
  return {
    type: types.SET_PROJECT_INSUREDS_LIST,
    payload: {
      list,
      totalAmount,
      totalProjectNonArchived
    }
  };
};
export const setFetchingProjectInsureds = () => {
  return {
    type: types.SET_FETCHING_PROJECT_INSUREDS
  };
};
export const setShowModal = (show) => {
  return {
    type: types.SET_SHOW_PROJECT_INSUREDS_MODAL,
    payload: show
  }
}

// FETCH
export const fetchProjectInsureds = (query_params) => {
  return (dispatch, getState) => {
    const { login, localization, projectInsureds } = getState();
    const { errorDefault, errorConnection } = localization.strings.projectInsureds.errors;
    const { authToken } = login;
    const { projectInsuredsPerPage } = projectInsureds;

    dispatch(setFetchingProjectInsureds());

    const urlParameters = Utils.getPaginatedUrlParameters(query_params, projectInsuredsPerPage);
    const urlQuery = `cf/projectInsureds`;
    return Api.get(`${urlQuery}${urlParameters}`, authToken)
      .then(response => {
        const { success, projectInsureds, totalCount, totalProjectNonArchived } = response.data;
        if (success) {
          dispatch(setProjectInsuredsList(projectInsureds || [], totalCount || 0, totalProjectNonArchived || 0));
        }
        else {
          dispatch(setProjectInsuredsListError(errorDefault));
        }
      })
      .catch(error => {
        dispatch(setProjectInsuredsListError(errorConnection));
      });
  };
};


/* POST CUSTOM FIELD */
export const setPostProjectInsuredError = (error) => {
  return {
    type: types.SET_POST_PROJECT_INSURED_ERROR,
    payload: error
  };
};
export const postProjectInsured = (projectInsuredPayload, callback) => {
  return (dispatch, getState) => {
    let apiMethod = projectInsuredPayload.projectInsuredId ? 'put' : 'post';
    const { login, localization } = getState();
    const { authToken } = login;
    const { errorConnection } = localization.strings.projectInsureds.errors;
    dispatch(setPostProjectInsuredError(null));

    return Api[apiMethod](
      'cf/projectInsureds',
      projectInsuredPayload,
      authToken
    ).then(response => {
      const { success, data } = response.data;
      if (success) {
        if (callback) callback(true);
      }
      else {
        console.log('* error from server', data);
        const errorMsg = getProjectInsuredErrors(data.errorCode, localization);
        dispatch(setPostProjectInsuredError(errorMsg));
        if (callback) callback(false);
      }
    })
      .catch(error => {
        console.log('error', error);
        dispatch(setPostProjectInsuredError(errorConnection));
        if (callback) callback(false);
      });

  }
}

// error
const getProjectInsuredErrors = (errorCode, localization) => {
  let {
    error10005, error10006, error10007,
    error10011, error10019, error10130, errorDefault,
  } = localization.strings.projectInsureds.errors;
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
    case 10130:
      errorMsg = error10130;
      break;
    default:
      errorMsg = errorDefault;
      break;
  }

  return errorMsg;
}

// Set Project Favorite
export const setProjectFavorite = (condition, id) => {
  return {
    type: types.SET_PROJECT_INSUREDS_FAVORITE,
    payload: {
      condition,
      id
    },
  };
};
export const setProjectFavoriteFetching = (projectId) => {
  return {
    type: types.SET_PROJECT_INSUREDS_FAVORITE_FETCHING,
    payload: projectId
  };
};
export const sendProjectFavorite = (condition, info) => {
  return (dispatch, getState) => {
    const { login: { authToken } } = getState();

    dispatch(setProjectFavoriteFetching(info.projectId))

    let apiMethod;
    if (condition) {
      apiMethod = 'post';
    } else {
      apiMethod = 'delete';
    }

    return Api[apiMethod]('cf/projects/favorites', info, authToken)
      .then(response => {
        const { success } = response.data;

        if (success) {
          dispatch(setProjectFavorite(condition, info.projectId));
        } else {
          dispatch(setProjectFavoriteFetching(null));
        }
      })
      .catch(() => {
        dispatch(setProjectFavoriteFetching(null));
      });
  };
}

export const archiveProject = (ProjectInsuredID, isCurrentArchived, callback) => {
  return (dispatch, getState) => {
    const { login: { authToken } } = getState();

    const urlQuery = `cf/projectInsureds/archive`;

    return Api.put(`${urlQuery}`, { ProjectInsuredID: ProjectInsuredID, isCurrentArchived: isCurrentArchived }, authToken)
      .then(response => {
        const { success } = response.data;

        if (success) {
          callback()
        } else {
          callback()
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
}

export const exemptProjectInsured = (projectInsuredId, exempt, callback) => {
  return (dispatch, getState) => {
    const { login: { authToken } } = getState();
    const urlQuery = `cf/projectInsureds/exempt`;
    const payload = {
      ProjectInsuredID: projectInsuredId,
      Exempt: exempt
    };
    return Api.put(`${urlQuery}`, payload, authToken)
      .then(response => {
        const { success } = response.data;
        if (success) {
          callback(true)
        } else {
          callback(false)
        }
      })
      .catch((error) => {
        console.log(error);
        callback(false)
      });
  };
}

export const uploadDocument = (payload, callback) => {
  return async (dispatch, getState) => {
    const { login: { authToken }, localization } = getState();
    let {
      errorDefault,
      errorConnection,
    } = localization.strings.hcProfile.projects.actions;
    //console.log('payload', payload);
    
    const formData = new FormData();
    const filename = payload.files[0].name.substr(0, payload.files[0].name.lastIndexOf("."));
    formData.append('document', payload.files[0]);
    formData.append('name', filename);
    
    for (let item in payload) {
      formData.append(item, payload[item]);
    }

    Api.post('cf/documents', formData, authToken)
      .then(response => {
        const { success, data } = response.data;
        console.log(response.data);        
        if (success) {          
          const linkPayload = {
            projectInsuredId: payload.projectInsuredId,
            documentId: data.documentId,
          };
          //console.log('linkPayload', linkPayload);          

          // LINK DOCUMENT TO PROJECT INSURED
          Api.post('cf/projectInsuredDocuments', linkPayload, authToken)
            .then(response => {
              const { success } = response.data;
              if (success) {
                callback(true, data)
              } else {
                // IF THE RELATION COUND'T BE CREATED DELETE THE UPLOADED DOCUMENT
                Api.delete('cf/documents', { documentId: linkPayload.documentId }, authToken);
                callback(false, errorDefault);
              }
            })
            .catch(() => {
              // IF THE RELATION COUND'T BE CREATED DELETE THE UPLOADED DOCUMENT
              Api.delete('cf/documents', { documentId: linkPayload.documentId }, authToken);
              callback(false, errorConnection);
            });
        }
    })
    .catch(() => {      
      callback(false, errorConnection);
    });
  };
};