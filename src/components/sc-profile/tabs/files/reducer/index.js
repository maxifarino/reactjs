import * as types from '../actions/types';

export default function filesReducer(state = {
  error: '',
  list: [],
  totalAmountOfFiles: 0,
  filesPerPage: 10,
  fetchingFiles: false,
  downloadingFile: false,
  viewFileUrl: ''
}, action) {
  switch(action.type) {
    case types.SET_DOWNLOADING_FILE:
      return Object.assign({}, state, {
        downloadingFile: action.isDownloading
      });

    case types.SET_FETCHING_FILES:
      return Object.assign({}, state, {
        fetchingFiles: action.isFetching
      });

    case types.SET_FILES:
      return Object.assign({}, state, {
        list: action.files
      });

    case types.SET_CONTRACTS_ERROR:
      return Object.assign({}, state, {
        error: action.error
      });

    case types.SET_TOTAL_AMOUNT_OF_FILES:
      return Object.assign({}, state, {
        totalAmountOfFiles: action.filesLength
      });
    case types.SET_FILE_URL:
      return Object.assign({}, state, {
        viewFileUrl: action.url
      })
    default:
      return state;
  }
};
