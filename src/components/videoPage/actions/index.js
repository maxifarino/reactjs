import * as types from './types';
import Api from '../../../lib/api';


export const setVideoData = (list) => {
  return {
    type: types.SET_VIDEO_DATA,
    list
  };
};

export const setVideoImages = (list) => {
  return {
    type: types.SET_VIDEO_IMAGES,
    list
  };
};

export const setFetchingVideoHeader = (isFetching) => {
  return {
    type: types.SET_FETCHING_VIDEO_HEADER,
    isFetching
  };
};

export const fetchVideoImages = (imgId) => {
  return (dispatch, getState) => {
    const token = getState().login.authToken;
    return Api.get(`videoImages?imgId=${imgId}`, token
    ).then(response => {
      const { success, data } = response.data
      if (success && data) {
        dispatch(setVideoImages(data));
      } else {
        console.log('no image available')
      }
    })
  }
}

export const fetchVideoData = (roleId) => {
  return (dispatch, getState) => {
    const token = getState().login.authToken;
    dispatch(setFetchingVideoHeader(true));
    dispatch(setVideoData([]));
    return Api.get(`videos?roleId=${roleId}`, token
    ).then(response => {
      const { success, data } = response.data;
      if (success && data) {
        dispatch(setVideoData(data));
      }
      dispatch(setFetchingVideoHeader(false));
    })
    .catch(error => {
      console.log(error);
      dispatch(setFetchingVideoHeader(false));
    });
  };
  
};