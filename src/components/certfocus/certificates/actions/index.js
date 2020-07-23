import Api from '../../../../lib/api';
import * as types from './types';
import _ from 'lodash';

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
    ])
      .then((response) => {
        // If one of the requests failed, return error
        if (response.find((res) => !res.data.success)) {
          dispatch(setRequirementSetsError(errorDefault));
        } else {
          response.forEach((res) => {
            const { requirementSets, requirementSetsDocuments, requirementSetsEndorsements } = res.data;
            if (requirementSets) {
              dispatch(setRequirementSets(requirementSets ? requirementSets : []))
            } else if (requirementSetsDocuments) {
              dispatch(setAttachments(requirementSetsDocuments ? requirementSetsDocuments : []));
            } else if (requirementSetsEndorsements) {
              dispatch(setEndorsements(requirementSetsEndorsements ? requirementSetsEndorsements : []));
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

export const setCertificatesFetching = () => {
  return {
    type: types.SET_FETCHING_CERTIFICATES,
  }
}

export const setFetchCertificatesSuccess = (data) => {
  return {
    type: types.SET_FETCH_CERTIFICATES_SUCCESS,
    payload: data
  }
}

export const fetchCertificates = (projectInsuredId, callback) => {
  return (dispatch, getState) => {
    const { login: { authToken }, localization } = getState();
    const { errorDefault, errorConnection } = localization.strings.hiringClients.actions;

    dispatch(setCertificatesFetching());

    const urlParameters = `?projectInsuredId=${projectInsuredId}`;
    let urlQuery = `cf/certificates`;

    return Api.get(`${urlQuery}${urlParameters}`, authToken)
      .then(response => {
        const { success, data } = response.data;

        if (success) {
          console.log(data);
          var result = _.chain(data).groupBy("CertificateID").map(function (v, i) {
            return {
              CertificateID: _.get(_.find(v, 'CertificateID'), 'CertificateID'),
              InsuredID: _.get(_.find(v, 'InsuredID'), 'InsuredID'),
              ProjectID: _.get(_.find(v, 'ProjectID'), 'ProjectID'),
              ProjectInsuredID: _.get(_.find(v, 'ProjectInsuredID'), 'ProjectInsuredID'),
              files: _.get(_.find(v, 'FileName'), 'FileName'),
              UrlFile: _.get(_.find(v, 'UrlFile'), 'UrlFile'),
              DocumentId: _.get(_.find(v, 'DocumentId'), 'DocumentId'),
              DocumentStatus: _.get(_.find(v, 'DocumentStatus'), 'DocumentStatus'),
              EmailProcedure: _.find(v, 'EmailProcedure') ? _.get(_.find(v, 'EmailProcedure'), 'EmailProcedure') : '',
              enableEmailProcedure: true,
              EmailInsured: _.find(v, 'EmailInsured') ? _.get(_.find(v, 'EmailInsured'), 'EmailInsured') : '',
              enableEmailInsured: true,
              Codes: _.map(v, 'Code').toString(),
              complianceStatusID: _.map(v, 'ComplianceStatusID')[0],
              disabledRejectBtn: _.map(v, 'ComplianceStatusID')[0] == 5 || _.map(v, 'ComplianceStatusID')[0] == 16,
              disabledOnHoldBtn: _.map(v, 'ComplianceStatusID')[0] == 16,
              isOnHold: _.map(v, 'ComplianceStatusID')[0] == 16,
              disabledEmailProcedureBtn: !(_.get(_.find(v, 'EmailProcedure'), 'EmailProcedure').length > 0)
            }
          }).value();

          dispatch(setFetchCertificatesSuccess(result));
          if (callback) callback(result);
        }
      })
      .catch(() => {
        if (callback) callback(false);
      });
  };
}


export const setEmailInsured = (data) => {
  return {
    type: types.SET_INSURED_EMAIL,
    payload: data
  }
}

export const setfetchInsuredEmail = (parameter, callback) => {
  return (dispatch, getState) => {
    const { login: { authToken } } = getState();

    let body = {
      insuredId: parameter.insuredId,
      email: parameter.email
    }

    let urlQuery = `cf/certificates/emailinsured`;

    return Api.put(urlQuery, body, authToken)
      .then(response => {
        const { success, data } = response.data;
        if (success) {
          if (callback)
            callback();
          //setToggleDeficiences(dispatch, parameter, types.UNDO_BY_ID);
        }
      })
      .catch((error) => {
        console.log('error ', error);
        if (callback)
          callback();
      });
  };
}

export const setEmailProcedure = (data) => {
  return {
    type: types.SET_PROCEDURE_EMAIL,
    payload: data
  }
}

export const setfetchProcedureEmail = (payload, callback) => {
  return (dispatch, getState) => {
    const { login: { authToken } } = getState();

    let body = {
      documentId: payload.documentId,
      email: payload.email,
      certificateId: payload.certificateId
    }

    let urlQuery = `cf/certificates/emailprocedure`;

    return Api.put(urlQuery, body, authToken)
      .then(response => {
        const { success, data } = response.data;
        if (success) {
          //dispatch(setEmailProcedure(body));
          if (callback)
            callback();
        }
      })
      .catch((error) => {
        console.log('error ', error);
        if (callback)
          callback();
      });
  };
}

export const setfetchSendEmail = (parameter, callback) => {

}

export const toogleEmailProcedure = (data) => {
  return {
    type: types.TOGGLE_PROCEDURE_EMAIL,
    payload: data
  }
}

export const toogleEmailInsured = (data) => {
  return {
    type: types.TOGGLE_INSURED_EMAIL,
    payload: data
  }
}

export const setFetchUsersSuccess = (data) => {
  return {
    type: types.SET_FETCH_USERS_SUCCESS,
    payload: data
  }
}

export const setFetchProjectInsuredSuccess = (data) => {
  return {
    type: types.SET_FETCH_PROJECTINSURED_SUCCESS,
    payload: data
  }
}

export const fetchUsers = () => {
  return (dispatch, getState) => {
    const { login: { authToken }, localization } = getState();

    let urlQuery = `cf/certificates/users`;

    return Api.get(`${urlQuery}`, authToken)
      .then(response => {
        const { success, data } = response.data;
        if (success) {
          dispatch(setFetchUsersSuccess(data));
        }
      })
  };
}
export const fetchProjectInsured = (projectInsuredId) => {
  return (dispatch, getState) => {
    const { login: { authToken }, localization } = getState();

    const urlParameters = `?projectInsuredId=${projectInsuredId}`;
    let urlQuery = `cf/certificates/projectInsured`;

    return Api.get(`${urlQuery}${urlParameters}`, authToken)
      .then(response => {
        const { success, data } = response.data;
        if (success) {
          dispatch(setFetchProjectInsuredSuccess(data));
        }
      })
  };
}


export const setFetchRejectSuccess = () => {
  return {
    type: types.SET_FETCH_REJECT_SUCCESS
  }
}

export const setfetchReject = (payload, callback) => {
  return (dispatch, getState) => {
    const { login: { authToken } } = getState();

    let urlQuery = `cf/certificates/rejectcertificate`;

    return Api.put(urlQuery, payload, authToken)
      .then(response => {
        const { success, data } = response.data;
        if (success) {
          dispatch(setFetchRejectSuccess());
          if (callback)
            callback(null);
        }
      })
      .catch((error) => {
        console.log('error ', error);
        callback(error);
      });
  };
}

export const setFetchOnHoldSuccess = () => {
  return {
    type: types.SET_FETCH_ON_HOLD_SUCCESS
  }
}

export const setfetchOnHold = (payload, callback) => {
  return (dispatch, getState) => {
    const { login: { authToken } } = getState();

    let urlQuery = `cf/certificates/onholdcertificate`;

    return Api.put(urlQuery, payload, authToken)
      .then(response => {
        const { success, data } = response.data;
        if (success) {
          dispatch(setFetchOnHoldSuccess());
          if (callback)
            callback(null);
        }
      })
      .catch((error) => {
        console.log('error ', error);
        callback(error);
      });
  };
}

export const setFetchRemoveOnHoldSuccess = () => {
  return {
    type: types.SET_FETCH_REMOVE_ON_HOLD_SUCCESS
  }
}

export const setFetchRemoveOnHold = (payload, callback) => {
  return (dispatch, getState) => {
    const { login: { authToken } } = getState();

    let urlQuery = `cf/certificates/removeonholdcertificate`;

    return Api.put(urlQuery, payload, authToken)
      .then(response => {
        const { success, data } = response.data;
        if (success) {
          dispatch(setFetchRemoveOnHoldSuccess());
          if (callback)
            callback(null);
        }
      })
      .catch((error) => {
        console.log('error ', error);
        callback(error);
      });
  };
}

export const setFetchEscalateCertificate = (payload, callback) => {
  return (dispatch, getState) => {
    const { login: { authToken } } = getState();

    let urlQuery = `cf/certificates/escalatecertificate`;

    return Api.put(urlQuery, payload, authToken)
      .then(response => {
        const { success, data } = response.data;
        if (success) {
          if (callback)
            callback(null);
        }
      })
      .catch((error) => {
        console.log('error ', error);
        callback(error);
      });
  };
}

export const settoggleEmailProcedurebtn = (payload) => {
  return {
    type: types.TOGGLE_PROCEDURE_EMAIL_BTN,
    payload
  }
}