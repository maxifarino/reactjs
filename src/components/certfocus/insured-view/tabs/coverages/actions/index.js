import Api from '../../../../../../lib/api';
import * as types from './types';

export const setFetching = (fetching) => {
  return {
    type: types.SET_FETCHING_COVERAGES,
    payload: fetching
  };
};

export const setFetchingLayers = (fetching) => {
  return {
    type: types.SET_FETCHING_COVERAGES_LAYERS,
    payload: fetching
  };
};

export const setError = (error) => {
  return {
    type: types.SET_COVERAGES_ERROR,
    payload: error
  };
};

export const setLayersError = (error) => {
  return {
    type: types.SET_COVERAGES_ERROR_LAYERS,
    payload: error
  };
};

export const setList = (list) => {
  return {
    type: types.SET_COVERAGES_LIST,
    payload: list
  };
};

export const setLayersList = (list) => {
  return {
    type: types.SET_COVERAGES_LIST_LAYERS,
    payload: list
  };
};

export const setTotalAmount = (total) => {
  return {
    type: types.SET_TOTAL_AMOUNT_OF_COVERAGES,
    payload: total
  };
};

export const setLayersTotalAmount = (total) => {
  return {
    type: types.SET_TOTAL_AMOUNT_OF_COVERAGES_LAYERS,
    payload: total
  };
};

export const setShowModal = (status) => {
  return {
    type: types.SET_COVERAGES_SHOW_MODAL,
    payload: status
  };
};

export const fetchCoverages = (queryParams) => {
  return (dispatch, getState) => {
    const { login: { authToken }, localization } = getState();
    let {
      errorDefault,
      errorConnection,
    } = localization.strings.hcProfile.projects.actions;

    if (queryParams.parentCoverageId) {
      dispatch(setFetchingLayers(true));
      dispatch(setLayersTotalAmount(0));
    } else {
      dispatch(setFetching(true));
      dispatch(setTotalAmount(0));
    }

    const { coveragesPerPage } = getState().coverages;

    if (queryParams) {
      if (!queryParams.pageNumber) {
        queryParams.pageNumber = 1;
      }
      queryParams.pageSize = coveragesPerPage;
    } else {
      queryParams = {
        pageNumber: 1,
        pageSize: coveragesPerPage,
      };
    }

    let urlQuery = 'cf/projectInsuredCoverages';
    let urlParameters = `?${Object.keys(queryParams).map(i => `${i}=${queryParams[i]}`).join('&')}`;

    return Api.get(`${urlQuery}${urlParameters}`, authToken)
      .then(response => {
        const { success, totalCount, data } = response.data;

        if (success) {
          if (queryParams.parentCoverageId) {
            dispatch(setLayersList(data ? data : []));
            dispatch(setLayersTotalAmount(totalCount ? totalCount : 0));
          } else {
            dispatch(setTotalAmount(totalCount ? totalCount : 0));
            dispatch(setList(data ? data : []));
          }
        } else {
          if (queryParams.parentCoverageId) {
            dispatch(setLayersError(errorDefault));
            dispatch(setLayersTotalAmount(0));
          } else {
            dispatch(setError(errorDefault));
            dispatch(setTotalAmount(0));
          }
        }
      })
      .catch(() => {
        if (queryParams.parentCoverageId) {
          dispatch(setLayersError(errorConnection));
        } else {
          dispatch(setError(errorConnection));
        }
      });
  };
};

export const setFetchingAgency = () => {
  return {
    type: types.SET_FETCHING_COVERAGES_AGENCY,
  };
};

export const setAgency = (data) => {
  return {
    type: types.SET_COVERAGES_AGENCY,
    payload: data,
  };
};

export const setAgencyError = (error) => {
  return {
    type: types.SET_COVERAGES_AGENCY_ERROR,
    payload: error,
  };
};

export const fetchAgency = (id) => {
  return (dispatch, getState) => {
    const { login: { authToken }, localization } = getState();
    let {
      errorDefault,
      errorConnection,
    } = localization.strings.hcProfile.projects.actions;

    dispatch(setFetchingAgency(true));

    let urlQuery = `cf/agencies?agencyId=${id}`;

    return Api.get(urlQuery, authToken)
      .then(response => {
        const { success, data } = response.data;

        if (success) {
          dispatch(setAgency(data ? data.agencies[0] : []));
        } else {
          dispatch(setAgencyError(errorDefault));
        }
      })
      .catch(() => {
        dispatch(setAgencyError(errorConnection));
      });
  };
};

// TODO: REMOVE IF NOT NECESSARY
// EDIT SET
export const setAddError = (error) => {
  return {
    type: types.SET_COVERAGES_ADD_ERROR,
    payload: error
  };
};

export const sendCoverage = (input, callback) => {
  return (dispatch, getState) => {
    const { login: { authToken }, localization } = getState();

    let {
      errorDefault,
      errorConnection,
    } = localization.strings.hcProfile.projects.actions; // TODO: ADD LOCALIZATION

    dispatch(setAddError(''));

    return Api.put(`cf/coverages`, input, authToken)
      .then(response => {
        const { success } = response.data;

        if (success) {
          callback(true);
        } else {
          dispatch(setAddError(errorDefault));
          callback();
        }
      })
      .catch(() => {
        dispatch(setAddError(errorConnection));
        callback();
      });
  };
};
