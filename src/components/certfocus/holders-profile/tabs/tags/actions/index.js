import * as types from './types';
import Api from '../../../../../../lib/api';
import Utils from '../../../../../../lib/utils';

// SETS
export const setTagsListError = (error) => {
  return {
    type: types.SET_TAGS_LIST_ERROR,
    payload: error
  };
};
export const setTagsList = (list, totalAmount) => {
  return {
    type: types.SET_TAGS_LIST,
    payload: {
      list,
      totalAmount
    }
  };
};
export const setFetchingTags = () => {
  return {
    type: types.SET_FETCHING_TAGS
  };
};
export const setShowModal = (show) => {
  return {
    type: types.SET_SHOW_TAGS_MODAL,
    payload: show
  }
}

// FETCHS
export const fetchTags = (query_params) => {
  return (dispatch, getState) => {
    const { login, localization, tags } = getState();
    const { errorDefault, errorConnection } = localization.strings.tags.errors;
    const { authToken } = login;
    const { tagsPerPage } = tags;

    dispatch(setFetchingTags());

    const urlParameters = Utils.getPaginatedUrlParameters(query_params, tagsPerPage);
    const urlQuery = `cf/tags`;
    return Api.get(`${urlQuery}${urlParameters}`, authToken)
    .then(response => {
      const { success, data, totalCount } = response.data;
      if(success) {
        dispatch(setTagsList(data||[], totalCount||0));
      }
      else {
        dispatch(setTagsListError(errorDefault));
      }
    })
    .catch(error => {
      dispatch(setTagsListError(errorConnection));
    });
  };
};


/* POST TAG */
export const setPostTagError = (error) => {
  return {
    type: types.SET_POST_TAG_ERROR,
    payload: error
  };
};
export const postTag = (tagPayload, callback) => {
  return (dispatch, getState) => {
    let apiMethod = tagPayload.tagId? 'put':'post';
    const { login, localization } = getState();
    const { authToken } = login;
    const { postErrorDefault, errorConnection } = localization.strings.tags.errors;
    dispatch(setPostTagError(null));

    return Api[apiMethod](
      'cf/tags',
      tagPayload,
      authToken
    ).then(response => {
      const {success, data } = response.data;
      if(success) {
        if(callback)callback(data);
      }
      else {
        console.log('* error from server', data);
        dispatch(setPostTagError(postErrorDefault));
        if(callback)callback(null);
      }
    })
    .catch(error => {
      console.log('error', error);
      dispatch(setPostTagError(errorConnection));
      if(callback)callback(null);
    });

  }
}
