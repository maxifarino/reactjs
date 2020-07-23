import Api from '../../../../lib/api';
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


export const fetchCoveragesTopLayers = (queryParams, callback) => {
  return (dispatch, getState) => {
    const { login: { authToken }, localization } = getState();
    let {
      errorDefault,
      errorConnection,
    } = localization.strings.hcProfile.projects.actions;
    
    let urlQuery = 'cf/coverages/topLayers';

    const urlParameters = `?${Object.keys(queryParams).map(i => `${i}=${queryParams[i]}`).join('&')}`;

    return Api.get(`${urlQuery}${urlParameters}`, authToken)
      .then(response => {
        const { success, data } = response.data;
        
        if (success) {
          callback(false, data);
        } else {
          callback(true, errorDefault);
        }
      })
      .catch(() => {
        callback(true, errorConnection);
      });
  };
};

export const setTopLayer = (payload, callback) => {
  return (dispatch, getState) => {
    const { login: { authToken }, localization } = getState();
    let {
      errorDefault,
      errorConnection,
    } = localization.strings.hcProfile.projects.actions;
    
    let urlQuery = 'cf/coverages/topLayers';
    
    return Api.post(`${urlQuery}`, payload, authToken)
      .then(response => {
        const { success, data } = response.data;
        
        if (success) {
          callback(false, data);
        } else {
          callback(true, errorDefault);
        }
      })
      .catch(() => {
        callback(true, errorConnection);
      });
  };
};


export const setRuleGroupsError = (error) => {
  return {
    type: types.SET_RULE_GROUPS_ERROR,
    payload: error
  };
};

export const setRuleGroupsList = (list) => {
  return {
    type: types.SET_RULE_GROUPS_LIST,
    payload: list
  };
};

export const fetchRuleGroups = (queryParams, callback) => {
  return (dispatch, getState) => {
    const { login: { authToken }, localization } = getState();
    let {
      errorDefault,
      errorConnection,
    } = localization.strings.hcProfile.projects.actions;

    let urlQuery = 'cf/coverages/status';

    const urlParameters = `?${Object.keys(queryParams).map(i => `${i}=${queryParams[i]}`).join('&')}`;

    return Api.get(`${urlQuery}${urlParameters}`, authToken)
      .then(response => {
        const { success, data } = response.data;        
        if (success) {
          dispatch(setRuleGroupsList(data ? data : []));
          callback(true);
        } else {
          dispatch(setRuleGroupsError(errorDefault));
          callback(false);
        }
      })
      .catch(() => {
        dispatch(setRuleGroupsError(errorConnection));
        callback(false);
      });
  };
};