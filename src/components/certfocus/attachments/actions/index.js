import Api from '../../../../lib/api';
import * as types from './types';

export const setFetching = (fetching) => {
  return {
    type: types.SET_FETCHING_ATTACHMENTS,
    payload: fetching
  };
};

export const setError = (error) => {
  return {
    type: types.SET_ATTACHMENTS_ERROR,
    payload: error
  };
};

export const setList = (list) => {
  return {
    type: types.SET_ATTACHMENTS_LIST,
    payload: list
  };
};

export const setTotalAmount = (total) => {
  return {
    type: types.SET_TOTAL_AMOUNT_OF_ATTACHMENTS,
    payload: total
  };
};

export const addError = (error) => {
  return {
    type: types.SET_ATTACHMENTS_ADD_ERROR,
    payload: error
  };
};

export const addSuccess = () => {
  return {
    type: types.SET_ATTACHMENTS_ADD_SUCCESS,
  };
};

export const addFetching = () => {
  return {
    type: types.SET_ATTACHMENTS_ADD_FETCHING,
  };
};


export const setShowModal = (status) => {
  return {
    type: types.SET_ATTACHMENTS_SHOW_MODAL,
    payload: status
  };
};

export const fetchAttachments = (queryParams) => {
  return (dispatch, getState) => {
    const { login: { authToken }, localization, attachments: { attachmentsPerPage }} = getState();
    let {
      errorDefault,
      errorConnection,
    } = localization.strings.hcProfile.projects.actions;

    dispatch(setFetching(true));
    dispatch(setTotalAmount(0));

    if (queryParams) {
      if (!queryParams.pageNumber) {
        queryParams.pageNumber = 1;
      }
      queryParams.pageSize = attachmentsPerPage;
    } else {
      queryParams = {
        pageNumber: 1,
        pageSize: attachmentsPerPage,
      };
    }

    let urlQuery = '';
    if (queryParams.projectId) {
      urlQuery = 'cf/projectDocuments';
    } else if (queryParams.insuredId) {
      urlQuery = 'cf/projectInsuredDocuments';
    }

    let urlParameters = `?${Object.keys(queryParams).map(i => `${i}=${queryParams[i]}`).join('&')}`;

    return Api.get(`${urlQuery}${urlParameters}`, authToken)
      .then(response => {
        const { success, totalCount, projectDocuments, projectInsuredDocuments } = response.data;
        
        if (success) {
          if (queryParams.projectId) {
            dispatch(setList(projectDocuments ? projectDocuments : []));
          } else if (queryParams.insuredId) {
            dispatch(setList(projectInsuredDocuments ? projectInsuredDocuments : []));
          }
          dispatch(setTotalAmount(totalCount ? totalCount : 0));
        } else {
          dispatch(setError(errorDefault));
          dispatch(setTotalAmount(0));
        }
      })
      .catch(() => {
        dispatch(setError(errorConnection));
      });
  };
};

export const sendProjectAttachment = (payload, callback) => {
  return async (dispatch, getState) => {
    const { login: { authToken }, localization } = getState();
    let {
      errorDefault,
      errorConnection,
    } = localization.strings.hcProfile.projects.actions;

    let form_data = new FormData();

    for (var key in payload) {
      form_data.append(key, payload[key]);
    }

    dispatch(addFetching(''));

    return Api.post('cf/documents', form_data, authToken)
      .then(response => {
        const { success, data } = response.data;
        if (success) {
          const linkPayload = {
            projectId: payload.projectId,
            documentId: data.documentId,
          };

          // LINK DOCUMENT TO REQ SET
          Api.post('cf/projectDocuments', linkPayload, authToken)
            .then(response => {
              const { success } = response.data;
              if (success) {
                dispatch(addSuccess());
                if (callback) callback(true);
              } else {
                // IF THE RELATION COUND'T BE CREATED DELETE THE UPLOADED DOCUMENT
                Api.delete('cf/documents', { documentId: linkPayload.documentId }, authToken);
                dispatch(addError(errorDefault));
                if (callback) callback(false);
              }
            })
            .catch(() => {
              // IF THE RELATION COUND'T BE CREATED DELETE THE UPLOADED DOCUMENT
              Api.delete('cf/documents', { documentId: linkPayload.documentId }, authToken);
              dispatch(addError(errorConnection));
              if (callback) callback(false);
            });
        } else {
          dispatch(addError(errorDefault));
          if (callback) callback(false);
        }
      })
      .catch(() => {
        dispatch(addError(errorConnection));
        if (callback) callback(false);
      });
  };
};

export const sendInsuredAttachment = (payload, callback) => {
  return async (dispatch, getState) => {
    const { login: { authToken }, localization } = getState();
    let {
      errorDefault,
      errorConnection,
    } = localization.strings.hcProfile.projects.actions;

    let form_data = new FormData();

    for (var key in payload) {
      form_data.append(key, payload[key]);
    }

    dispatch(addFetching(''));

    return Api.get(`cf/projectInsureds?projectId=${payload.projectId}&insuredId=${payload.insuredId}`, authToken)
      .then(response => {
        const { success, projectInsureds } = response.data;

        if (success && projectInsureds.length > 0) {
          const projectInsuredId = projectInsureds[0].ProjectInsuredID;

          Api.post('cf/documents', form_data, authToken)
            .then(response => {
              const { success, data } = response.data;
              if (success) {
                const linkPayload = {
                  projectInsuredId: projectInsuredId,
                  documentId: data.documentId,
                };

                // LINK DOCUMENT TO REQ SET
                Api.post('cf/projectInsuredDocuments', linkPayload, authToken)
                  .then(response => {
                    const { success } = response.data;
                    if (success) {
                      dispatch(addSuccess());
                      if (callback) callback(true);
                    } else {
                      // IF THE RELATION COUND'T BE CREATED DELETE THE UPLOADED DOCUMENT
                      Api.delete('cf/documents', { documentId: linkPayload.documentId }, authToken);
                      dispatch(addError(errorDefault));
                      if (callback) callback(false);
                    }
                  })
                  .catch(() => {
                    // IF THE RELATION COUND'T BE CREATED DELETE THE UPLOADED DOCUMENT
                    Api.delete('cf/documents', { documentId: linkPayload.documentId }, authToken);
                    dispatch(addError(errorConnection));
                    if (callback) callback(false);
                  });
              } else {
                dispatch(addError(errorDefault));
                if (callback) callback(false);
              }
            })
            .catch(() => {
              dispatch(addError(errorConnection));
              if (callback) callback(false);
            });
        } else {
          dispatch(addError(errorConnection));
          if (callback) callback(false);
        }
      })
      .catch(() => {
        dispatch(addError(errorConnection));
        if (callback) callback(false);
      });
  };
};
