import * as types from './types';
import Api from '../../../lib/api';
import { setHeaderTitle } from '../../common/actions';

export const setHCProfileError = (error) => {
  return {
    type: types.SET_HC_PROFILE_ERROR,
    error
  };
};

export const setHCProfile = (hcprofile) => {
  console.log('setHCProfile',hcprofile);
  return {
    type: types.SET_HC_PROFILE,
    hcprofile
  };
};

export const fetchHCProfile = (id, callback) => {
  return (dispatch, getState) => {
    const { login, localization } = getState();
    let {
      error10005,
      error10006,
      error10007,
      error10011,
      errorDefault,
      errorConnection,
    } = localization.strings.hiringClients.actions;

    const token = login.authToken;
    let urlQuery = `hiringclientdetail?hiringClientId=${id}`;
    return Api.get(urlQuery, token)
    .then(response => {
      const {success, data } = response.data;
      let errorMsg = '';
      if(success) {
        dispatch(setHCProfile(data[0]));
        dispatch(setHeaderTitle(data[0].name));
        if(callback)callback(data[0]);
      }
      else {
        switch(data.errorCode) {
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
          default:
            errorMsg = errorDefault;
            break;
        }
        dispatch(setHCProfileError(errorMsg));
        if(callback)callback(null);
      }
    })
    .catch(error => {
      dispatch(setHCProfileError(errorConnection));
      if(callback)callback(null);
    });
  };
};

export const setSearchText = (str) => {
  return {
    type: types.SET_SEARCH_TEXT,
    str
  };
};

export const setFetchingLanguages = (isFetching) => {
  return {
    type: types.SET_FETCHING_LANGUAGES,
    isFetching
  };
};

export const setLanguagesList = (obj)=> {
  return {
    type: types.SET_LANGUAGES_LIST,
    dictionary: obj.dictionary,
    totalCount: obj.totalCount
  }
};

export const setLanguagesError = (err)=> {
  return {
    type: types.SET_LANGUAGES_ERROR,
    err
  }
};

export const setModifiedItems = (arr = [])=> {
  return {
    type: types.EDIT_LANGUAGES,
    modifiedItems: arr
  }
};

export const fetchLanguages = (hiringClientId) => {
  return (dispatch, getState) => {
    const token = getState().login.authToken;
    dispatch(setFetchingLanguages(true));
    return Api.get(`languages/keys?hiringClientId=${hiringClientId}`, token)
      .then(response => {
        const {success, data } = response.data;
        if(success) {
          let languagesResponse = data;
          dispatch(setLanguagesList(languagesResponse));
          dispatch(setFetchingLanguages(false));
        }
        else {
          let errorMsg = '';
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
              errorMsg = 'Error: your current template is disabled. Please, contact an admin to enable this account and login again to continue.';
              break;
            default:
              errorMsg = '';
              break;
          }
          dispatch(setLanguagesError(errorMsg));
        }
      })
      .catch(error => {
        console.log(error)
        //dispatch(setTemplatesListError('Connection error - Please, check your Internet service.'));
      });
  };
};

export const editLanguageItem = (item)=> {
  return (dispatch, getState)=> {
    let arr = [...getState().HCProfile.modifiedItems];
    arr.filter(e=> e.keyId === item.keyId)[0] ? arr = arr.map(e=> e.keyId === item.keyId ? item : e) : arr.push(item);
    dispatch(setModifiedItems(arr));
  }
};

export const showMessage = (type, text)=> {
  return (dispatch, getState)=> {
    dispatch({type: types.SHOW_MESSAGE, message: {visible: true, text, type}});
    setTimeout(()=> dispatch({type: types.SHOW_MESSAGE, message: { visible: false, text: '', type }}), 5000);
  };
};

export const saveLanguages = (hiringClientId) => {
  return (dispatch, getState) => {
    const token = getState().login.authToken;
    const dictionary = getState().HCProfile.modifiedItems;
    dispatch(setFetchingLanguages(true));
    const payload = {
      hiringClientId,
      dictionary
    };
    return Api.put(`languages/values`, payload, token)
      .then(response => {
        const {success, data} = response.data;
        if (success) {
          dispatch(fetchLanguages(hiringClientId));
          dispatch(showMessage('success', 'Save changes succesfully!'));
          dispatch(setModifiedItems());
        }
        else {
          let errorMsg = '';
          dispatch(showMessage('error', 'There was an error while trying to save the changes, please try again later'));
          switch (data.errorCode) {
            case 10003:
              errorMsg = 'Error: invalid data. Please, adjust the filters values and try again.';
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
              errorMsg = 'Error: your current template is disabled. Please, contact an admin to enable this account and login again to continue.';
              break;
            default:
              errorMsg = '';
              break;
          }
          dispatch(setLanguagesError(errorMsg));
        }
      })
      .catch(error => {
        console.log(error)
        //dispatch(setTemplatesListError('Connection error - Please, check your Internet service.'));
      });
  };
}

export const SetScListForSelectComponent = (scList) => {
  return {
    type: types.SET_SC_LIST_FOR_SELECT_COMPONENT,
    scList
  };
};

export const fetchScListForSelectComponent = (id) => {
  return (dispatch, getState) => {
    const { login, localization } = getState();
    let {
      error10005,
      error10006,
      error10007,
      error10011,
      errorDefault,
      errorConnection,
    } = localization.strings.hiringClients.actions;

    const token = login.authToken;
    const userId = login.userId;

    let urlQuery = `subcontractors?orderBy=name&orderDirection=ASC&userId=${userId}&searchByHCId=${id}`;
    return Api.get(urlQuery, token)
      .then(response => {
        const { success, data } = response.data;
        let errorMsg = '';
        if (success) {
          dispatch(SetScListForSelectComponent(data.subContractors));
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
            default:
              errorMsg = errorDefault;
              break;
          }
          dispatch(setHCProfileError(errorMsg));
        }
      })
      .catch(error => {
        dispatch(setHCProfileError(errorConnection));
      });
  };
};
