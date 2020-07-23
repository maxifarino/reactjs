import _ from 'lodash';
import * as types from './types';
import Api from '../../../../lib/api';

export const setInsuredDetailsError = (error) => {
  return {
    type: types.SET_INSURED_DETAILS_ERROR,
    payload: error
  };
};

export const setInsured = (insured) => {
  return {
    type: types.SET_INSURED_DETAILS,
    payload: insured
  };
};

export const setInsuredDetailsLoading = () => {
  return {
    type: types.SET_INSURED_DETAILS_FETCHING
  };
};

export const fetchInsured = (id) => {
  return (dispatch, getState) => {
    const { login: { authToken }, localization } = getState();

    let { errorConnection } = localization.strings.hiringClients.actions;
    const urlQuery = `cf/insureds?insuredId=${id}`;

    dispatch(setInsuredDetailsLoading());

    return Api.get(urlQuery, authToken)
      .then(response => {
        const { success, data } = response.data;
        let errorMsg = '';

        if (success) {
          dispatch(setInsured(_.isEmpty(data) ? [] : data[0]));
        } else {
          errorMsg = getError(data.errorCode, localization);
          dispatch(setInsuredDetailsError(errorMsg));
        }
      })
      .catch(() => {
        dispatch(setInsuredDetailsError(errorConnection));
      });
  };
};

// TAGS
export const setInsuredTagsLoading = () => {
  return {
    type: types.SET_INSURED_TAGS_FETCHING,
  };
};
export const setInsuredTagsError = (error) => {
  return {
    type: types.SET_INSURED_TAGS_ERROR,
    payload: error,
  };
};
export const setInsuredTags = (tags) => {
  return {
    type: types.SET_INSURED_TAGS,
    payload: tags,
  };
};
export const fetchInsuredTags = (id) => {
  return (dispatch, getState) => {
    const { login: { authToken }, localization } = getState();

    let { errorConnection } = localization.strings.hiringClients.actions;
    const urlQuery = `cf/projectInsuredTags?insuredId=${id}`;

    dispatch(setInsuredTagsLoading());

    return Api.get(urlQuery, authToken)
      .then(response => {
        const { success, data } = response.data;
        let errorMsg = '';

        if (success) {
          dispatch(setInsuredTags(_.isEmpty(data) ? [] : data));
        } else {
          errorMsg = getError(data.errorCode, localization);
          dispatch(setInsuredTagsError(errorMsg));
        }
      })
      .catch(() => {
        dispatch(setInsuredTagsError(errorConnection));
      });
  };
};

export const setEditTagLoading = (tagId) => {
  return {
    type: types.SET_EDIT_TAG_FETCHING,
    payload: tagId,
  };
};

export const setEditTagSuccess = (tag) => {
  return {
    type: types.SET_EDIT_TAG_SUCCESS,
    payload: tag,
  };
};

export const setDeleteTagSuccess = (tagId) => {
  return {
    type: types.SET_DELETE_TAG_SUCCESS,
    payload: tagId,
  };
};

export const setEditTagError = (tagId) => {
  return {
    type: types.SET_EDIT_TAG_ERROR,
    payload: tagId
  };
};

export const sendTag = (tag, condition) => {
  return (dispatch, getState) => {
    const { login: { authToken } } = getState();

    const urlQuery = `cf/projectInsuredTags`;

    const payload = {
      tagId: tag.Id,
      projectInsuredId: tag.ProjectInsuredID,
    };

    dispatch(setEditTagLoading(payload.tagId));

    let apiMethod;
    if (condition) {
      apiMethod = 'post';
    } else {
      apiMethod = 'delete';
    }

    return Api[apiMethod](urlQuery, payload, authToken)
      .then(response => {
        const { success } = response.data;

        if (success) {
          if (condition) {
            dispatch(setEditTagSuccess(tag));
          } else {
            dispatch(setDeleteTagSuccess(payload.tagId));
          }
        } else {
          dispatch(setEditTagError(payload.tagId));
        }
      })
      .catch(() => {
        dispatch(setEditTagError(payload.tagId));
      });
  };
};

const getError = (errorCode, localization) => {
  let {
    error10005,
    error10006,
    error10007,
    error10011,
    error10019,
    errorDefault,
  } = localization.strings.hiringClients.actions; //TODO: localization
  let errorMsg = '';
  switch (errorCode) {
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
  return errorMsg;
};

export const setTagTab = (payload) => {
  return {
    type: types.SET_SELECT_TAG_TAB,
    payload: payload
  };
};

export const setHideAddTask = () => {
  return {
    type: types.SET_HIDE_ADD_TASK
  };
};

export const setHideAddNote = () => {
  return {
    type: types.SET_HIDE_ADD_NOTE
  };
}

export const setHolderSelected = (payload) => {  
  return {
    type: types.SET_HOLDER_SELECTED,
    payload: payload
  }
}