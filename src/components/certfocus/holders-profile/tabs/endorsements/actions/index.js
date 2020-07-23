import Api from '../../../../../../lib/api';
import * as types from './types';

export const setFetching = (fetching) => {
  return {
    type: types.SET_FETCHING_ENDORSEMENTS,
    payload: fetching
  };
};

export const setError = (error) => {
  return {
    type: types.SET_ENDORSEMENTS_ERROR,
    payload: error
  };
};

export const setList = (list) => {
  return {
    type: types.SET_ENDORSEMENTS_LIST,
    payload: list
  };
};

export const setTotalAmount = (total) => {
  return {
    type: types.SET_TOTAL_AMOUNT_OF_ENDORSEMENTS,
    payload: total
  };
};

export const addError = (error) => {
  return {
    type: types.SET_ENDORSEMENTS_ADD_ERROR,
    payload: error
  };
};

export const addSuccess = () => {
  return {
    type: types.SET_ENDORSEMENTS_ADD_SUCCESS,
  };
};

export const addFetching = () => {
  return {
    type: types.SET_ENDORSEMENTS_ADD_FETCHING,
  };
};


export const setShowModal = (status) => {
  return {
    type: types.SET_ENDORSEMENTS_SHOW_MODAL,
    payload: status
  };
};

export const fetchEndorsements = (queryParams) => {
  return (dispatch, getState) => {
    const { login: { authToken }, localization } = getState();
    let {
      errorDefault,
      errorConnection,
    } = localization.strings.hcProfile.projects.actions;
    let urlParameters = '';

    dispatch(setFetching(true));
    dispatch(setTotalAmount(0));

    const { endorsementsPerPage } = getState().endorsements;

    if (queryParams) {
      if (!queryParams.pageNumber) {
        queryParams.pageNumber = 1;
      }
      queryParams.pageSize = endorsementsPerPage;
    } else {
      queryParams = {
        pageNumber: 1,
        pageSize: endorsementsPerPage
      };
    }

    let urlQuery = 'cf/endorsements';

    urlParameters = `?${Object.keys(queryParams).map(i => `${i}=${queryParams[i]}`).join('&')}`;

    return Api.get(`${urlQuery}${urlParameters}`, authToken)
      .then(response => {
        const { success, totalCount, endorsements } = response.data;

        if (success) {
          dispatch(setTotalAmount(totalCount ? totalCount : 0));
          dispatch(setList(endorsements ? endorsements : []));
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

export const sendEndorsements = (input, callback) => {
  return (dispatch, getState) => {
    const { login: { authToken }, localization } = getState();

    const {
      errorDefault,
      errorConnection,
    } = localization.strings.certFocusProjects.errors;

    dispatch(addFetching());

    let apiMethod;

    if (input.endorsementId) {
      apiMethod = 'put';
    } else {
      apiMethod = 'post';
    }

    return Api[apiMethod](`cf/endorsements`, input, authToken)
      .then(response => {
        const { success } = response.data;

        if (success) {
          dispatch(addSuccess());
          if (callback) callback(true);
        } else {
          dispatch(addError(errorDefault));
          if (callback) callback(false);
        }
      })
      .catch(() => {
        dispatch(addError(errorConnection));
        if (callback) callback(false);
      });
  };
};
