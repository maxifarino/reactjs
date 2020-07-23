import * as types from './types';
import Api from '../../../../../../lib/api';
import Utils from '../../../../../../lib/utils';

// SETS
export const setCustomFieldsListError = (error) => {
  return {
    type: types.SET_CUSTOM_FIELDS_LIST_ERROR,
    payload: error
  };
};
export const setCustomFieldsList = (list, totalAmount) => {
  return {
    type: types.SET_CUSTOM_FIELDS_LIST,
    payload: {
      list,
      totalAmount
    }
  };
};
export const setFetchingCustomFields = () => {
  return {
    type: types.SET_FETCHING_CUSTOM_FIELDS
  };
};
export const setShowModal = (show) => {
  return {
    type: types.SET_SHOW_CUSTOM_FIELDS_MODAL,
    payload: show
  }
}

// FETCH
export const fetchCustomFields = (query_params) => {
  return (dispatch, getState) => {
    const { login, localization, customFields } = getState();
    const { errorDefault, errorConnection } = localization.strings.customFields.errors;
    const { authToken } = login;
    const { customFieldsPerPage } = customFields;

    dispatch(setFetchingCustomFields());

    const urlParameters = Utils.getPaginatedUrlParameters(query_params, customFieldsPerPage);
    const urlQuery = `cf/customFields`;
    return Api.get(`${urlQuery}${urlParameters}`, authToken)
    .then(response => {
      const { success, customFields, totalCount } = response.data;
      if(success) {
        dispatch(setCustomFieldsList(customFields||[], totalCount||0));
      }
      else {
        dispatch(setCustomFieldsListError(errorDefault));
      }
    })
    .catch(error => {
      dispatch(setCustomFieldsListError(errorConnection));
    });
  };
};


/* POST CUSTOM FIELD */
export const setPostCustomFieldError = (error) => {
  return {
    type: types.SET_POST_CUSTOM_FIELD_ERROR,
    payload: error
  };
};
export const postCustomField = (customFieldPayload, callback) => {
  return (dispatch, getState) => {
    let apiMethod = customFieldPayload.customFieldId? 'put':'post';
    const { login, localization } = getState();
    const { authToken } = login;
    const { postErrorDefault, errorConnection } = localization.strings.customFields.errors;
    dispatch(setPostCustomFieldError(null));

    return Api[apiMethod](
      'cf/customFields',
      customFieldPayload,
      authToken
    ).then(response => {
      const {success, data } = response.data;
      if(success) {
        if(callback)callback(data);
      }
      else {
        console.log('* error from server', data);
        dispatch(setPostCustomFieldError(postErrorDefault));
        if(callback)callback(null);
      }
    })
    .catch(error => {
      console.log('error', error);
      dispatch(setPostCustomFieldError(errorConnection));
      if(callback)callback(null);
    });

  }
}
