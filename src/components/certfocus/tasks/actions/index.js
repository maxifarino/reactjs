import Api from './../../../../lib/api';
import * as types from './types';
import Utils from "../../../../lib/utils";

export const setTasksError = (error) => {
  return {
    type: types.SET_CERTFOCUS_TASKS_ERROR,
    payload: error
  };
};

export const setSavingError = (error) => {
  return {
    type: types.SET_CERTFOCUS_SAVING_TASK_ERROR,
    payload: error,
  };
};

export const setFetchingTasks = () => {
  return {
    type: types.SET_CERTFOCUS_FETCHING_TASKS,
  };
};

export const setTasks = (tasks) => {
  return {
    type: types.SET_CERTFOCUS_TASKS_LIST,
    payload: tasks
  };
};

export const setTasksRolesPossibleValues = (roles) => {
  return {
    type: types.SET_CERTFOCUS_ROLES_POSSIBLE_VALUES,
    payload: roles,
  };
};

export const fetchTasks = (queryParams) => {
  return (dispatch, getState) => {
    const { CFTasks: { tasksPerPage }, login, localization } = getState();
    const token = login.authToken;

    const {
      errorDefault,
      errorConnection,
    } = localization.strings.hcProfile.projects.actions;

    dispatch(setFetchingTasks());

    if (queryParams) {
      if (queryParams.withoutPag) {
        delete queryParams.pageNumber;
        delete queryParams.pageSize;
      } else {
        if (!queryParams.pageNumber) {
          queryParams.pageNumber = 1;
        }
        queryParams.pageSize = tasksPerPage;
      }
    } else {
      queryParams = {
        pageNumber: 1,
        pageSize: tasksPerPage,
      };
    }

    let urlQuery = 'cf/tasks';
    const urlParameters = `?${Object.keys(queryParams).map(i => `${i}=${queryParams[i]}`).join('&')}`;
    return Api.get(`${urlQuery}${urlParameters}`, token)
      .then(response => {
        const { success, data } = response.data;
        if (success) {
          const { tasks, totalCount,  totalUrgentTasks, unassignedTasks, urgentUnassignedTasks} = data;

          dispatch(setTasks({ tasks, totalCount, totalUrgentTasks, unassignedTasks, urgentUnassignedTasks }));
        } else {
          dispatch(setTasksError(errorDefault)); //TODO: error handling codes
        }
      })
      .catch(() => {
        dispatch(setTasksError(errorConnection)); //TODO: error handling codes
      });
  };
};

export const fetchRoles = () => {
  return (dispatch, getState) => {
    const token = getState().login.authToken;

    return Api.get(`roles/rolesext`, token)
      .then(response => {
        const { success, roles } = response.data;

        if (success) {
          dispatch(setTasksRolesPossibleValues(roles || { CFRoles: [] }));
        }
      })
      .catch(error => {
        console.log(error)
      });
  };
};

export const saveNoteTask = (payload, callback) => {
  return (dispatch, getState) => {
    const { login: { authToken }, localization } = getState();

    const {
      errorDefault,
      errorConnection,
    } = localization.strings.hcProfile.projects.actions;

    dispatch(setSavingError(''));

    let method = 'post';
    if (payload.taskId) {
      method = 'put';
    }

    Api[method](`cf/tasks`, payload, authToken)
      .then(response => {
        const { success } = response.data;

        if (success) {
          callback(true);
        } else {
          dispatch(setSavingError(errorDefault));
          callback(false);
        }
      }).catch(() => {
        dispatch(setSavingError(errorConnection));
        callback(false);
      });
  };
}

export const fetchTaskHistory = (queryParams, callback) => {
  return (dispatch, getState) => {
    const { login, localization } = getState();
    const token = login.authToken;

    //todo: change this translations to the correct key
    const {
      errorDefault,
      errorConnection,
    } = localization.strings.hcProfile.projects.actions;

    let urlQuery = 'cf/task/history';
    const urlParameters = `?${Object.keys(queryParams).map(i => `${i}=${queryParams[i]}`).join('&')}`;
    return Api.get(`${urlQuery}${urlParameters}`, token)
      .then(response => {
        const { success, taskHistory, projectHistory } = response.data;
        callback(success, taskHistory, projectHistory);
      })
      .catch(() => {
        callback(false);
      });
  }
}