import Api from '../../../../../../lib/api';
import * as types from './types';

export const setFetching = (fetching) => {
  return {
    type: types.SET_FETCHING_PROJECT_REQUIREMENTS,
    payload: fetching
  };
};

export const setError = (error) => {
  return {
    type: types.SET_PROJECT_REQUIREMENTS_ERROR,
    payload: error
  };
};

export const setList = (list) => {
  return {
    type: types.SET_PROJECT_REQUIREMENTS_LIST,
    payload: list
  };
};

export const setTotalAmount = (total) => {
  return {
    type: types.SET_TOTAL_AMOUNT_OF_PROJECT_REQUIREMENTS,
    payload: total
  };
};

export const fetchRequirements = (queryParams) => {
  return (dispatch, getState) => {
    const { login: { authToken }, localization } = getState();
    let {
      errorDefault,
      errorConnection,
    } = localization.strings.hcProfile.projects.actions;

    dispatch(setFetching(true));
    dispatch(setTotalAmount(0));

    const { requirementsPerPage } = getState().projectRequirements;

    if (queryParams) {
      if (!queryParams.pageNumber) {
        queryParams.pageNumber = 1;
      }
      queryParams.pageSize = requirementsPerPage;
    } else {
      queryParams = {
        pageNumber: 1,
        pageSize: requirementsPerPage,
      };
    }

    let urlQuery = 'cf/requirementSetsDetail';

    const urlParameters = `?${Object.keys(queryParams).map(i => `${i}=${queryParams[i]}`).join('&')}`;

    return Api.get(`${urlQuery}${urlParameters}`, authToken)
      .then(response => {
        const { success, totalCount, requirementSets } = response.data;

        if (success) {
          dispatch(setTotalAmount(totalCount ? totalCount : 0));
          dispatch(setList(requirementSets ? requirementSets : []));
        } else {
          dispatch(setError(errorDefault));
          dispatch(setTotalAmount(0));
        }
      })
      .catch(() => {
        dispatch(setError(errorConnection));
      });
  };
};
