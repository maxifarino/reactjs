import Api from "../../../../lib/api";
import * as types from './types';
import Utils from "../../../../lib/utils";

export const setProjectUsersListError = (error) => {
  return {
    type: types.SET_PROJECT_USERS_LIST_ERROR,
    error
  };
};

export const setProjectUsersList = (users) => {
  return {
    type: types.SET_PROJECT_USERS_LIST,
    payload: users
  };
};

export const setTotalAmountOfProjectUsers = (usersLength) => {
  return {
    type: types.SET_TOTAL_AMOUNT_OF_PROJECT_USERS,
    payload: usersLength
  };
};

export const sendProjectUser = (values, closeModal) => {

  return (dispatch, getState) => {
    const {login, localization} = getState();

    const {
      errorConnection,
    } = localization.strings.projectUsers.actions;

    const token = login.authToken;
    let method = 'post';
    dispatch(setProjectUsersListError(''));

    let payload = {
      projectId: values.projectId,
      userId: values.userId,
    };

    return Api[method](`cf/projectUser`, payload, token)
      .then(response => {
        const {success, data} = response.data;
        let errorMsg = '';
        if (success) {
          let query = Utils.getFetchQuery('Name', 1, 'ASC');
          query.projectId =  values.projectId;
          dispatch(fetchProjectUsers(query, token, localization));
        } else {
          errorMsg = data.description;
        }
        closeModal(success);
        dispatch(setProjectUsersListError(errorMsg));
      })
      .catch(error => {
        dispatch(setProjectUsersListError(errorConnection));
        closeModal();
      });
  };
};

export const setFetchingProjectUsers = (isFetching) => {
  return {
    type: types.SET_FETCHING_PROJECT_USERS,
    payload: isFetching
  };
};

export const fetchProjectUsers = (queryParams) => {
  return (dispatch, getState) => {
    const { localization } = getState();
    const token = getState().login.authToken;
    queryParams.pageSize = getState().users.usersPerPage;

    const {
      errorConnection,
    } = localization;

    let urlParameters = `?${Object.keys(queryParams).map(i => `${i}=${queryParams[i]}`).join('&')}`;

    dispatch(setTotalAmountOfProjectUsers(0));
    dispatch(setFetchingProjectUsers(true));
    return Api.get(`cf/projectUsers${urlParameters}`, token)
      .then(response => {
        const {success, data} = response.data;
        let errorMsg = '';
        if (success) {
          dispatch(setTotalAmountOfProjectUsers(data.totalCount));
          dispatch(setProjectUsersList(data.users));
        } else {
          dispatch(setProjectUsersListError(data.description));
          dispatch(setProjectUsersList({}));
        }
        dispatch(setProjectUsersListError(errorMsg));
        dispatch(setFetchingProjectUsers(false));
      })
      .catch(error => {
        dispatch(setProjectUsersListError(errorConnection));
      });
  };
};

export const toggleProjectUserStatus = (params) => {
  return (dispatch, getState) => {
    const token = getState().login.authToken;
    const method = 'put';
    const payload = {
      projectId: params.projectId,
      userId: params.userId,
    };
    return Api[method](`cf/projectUser/status`, payload, token)
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

export const setAvailableProjectUsers = (users) => {
  return {
    type: types.SET_AVAILABLE_PROJECT_USERS_LIST,
    payload: users
  };
};

export const fetchAvailableProjectUsers = (projectId, hiringClientId) => {
  return (dispatch, getState) => {
    const { localization } = getState();
    const token = getState().login.authToken;
    let queryParams = {
      orderBy: 'name',
      orderDirection: 'ASC',
      associatedOnly: 1,
      hiringClientId,
      projectId,
    };

    const {
      errorConnection,
    } = localization;

    let urlParameters = `?${Object.keys(queryParams).map(i => `${i}=${queryParams[i]}`).join('&')}`;

    return Api.get(`/users${urlParameters}`, token)
      .then(response => {
        const {success, data} = response.data;
        let errorMsg = '';
        if (success) {
          dispatch(setAvailableProjectUsers(data.users));
        } else {
          errorMsg = data.description;
        }
        dispatch(setProjectUsersListError(errorMsg));
      })
      .catch(error => {
        dispatch(setProjectUsersListError(errorConnection));
      });
  };
};