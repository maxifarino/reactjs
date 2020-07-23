import * as types from './types';
import Api from '../../../lib/api';

export const setFormDiscreetAccountsSelected=(list)=>{
  return {
    type: types.SET_FORM_DISCREET_ACCOUNT_SELECTED,
    list
  };
}

export const setFormsList = (list) => {  
  return {
    type: types.SET_SAVED_FORMS_LIST,
    list
  };
};

export const setFormsListError = (error) => {
  return {
    type: types.SET_SAVED_FORMS_LIST_ERROR,
    error
  };
};

export const setFetchingForms = (isFetching) => {
  return {
    type: types.SET_FETCHING_SAVED_FORMS,
    isFetching
  };
};

export const setTotalAmountOfForms = (formsLength) => {
  return {
    type: types.SET_TOTAL_AMOUNT_OF_SAVED_FORMS,
    formsLength
  };
};

export const fetchForms = (queryParams, origin) => {
  if (origin) {
    // console.log('origin = ', origin)
    // console.log('queryParams from origin = ', queryParams)
    const date = new Date
    // console.log('timeStamp = ', date.getTime())
  }
  // console.log('actions.fetchForms queryParams = ', queryParams)
  return (dispatch, getState) => {
    const token = getState().login.authToken;
    let urlParameters = '';

    dispatch(setFetchingForms(true));
    dispatch(setTotalAmountOfForms(0));

    if(queryParams) {
      if(!queryParams.pageNumber) {
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
    // console.log('formFetch url = ', 'forms/savedforms' + urlParameters)
    return Api.get(`forms/savedforms${urlParameters}`, token)
    .then(response => {
      const {success, data } = response.data;
      // console.log('fetchForms response.data = ', response.data)
      let errorMsg = '';
      if(success) {
        dispatch(setTotalAmountOfForms(data.totalCount));
        dispatch(setFormsList(data.savedForms));
      }
      else {
        switch(data.errorCode) {
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
      }
      dispatch(setFetchingForms(false));
    })
    .catch(error => {
      console.log(error)
      dispatch(setFormsListError('Connection error - Please, check your Internet service.'));
      dispatch(setTotalAmountOfForms(0));
      dispatch(setFormsList([]));
      dispatch(setFetchingForms(false));
    });
  };
};

export const setFormCreatorUsers = (formCreatorUsers) => {
  return {
    type: types.SET_SAVED_FORM_CREATOR_USERS,
    formCreatorUsers
  };
};
export const setFormSCSentTo = (formSCSentTo) => {
  return {
    type: types.SET_SAVED_FORM_SC_SENT_TO,
    formSCSentTo
  };
};
export const fetchSavedFormsFilters = () => {
  return (dispatch, getState) => {
    const token = getState().login.authToken;
    dispatch(setFormCreatorUsers([]));
    dispatch(setFormSCSentTo([]));
    return Api.get(
      `forms/savedformsfilter`,
      token
    ).then(response => {
      const {success, data } = response.data;
      if (success) {
        dispatch(setFormCreatorUsers(data.creators));
        dispatch(setFormSCSentTo(data.subcontractors));
      }
    })
    .catch(error => {
      console.log(error)
      dispatch(setFormsListError('Connection error - Please, check your Internet service.'));
    });
  };
}

export const setFormIdForFetching = (formId) => {
  return {
    type: types.SET_FORM_ID_FOR_FETCHING,
    formId
  };
};

/* Submission Link support */
export const setFormSubmissionLink = (submissionLink) => {
  return {
    type: types.SET_FORM_SUBMISSION_LINK,
    submissionLink
  };
};
export const fetchFormSubmissionLink = (subcontractorId, hiringClientId) => {
  return (dispatch, getState) => {
    const token = getState().login.authToken;
    dispatch(setFormSubmissionLink(null));
    return Api.get(
      `subcontractors/submissionlink?subcontractorId=${subcontractorId}&hiringClientId=${hiringClientId}`,
      token
    ).then(response => {
      const {success, data, link } = response.data;
      if (success) {
        dispatch(setFormSubmissionLink(link));
      } else {
        console.log(data);
      }
    })
    .catch(error => {
      console.log(error)
      dispatch(setFormsListError('Connection error - Please, check your Internet service.'));
    });
  };
}

export const fetchFormDiscreetAccounts = (urlParameters) => {
  return (dispatch, getState) => {
    const token = getState().login.authToken;    
    return Api.get(
      `forms/discreetaccounts?formId=${urlParameters}`,
      token
    ).then(response => {             
       dispatch(setFormDiscreetAccountsSelected(response.data));
    })
    .catch(error => {
      console.log(error)
      dispatch(setFormsListError('Connection error - Please, check your Internet service.'));
    });
  };
}
