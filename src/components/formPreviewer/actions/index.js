import Api from '../../../lib/api';
import * as types from './types';

export const assignForm = (form) => {
  return (dispatch, getState) => {
    dispatch({type: types.ASSIGN_PREVIEW_FORM, form });
  }
}

export const clearForm = () => {
  return (dispatch, getState) => {
    dispatch({type: types.CLEAR_PREVIEW_FORM });
  }
}

/* support to populate dropdown lists */
export const clearFormPreviewDropDownLists = () => {
  return {
    type: types.SET_FORM_PREVIEW_DROP_DOWN_LISTS,
    formFieldsLists: [],
    scorecardsSourcesList: [],
    companiesTypesList: [],
    turnOverRatesList: [],
  };
};
export const setFormPreviewDropDownLists = (lists) => {
  return {
    type: types.SET_FORM_PREVIEW_DROP_DOWN_LISTS,
    formFieldsLists: lists.formFieldsLists,
    scorecardsSourcesList: lists.scorecardsSourcesList,
    companiesTypesList: lists.companiesTypesList,
    turnOverRatesList: lists.turnOverRatesList,
  };
};
export const fetchFormDropDownLists = () => {
  return (dispatch, getState) => {
    const token = getState().login.authToken;
    dispatch(clearFormPreviewDropDownLists());
    return Api.get(
      `forms/fieldslists`,
      token
    ).then(response => {
      const {success, data } = response.data;
      if (success && data) {
        //console.log(data);
        dispatch(setFormPreviewDropDownLists(data));
      }
    })
    .catch(error => {
      console.log(error);
    });
  };
}

export const setTableOfContentItems = (tableOfContentItems) => {
  return {
    type: types.SET_FORM_TABLE_OF_CONTENTS,
    tableOfContentItems
  };
};

export const setFormPreviewerPage = (page) => {
  return (dispatch, getState) => {
    dispatch({
      type: types.SET_FORM_PREVIEWER_PAGE,
      page
    });
  }
}

export const setFetchingFormFiles = (isFetching) => {
  return {
    type: types.SET_FETCHING_FORM_FILES,
    isFetching
  };
};

export const setFormFilesError = (error) => {
  return {
    type: types.SET_FORM_FILES_ERROR,
    error
  };
};

export const setFormFiles = (formFiles) => {
  return {
    type: types.SET_FORM_FILES,
    formFiles
  };
};

export const fetchFilesForSavedForm = (query) => {
  // console.log('query = ', query)
  return (dispatch, getState) => {
    const { login, localization } = getState();
    let {
      error10005,
      error10006,
      error10007,
      error10011,
      error10019,
      errorDefault,
      errorConnection,
    } = localization.strings.scProfile.files.actions;
    const token = login.authToken;

    dispatch(setFetchingFormFiles(true));

    const urlQuery = 'filesForForm';
    const urlParameters = `?${Object.keys(query).map(i => `${i}=${query[i]}`).join('&')}`;

    return Api.get(`${urlQuery}${urlParameters}`, token)
      .then(response => {
        const { success, data } = response.data;
        let errorMsg = '';
        if (success) {
          dispatch(setFormFiles(data));
        }
        else {
          switch (data.errorCode) {
            case 10005:
              errorMsg = error10005;
              break;
            case 10006:
              errorMsg = error10006;
              break;
            case 10007:
              errorMsg = error10007;
              break;
            case 10011:
              errorMsg = error10011;
              break;
            case 10019:
              errorMsg = error10019;
              break;
            default:
              errorMsg = errorDefault;
              break;
          }
          dispatch(setFormFilesError(errorMsg));
        }
        dispatch(setFetchingFormFiles(false));
      })
      .catch(error => {
        dispatch(setFormFilesError(errorConnection));
      });
  };
};