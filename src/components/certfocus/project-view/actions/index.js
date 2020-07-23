import * as types from './types';
import Api from '../../../../lib/api';
import { setHeaderTitle } from '../../../common/actions';

export const setProjectDetailsError = (error) => {
  return {
    type: types.SET_PROJECT_DETAILS_ERROR,
    payload: error
  };
};

export const setProject = (project) => {
  return {
    type: types.SET_PROJECT_DETAILS,
    payload: project
  };
};

export const setProjectDetailsLoading = () => {
  return {
    type: types.SET_PROJECT_DETAILS_FETCHING
  };
};

export const fetchProject = (id, callback) => {
  return (dispatch, getState) => {
    const { login, localization } = getState();
    let { errorDefault, errorConnection } = localization.strings.hiringClients.actions;
    const token = login.authToken;
    const urlQuery = `cf/projectsdetail?projectId=${id}`;

    dispatch(setProjectDetailsLoading());

    return Api.get(urlQuery, token)
    .then(response => {
      const { success, data } = response.data;
      let errorMsg = '';
      if(success) {

        // GET CUSTOM FIELDS
        const urlQuery2 = `cf/projectCustomFields?projectId=${id}`;
        return Api.get(urlQuery2, token)
        .then(response2 => {
          const success2 = response2.data.success;
          const projectCustomFields = response2.data.projectCustomFields || [];
          //console.log(projectCustomFields);
          if(success2){
            const project = {...data, projectCustomFields};
            dispatch(setProject(project));
            dispatch(setHeaderTitle(project.name));
            if (callback) callback(project);
          } else {
            dispatch(setProjectDetailsError(errorDefault));
            if (callback) callback(null);
          }
        });

      } else {
        errorMsg = getError(data.errorCode, localization);
        dispatch(setProjectDetailsError(errorMsg));
        if (callback) callback(null);
      }
    })
    .catch(() => {
      dispatch(setProjectDetailsError(errorConnection));
      if (callback) callback(null);
    });
  };
};

const getError = (errorCode, localization) => {
  let {
    error10005,
    error10006,
    error10007,
    error10011,
    error10019,
    errorDefault,
  } = localization.strings.hiringClients.actions;
  let errorMsg = '';
  switch(errorCode) {
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
