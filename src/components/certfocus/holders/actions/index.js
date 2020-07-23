import * as types from './types';
import Api from '../../../../lib/api';
import Utils from '../../../../lib/utils';
import async from 'async';

// SETS
export const setHoldersError = (error) => {
  return {
    type: types.SET_HOLDERS_ERROR,
    error
  };
};

/* PARENT HOLDERS */
export const setFetchingParents = (fetching) => {
  return {
    type: types.SET_FETCHING_PARENT_HOLDERS,
    fetching
  };
};
export const setParentHolders = (parents) => {
  return {
    type: types.SET_PARENT_HOLDERS,
    parents
  };
};
export const fetchParentHolders = (filterTerm, excludeHolderId) => {
  return (dispatch, getState) => {
    const { login: { authToken }, localization } = getState();
    const { errorDefault, errorConnection } = localization.strings.hiringClients.actions;
    const queryParams = { onlyHolderParents: true };
    if (filterTerm) queryParams.filterTerm = filterTerm;
    if (excludeHolderId) queryParams.excludeHolderId = excludeHolderId;

    dispatch(setFetchingParents(true));
    dispatch(setHoldersError(null));
    dispatch(setParentHolders([]));

    const urlParameters = Utils.getUrlParameters(queryParams);
    let urlQuery = `cf/holders`;
    return Api.get(`${urlQuery}${urlParameters}`, authToken)
    .then(response => {
      const { success, data } = response.data;
      if(success) {
        dispatch(setParentHolders(data.holders));
      } else {
        dispatch(setHoldersError(errorDefault));
      }
      dispatch(setFetchingParents(false));
    })
    .catch(() => {
      dispatch(setHoldersError(errorConnection));
      dispatch(setFetchingParents(false));
    });
  };
};


/* ACCOUNT MANAGERS */
export const setFetchingAccountManagers = (fetching) => {
  return {
    type: types.SET_FETCHING_ACCOUNT_MANAGERS,
    fetching
  };
};
export const setAccountManagers = (managers) => {
  return {
    type: types.SET_ACCOUNT_MANAGERS,
    managers
  };
};
export const fetchAccountManagers = (filterTerm) => {
  return (dispatch, getState) => {
    const { login, localization } = getState();
    const { errorDefault, errorConnection } = localization.strings.hiringClients.actions;
    const { authToken } = login;
    const queryParams = {};
    if(filterTerm)queryParams.filterTerm = filterTerm;

    dispatch(setFetchingAccountManagers(true));
    dispatch(setHoldersError(null));
    dispatch(setAccountManagers([]));

    const urlParameters = Utils.getUrlParameters(queryParams);
    const urlQuery = `cf/holders/managers`;
    return Api.get(`${urlQuery}${urlParameters}`, authToken)
    .then(response => {
      const { success, data } = response.data;
      if(success) {
        dispatch(setAccountManagers(data.accountManagers));
      }
      else {
        dispatch(setHoldersError(errorDefault));
      }
      dispatch(setFetchingAccountManagers(false));
    })
    .catch(error => {
      dispatch(setHoldersError(errorConnection));
      dispatch(setFetchingAccountManagers(false));
    });
  };
};

// POST HOLDER (CREATE/EDIT)
// HolderPayload object contains the entire information from holder wizard form
export const postHolder = (holderPayload, callback) => {
  return (dispatch, getState) => {

    const { login: { authToken }, localization } = getState();
    const { errorConnection, errorDefault } = localization.strings.hiringClients.actions;
    let hlId, res;

    dispatch(setHoldersError(null));
    
    async.series(
      [
        (callback) => {
          console.log('step 1: create holder info');

          Api.post('cf/holders', holderPayload, authToken)
            .then(response => {
              const {success, data } = response.data;
              hlId = data.hlId;
              res = data; 
              if (success) {
                if (callback) callback (null);
              } else {
                dispatch(setHoldersError(errorDefault));
                if (callback) callback (null);
              }
            })
            .catch(() => {
              dispatch(setHoldersError(errorConnection));
              if (callback) callback (null);
            });
        },
        (callback) => {
          console.log('step 2: create holder logo');

          const fileInput = document.getElementById('companyLogo');
          const formData = new FormData();
          formData.append('hiringClientId', parseInt(hlId, 10));
          formData.append("logoFile", fileInput.files[0]);

          if(fileInput.files[0]) {
            Api.post(`hiringclients/logo`, formData, authToken)
              .then(response => {
                const { success, data } = response.data;
                if(success) {
                  // new relation
                  console.log('* successful image upload');
                  callback(null);
                } else {
                  // Todo: manage error
                  console.log('* error from server', data);
                  dispatch(setHoldersError(response.data.description));
                  callback(response.data.description);
                }
              })
              .catch(error => {
                dispatch(setHoldersError(errorConnection));
                callback(null);
              });
          }
          else {
            console.log("ignoring image upload");
            callback(null);
          }
        }
      ],
      (err) => {
        if(err) {
          console.log('error ', err);
        } else {
          console.log('holder creation completed');
          if (callback) callback (res);
        }
      }
    )        
  }
};
