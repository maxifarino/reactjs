import * as types from './types';
import Api from '../../../../../lib/api';

export const setError = (error) => {
  return {
    type: types.SET_TASKS_ERROR,
    error
  };
};

export const setSavingTask = (saving) => {
  return {
    type: types.SET_SAVING_TASK,
    saving
  };
};

export const setFetchingTasks = (isFetching) => {
  return {
    type: types.SET_FETCHING_TASKS,
    isFetching
  };
};

export const setTotalAmountOfTasks = (total) => {
  return {
    type: types.SET_TOTAL_AMOUNT_OF_TASKS,
    total
  };
};

export const setTaskTypesPossibleValues = (taskTypesPossibleValues) => {
  return {
    type: types.SET_TASK_TYPES_POSSIBLE_VALUES,
    taskTypesPossibleValues
  };
};

export const setTaskPriorityPossibleValues = (taskPriorityPossibleValues) => {
  return {
    type: types.SET_TASK_PRIORITY_POSSIBLE_VALUES,
    taskPriorityPossibleValues
  };
};

export const setContactsTypesPossibleValues = (contactsTypesPossibleValues) => {
  return {
    type: types.SET_CONTACTS_TYPES_POSSIBLE_VALUES,
    contactsTypesPossibleValues
  };
};

export const setStatusPossibleValues = (statusPossibleValues) => {
  return {
    type: types.SET_STATUS_POSSIBLE_VALUES,
    statusPossibleValues
  };
};

export const setTasksList = (tasks) => {
  return {
    type: types.SET_TASKS_LIST,
    tasks
  };
};

export const setTasksRolesPossibleValues = (roles) => {
  return {
    type: types.SET_ROLES_POSSIBLE_VALUES,
    PQRoles: roles.PQRoles,
    CFRoles: roles.CFRoles
  };
};

export const fetchTasks = (queryParams) => {
  return (dispatch, getState) => {
    const { login } = getState();
    const { tasksPerPage } = getState().notesTasks;
    const token = login.authToken;
    let urlParameters = '';

    dispatch(setFetchingTasks(true));
    dispatch(setTotalAmountOfTasks(0));

    if (queryParams) {
      if (queryParams.withoutPag) {
        delete queryParams.pageNumber;
        delete queryParams.pageSize;
      }
      else {
        if (!queryParams.pageNumber) {
          queryParams.pageNumber = 1;
        }
        queryParams.pageSize = tasksPerPage;
      }
    }
    else {
      queryParams = {
        pageNumber: 1,
        pageSize: tasksPerPage
      };
    }
    let urlQuery = 'tasks';
    urlParameters = `?${Object.keys(queryParams).map(i => `${i}=${queryParams[i]}`).join('&')}`;
    return Api.get(`${urlQuery}${urlParameters}`, token)
      .then(response => {
        const {success, data} = response.data;
        if (success) {
          const { totalCount, tasks } = data;
          const { tasksList, TaskTypesPossibleValues, PriorityPossibleValues, ContactsTypesPossibleValues, StatusPossibleValues } = tasks;
          dispatch(setTotalAmountOfTasks(totalCount));
          dispatch(setTaskTypesPossibleValues(TaskTypesPossibleValues || []));
          dispatch(setTaskPriorityPossibleValues(PriorityPossibleValues || []));
          dispatch(setContactsTypesPossibleValues(ContactsTypesPossibleValues || []));
          dispatch(setStatusPossibleValues(StatusPossibleValues || []));

          dispatch(setTasksList(tasksList || []));
        } else {
          dispatch(setTotalAmountOfTasks(0));
          dispatch(setTasksList([]));
        }
        dispatch(setFetchingTasks(false));
      })
      .catch(error => {
        console.log(error);
        dispatch(setFetchingTasks(false));
      });
  };
};

export const fetchRoles = () => {
  return (dispatch, getState) => {
    const { login } = getState();
    const token = login.authToken;
    return Api.get(`roles/rolesext`, token)
      .then(response => {
        const { success, roles } = response.data;
        if (success) {
          dispatch(setTasksRolesPossibleValues(roles || {PQRoles:[],CFRoles:[]}));
        }
      })
      .catch(error => {
        console.log(error)
      });
  };
};

export const saveNoteTask = (payload) => {
  return (dispatch, getState) => {
    const token = getState().login.authToken;
    dispatch(setError(null));
    dispatch(setSavingTask(true));

    const callback = (err, data) => {
      if (err) {
        console.log(err);
        dispatch(setError("There was an error while saving, please try again"));
      } else {
        const { success } = data;
        if (!success) {
          dispatch(setError("There was an error while saving, please try again"));
        }
      }
      dispatch(setSavingTask(false));
    }

    if (payload.taskId) {
      // update
      Api.put(
        `tasks/`,
        payload,
        token
      ).then(response => {
        callback(null, response.data);
      }).catch(error => {
        callback(error, null);
      });
    } else {
      // creation
      Api.post(
        `tasks/`,
        payload,
        token
      ).then(response => {
        callback(null, response.data);
      }).catch(error => {
        callback(error, null);
      });
    }

  };
}
