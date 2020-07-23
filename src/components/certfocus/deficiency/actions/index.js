import * as types from './types';
import Api from '../../../../lib/api';
import Utils from '../../../../lib/utils';

/* DEFICIENCY VIEWER */
export const setDeficienciesFetching = () => {
  return {
    type: types.SET_DEFICIENCY_FETCHING,
  }
}

export const setDeficiencies = (data) => {
  return {
    type: types.SET_DEFICIENCY_SUCCESS,
    payload: {
      data,
    },
  }
}

export const setDeficienciesError = (error) => {
  return {
    type: types.SET_DEFICIENCY_ERROR,
    payload: error,
  }
}

export const fetchDeficiencies = (documentId, callback) => {
  return (dispatch, getState) => {
    const { login: { authToken }, localization } = getState();
    const { errorDefault, errorConnection } = localization.strings.hiringClients.actions;

    dispatch(setDeficienciesFetching());

    const urlParameters = `?documentId=${documentId}`;
    let urlQuery = `cf/deficiencyViewer`;

    return Api.get(`${urlQuery}${urlParameters}`, authToken)
      .then(response => {
        const { success, data } = response.data;
        if (success) {
          if (data) {
            dispatch(setDeficiencies({ ...data, documentId }));
            if (callback) callback(data.project, data.holder);
          } else {
            dispatch(setDeficienciesError(errorDefault));
            if (callback) callback(false);  
          }
          
        } else {
          dispatch(setDeficienciesError(errorDefault));
          if (callback) callback(false);
        }
      })
      .catch(() => {
        dispatch(setDeficienciesError(errorConnection));
        if (callback) callback(false);
      });
  };
};

export const setDeficiencyUpdateFetching = (id) => {
  return {
    type: types.SET_DEFICIENCY_UPDATE_FETCHING,
    payload: id,
  }
};

export const setDeficiencyUpdateError = (error, id) => {
  return {
    type: types.SET_DEFICIENCY_UPDATE_ERROR,
    payload: {
      error,
      id,
    },
  }
};

export const setDeficiencyUpdate = (id, status) => {
  return {
    type: types.SET_DEFICIENCY_UPDATE_SUCCESS,
    payload: {
      status,
      id,
    },
  }
};

export const sendDeficiencyStatus = (data, documentId, status) => {
  return (dispatch, getState) => {
    const { login: { authToken }, localization } = getState();
    const { errorDefault, errorConnection } = localization.strings.hiringClients.actions;
    const id = data.ProjectInsuredDeficiencyID;

    dispatch(setDeficiencyUpdateFetching(data.ProjectInsuredDeficiencyID));
    let params = {
      projectInsuredDeficiencyId: id,
      projectInsuredID: data.ProjectInsuredID,
    };
    console.log('sendDeficiencyStatus', data, documentId, status);
    if (status === 'waive') {
      params.deficiencyStatusId = 1;
    } else if (status === 'accept') {
      params.deficiencyStatusId = 2;
    }
  
    let urlQuery = `cf/projectInsuredDeficiencies`;

    return Api.put(`${urlQuery}`, params, authToken)
      .then(response => {
        const { success } = response.data;

        if (success) {

          if (status === 'waive') {
            params = {
              projectInsuredId: data.ProjectInsuredID,
            };
            let urlQuery = `cf/waivers`;
            console.log('post waivers', params);
            Api.post(`${urlQuery}`, params, authToken)
              .then(response => {
                const { success } = response.data;
                console.log('response waivers', response);
                if (success) {
        
                  params = {
                    waiverId: response.data.data.waiverId,
                    projectInsuredId: data.ProjectInsuredID,
                    projectInsuredDeficiencyId: id,
                  };
                  let urlQuery = `cf/waiverLineItems`;
                  console.log('post waiverLineItems', params);
      
                  Api.post(`${urlQuery}`, params, authToken)
                    .then(response => {
                      console.log('response waiverLineItems', response);
                      const { success } = response.data;
              
                      if (success) {
              
                        dispatch(setDeficiencyUpdate(id, status));
                      } else {
                        dispatch(setDeficiencyUpdateError(errorDefault, id));
                      }
                    })
                    .catch(() => {
                      dispatch(setDeficiencyUpdateError(errorConnection, id));
                    });        
        
                } else {
                  dispatch(setDeficiencyUpdateError(errorDefault, id));
                }
              })
              .catch(() => {
                dispatch(setDeficiencyUpdateError(errorConnection, id));
              });
        
          } else {
            dispatch(setDeficiencyUpdate(id, status));
          }

        } else {
          dispatch(setDeficiencyUpdateError(errorDefault, id));
        }
      })
      .catch(() => {
        dispatch(setDeficiencyUpdateError(errorConnection, id));
      });
  };
};



const getTypeAheadErrors = (errorCode, localization) => {
  let {
    error10005, error10006, error10007,
    error10011, error10019, errorDefault,
  } = localization.strings.common.typeAheadErrors;
  let errorMsg = '';

  switch(errorCode) {
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
}