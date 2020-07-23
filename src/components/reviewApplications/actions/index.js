import axios from 'axios';
import Api from '../../../lib/api';
import Utils from '../../../lib/utils';
import * as types from './types';

export const setAddReviewApplicationsSuccess = (success) => {
  return {
    type: types.SET_ADD_REVIEW_APPLICATIONS_SUCCESS,
    payload: {
      success
    }
  };
};

export const setAddReviewApplicationsError = (error) => {
  return {
    type: types.SET_ADD_REVIEW_APPLICATIONS_ERROR,
    payload: {
      error
    }
  };
};


export const setFetchingReviewApplications = (isFetching) => {
  return {
    type: types.SET_FETCHING_REVIEW_APPLICATIONS,
    payload: {
      isFetching
    }
  };
};
export const setReviewApplicationsList = (list, total) => {
  return {
    type: types.SET_REVIEW_APPLICATIONS_LIST,
    payload: {
      list,
      total
    }
  };
};
export const setReviewApplicationsListError = (error) => {
  return {
    type: types.SET_REVIEW_APPLICATIONS_LIST_ERROR,
    payload: {
      error
    }
  };
};

export const setReviewApplicationsHiringClient = (list) => {
  return {
    type: types.SET_REVIEW_APPLICATIONS_HIRING_CLIENT,
    payload: {
      list
    }
  };
};
export const setReviewApplicationsHiringClientError = (error) => {
  return {
    type: types.SET_REVIEW_APPLICATIONS_HIRING_CLIENT_ERROR,
    payload: {
      error
    }
  };
};

export const setAddReviewApplications = (payload, callback) => {
  return (dispatch, getState) => {
    const { login: { authToken }, localization } = getState();
    const {
      error10000,
      error10001,
      error10003,
      error10005,
      error10006,
      error10007,
      error10019,
      errorDefault,
      errorConnection
    } = localization.strings.reviewApplications.errors;

    const errors = {
      10000: error10000,
      10001: error10001,
      10003: error10003,
      10005: error10005,
      10006: error10006,
      10017: error10007,
      10019: error10019,
    };
    console.log(payload);
    
    dispatch(setAddReviewApplicationsError(null));

    return Api.post('subcontractors/applications', payload, authToken)
      .then(response => {
        const {success, data} = response.data;
        
        if (success) {
          dispatch(setAddReviewApplicationsSuccess(success));
          if (callback) callback (data);
        } else {
          const errorMsg = errors[data.errorCode] || errorDefault;          
          dispatch(setAddReviewApplicationsError(errorMsg));
          if (callback) callback (null);
        }
      })
      .catch(() => {
        dispatch(setAddReviewApplicationsError(errorConnection));
        if (callback) callback (null);
      });
  }
};


export const fetchReviewApplications = (queryParams) => {
  return (dispatch, getState) => {
    const { login, localization, search } = getState();
    const { errorDefault, errorConnection } = localization.strings.hiringClients.actions;
    const { authToken } = login;
    const { itemsPerPage } = search;
    console.log(queryParams);

    dispatch(setFetchingReviewApplications(true));
    dispatch(setReviewApplicationsListError(null));
    dispatch(setReviewApplicationsList([]));

    const urlParameters = Utils.getPaginatedUrlParameters(queryParams, itemsPerPage);
    let urlQuery = `/subcontractors/applications`;
    return Api.get(`${urlQuery}${urlParameters}`, authToken)
      .then(response => {
        const { success, data, totalCount } = response.data;
        //console.log(response.data);
        if(success) {
          dispatch(setReviewApplicationsList(data, totalCount));
        }
        else {
          dispatch(setReviewApplicationsListError(errorDefault));
        }
        dispatch(setFetchingReviewApplications(false));
      })
      .catch(error => {
        dispatch(setReviewApplicationsListError(errorConnection));
        dispatch(setFetchingReviewApplications(false));
      });
  };
};

export const fetchHiringClient = (payload, callback) => {
  return (dispatch, getState) => {
    const { login, localization } = getState();
    const { errorDefault, errorConnection } = localization.strings.hiringClients.actions;
    const { authToken } = login;
    const queryParams = {};

    dispatch(setReviewApplicationsHiringClientError(null));
    dispatch(setReviewApplicationsHiringClient([]));

    const urlParameters = Utils.getUrlParameters(queryParams);
    let urlQuery = `hiringclients`;
    return Api.get(`${urlQuery}${urlParameters}`, authToken)
      .then(response => {
        const { success, data } = response.data;
        if(success) {
          dispatch(setReviewApplicationsHiringClient(data.hiringClients));
        }
        else {
          dispatch(setReviewApplicationsHiringClientError(errorDefault));
        }
      })
      .catch(error => {
        dispatch(setReviewApplicationsHiringClientError(errorConnection));
      });
  };
};

export const setApplicationsError = (error) => {
  return {
    type: types.SET_APPLICATIONS_ERROR,
    payload: {
      error
    }
  };
};

export const setApproveApplications = (data) => {
  return {
    type: types.SET_APPROVE_APPLICATIONS,
    payload: {
      data
    }
  };
};

export const setDeclineApplications = (data) => {
  return {
    type: types.SET_DECLINE_APPLICATIONS,
    payload: {
      data
    }
  };
};

export const approveApplications = (payload, callback) => {
  console.log("approveApplications");
  return (dispatch, getState) => {
    const { login: { authToken }, localization } = getState();
    const {
      error10000,
      error10001,
      error10003,
      error10005,
      error10006,
      error10007,
      error10019,
      errorDefault,
      errorConnection
    } = localization.strings.reviewApplications.errors;

    const errors = {
      10000: error10000,
      10001: error10001,
      10003: error10003,
      10005: error10005,
      10006: error10006,
      10017: error10007,
      10019: error10019,
    };
    console.log(payload);
    
    dispatch(setApplicationsError(null));
    dispatch(setApproveApplications(null));
    
    return Api.post('subcontractors/applications/approve', payload, authToken)
      .then(response => {
        const {success, data} = response.data;
        
        if (success) {
          dispatch(setApproveApplications(true));
          if (callback) callback (success);
        } else {
          const errorMsg = errors[data.errorCode] || errorDefault;          
          dispatch(setApplicationsError(errorMsg));
          if (callback) callback (null);
        }
      })
      .catch(() => {
        dispatch(setApplicationsError(errorConnection));
        if (callback) callback (null);
      });
  }
};

export const declineApplications = (payload, callback) => {
  console.log("declineApplications");
  return (dispatch, getState) => {
    const { login: { authToken }, localization } = getState();
    const {
      error10000,
      error10001,
      error10003,
      error10005,
      error10006,
      error10007,
      error10019,
      errorDefault,
      errorConnection
    } = localization.strings.reviewApplications.errors;

    const errors = {
      10000: error10000,
      10001: error10001,
      10003: error10003,
      10005: error10005,
      10006: error10006,
      10017: error10007,
      10019: error10019,
    };
    console.log(payload);
    
    dispatch(setApplicationsError(null));
    dispatch(setDeclineApplications(null));
    
    return Api.post('subcontractors/applications/decline', payload, authToken)
      .then(response => {
        const {success, data} = response.data;
        
        if (success) {
          dispatch(setDeclineApplications(true));
          if (callback) callback (success);
        } else {
          const errorMsg = errors[data.errorCode] || errorDefault;          
          dispatch(setApplicationsError(errorMsg));
          if (callback) callback (null);
        }
      })
      .catch(() => {
        dispatch(setApplicationsError(errorConnection));
        if (callback) callback (null);
      });
  }
};

export const setShowModal = (show) => {
  return {
    type: types.SET_SHOW_ANSWERS_MODAL,
    payload: show
  }
};