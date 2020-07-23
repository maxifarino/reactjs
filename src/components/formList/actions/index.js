import * as types from './types';
import Api from '../../../lib/api';

import { showErrorAlert } from '../../alerts/index';

export const setFormsList = (list) => {
  return {
    type: types.SET_FORMS_LIST,
    list
  };
};

export const setDiscreetAcountsList = (list) => {
  return {
    type: types.SET_DISCREET_ACCOUNTS_LIST,
    list
  };
};

export const setScorecardsFieldsList = (list) => {
  return {
    type: types.SET_SCORECARDS_FIELDS_LIST,
    list
  };
};

export const setFormsListError = (error) => {
  return {
    type: types.SET_FORMS_LIST_ERROR,
    error
  };
};

export const setFetchingForms = (isFetching) => {
  return {
    type: types.SET_FETCHING_FORMS,
    isFetching
  };
};

export const setTotalAmountOfForms = (formsLength) => {
  return {
    type: types.SET_TOTAL_AMOUNT_OF_FORMS,
    formsLength
  };
};

export const setFormCreatorUsers = (formCreatorUsers) => {
  return {
    type: types.SET_FORM_CREATOR_USERS,
    formCreatorUsers
  };
};

export const setFormSCSentTo = (formSCSentTo) => {
  return {
    type: types.SET_FORM_SC_SENT_TO,
    formSCSentTo
  };
};

export const setFetchingHiddenScorecardFields = (fetching) => {
  return {
    type: types.SET_FETCHING_HIDDEN_SCORECARD_FIELDS,
    fetching,
  };
};

export const setListHiddenScorecardFields = (fields, formId) => {
  return {
    type: types.SET_FORMS_LIST_HIDDEN_SCORECARD_FIELDS,
    payload: {
      fields,
      formId,
    },
  };
};

export const updateDiscreteAccountsProps = (payload) => {
  return {
    type: types.SET_UPDATE_FORMS_LIST_DISCRETE_ACCOUNTS,
    payload,
  };
};

export const fetchForms = (queryParams) => {
  return (dispatch, getState) => {
    const token = getState().login.authToken;
    let urlParameters = '';

    dispatch(setFetchingForms(true));
    dispatch(setTotalAmountOfForms(0));

    if (queryParams) {
      if (!queryParams.pageNumber) {
        queryParams.pageNumber = 1;
      }
    }
    else {
      queryParams = {
        pageNumber: 1
      };
    }

    queryParams.pageSize = getState().forms.formsPerPage;
    urlParameters = `?${Object.keys(queryParams).map(i => `${i}=${queryParams[i]}`).join('&')}`;
    return Api.get(`forms${urlParameters}`, token)
      .then(response => {
        const { success, data } = response.data;
        let errorMsg = '';
        if (success) {
          dispatch(setTotalAmountOfForms(data.totalCount));
          dispatch(setFormsList(data.forms));
          dispatch(setDiscreetAcountsList(data.discreetAccounts));
          dispatch(setScorecardsFieldsList(data.scorecardsFields));
        } else {
          switch (data.errorCode) {
            case 10003:
              errorMsg = 'Error: invalid filter data. Please, adjust the filters values and try again.';
              break;
            case 10005:
              errorMsg = 'Error: This is an invalid session. Please, sign in again.';
              break;
            case 10006:
              errorMsg = 'Error: You are not logged in. Please, sign in and try again.';
              break;
            case 10007:
              errorMsg = 'Error: Session expired. Please, sign in and try again.';
              break;
            case 10011:
              errorMsg = 'Error: your current form is disabled. Please, contact an admin to enable this account and login again to continue.';
              break;
            default:
              errorMsg = '';
              break;
          }

          dispatch(setFormsListError(errorMsg));
          dispatch(setTotalAmountOfForms(0));
          dispatch(setFormsList([]));
          dispatch(setDiscreetAcountsList([]));
          dispatch(setScorecardsFieldsList([]));
        }
        dispatch(setFetchingForms(false));
      })
      .catch(error => {
        console.log(error)
        dispatch(setFormsListError('Connection error - Please, check your Internet service.'));
      });
  };
};

export const fetchFormCreatorUsers = () => {
  return (dispatch, getState) => {
    const token = getState().login.authToken;
    return Api.get(
      `forms/users`,
      token
    ).then(response => {
      const { success, data } = response.data;
      if (success) {
        dispatch(setFormCreatorUsers(data.formCreatorUsers));
      }
    })
      .catch(error => {
        console.log(error)
        dispatch(setFormsListError('Connection error - Please, check your Internet service.'));
      });
  };
}

export const fetchFormSCSentTo = () => {
  return (dispatch, getState) => {
    const token = getState().login.authToken;
    return Api.get(
      `forms/scsentto`,
      token
    ).then(response => {
      const { success, data } = response.data;
      if (success) {
        dispatch(setFormSCSentTo(data.formSCSentTo));
      }
    })
      .catch(error => {
        console.log(error)
        dispatch(setFormsListError('Connection error - Please, check your Internet service.'));
      });
  };
}

export const fetchSaveFormByDiscreetAccount = (form, callback) => {
  return (dispatch, getState) => {
    const token = getState().login.authToken;

    return Api.post(
      `forms/discreetAccount`,
      { data: form },
      token
    ).then(response => {
      const { success, data } = response.data;

      if (success) {
        callback(null, data);
      } else {
        callback(true, null);
      }
    }).catch(error => {
      console.log(error)
      dispatch(setFormsListError('Connection error - Please, check your Internet service.'));
    });
  };
}

export const fetchSaveFormHiddenScorecardField = (form, callback) => {
  return (dispatch, getState) => {
    const token = getState().login.authToken;

    dispatch(setFetchingHiddenScorecardFields(true));

    return Api.post(
      `forms/hiddenScorecardFields`, { data: {
        formId: form.formId,
        hiddenScorecardFields: form.fields,
      }},
      token
    ).then(response => {
      const { success } = response.data;

      if (success) {
        dispatch(setListHiddenScorecardFields(form.fields, form.formId));
        callback();
      } else {
        showErrorAlert('Error', 'There was an error saving the hidden fields');
      }
    }).catch(error => {
      showErrorAlert('Error', 'Connection error - Please, check your Internet service.');
    }).finally(() => {
      dispatch(setFetchingHiddenScorecardFields(false));
    });
  };
}
