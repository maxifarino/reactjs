import * as types from '../actions/types';

export default function HCProfileReducer(state = {
  fetchingVideoHeader: false,
  videos: [],
  images: []
}, action) {
  switch(action.type) {
    case types.SET_FETCHING_VIDEO_HEADER:
      return Object.assign({}, state, {
        fetchingVideoHeader: action.isFetching
      });
    case types.SET_VIDEO_DATA:
      return Object.assign({}, state, {
        videos: action.list
      });
    case types.SET_VIDEO_IMAGES:
      return Object.assign({}, state, {
        images: [...state.images, action.list]
      });
    default:
      return state;
  }
};
