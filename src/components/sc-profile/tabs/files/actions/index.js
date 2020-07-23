import * as types from './types';
import Api from '../../../../../lib/api';

export const setFetchingFiles = (isFetching) => {
  return {
    type: types.SET_FETCHING_FILES,
    isFetching
  };
};

export const setDownloadingFile = (isDownloading) => {
  return {
    type: types.SET_DOWNLOADING_FILE,
    isDownloading
  };
};

export const setFileUrl = (url) => {
  return {
    type: types.SET_FILE_URL,
    url
  };
};

export const setSavingFile = (isSaving) => {
  return {
    type: types.SET_SAVING_FILE,
    isSaving
  };
};

export const setFiles = (files) => {
  return {
    type: types.SET_FILES,
    files
  };
};

export const setTotalAmountOfFiles = (filesLength) => {
  return {
    type: types.SET_TOTAL_AMOUNT_OF_FILES,
    filesLength
  };
};

export const setFilesError = (error) => {
  return {
    type: types.SET_CONTRACTS_ERROR,
    error
  };
};

export const fetchFiles = (query) => {
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

    dispatch(setFetchingFiles(true));

    const urlQuery = 'files';
    const urlParameters = `?${Object.keys(query).map(i => `${i}=${query[i]}`).join('&')}`;

    return Api.get(`${urlQuery}${urlParameters}`, token)
      .then(response => {
        const { success, data, totalCount } = response.data;
        let errorMsg = '';
        if (success) {
          // console.log('totalCount = ', totalCount)
          dispatch(setTotalAmountOfFiles(totalCount));
          dispatch(setFiles(data));
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
          dispatch(setFilesError(errorMsg));
        }
        dispatch(setFetchingFiles(false));
      })
      .catch(error => {
        dispatch(setFilesError(errorConnection));
      });
  };
};

export const viewFileLink = (query) => {
  console.log('query in viewFileLink = ', query)
  return (dispatch, getState) => {
    dispatch(setDownloadingFile(true));
    const token = getState().login.authToken;

    const urlQuery = 'viewFileLink';
    const urlParameters = `?${Object.keys(query).map(i => `${i}=${query[i]}`).join('&')}`;

    return Api.get(`${urlQuery}${urlParameters}`, token)
      .then(response => {
        const { data } = response;

        if (data.success) {
          // let storage = window.localStorage
          // storage.setItem('doc', data.url)
          // window.open( `/ViewDocumentPage`, '_blank');
          window.open( data.url, '_blank');
          // console.log('data.url = ', data.url)




          // setFileUrl(data.url)

        } else {
          dispatch(setFilesError("There was an error, please try again"));
        }
        dispatch(setDownloadingFile(false));
      })
      .catch(error => {
        dispatch(setFilesError("There was an error, please try again"));
        dispatch(setDownloadingFile(false));
      });
  };
}

export const downloadFile = (query) => {
  return (dispatch, getState) => {
    dispatch(setDownloadingFile(true));
    const token = getState().login.authToken;

    const urlQuery = 'files/download';
    const urlParameters = `?${Object.keys(query).map(i => `${i}=${query[i]}`).join('&')}`;

    return Api.get(`${urlQuery}${urlParameters}`, token)
      .then(response => {
        const { data } = response;

        if (data.success) {
          const link = document.createElement('a');
          link.download = data.fileName;
          link.href = 'data:application/octet-stream;base64,' + data.fileData;
          link.className = 'd-none';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        } else {
          dispatch(setFilesError("There was an error, please try again"));
        }
        dispatch(setDownloadingFile(false));
      })
      .catch(error => {
        dispatch(setFilesError("There was an error, please try again"));
        dispatch(setDownloadingFile(false));
      });
  };
}

export const saveFile = (payload, callback) => {
  return (dispatch, getState) => {
    const token = getState().login.authToken;
    dispatch(setSavingFile(true));

    Api.post(
      `files/`,
      payload,
      token
    )
      .then(response => {
        let err = null
        if (!response.data.success) {
          let msg = "There was an error while saving, please try again"
          dispatch(setFilesError(msg));
          err = msg
        }
        console.log('upload file data = ', response.data)
        dispatch(setSavingFile(false));
        if (callback) {
          callback(err)
        }
      })
      .catch(error => {
        dispatch(setFilesError("There was an error while saving, please try again"));
        dispatch(setSavingFile(false));
        if (callback) {
          callback(error)
        }
      });
  };
}
