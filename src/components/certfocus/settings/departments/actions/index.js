import Api from "../../../../../lib/api";
import * as types from './types';

export const setFetchingDepartments = (fetching) => {
  return {
    type: types.SET_DEPARTMENT_LIST_FETCHING,
    payload: fetching,
  }
}

export const setShowModal = (status) => {
  return {
    type: types.SET_DEPARTMENT_SHOW_MODAL,
    payload: status,
  }
}

export const setShowUsersModal = (status) => {
  return {
    type: types.SET_DEPARTMENT_SHOW_USERS_MODAL,
    payload: status,
  }
}

export const setDepartmentsError = (error) => {
  return {
    type: types.SET_DEPARTMENT_ERROR,
    payload: error,
  }
}

export const setDepartmentList = (list) => {
  return {
    type: types.SET_DEPARTMENT_LIST,
    payload: list,
  }
}

export const setDepartmentsAvailableRoles = (roles) => {
  return {
    type: types.SET_DEPARTMENT_AVAILABLE_ROLES,
    payload: roles,
  }
}

export const setDepartmentRoles = (roles) => {
  return {
    type: types.SET_DEPARTMENT_ROLES,
    payload: roles,
  }
}

export const setDepartmentUsers = (users) => {
  return {
    type: types.SET_DEPARTMENT_USERS,
    payload: users,
  }
}

export const setDepartmentTotalCount = (total) => {
  return {
    type: types.SET_DEPARTMENT_LIST_TOTAL,
    payload: total,
  }
}

export const sendDepartment = (payload, callback) => {
  return (dispatch, getState) => {
    const {login: {authToken}, localization} = getState();
    const {
      errorDefault,
      errorConnection,
    } = localization.strings.departments.errors;
    dispatch(setFetchingDepartments());

    let apiMethod = 'post';

    if (payload.id) apiMethod = 'put'

    const url = 'cf/departments'

    return Api[apiMethod](url, payload, authToken)
      .then(response => {
        const {success} = response.data;
        let errorMsg = '';

        if (success) {
          // dispatch(addDocumentQueueDefinitionsSuccess());
        } else {
          errorMsg = errorDefault;
        }
        dispatch(setDepartmentsError(errorMsg));
        callback(success);
      })
      .catch(err => {
        dispatch(setDepartmentsError(errorConnection));
        callback();
      })

  }
}

export const getDepartments = (queryParams) => {
  return (dispatch, getState) => {
    const {login, localization, departments} = getState();
    const {itemsPerPage} = departments;
    const {
      error10003,
      errorDefault,
      errorConnection,
    } = localization.strings.departments.errors;
    const token = login.authToken;
    let urlParameters = '';


    if (queryParams) {
      if (!queryParams.withoutPag) {
        if (!queryParams.pageNumber) {
          queryParams.pageNumber = 1;
        }
        queryParams.pageSize = itemsPerPage;
      }
    } else {
      queryParams = {
        pageNumber: 1,
        pageSize: itemsPerPage
      };
    }

    let urlQuery = 'cf/departments';

    urlParameters = `?${Object.keys(queryParams).map(i => `${i}=${queryParams[i]}`).join('&')}`;

    dispatch(setFetchingDepartments(true));
    dispatch(setDepartmentTotalCount(0));
    dispatch(setDepartmentList([]));
    dispatch(setDepartmentsAvailableRoles([]));

    return Api.get(`${urlQuery}${urlParameters}`, token)
      .then(response => {
        const {success, data, totalCount, roles} = response.data;

        let errorMsg = '';
        if (success) {
          dispatch(setDepartmentList(data ? data : []));
          dispatch(setDepartmentsAvailableRoles(roles ? roles : []));
          dispatch(setDepartmentTotalCount(totalCount ? totalCount : 0));
        } else {

          switch (data.errorCode) {
            case 10003:
              errorMsg = error10003
              break
            default:
              errorMsg = errorDefault;
              break;
          }
          dispatch(setDepartmentsError(errorMsg));
        }
        dispatch(setFetchingDepartments(false));
      })
      .catch(() => {
        dispatch(setDepartmentsError(errorConnection));
        dispatch(setFetchingDepartments(false));
      });
  };
}

export const removeDepartmentUser = (queryParams, callback) => {
  return (dispatch, getState) => {
    const {login, localization, departments} = getState();
    const {
      error10003,
      errorDefault,
      errorConnection,
    } = localization.strings.departments.errors;
    const token = login.authToken;

    let urlQuery = 'cf/departments/user';

    return Api.delete(urlQuery,queryParams, token)
      .then(response => {
        const {success, data} = response.data;

        let errorMsg = '';
        if (success) {

        } else {

          switch (data.errorCode) {
            case 10003:
              errorMsg = error10003
              break
            default:
              errorMsg = errorDefault;
              break;
          }
          dispatch(setDepartmentsError(errorMsg));
        }
        callback(success)

      })
      .catch(() => {
        dispatch(setDepartmentsError(errorConnection));
      });

  };
};

export const addDepartmentUser = (queryParams, callback) => {
  return (dispatch, getState) => {
    const {login, localization} = getState();
    const {
      error10003,
      errorDefault,
      errorConnection,
    } = localization.strings.departments.errors;

    const token = login.authToken;

    let urlQuery = 'cf/departments/user';

    return Api.post(urlQuery,queryParams, token)
      .then(response => {
        const {success, data} = response.data;

        let errorMsg = '';
        if (success) {

        } else {

          switch (data.errorCode) {
            case 10003:
              errorMsg = error10003
              break
            default:
              errorMsg = errorDefault;
              break;
          }
          dispatch(setDepartmentsError(errorMsg));
        }
        callback(success)

      })
      .catch(() => {
        dispatch(setDepartmentsError(errorConnection));
      });

  };
};

export const getDepartmentUsers = (queryParams) => {
  return (dispatch, getState) => {
    const {login, localization, departments} = getState();
    const {
      error10003,
      errorDefault,
      errorConnection,
    } = localization.strings.departments.errors;
    const token = login.authToken;
    let urlParameters = '';
    let urlQuery = 'cf/departments/users';

    urlParameters = `?${Object.keys(queryParams).map(i => `${i}=${queryParams[i]}`).join('&')}`;

    return Api.get(`${urlQuery}${urlParameters}`, token)
      .then(response => {
        const {success, data } = response.data;
        let errorMsg = '';
        if (success) {
          dispatch(setDepartmentUsers(data.users));
          dispatch(setDepartmentRoles(data.holdersUsers))
        } else {
          switch (data.errorCode) {
            case 10003:
              errorMsg = error10003
              break
            default:
              errorMsg = errorDefault;
              break;
          }
          dispatch(setDepartmentsError(errorMsg));
        }
        dispatch(setFetchingDepartments(false));
      })
      .catch(() => {
        dispatch(setDepartmentsError(errorConnection));
      });

  }
}