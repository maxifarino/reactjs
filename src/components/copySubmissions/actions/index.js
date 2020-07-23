import * as types from './types';
import Api from './../../../lib/api';

/**
 * 
 * @param {*} queryParams 
 */
export const fetchHiringClient = (param) => {
    return (dispatch, getState) => {
        const { CFTasks: { tasksPerPage }, login, localization } = getState();
        const token = login.authToken;

        return Api.get(`hiringclients/subcontractor?scId=${param.scId}&formId=${param.formId}&hcId=${param.hiringClientId}`, token)
            .then(response => {
                const { success, data } = response.data;
                if (success) {
                    dispatch(setHiringClientSuccess(data));
                }
            });
    }
};

export const fetchFormsByHiringClient = (param) => {
    return (dispatch, getState) => {
        const { CFTasks: { tasksPerPage }, login, localization } = getState();
        const token = login.authToken;

        return Api.get(`hiringclients/forms?hcId=${param}`, token)
            .then(response => {
                const { success, data } = response.data;
                if (success) {
                    dispatch(setFormsHiringClientSuccess(data));
                    dispatch(setClearFormSubmission());
                }
            });
    }
};

export const fetSubmissionsByFormId = (param) => {

    return (dispatch, getState) => {
        dispatch(setFetchingTable(true));
        const { CFTasks: { tasksPerPage }, login, localization } = getState();
        const token = login.authToken;
        return Api.get(`hiringclients/submissions?formId=${param.formId}&hcId=${param.hcId}&&pageSize=${param.pageSize}&pageNumber=${param.pageNumber}&subContractorIdSelected=${param.subContractorIdSelected}`, token)
            .then(response => {
                const { success, data } = response.data;
                if (success) {
                    dispatch(setSubmissionFormsSuccess(data));
                    dispatch(setFetchingTable(false));
                }
            });
    }
}

/**
 * 
 * @param {*} data 
 */
export const setHiringClientSuccess = (data) => {
    return {
        type: types.SET_CERTFOCUS_HIRING_CLIENT_SUCCESS,
        payload: data
    };
};

export const setFormsHiringClientSuccess = (data) => {
    return {
        type: types.SET_CERTFOCUS_FORMS_SUCCESS,
        payload: data
    };
};

export const setSubmissionFormsSuccess = (data) => {
    return {
        type: types.SET_CERTFOCUS_SUBMISSIONS_FORMS_SUCCESS,
        payload: data
    };
};

export const setFetchingTable = (data) => {
    return {
        type: types.SET_CERTFOCUS_FETCHING_TABLE,
        payload: data
    };
};

export const setClearFormSubmission = () => {
    return {
        type: types.SET_CERTFOCUS_CLEAR_FORM_SUBMISSION
    };
};

export const setSubContractorSelected = (data) => {
    return {
        type: types.SET_CERTFOCUS_SUBCONTRACTOR_SELECTED,
        payload: data
    };
};

export const fetchCopySubmissionSuccess = () => {
    return {
        type: types.SET_CERTFOCUS_COPY_SUBMISSION_SUCCESS
    };
}

export const fetchCopySubmission = (paramsCopy, paramFilter,callback) => {
    return (dispatch, getState) => {
        const { CFTasks: { tasksPerPage }, login, localization } = getState();
        const token = login.authToken;

        return Api.post(`forms/copySubmission`, paramsCopy, token)
            .then(response => {
                const { success, data } = response.data;
                if (success) {                    
                    dispatch(fetSubmissionsByFormId(paramFilter));
                    callback();
                }
            });
    }
};