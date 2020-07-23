import axios from 'axios';
import * as types from './types';
import Api from '../../../../lib/api';
import Utils from '../../../../lib/utils';


/* CREATE CERTIFICATE */
export const addCertificate = (payload, callback) => {
  return (dispatch, getState) => {
    const { login: { authToken }, localization } = getState();
    let {
      errorDefault,
      errorConnection,
    } = localization.strings.hcProfile.projects.actions;
    let apiMethod;
    
    if (payload.certificateId) {
      apiMethod = 'put';
    } else {
      apiMethod = 'post';
    }

    return Api[apiMethod](`cf/certificateOfInsurance`, payload, authToken)
      .then(response => {
        const { success, certificateId } = response.data;
        console.log(response.data);        
        if (success) {
          callback(false, certificateId);
        } else {
          callback(true, errorDefault);
        }
      })
      .catch(() => {
        callback(true, errorConnection);
      });
  };
};

/* FETCH CERTIFICATE DATA */
export const fetchCertificateData = (certificateId, callback) => {
  return (dispatch, getState) => {
    const { login: { authToken }, localization } = getState();
    const { errorDefault, errorConnection } = localization.strings.hiringClients.actions;
    
    const urlQuery = `cf/certificateOfInsurance?certificateId=${certificateId}`;

    return Api.get(urlQuery, authToken)
      .then(response => {
        const { success, data } = response.data;
        if (success) {          
          if (data && data.length > 0) {
            // change document status (Processing in Progress)
            const payload = { 
              documentId: data[0].DocumentId,
              hiringClientId: data[0].HolderId,
              projectId: data[0].ProjectId,
              subcontractorId: data[0].InsuredId,
              documentStatusId: 10
            };
            Api.put(`cf/documents`, payload, authToken)
              .then((response) => {
                const { success } = response.data;
                if (success) {
                  callback(false, data[0]);
                } 
              });
          } else {
            callback(false, data[0]);
          }
          
        } else {
          callback(true, errorDefault);
        }
      })
      .catch(() => {
        callback(true, errorConnection);
      });
  };
};


/* DATA ENTRY FORM POPULATE */
export const fetchDataEntry = (certificateId, callback) => {
  return (dispatch, getState) => {
    const { login: { authToken }, localization } = getState();
    const { errorDefault, errorConnection } = localization.strings.hiringClients.actions;
    
    const urlQuery = `cf/processing?certificateId=${certificateId}`;

    return Api.get(urlQuery, authToken)
      .then(response => {
        const { success, data, availableCoverages } = response.data;
        if(success) {
          if (availableCoverages.length > 0)  
            dispatch(setProcessingAvailableCoverages(availableCoverages ? availableCoverages : []));

          callback(false, data);
        } else {
          callback(true, errorDefault);
        }
      })
      .catch(() => {
        callback(true, errorConnection);
      });
  };
};


/* DATA ENTRY FORM SAVE */
export const setAddDataEntrySuccess = (data) => {
  return {
    type: types.SET_ADD_DATA_ENTRY_SUCCESS,
    payload: {
      data,
    }
  };
};
export const setAddDataEntryError = (error) => {
  return {
    type: types.SET_ADD_DATA_ENTRY_ERROR,
    payload: {
      error,
    }
  };
};
export const setShowModal = (status) => {
  return {
    type: types.SET_OTHER_COVERAGES_SHOW_MODAL,
    payload: {
      status,
    }
  };
}; 

export const addDataEntry = (payload, callback) => {
  return (dispatch, getState) => {
    const { login: { authToken }, localization } = getState();
    let {
      errorDefault,
      errorConnection,
    } = localization.strings.hcProfile.projects.actions;

    return Api.put(`cf/processing`, payload, authToken)
      .then(response => {
        const { success, data, certificateId } = response.data;
        console.log(response.data);        
        if (success) {
          dispatch(setAddDataEntrySuccess({ ...data}));
          callback(certificateId);
        } else {
          dispatch(setAddDataEntryError(errorDefault));
          callback(false);
        }
      })
      .catch(() => {
        callback(false);
        dispatch(setAddDataEntryError(errorConnection));
      });
  };
};


/* DEFICIENCIES */
export const calculateDeficiencies = (holderId, projectId, insuredId, documentId, certificateId, callback) => {
  return (dispatch, getState) => {
    const { login: { authToken }, localization } = getState();
    let {
      errorDefault,
      errorConnection,
    } = localization.strings.hcProfile.projects.actions;
    
  return Api.post(`cf/certificates/deficiencies`, { holderId, projectId, documentId, certificateId }, authToken)
    .then((response) => {
      const { success } = response.data;
      if (success) {        
        callback(documentId);
      } else {
        callback(false);
      }
    })
    .catch(() => {
      callback(false);
    });
  };
};


/* AGENCIES */
export const setDataEntryFetchingAgencies = (isFetching) => {
  return {
    type: types.SET_DATAENTRY_FETCHING_AGENCIES,
    payload: {
      isFetching,
    }
  };
};
export const setDataEntryAgenciesList = (list) => {
  return {
    type: types.SET_DATAENTRY_AGENCIES_LIST,
    payload: {
      list,
    }
  };
};
export const setDataEntryAgenciesListError = (error) => {
  return {
    type: types.SET_DATAENTRY_AGENCIES_LIST_ERROR,
    payload: {
      error,
    }
  };
};
export const fetchDataEntryAgencies = (queryParams) => {
  return (dispatch, getState) => {
    const { login, localization } = getState();
    const { errorDefault, errorConnection } = localization.strings.hiringClients.actions;
    const { authToken } = login;

    dispatch(setDataEntryFetchingAgencies(true));
    dispatch(setDataEntryAgenciesListError(null));
    dispatch(setDataEntryAgenciesList([]));

    const urlParameters = Utils.getUrlParameters(queryParams);
    let urlQuery = `cf/agencies`;
    return Api.get(`${urlQuery}${urlParameters}`, authToken)
      .then(response => {
        const { success, data } = response.data;
        
        if(success) {
          dispatch(setDataEntryAgenciesList(data.agencies));
        }
        else {
          dispatch(setDataEntryAgenciesListError(errorDefault));
        }
        dispatch(setDataEntryFetchingAgencies(false));
      })
      .catch(error => {
        dispatch(setDataEntryAgenciesListError(errorConnection));
        dispatch(setDataEntryFetchingAgencies(false));
      });
  };
};

export const setDataEntrySelectedAgency = (data) => {
  return {
    type: types.SET_DATAENTRY_SELECTED_AGENCY,
    payload: {
      data,
    }
  };
};

export const fetchDataEntrySelectedAgency = (queryParams, callback) => {
  return (dispatch, getState) => {
    const { login } = getState();
    const { authToken } = login;

    const urlParameters = Utils.getUrlParameters(queryParams);
    let urlQuery = `cf/agencies`;

    return Api.get(`${urlQuery}${urlParameters}`, authToken)
      .then(response => {
        const { success, data } = response.data;

        dispatch(setDataEntrySelectedAgency(data.agencies[0]));
        if (callback) callback(success);
      })
      .catch(error => {
        console.log(error);
        if (callback) callback(false);
      });
  };
};


/* INSURERS */
export const setInsurersTypeAheadFetching = () => ({
  type: types.SET_INSURERS_TYPEAHEAD_FETCHING,
});
export const setInsurersTypeAheadResults = result => ({
  type: types.SET_INSURERS_TYPEAHEAD_RESULTS,
  payload: result
});
export const setInsurersTypeAheadError = error => ({
  type: types.SET_INSURERS_TYPEAHEAD_ERROR,
  payload: error
});

export const setAddInsurerError = (error) => {
  return {
    type: types.SET_ADD_INSURER_ERROR,
    payload: {
      error
    }
  };
};

const CancelToken = axios.CancelToken;
let source = null;

export const fetchInsurersTypeAhead = (queryParams) => {
  return (dispatch, getState) => {
    const { login: { authToken }, localization } = getState();
    const {
      errorConnection,
    } = localization.strings.common.typeAheadErrors;

    dispatch(setInsurersTypeAheadFetching(true));

    // cancel current request if any
    if (source) {
      source.cancel("typeAheadCanceled");
      source = null;
    }
    // create new token
    if(!source){
      source = CancelToken.source();
    }

    Api.get(`cf/insurers?${Object.keys(queryParams).map(i => `${i}=${queryParams[i]}`).join('&')}`, authToken, source.token)
      .then(response => {
        const { success, data } = response.data;
        source = null;

        if (success) {
          dispatch(setInsurersTypeAheadResults(data ? data : []));
        } else {
          const errorMsg = getTypeAheadErrors(data.errorCode, localization);
          dispatch(setInsurersTypeAheadError(errorMsg));
        }
      })
      .catch((err) => {
        if(err.message !== 'typeAheadCanceled'){
          dispatch(setInsurersTypeAheadError(errorConnection));
        }
      });
  };
};

export const setAddInsurer = (payload, callback) => {
  return (dispatch, getState) => {
    const { login: { authToken }, localization } = getState();
    const { errorConnection, errorDefault } = localization.strings.hiringClients.actions;

    dispatch(setAddInsurerError(null));

    return Api.post('cf/insurers', payload, authToken)
      .then(response => {
        const {success, data } = response.data;

        if (success) {
          if (callback) callback (data);
        } else {
          dispatch(setAddInsurerError(errorDefault));
          if (callback) callback (null);
        }
      })
      .catch(() => {
        dispatch(setAddInsurerError(errorConnection));
        if (callback) callback (null);
      });
  }
};


/* REQUIREMENT SET DETAIL */
export const setProcessingRequirementSetDetailFetching = () => {
  return {
    type: types.SET_PROCESSING_REQUIREMENT_SET_DETAIL_FETCHING,
  }
}
export const setProcessingRequirementSetDetail = (data) => {
  return {
    type: types.SET_PROCESSING_REQUIREMENT_SET_DETAIL_SUCCESS,
    payload: {
      data,
    },
  }
}
export const setProcessingRequirementSetDetailError = (error) => {
  return {
    type: types.SET_PROCESSING_REQUIREMENT_SET_DETAIL_ERROR,
    payload: error,
  }
}
export const setProcessingAvailableCoverages = (data) => {
  return {
    type: types.SET_PROCESSING_AVAILABLE_COVERAGES_SUCCESS,
    payload: {
      data,
    },
  }
}
export const setProcessingAvailableEndorsements = (data) => {
  return {
    type: types.SET_PROCESSING_AVAILABLE_ENDORSEMENTS_SUCCESS,
    payload: {
      data,
    },
  }
}
export const setDataEntrySelectedEndorsements = (data) => {
  return {
    type: types.SET_DATAENTRY_SELECTED_ENDORSEMENTS,
    payload: {
      data,
    }
  };
};

export const fetchRequirementSetDetail = (payload) => {  
  return (dispatch, getState) => {
    const { login: { authToken }, localization } = getState();
    const { errorDefault, errorConnection } = localization.strings.hiringClients.actions;
    
    dispatch(setProcessingRequirementSetDetailFetching());

    const urlParameters = Utils.getUrlParameters({ projectId: payload.projectId, holderId: payload.holderId });
    let urlQuery = `cf/requirementSetsDetail`;
    
    return Api.get(`${urlQuery}${urlParameters}`, authToken)
      .then(response => {
        const { success, requirementSets, availableCoverages, availableEndorsements } = response.data;
        
        if (success) {
          if (requirementSets.length > 0)
            dispatch(setProcessingRequirementSetDetail(requirementSets ? requirementSets : [] ));

          if (availableCoverages.length > 0)  
            dispatch(setProcessingAvailableCoverages(availableCoverages ? availableCoverages : []));
          
          if (availableEndorsements.length > 0)  
            dispatch(setProcessingAvailableEndorsements(availableEndorsements ? availableEndorsements : []));
        
        } else {
          dispatch(setProcessingRequirementSetDetailError(errorDefault));
        }
      })
      .catch(() => {
        dispatch(setProcessingRequirementSetDetailError(errorConnection));
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


/* AGENCIES */
export const setAgenciesTypeAheadFetching = () => ({
  type: types.SET_AGENCIES_TYPEAHEAD_FETCHING,
});
export const setAgenciesTypeAheadResults = result => ({
  type: types.SET_AGENCIES_TYPEAHEAD_RESULTS,
  payload: result
});
export const setAgenciesTypeAheadError = error => ({
  type: types.SET_AGENCIES_TYPEAHEAD_ERROR,
  payload: error
});
export const fetchAgenciesTypeAhead = (queryParams) => {
  return (dispatch, getState) => {
    const { login: { authToken }, localization } = getState();
    const {
      errorConnection,
    } = localization.strings.common.typeAheadErrors;

    dispatch(setAgenciesTypeAheadFetching(true));

    // cancel current request if any
    if (source) {
      source.cancel("typeAheadCanceled");
      source = null;
    }
    // create new token
    if(!source){
      source = CancelToken.source();
    }

    let urlQuery = 'cf/agencies';
    let urlParameters = `?${Object.keys(queryParams).map(i => `${i}=${queryParams[i]}`).join('&')}`;

    return Api.get(`${urlQuery}${urlParameters}`, authToken, source.token)
      .then(response => {
        const { success, data } = response.data;
        source = null;

        if (success) {
          dispatch(setAgenciesTypeAheadResults(data ? data.agencies : []));
        } else {
          const errorMsg = getTypeAheadErrors(data.errorCode, localization);
          dispatch(setAgenciesTypeAheadError(errorMsg));
        }
      })
      .catch((err) => {
        if(err.message !== 'typeAheadCanceled'){
          dispatch(setAgenciesTypeAheadError(errorConnection));
        }
      });
  };
};

export const fetchAgencies = (queryParams, callback) => {
  return (dispatch, getState) => {
    const { login: { authToken }} = getState();

    let urlQuery = 'cf/agencies';
    let urlParameters = `?${Object.keys(queryParams).map(i => `${i}=${queryParams[i]}`).join('&')}`;

    return Api.get(`${urlQuery}${urlParameters}`, authToken)
      .then(response => {
        const { success, data } = response.data;               
        if(success) {
          return (data.agencies) ? callback(data.agencies) : callback([]);  
        } else {
          if (callback) callback(false);
        }
      })
      .catch(() => {
        if (callback) callback(false);
      });
  };
};

export const fetchAgents = (queryParams, callback) => {
  return (dispatch, getState) => {
    const { login: { authToken }} = getState();

    let urlQuery = 'cf/agents';
    let urlParameters = `?${Object.keys(queryParams).map(i => `${i}=${queryParams[i]}`).join('&')}`;

    return Api.get(`${urlQuery}${urlParameters}`, authToken)
      .then(response => {
        const { success, data } = response.data;               
        if(success) {
          return (data.agents) ? callback(data.agents) : callback([]);  
        } else {
          if (callback) callback(false);
        }
      })
      .catch(() => {
        if (callback) callback(false);
      });
  };
};

export const fetchInsurers = (queryParams, callback) => {
  return (dispatch, getState) => {
    const { login: { authToken }} = getState();

    let urlQuery = 'cf/insurers';
    let urlParameters = `?${Object.keys(queryParams).map(i => `${i}=${queryParams[i]}`).join('&')}`;

    return Api.get(`${urlQuery}${urlParameters}`, authToken)
      .then(response => {
        const { success, data } = response.data;  
        if(success) {
          return (data) ? callback(data) : callback([]);  
        } else {
          if (callback) callback(false);
        }
      })
      .catch(() => {
        if (callback) callback(false);
      });
  };
};