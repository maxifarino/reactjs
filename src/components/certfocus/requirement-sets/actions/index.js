import Api from '../../../../lib/api';
import * as types from './types';

export const setFetching = (fetching) => {
  return {
    type: types.SET_FETCHING_HOLDER_REQUIREMENT_SETS,
    payload: fetching
  };
};

export const setError = (error) => {
  return {
    type: types.SET_HOLDER_REQUIREMENT_SETS_ERROR,
    payload: error
  };
};

export const setList = (list) => {
  return {
    type: types.SET_HOLDER_REQUIREMENT_SETS_LIST,
    payload: list
  };
};

export const setTotalAmount = (total) => {
  return {
    type: types.SET_TOTAL_AMOUNT_OF_HOLDER_REQUIREMENT_SETS,
    payload: total
  };
};

export const addError = (error) => {
  return {
    type: types.SET_HOLDER_REQUIREMENT_SETS_ADD_ERROR,
    payload: error
  };
};

export const addSuccess = () => {
  return {
    type: types.SET_HOLDER_REQUIREMENT_SETS_ADD_SUCCESS,
  };
};

export const addFetching = () => {
  return {
    type: types.SET_HOLDER_REQUIREMENT_SETS_ADD_FETCHING,
  };
};


export const setShowModal = (status) => {
  return {
    type: types.SET_HOLDER_REQUIREMENT_SETS_SHOW_MODAL,
    payload: status
  };
};

export const fetchRequirementSets = (queryParams) => {
  return (dispatch, getState) => {
    const { login: { authToken }, localization } = getState();
    let {
      errorDefault,
      errorConnection,
    } = localization.strings.hcProfile.projects.actions;
    let urlParameters = '';

    dispatch(setFetching(true));
    dispatch(setTotalAmount(0));

    const { requirementSetsPerPage } = getState().holderRequirementSets;

    if (queryParams) {
      if (!queryParams.pageNumber) {
        queryParams.pageNumber = 1;
      }
      queryParams.pageSize = requirementSetsPerPage;
    } else {
      queryParams = {
        pageNumber: 1,
        pageSize: requirementSetsPerPage
      };
    }
    let urlQuery = 'cf/requirementSets';

    urlParameters = `?${Object.keys(queryParams).map(i => `${i}=${queryParams[i]}`).join('&')}`;
    urlParameters += '&templates=master'; //For master templates

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

export const sendRequirementSet = (input, callback) => {
  return (dispatch, getState) => {
    const { login: { authToken }, localization } = getState();

    const {
      errorDefault,
      errorConnection,
    } = localization.strings.certFocusProjects.errors;

    dispatch(addFetching());

    let apiMethod;

    if (input.requirementSetId) {
      apiMethod = 'put';
    } else {
      apiMethod = 'post';
    }

    return Api[apiMethod](`cf/requirementSets`, input, authToken)
      .then(response => {
        const { success } = response.data;

        if (success) {
          dispatch(addSuccess());
          if (callback) callback(true);
        } else {
          const errorMsg = errorDefault;
          dispatch(addError(errorMsg));
          if (callback) callback(false);
        }
      })
      .catch(() => {
        dispatch(addError(errorConnection));
        if (callback) callback(false);
      });
  };
};

// REQ SETS DETAILS

// SET GROUPS
export const setDetailsError = (error) => {
  return {
    type: types.SET_HOLDER_REQUIREMENT_SETS_RULES_GROUPS_ERROR,
    payload: error,
  };
};
export const setRulesGroups = (rulesGroups) => {
  return {
    type: types.SET_HOLDER_REQUIREMENT_SETS_RULES_GROUPS,
    payload: rulesGroups,
  };
};
export const fetchRuleGroup = (reqSet, callback) => {
  const reqSetId = reqSet.Id;
  const {HolderId} = reqSet;
  return (dispatch, getState) => {
    const { login: { authToken }, localization } = getState();
    let {
      errorDefault,
      errorConnection,
    } = localization.strings.hcProfile.projects.actions;

    dispatch(setDetailsError(''));

    let urlQuery = 'cf/ruleGroups';
    let urlParameters = `?requirementSetId=${reqSetId}`;
    
    if (HolderId !== null) {
      urlParameters += `&holderId=${HolderId}`;
    }

    return Api.get(`${urlQuery}${urlParameters}`, authToken)
      .then(response => {
        const { success, ruleGroups } = response.data;

        if (success) {
          dispatch(setRulesGroups(ruleGroups ? ruleGroups : []));
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
  };
};

export const addRuleGroup = (group) => {
  return {
    type: types.ADD_HOLDER_REQUIREMENT_SETS_RULES_GROUP,
    payload: group,
  };
};
export const editRuleGroup = (group) => {
  return {
    type: types.EDIT_HOLDER_REQUIREMENT_SETS_RULES_GROUP,
    payload: group,
  };
};
export const sendRuleGroup = (ruleGroup, callback) => {
  return (dispatch, getState) => {
    const { login: { authToken }, localization } = getState();
    let {
      errorDefault,
      errorConnection,
    } = localization.strings.hcProfile.projects.actions;

    dispatch(setDetailsError(''));

    let apiMethod = 'post';
    if (ruleGroup.ruleGroupId) apiMethod = 'put';
    console.log('sendRuleGroup', ruleGroup, apiMethod);

    return Api[apiMethod]('cf/ruleGroups', ruleGroup, authToken)
      .then(response => {
        const { success, data } = response.data;

        if (success) {
          const resData = {
            RuleGroupID: Number(data.ruleGroupId),
            CoverageTypeID: Number(ruleGroup.coverageTypeId),
            RequirementSetID: Number(ruleGroup.requirementSetId),
            RuleGroupName: ruleGroup.ruleGroupName,
            CoverageTypeName: ruleGroup.coverageTypeName,
          }

          if (ruleGroup.ruleGroupId) {
            dispatch(editRuleGroup(resData));
          } else {
            dispatch(addRuleGroup(resData));
          }
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
  };
};

export const removeRuleGroup = (id) => {
  return {
    type: types.DELETE_HOLDER_REQUIREMENT_SETS_RULES_GROUP,
    payload: id,
  };
};
export const deleteRuleGroup = (payload, callback) => {
  return (dispatch, getState) => {
    const { login: { authToken }, localization } = getState();
    let {
      errorDefault,
      errorConnection,
    } = localization.strings.hcProfile.projects.actions;

    dispatch(setDetailsError(''));

    return Api.delete('cf/ruleGroups', payload, authToken)
      .then(response => {
        const { success } = response.data;

        if (success) {
          dispatch(removeRuleGroup(payload.ruleGroupId));
          if (callback) callback();
        } else {
          dispatch(setDetailsError(errorDefault));
          if (callback) callback();
        }
      })
      .catch(() => {
        dispatch(setDetailsError(errorConnection));
        if (callback) callback();
      });
  };
};


// RULES
export const setRules = (rule) => {
  return {
    type: types.SET_HOLDER_REQUIREMENT_SETS_RULES,
    payload: rule,
  };
};
export const setDocuments = (document) => {
  return {
    type: types.SET_HOLDER_REQUIREMENT_SETS_DOCUMENTS,
    payload: document,
  };
};

export const fetchRule = (groupId, callback) => {
  return (dispatch, getState) => {
    const { login: { authToken }, localization } = getState();
    let {
      errorDefault,
      errorConnection,
    } = localization.strings.hcProfile.projects.actions;

    dispatch(setDetailsError(''));

    let urlQuery = 'cf/rules';

    const urlParameters = `?ruleGroupId=${groupId}`;

    return Api.get(`${urlQuery}${urlParameters}`, authToken)
      .then(response => {
        const { success, rules } = response.data;

        if (success) {
          dispatch(setRules(rules ? rules : []));
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
  };
};

export const setAllEndorsements = (data) => {
  return {
    type: types.SET_HOLDER_REQUIREMENT_SETS_ENDORSEMENTS,
    payload: data,
  };
};
export const setReqSetEndorsements = (data) => {
  return {
    type: types.SET_HOLDER_REQUIREMENT_SETS_REQ_SET_ENDORSEMENTS,
    payload: data,
  };
};

export const fetchMultipleRulesAndDocuments = (groupsId, setId, holderId, callback) => {
  return (dispatch, getState) => {
    const { login: { authToken }, localization } = getState();
    let {
      errorDefault,
      errorConnection,
    } = localization.strings.hcProfile.projects.actions;

    dispatch(setDetailsError(''));

    let urlQuery = 'cf/rules';

    return Promise.all([
      // Fetch rules by each group id
      ...groupsId.map((el) => {
        return Api.get(`${urlQuery}?ruleGroupId=${el}`, authToken)
      }),
      // Fetch all the documents from that req set
      Api.get(`cf/requirementSetsDocuments?requirementSetId=${setId}`, authToken),
      // Fetch all available endorsements
      Api.get(`cf/endorsements?holderId=${holderId}`, authToken),
      // Fetch requirement set endorsements
      Api.get(`cf/requirementSetsEndorsements?requirementSetId=${setId}`, authToken),
    ])
    .then((response) => {
      // If one of the requests failed, return error
      if (response.find((res) => !res.data.success)) {
        dispatch(setDetailsError(errorDefault));
        if (callback) callback(false);
      } else {
        response.forEach((res) => {
          const { rules, requirementSetsDocuments, endorsements, data } = res.data;

          if (rules) {
            dispatch(setRules(rules ? rules : []));
          } else if (requirementSetsDocuments) {
            dispatch(setDocuments(requirementSetsDocuments ? requirementSetsDocuments : []));
          } else if (endorsements) {
            dispatch(setAllEndorsements(endorsements ? endorsements : []));
          } else if (data) {
            dispatch(setReqSetEndorsements(data ? data : []));
          }
        });
        if (callback) callback(true);
      }
    })
    .catch(() => {
      dispatch(setDetailsError(errorConnection));
      if (callback) callback(false);
    });
  };
};

export const addRule = (rule) => {
  return {
    type: types.ADD_HOLDER_REQUIREMENT_SETS_RULES,
    payload: rule,
  };
};
export const editRule = (rule) => {
  return {
    type: types.EDIT_HOLDER_REQUIREMENT_SETS_RULES,
    payload: rule,
  };
};
export const sendRule = (payload, callback) => {
  return (dispatch, getState) => {
    const { login: { authToken }, localization } = getState();
    let {
      errorDefault,
      errorConnection,
    } = localization.strings.hcProfile.projects.actions;

    dispatch(setDetailsError(''));

    let apiMethod = 'post';
    if (payload.ruleId) apiMethod = 'put';

    return Api[apiMethod]('cf/rules', payload, authToken)
      .then(response => {
        const { success, data } = response.data;
        if (success) {
          const ruleObj = {
            RuleID: Number(data.ruleId),
            AttributeID: Number(payload.attributeId),
            AttributeName: payload.attributeName,
            ConditionTypeID: Number(payload.conditionTypeId),
            ConditionValue: payload.conditionValue,
            DeficiencyText: payload.deficiencyText,
            DeficiencyTypeID: Number(payload.deficiencyTypeId),
            RuleGroupID: Number(payload.ruleGroupId),
          };

          if (payload.ruleId) {
            dispatch(editRule(ruleObj));
          } else {
            dispatch(addRule(ruleObj));
          }
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
  };
};

export const removeRule = (ruleId) => {
  return {
    type: types.DELETE_HOLDER_REQUIREMENT_SETS_RULES,
    payload: ruleId,
  };
};
export const deleteRule = (ruleId, callback) => {
  return (dispatch, getState) => {
    const { login: { authToken }, localization } = getState();
    let {
      errorDefault,
      errorConnection,
    } = localization.strings.hcProfile.projects.actions;

    dispatch(setDetailsError(''));

    return Api.delete('cf/rules', { ruleId }, authToken)
      .then(response => {
        const { success } = response.data;
        if (success) {
          dispatch(removeRule(ruleId));
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
  };
};

// ATTRIBUTES TYPE AHEAD
export const setAttributeTypeAhead = (data) => {
  return {
    type: types.SET_REQUIREMENT_SETS_ATTRIBUTES_TYPE_AHEAD,
    payload: data,
  }
};
export const setAttributeTypeAheadError = (data) => {
  return {
    type: types.SET_REQUIREMENT_SETS_ATTRIBUTES_TYPE_AHEAD_ERROR,
    payload: data,
  }
};
export const setAttributeTypeAheadFetching = () => {
  return {
    type: types.SET_REQUIREMENT_SETS_ATTRIBUTES_TYPE_AHEAD_FETCHING,
  }
};
export const resetAttributeTypeAheadResults = () => {
  return {
    type: types.SET_REQUIREMENT_SETS_ATTRIBUTES_TYPE_AHEAD_RESET
  }
};
export const fetchAttributeTypeAhead = (queryParams) => {
  return (dispatch, getState) => {
    const { login: { authToken }, localization } = getState();
    let {
      errorDefault,
      errorConnection,
    } = localization.strings.hcProfile.projects.actions;

    dispatch(setAttributeTypeAheadFetching());
    
    const urlParameters = `?${Object.keys(queryParams).map(i => `${i}=${queryParams[i]}`).join('&')}`;

    return Api.get(`cf/attributes${urlParameters}`, authToken)
      .then(response => {
        const { success, attributes } = response.data;

        if (success) {
          dispatch(setAttributeTypeAhead(attributes ? attributes : []));
        } else {
          dispatch(setAttributeTypeAheadError(errorDefault));
        }
      })
      .catch(() => {
        dispatch(setAttributeTypeAheadError(errorConnection));
      });
  };
};

// ENDORSEMENTS
export const setEndorsementFetching = (id) => {
  return {
    type: types.SET_REQUIREMENT_SETS_ENDORSEMENT_FETCHING,
    payload: id,
  }
};
export const setEndorsementSuccess = (endorsementId, checked, requirementSetEndorsementId, name, alwaysVisible) => {
  return {
    type: types.SET_REQUIREMENT_SETS_ENDORSEMENT_SUCCESS,
    payload: {
      endorsementId,
      checked,
      requirementSetEndorsementId,
      name,
      alwaysVisible
    }
  }
};
export const setEndorsementError = (id) => {
  return {
    type: types.SET_REQUIREMENT_SETS_ENDORSEMENT_ERROR,
    payload: id,
  }
};

export const sendEndorsement = (payload, callback) => {
  return (dispatch, getState) => {
    const { login: { authToken } } = getState();

    dispatch(setEndorsementFetching(payload.endorsementId));

    let requestMethod = 'post';
    if (!payload.checked) {
      requestMethod = 'delete';
    }

    return Api[requestMethod]('cf/requirementSetsEndorsements', payload, authToken)
      .then(response => {
        const { success, data } = response.data;
        if (success) {          
          dispatch(setEndorsementSuccess(
            payload.endorsementId, 
            payload.checked, 
            data ? data.requirementSetEndorsementId : undefined,
            payload.name,
            payload.alwaysVisible
          ));
          if (callback) callback(true);
        } else {
          dispatch(setEndorsementError(payload.endorsementId));
          if (callback) callback(false);
        }
      })
      .catch(() => {
        dispatch(setEndorsementError(payload.endorsementId));
        if (callback) callback(false);
      });
  };
};

// ATTACHMENTS
export const addFile = (file) => {
  return {
    type: types.ADD_HOLDER_REQUIREMENT_SETS_ATTACHMENTS,
    payload: file,
  };
};
export const sendAttachment = (payload, callback) => {
  return (dispatch, getState) => {
    const { login: { authToken }, localization } = getState();
    let {
      errorDefault,
      errorConnection,
    } = localization.strings.hcProfile.projects.actions;

    let form_data = new FormData();

    for (var key in payload) {
      form_data.append(key, payload[key]);
    }

    dispatch(setDetailsError(''));

    return Api.post('cf/documents', form_data, authToken)
      .then(response => {
        const { success, data } = response.data;
        if (success) {
          const linkPayload = {
            requirementSetId: payload.requirementSetId,
            documentId: data.documentId,
          };
          const documentUrl = data.url;

          // LINK DOCUMENT TO REQ SET
          Api.post('cf/requirementSetsDocuments', linkPayload, authToken)
            .then(response => {
              const { success, data } = response.data;
              if (success) {
                const fileObj = {
                  DocumentID: Number(linkPayload.documentId),
                  RequirementSets_DocumentID: Number(data.requirementSetsDocumentId),
                  FileName: `cf_${payload.name}.${payload.document.name.split('.').pop()}`,
                  RequirementSetID: Number(payload.requirementSetId),
                  Url: documentUrl,
                };

                dispatch(addFile(fileObj));
                if (callback) callback(true);
              } else {
                // IF THE RELATION COUND'T BE CREATED DELETE THE UPLOADED DOCUMENT
                Api.delete('cf/documents', { documentId: linkPayload.documentId }, authToken);
                dispatch(setDetailsError(errorDefault));
                if (callback) callback(false);
              }
            })
            .catch(() => {
              // IF THE RELATION COUND'T BE CREATED DELETE THE UPLOADED DOCUMENT
              Api.delete('cf/documents', { documentId: linkPayload.documentId }, authToken);
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
  };
};

export const removeFile = (id) => {
  return {
    type: types.DELETE_HOLDER_REQUIREMENT_SETS_ATTACHMENTS,
    payload: id,
  };
};
export const deleteAttachment = (requirementSetsDocumentId, documentId, callback) => {
  return (dispatch, getState) => {
    const { login: { authToken }, localization } = getState();
    let {
      errorDefault,
      errorConnection,
    } = localization.strings.hcProfile.projects.actions;

    dispatch(setDetailsError(''));

    return Api.delete('cf/requirementSetsDocuments', { requirementSetsDocumentId }, authToken)
      .then(response => {
        const { success } = response.data;
        if (success) {
          // DELETE ASSOCIATED DOCUMENT
          Api.delete('cf/documents', { documentId }, authToken);
          dispatch(removeFile(requirementSetsDocumentId));
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
  };
};

// REQUIREMENT SETS POSSIBLE VALUES FOR DROPDOWNS OR TYPEAHEAD
export const setReqSetsPossibleValues = (reqSets) => {
  return {
    type: types.SET_HOLDER_REQUIREMENT_SETS_POSSIBLE_VALUES_LIST,
    payload: reqSets,
  }
}
export const setFetchingPossibleValues = (fetching) => {
  return {
    type: types.SET_HOLDER_REQUIREMENT_SETS_POSSIBLE_VALUES_FETCHING,
    payload: fetching,
  }
}
export const setErrorPossibleValues = (error) => {
  return {
    type: types.SET_HOLDER_REQUIREMENT_SETS_POSSIBLE_VALUES_ERROR,
    payload: error,
  }
}
export const fetchRequirementSetsPossibleValues = (queryParams) => {
  return (dispatch, getState) => {
    const { login: { authToken }, localization } = getState();
    let {
      errorDefault,
      errorConnection,
    } = localization.strings.hcProfile.projects.actions;

    dispatch(setFetchingPossibleValues(true));

    let urlQuery = 'cf/requirementSets';

    const urlParameters = `?${Object.keys(queryParams).map(i => `${i}=${queryParams[i]}`).join('&')}`;

    return Api.get(`${urlQuery}${urlParameters}`, authToken)
      .then(response => {
        const { success, requirementSets } = response.data;

        if (success) {
          dispatch(setReqSetsPossibleValues(requirementSets ? requirementSets : []));
        } else {
          dispatch(setErrorPossibleValues(errorDefault));
        }
      })
      .catch(() => {
        dispatch(setErrorPossibleValues(errorConnection));
      });
  };
};


export const setHolderSetIdsPossibleValues = (holderSetIds) => {
  return {
    type: types.SET_HOLDER_SET_IDS_POSSIBLE_VALUES_LIST,
    payload: holderSetIds,
  }
}
export const setFetchingHolderSetIdsPossibleValues = (fetching) => {
  return {
    type: types.SET_HOLDER_SET_IDS_POSSIBLE_VALUES_FETCHING,
    payload: fetching,
  }
}
export const setErrorHolderSetIdsPossibleValues = (error) => {
  return {
    type: types.SET_HOLDER_SET_IDS_POSSIBLE_VALUES_ERROR,
    payload: error,
  }
}
export const fetchHolderSetIdsPossibleValues = (queryParams) => {
  return (dispatch, getState) => {
    const { login: { authToken }, localization } = getState();
    let {
      errorDefault,
      errorConnection,
    } = localization.strings.hcProfile.projects.actions;

    dispatch(setFetchingHolderSetIdsPossibleValues(true));
    
    let urlQuery = 'cf/requirementSets/holderSetIds';

    return Api.get(`${urlQuery}`, authToken)
      .then(response => {
        const { success, holderSetIds } = response.data;

        if (success) {
          dispatch(setHolderSetIdsPossibleValues(holderSetIds ? holderSetIds : []));
        } else {
          dispatch(setErrorHolderSetIdsPossibleValues(errorDefault));
        }
      })
      .catch(() => {
        dispatch(setErrorHolderSetIdsPossibleValues(errorConnection));
      });
  };
};

export const fetchMultipleRulesAndDocumentsForSettings = (groupsId, setId, callback) => {  
  return (dispatch, getState) => {
    const { login: { authToken }, localization } = getState();
    let {
      errorDefault,
      errorConnection,
    } = localization.strings.hcProfile.projects.actions;

    let urlQuery = 'cf/rules';

    return Promise.all([
      // Fetch rules by each group id
      ...groupsId.map((el) => {
        return Api.get(`${urlQuery}?ruleGroupId=${el}`, authToken)
      }),
      // Fetch all the documents from that req set
      Api.get(`cf/requirementSetsDocuments?requirementSetId=${setId}`, authToken),
      // Fetch all available endorsements
      //Api.get(`cf/endorsements`, authToken),
      // Fetch requirement set endorsements
      Api.get(`cf/requirementSetsEndorsements?requirementSetId=${setId}`, authToken),
    ])
    .then((response) => {
      // If one of the requests failed, return error
      if (response.find((res) => !res.data.success)) {
        dispatch(setDetailsError(errorDefault));
        if (callback) callback(false);
      } else {
        response.forEach((res) => {
          const { rules, requirementSetsDocuments, endorsements, data } = res.data;

          if (rules) {
            dispatch(setRules(rules ? rules : []));
          } else if (requirementSetsDocuments) {
            dispatch(setDocuments(requirementSetsDocuments ? requirementSetsDocuments : []));
          // } else if (endorsements) {
          //   dispatch(setAllEndorsements(endorsements ? endorsements : []));
          } else if (data) {
            dispatch(setReqSetEndorsements(data ? data : []));
          }
        });
        if (callback) callback(true);
      }
    })
    .catch(() => {
      dispatch(setDetailsError(errorConnection));
      if (callback) callback(false);
    });
  };

};
  
export const duplicateReqSet = (data, callback) => {
  return (dispatch, getState) => {
    const { login: { authToken }, localization } = getState();
    let {
      errorDefault,
      errorConnection,
    } = localization.strings.hcProfile.projects.actions;

    dispatch(setDetailsError(''));
    console.log('action duplicateReqSet', data);

    return Api.post('cf/requirementSets/Duplicate', data, authToken)
      .then(response => {
        const { success, data } = response.data;

        if (success) {
          dispatch(setRulesGroups(data ? data : []));
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
  };
};