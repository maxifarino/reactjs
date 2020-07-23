import Api from '../../../../lib/api';
import * as types from './types';

export const validateHash = (hash, callback) => {
  return (dispatch, getState) => {
    const { login, localization } = getState();
    let {
      invalidHash,
      errorConnection,
    } = localization.strings.register.actions;

    const payload = { hash };
    
    return Api.post(`cf/certUpload/validateHash`, payload)
      .then(response => {
        const { success, data } = response.data;
        console.log(success, data);
        if (success) {
          (data.length > 0) ? callback(true, data[0]) : callback(false, invalidHash);
        }
        else {
          callback(false, invalidHash);
        }
      })
      .catch(error => {
        callback(false, errorConnection);
      });
  };
};

export const setRequirementSetsError = (error) => {
  return {
    type: types.SET_REQUIREMENT_SETS_ERROR,
    payload: {
      error
    }
  };
};

export const setRequirementSets = (requirementSets) => {
  return {
    type: types.SET_REQUIREMENT_SETS,
    payload: {
      requirementSets
    }
  };
};

export const setAttachments = (attachments) => {
  return {
    type: types.SET_ATTACHMENTS,
    payload: {
      attachments
    }
  };
};

export const setEndorsements = (endorsements) => {
  return {
    type: types.SET_ENDORSEMENTS,
    payload: {
      endorsements
    }
  };
};

export const setAllEndorsements = (endorsements) => {
  return {
    type: types.SET_ALL_ENDORSEMENTS,
    payload: {
      endorsements
    }
  };
};

export const fetchRequirementSets = (query) => {
  return (dispatch, getState) => {
    const { login, localization } = getState();
    let {
      errorDefault,
      errorConnection,
    } = localization.strings.scProfile.files.actions;
    const token = login.authToken;

    const urlParameters = `?${Object.keys(query).map(i => `${i}=${query[i]}`).join('&')}`;

    return Promise.all([
      // Fetch requirementSet details
      Api.get(`cf/certUpload/requirementSetsDetail${urlParameters}`, token),
      // Fetch requirementSet documents
      Api.get(`cf/certUpload/requirementSetsDocuments?requirementSetId=${query.requirementSetId}`, token),      
      // Fetch requirementSet endorsements
      Api.get(`cf/certUpload/requirementSetsEndorsements?requirementSetId=${query.requirementSetId}`, token),
      // Fetch all available endorsements
      Api.get(`cf/certUpload/endorsements?holderId=${query.holderId}`, token),
    ])
    .then((response) => {
      // If one of the requests failed, return error
      if (response.find((res) => !res.data.success)) {
        dispatch(setRequirementSetsError(errorDefault));
      } else {
        response.forEach((res) => {          
          const { data, requirementSetsDocuments, requirementSetsEndorsements, endorsements } = res.data;
          if (data) {
            dispatch(setRequirementSets(data ? data : []))
          }else if (requirementSetsDocuments) {
            dispatch(setAttachments(requirementSetsDocuments ? requirementSetsDocuments : []));
          } else if (requirementSetsEndorsements) {
            dispatch(setEndorsements(requirementSetsEndorsements ? requirementSetsEndorsements : []));
          } else if (endorsements) {
            dispatch(setAllEndorsements(endorsements ? endorsements : []));
          }
        });
      }
    })
    .catch(() => {
      dispatch(setRequirementSetsError(errorConnection));
    });
  };
};

export const setFetchingDocuments = (isFetching) => {
  return {
    type: types.SET_FETCHING_DOCUMENTS,
    isFetching
  };
};

export const setDocumentsError = (error) => {
  return {
    type: types.SET_DOCUMENTS_ERROR,
    payload: {
      error
    }
  };
};

export const setDocumentsList = (list) => {
  return {
    type: types.SET_DOCUMENTS_LIST,
    payload: {
      list
    }
  };
};

export const fetchDocuments = (query) => {
  return (dispatch, getState) => {
    const { login, localization } = getState();
    let {
      errorDefault,
      errorConnection,
    } = localization.strings.scProfile.files.actions;
    const token = login.authToken;

    dispatch(setFetchingDocuments(true));

    const urlQuery = 'cf/certUpload/projectInsuredDocuments';
    const urlParameters = `?${Object.keys(query).map(i => `${i}=${query[i]}`).join('&')}`;

    return Api.get(`${urlQuery}${urlParameters}`, token)
      .then(response => {
        const { success, projectInsuredDocuments } = response.data;
        dispatch(setFetchingDocuments(false));
        (success) 
          ? dispatch(setDocumentsList(projectInsuredDocuments))
          : dispatch(setDocumentsError(errorDefault));
      })
      .catch(error => {
        dispatch(setDocumentsError(errorConnection));
      });
  };
};

export const uploadFiles = (payload, callback) => {
  return (dispatch, getState) => {
    const { localization } = getState();
    let {
      errorDefault,
      errorConnection,
    } = localization.strings.register.actions;
    const lastFileIdx = (payload.files) ? (payload.files.length - 1) : 0;
    //console.log('p', payload);

    dispatch(setFetchingDocuments(true));
    
    payload.files && payload.files.forEach((file, idx) => {
      const formData = new FormData();
      const filename = file.name.substr(0, file.name.lastIndexOf("."));
      formData.append('document', file);
      formData.append('name', filename);
      formData.append('ftpUpload', true);

      // add new documents data
      for (let item in payload) {
        formData.append(item, payload[item]);
      }
      console.log('formData', formData);

      Api.post('cf/certUpload/documents', formData, payload)
        .then(response => {        
          const { success, data } = response.data;
          console.log('response', response);
          if (success) {
            const linkPayload = {
              projectInsuredId: payload.projectInsuredId,
              documentId: data.documentId,
              status: 'Pending', // TODO: Change it for documentStatusId
            };
            console.log('linkPayload', linkPayload);
             
            // Link with projectInsuredDocuments
            Api.post('cf/certUpload/projectInsuredDocuments', linkPayload)
              .then(response => {
                const { success, data } = response.data;
                dispatch(setFetchingDocuments(false));
                if (success) {
                  if (idx === lastFileIdx) callback(true, data);
                } else {
                  callback(false, errorDefault);
                }
              })
              .catch(() => {
                callback(false, errorDefault);
              });
          } else {
            callback(false, errorConnection);
          }
        })
        .catch(() => {
          callback(false, errorConnection);
        });
    });
  };
};

export const createTask = (payload, callback) => {
  return (dispatch, getState) => {
    const { localization } = getState();
    let {
      errorDefault,
      errorConnection,
    } = localization.strings.register.actions;
    console.log('payload', payload);

    Api.post('cf/certUpload/tasks', payload)
      .then(response => {        
        const { success, data } = response.data;
        console.log(response.data);
        
        dispatch(setFetchingDocuments(false));
        if (success) {
          callback(true, data);
        } else {
          callback(false, errorDefault);
        }
      })
      .catch(() => {
        callback(false, errorConnection);
      });
  };
};