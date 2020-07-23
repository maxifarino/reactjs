import Api from '../../../../lib/api';
import * as types from './types';
import { setDetailsError } from '../../requirement-sets/actions';

export const setFetching = (fetching) => {
  return {
    type: types.SET_FETCHING_HOLDER_REQUIREMENT_SETS_VIEW,
    payload: fetching
  };
};

export const setError = (error) => {
  return {
    type: types.SET_HOLDER_REQUIREMENT_SETS_ERROR_VIEW,
    payload: error
  };
};

export const setList = (list) => {
  return {
    type: types.SET_HOLDER_REQUIREMENT_SETS_LIST_VIEW,
    payload: list
  };
};

export const setTotalAmount = (total) => {
  return {
    type: types.SET_TOTAL_AMOUNT_OF_HOLDER_REQUIREMENT_SETS_VIEW,
    payload: total
  };
};

export const addError = (error) => {
  return {
    type: types.SET_HOLDER_REQUIREMENT_SETS_ADD_ERROR_VIEW,
    payload: error
  };
};

export const addSuccess = () => {
  return {
    type: types.SET_HOLDER_REQUIREMENT_SETS_ADD_SUCCESS_VIEW,
  };
};

export const addFetching = () => {
  return {
    type: types.SET_HOLDER_REQUIREMENT_SETS_ADD_FETCHING_VIEW,
  };
};


export const setShowModal = (status) => {
  return {
    type: types.SET_HOLDER_REQUIREMENT_SETS_SHOW_MODAL_VIEW,
    payload: status
  };
};

export const fetchRules = (queryParams) => {
  return (dispatch, getState) => {
    const { login: { authToken }, localization } = getState();
    let {
      errorDefault,
      errorConnection,
    } = localization.strings.hcProfile.projects.actions;
    let urlParameters = '';

    dispatch(setFetching(true));
    dispatch(setTotalAmount(0));

    const { rulesPerPage } = getState().holderRequirementSetsView;

    if (queryParams) {
      if (!queryParams.pageNumber) {
        queryParams.pageNumber = 1;
      }
      queryParams.pageSize = rulesPerPage;
    } else {
      queryParams = {
        pageNumber: 1,
        pageSize: rulesPerPage
      };
    }

    let urlQuery = 'cf/requirementSetsDetail';

    urlParameters = `?${Object.keys(queryParams).map(i => `${i}=${queryParams[i]}`).join('&')}`;

    return Api.get(`${urlQuery}${urlParameters}`, authToken)
      .then(response => {
        const { success, totalCount, requirementSets } = response.data;

        if (success) {
          dispatch(setTotalAmount(totalCount ? totalCount : 0));
          dispatch(setList(requirementSets ? requirementSets : []));
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

export const checkGroupAndSendRule = (payload, groupsQuery, callback) => {
  return (dispatch, getState) => {
    const { login: { authToken }, localization } = getState();
    let {
      errorDefault,
      errorConnection,
      error20001,
    } = localization.strings.holderRequirementSetsView.actions;

    dispatch(setDetailsError(''));

    let urlQuery = 'cf/ruleGroups';
    let urlParameters = `?${Object.keys(groupsQuery).map(i => `${i}=${groupsQuery[i]}`).join('&')}`;
    console.log('checkGroupAndSendRule', payload, groupsQuery);
    return Api.get(`${urlQuery}${urlParameters}`, authToken)
      .then(response => {
        const { success, ruleGroups } = response.data;
        console.log('RESPONSE ruleGroups',response.data);
        if (success) {
          // If there is already a group with the same name en coverage type, use the rule in that group and create the rule
          // else create a new group and create the rule
          if (ruleGroups.length > 0) {
            const ruleDataQuery = {
              ruleGroupId: ruleGroups[0].RuleGroupID,
              attributeId: payload.attributeId,
            };

            urlQuery = 'cf/rules';
            urlParameters = `?${Object.keys(ruleDataQuery).map(i => `${i}=${ruleDataQuery[i]}`).join('&')}`;
            console.log('get rules',urlQuery,urlParameters );
            Api.get(`${urlQuery}${urlParameters}`, authToken)
            .then(response => {
              const { success, rules } = response.data;
              console.log('RESPONSE rules',response.data);
              if (success) {

                if (rules.length > 0) {
                  dispatch(setDetailsError(error20001));
                  if (callback) callback(false);
                } else {
                  const ruleData = {
                    ...payload,
                    ruleGroupId: ruleDataQuery.ruleGroupId,
                    ruleGroupName: payload.ruleGroupName,
                  };
                  console.log('cf/rules data', ruleData);
                  Api.post('cf/rules', ruleData, authToken)
                  .then(response => {
                    const { success } = response.data;
                    if (success) {
                      if (callback) callback(true);
                    } else {
                      dispatch(setDetailsError(errorDefault));
                      if (callback) callback(false);
                    }
                  })
                  .catch(() => {
                    dispatch(setDetailsError(errorConnection));
                    if (callback) callback(false);
                  });

                }

              } else {
                dispatch(setDetailsError(errorDefault));
                if (callback) callback(false);
              }
            })
            .catch(() => {
              dispatch(setDetailsError(errorConnection));
              if (callback) callback(false);
            });
  
          } else {
            const ruleDataQuery = {
              ...groupsQuery,
              ruleGroupName: payload.ruleGroupName,
            };

            Api.post('cf/ruleGroups', ruleDataQuery, authToken)
            .then(response => {
              const { success, data } = response.data;

              if (success) {
                const ruleData = {
                  ...payload,
                  ruleGroupId: Number(data.ruleGroupId),
                };

                Api.post('cf/rules', ruleData, authToken)
                .then(response => {
                  const { success } = response.data;

                  if (success) {
                    if (callback) callback(true);
                  } else {
                    Api.delete('cf/ruleGroups', { ruleGroupId: data.ruleGroupId });
                    dispatch(setDetailsError(errorDefault));
                    if (callback) callback(false);
                  }
                })
                .catch(() => {
                  Api.delete('cf/ruleGroups', { ruleGroupId: data.ruleGroupId });
                  dispatch(setDetailsError(errorConnection));
                  if (callback) callback(false);
                });
              } else {
                dispatch(setDetailsError(errorDefault));
                if (callback) callback(false);
              }
            })
            .catch(() => {
              dispatch(setDetailsError(errorConnection));
              if (callback) callback(false);
            });
          }
        } else {
          dispatch(setDetailsError(errorDefault));
          if (callback) callback(false);
        }
      })
      .catch(() => {
        dispatch(setDetailsError(errorConnection));
        if (callback) callback(false);
      });
  };
}

// ENDORSEMENTS
export const setEndosementsError = (error) => {
  return {
    type: types.SET_HOLDER_REQUIREMENT_SETS_VIEW_ENDORSEMENTS_ERROR,
    payload: error,
  };
};
export const setAllEndorsements = (endorsements) => {
  return {
    type: types.SET_HOLDER_REQUIREMENT_SETS_VIEW_ALL_ENDORSEMENTS,
    payload: endorsements,
  };
};
export const setReqSetEndorsements = (endorsements) => {
  return {
    type: types.SET_HOLDER_REQUIREMENT_SETS_VIEW_ENDORSEMENTS,
    payload: endorsements,
  };
};
export const setEndosementsFetching = (condition) => {
  return {
    type: types.SET_HOLDER_REQUIREMENT_SETS_VIEW_ENDORSEMENTS_FETCHING,
    payload: condition,
  };
};
export const fetchEndorsements = (setId, holderId, callback) => {
  return (dispatch, getState) => {
    const { login: { authToken }, localization } = getState();
    let {
      errorDefault,
      errorConnection,
    } = localization.strings.hcProfile.projects.actions;
    
    dispatch(setEndosementsError(''));
    dispatch(setEndosementsFetching(true));

    return Promise.all([
      // Fetch all available endorsements
      Api.get(`cf/endorsements?holderId=${holderId}`, authToken),
      // Fetch requirement set endorsements
      Api.get(`cf/requirementSetsEndorsements?requirementSetId=${setId}`, authToken),
    ])
    .then((response) => {
      // If one of the requests failed, return error
      if (response.find((res) => !res.data.success)) {
        dispatch(setEndosementsError(errorDefault));
        dispatch(setEndosementsFetching(false));
        if (callback) callback(false);
      } else {
        response.forEach((res) => {
          const { endorsements, data } = res.data;

          if (endorsements) {
            dispatch(setAllEndorsements(endorsements ? endorsements : []));
          } else if (data) {
            dispatch(setReqSetEndorsements(data ? data : []));
          }
        });
        dispatch(setEndosementsFetching(false));
        if (callback) callback(true);
      }
    })
    .catch(() => {
      dispatch(setEndosementsError(errorConnection));
      dispatch(setEndosementsFetching(false));
      if (callback) callback(false);
    });
  };
};

export const selectedEndorsementFetching = (id) => {
  return {
    type: types.SET_HOLDER_REQUIREMENT_SETS_VIEW_ENDORSEMENTS_SELECT_FETCHING,
    payload: id,
  }
};
export const selectedEndorsementSuccess = (endorsementId, checked, requirementSetEndorsementId) => {
  return {
    type: types.SET_REQUIREMENT_SETS_VIEW_ENDORSEMENT_SELECT_SUCCESS,
    payload: {
      endorsementId,
      checked,
      requirementSetEndorsementId,
    }
  }
};
export const selectedEndorsementError = (id) => {
  return {
    type: types.SET_REQUIREMENT_SETS_VIEW_ENDORSEMENT_SELECT_ERROR,
    payload: id,
  }
};

export const sendEndorsement = (payload) => {
  return (dispatch, getState) => {
    const { login: { authToken } } = getState();

    dispatch(selectedEndorsementFetching(payload.endorsementId));

    let requestMethod = 'post';
    if (!payload.checked) {
      requestMethod = 'delete';
    }

    return Api[requestMethod]('cf/requirementSetsEndorsements', payload, authToken)
      .then(response => {
        const { success, data } = response.data;
        if (success) {
          dispatch(selectedEndorsementSuccess(payload.endorsementId, payload.checked, data ? data.requirementSetEndorsementId : undefined));
        } else {
          dispatch(selectedEndorsementError(payload.endorsementId));
        }
      })
      .catch(() => {
        dispatch(selectedEndorsementError(payload.endorsementId));
      });
  };
};
