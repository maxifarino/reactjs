import Api from '../../../../lib/api';
import * as types from './types';

export const setNotesError = (error) => {
  return {
    type: types.SET_CERTFOCUS_NOTES_ERROR,
    payload: error
  };
};

export const setSavingError = (error) => {
  return {
    type: types.SET_CERTFOCUS_SAVING_NOTE_ERROR,
    payload: error,
  };
};

export const setFetching = () => {
  return {
    type: types.SET_CERTFOCUS_FETCHING_NOTES,
  };
};

export const setNotes = (notes) => {
  return {
    type: types.SET_CERTFOCUS_NOTES_LIST,
    payload: notes
  };
};

export const setNotesRolesPossibleValues = (roles) => {
  return {
    type: types.SET_CERTFOCUS_NOTES_ROLES_POSSIBLE_VALUES,
    payload: roles,
  };
};

export const fetchNotes = (queryParams) => {
  return (dispatch, getState) => {
    const { CFNotes: { notesPerPage }, login: { authToken }} = getState();

    dispatch(setFetching());

    if (queryParams) {
      if (queryParams.withoutPag) {
        delete queryParams.pageNumber;
        delete queryParams.pageSize;
      } else {
        if (!queryParams.pageNumber) {
          queryParams.pageNumber = 1;
        }
        queryParams.pageSize = notesPerPage;
      }
    } else {
      queryParams = {
        pageNumber: 1,
        pageSize: notesPerPage,
      };
    }

    let urlQuery = 'cf/tasks';
    const urlParameters = `?${Object.keys(queryParams).map(i => `${i}=${queryParams[i]}`).join('&')}`;
    return Api.get(`${urlQuery}${urlParameters}`, authToken)
      .then(response => {
        const { success, data } = response.data;
        if (success) {
          const { tasks, totalCount } = data;

          dispatch(setNotes({ tasks, totalCount }));
        } else {
          dispatch(setNotesError('Request error')); //TODO: error handling codes
        }
      })
      .catch(() => {
        dispatch(setNotesError('Connection error')); //TODO: error handling codes
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
          dispatch(setNotesRolesPossibleValues(roles || { CFRoles: [] }));
        }
      })
      .catch(error => {
        console.log(error)
      });
  };
};

export const saveNoteTask = (payload, callback) => {
  return (dispatch, getState) => {
    const token = getState().login.authToken;

    dispatch(setSavingError(''));

    let apiAction = 'post';
    if (payload.taskId) {
      apiAction = 'put';
    }

    Api[apiAction](`cf/tasks`, payload, token)
      .then(response => {
        const { success } = response.data;

        if (success) {
          callback(true);
        } else {
          dispatch(setSavingError("There was an error while saving, please try again"));
          callback(false);
        }
      }).catch(() => {
        dispatch(setSavingError("There was an error while saving, please try again"));
        callback(false);
      });
  };
}
