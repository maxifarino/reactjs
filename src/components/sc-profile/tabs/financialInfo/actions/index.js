import * as types from './types';
import Api from '../../../../../lib/api';

export const setError = (error) => {
  return {
    type: types.SET_FINANCIALS_ERROR,
    error
  };
};

export const setSuccessMsg = (successMsg) => {
  return {
    type: types.SET_FINANCIALS_SUCCESS_MSG,
    successMsg
  };
};

/* SCORE CARDS */
export const setFetchingAccountsList = (isFetching) => {
  return {
    type: types.SET_FETCHING_ACCOUNTS_LIST,
    isFetching
  };
};

export const setFetchingcalculateAccounts = (isFetching) => {
  return {
    type: types.SET_FETCHING_CALCULATE_ACCOUNTS,
    isFetching
  };
};

export const setAccountsList = (data) => {
  return {
    type: types.SET_ACCOUNTS_LIST,
    accountsList: data.accountsList,
    basicAccounts: data.basicAccounts,
    accountsListData: data.subcontractorData,
    scorecardSourcePossibleValues: data.scorecardSourcePossibleValues,
    scorecardCompaniesTypesPossibleValues: data.scorecardCompaniesTypesPossibleValues,
    scorecardTurnOverRatesPossibleValues: data.scorecardTurnOverRatesPossibleValues,
    referencesPossibleValues: data.referencesPossibleValues,
    legalPossibleValues: data.legalPossibleValues,
    creditHistoryPossibleValues: data.creditHistoryPossibleValues,
    scorecardConcetpsList: data.scorecardConcetpsList,
    avgProjectAccounts: data.avgProjectAccounts,
    avgVolumeAccounts: data.avgVolumeAccounts,
    subcontractorData: data.subcontractorData,
    bankLinePossibleValues: data.bankLinePossibleValues,
    analysisTypePossibleValues: data.analysisTypePossibleValues,
    financialStatementTypePossibleValues: data.financialStatementTypePossibleValues,
    companiesTypesPossibleValues: data.companiesTypesPossibleValues,
    discreteAccounts: data.discreteAccounts,
    accountDisplayTypeId: data.accountDisplayTypeId,
  };
};

export const setCalculatedAccounts = (data) => {
  return {
    type: types.SET_CALCULATED_ACCOUNTS,
    data
  };
};

export const setWorkingCapital = (data) => {
  return {
    type: types.SET_WORKING_CAPITAL,
    data
  };
};

export const setSubmitionDates = (data) => {
  return {
    type: types.SET_SUBMITION_DATES,
    data
  };
};

export const setPrequalDates = (data) => {
  return {
    type: types.SET_PREQUAL_DATES,
    data
  };
};

export const setSavedFormAsCompleted = () => {
  return {
    type: types.SET_SAVED_FORM_AS_COMPLETED
  };
};

export const fetchAccountsList = (hcId, scId, savedFormId, origin) => {
  return (dispatch, getState) => {
    const token = getState().login.authToken;

    dispatch(setFetchingAccountsList(true));

    let url = '';

    if (savedFormId && (!hcId || !scId)) {
      url = `finances/scorecards?savedFormId=${savedFormId}`;
    } else {
      url = `finances/scorecards?hcId=${hcId}&scId=${scId}&savedFormId=${savedFormId}`;
    }

    return Api.get(
      url,
      token,
    ).then(response => {
      const { success, data } = response.data;
      // console.log(response.data);
      if (success && data) {

        const accountListData = {
          accountsList: data.accountsList,
          basicAccounts: data.basicAccounts,
          accountsListData: data.subcontractorData,
          scorecardSourcePossibleValues: data.scorecardSourcePossibleValues,
          scorecardCompaniesTypesPossibleValues: data.scorecardCompaniesTypesPossibleValues,
          scorecardTurnOverRatesPossibleValues: data.scorecardTurnOverRatesPossibleValues,
          referencesPossibleValues: data.referencesPossibleValues,
          legalPossibleValues: data.legalPossibleValues,
          creditHistoryPossibleValues: data.creditHistoryPossibleValues,
          scorecardConcetpsList: data.scorecardConcetpsList,
          avgProjectAccounts: data.avgProjectAccounts,
          avgVolumeAccounts: data.avgVolumeAccounts,
          subcontractorData: data.subcontractorData,
          bankLinePossibleValues: data.bankLinePossibleValues,
          analysisTypePossibleValues: data.analysisTypePossibleValues,
          financialStatementTypePossibleValues: data.financialStatementTypesPossibleValues,
          companiesTypesPossibleValues: data.companiesTypesPossibleValues,
          discreteAccounts: data.discreteAccountsList,
          accountDisplayTypeId: data.accountDisplayTypeId,
        };

        dispatch(setAccountsList(accountListData));
      }
      dispatch(setFetchingAccountsList(false));
    }).catch(error => {
      console.log(error);
    });
  };
}

export const fetchSubmitionDates = (hcId, scId, origin) => {
  if (origin) {
    // console.log('>>>fetchSubmitionDates origin = ', origin)
  }
  return (dispatch, getState) => {
    const token = getState().login.authToken;
    return Api.get(
      `forms/savedforms/datessubmission?subcontractorId=${scId}&hiringClientId=${hcId}`,
      token
    ).then(response => {
      const { success, data } = response.data;
      if (success) {
        dispatch(setSubmitionDates(data));
      }
    })
      .catch(error => {
        console.log(error);
      });
  };
}

export const fetchPrequalDates = (hcId, scId) => {
  return (dispatch, getState) => {
    const token = getState().login.authToken;
    return Api.get(
      `forms/savedforms/datesprequal?subcontractorId=${scId}&hiringClientId=${hcId}`,
      token
    ).then(response => {
      const { success, data } = response.data;
      if (success) {
        dispatch(setPrequalDates(data));
      }
    })
      .catch(error => {
        console.log(error);
      });
  };
}

export const saveAccountsList = (payload, callback) => {
  return (dispatch, getState) => {
    const token = getState().login.authToken;
    dispatch(setFetchingAccountsList(true));
    dispatch(setError(null));
    return Api.post(
      `finances/scorecards`,
      payload,
      token
    ).then(response => {
      const { success } = response.data;
      if (success) {
        // console.log('saveAccountsList response.data = ', response.data)
        dispatch(setSuccessMsg("Changes successfully saved"));
        if (callback) {
          callback();
        }
      } else {
        dispatch(setError("There was an error while saving, please try again"));
      }
      dispatch(setFetchingAccountsList(false));
    })
      .catch(error => {
        console.log(error);
        dispatch(setError("There was an error while saving, please try again"));
        dispatch(setFetchingAccountsList(false));
      });
  };
}

export const fetchWorkingCapital = (payload) => {
  return (dispatch, getState) => {
    const token = getState().login.authToken;
    dispatch(setFetchingcalculateAccounts(true));
    dispatch(setError(null));
    return Api.post(
      `finances/workingCapital`,
      payload,
      token
    ).then(response => {
      const { success, workingCapital } = response.data;
      if (success) {
        // console.log('fetchWorkingCapital response.data = ', response.data)
        dispatch(setWorkingCapital(workingCapital));
      } else {
        console.log(response.data)
        dispatch(setError("There was an error, please try again"));
      }
      dispatch(setFetchingcalculateAccounts(false));
    })
      .catch(error => {
        console.log(error);
        dispatch(setError("There was an error, please try again"));
        dispatch(setFetchingcalculateAccounts(false));
      });
  };
}

export const fetchCalculatedAccounts = (payload) => {
  return (dispatch, getState) => {
    const token = getState().login.authToken;
    dispatch(setFetchingcalculateAccounts(true));
    dispatch(setError(null));
    return Api.post(
      `finances/scorecards`,
      payload,
      token
    ).then(response => {
      const { success, calcRes } = response.data;
      if (success) {
        // console.log('fetchCalculatedAccounts response.data = ', response.data)
        dispatch(setCalculatedAccounts(calcRes));
      } else {
        dispatch(setError("There was an error, please try again"));
      }
      dispatch(setFetchingcalculateAccounts(false));
    })
      .catch(error => {
        console.log(error);
        dispatch(setError("There was an error, please try again"));
        dispatch(setFetchingcalculateAccounts(false));
      });
  };
}

/* SCORE CARDS CONCEPTS */
export const setFetchingScoreCardsConcepts = (isFetching) => {
  return {
    type: types.SET_FETCHING_SCORE_CARDS_CONCEPTS,
    isFetching
  };
};
export const setScoreCardsConceptsEmpty = () => {
  return {
    type: types.SET_SCORE_CARDS_CONCEPTS,
    scoreCardsConcepts: [],
    subcontractorData: {},
    scorecardMainParameters: {},
    discreteAccountsList: [],
    accountDisplayTypeId: 1,
    commentary: null,
    averageConcepts: {
      avgProjectAccounts: [],
      avgVolumeAccounts: []
    },
    emrAccounts: [],
    isScoreCardEmpty: true,
    scorecardHiddenFields: [],
    isCovid19Form: false,
  };
};
export const setScoreCardsConcepts = (data) => {
  return {
    type: types.SET_SCORE_CARDS_CONCEPTS,
    averageConcepts: {
      avgProjectAccounts: data.avgProjectAccounts,
      avgVolumeAccounts: data.avgVolumeAccounts
    },
    accountDisplayTypeId: data.accountDisplayTypeId,
    discreteAccountsList: data.discreteAccountsList,
    commentary: data.commentary,
    emrAccounts: data.emrAccounts,
    nevadaSingleLimit: data.nevadaSingleLimit,
    scoreCardsConcepts: data.scorecardConcepts,
    subcontractorData: data.subcontractorData,
    scorecardMainParameters: data.scorecardMainParameters,
    isScoreCardEmpty: false,
    scorecardHiddenFields: data.scorecardHiddenFields,
    isCovid19Form: data.isCovid19Form,
  };
};
export const fetchScoreCardsConcepts = (savedFormId) => {
  // console.log('>>>fetchScoreCardsConcepts, savedFormId = ', savedFormId)
  return (dispatch, getState) => {
    const token = getState().login.authToken;
    dispatch(setFetchingScoreCardsConcepts(true));
    return Api.get(
      `finances/scorecardsconcepts?savedFormId=${savedFormId}`,
      token
    ).then(response => {
      const { success, data } = response.data;

      if (success && data) {
        dispatch(setScoreCardsConcepts(data));
      } else {
        dispatch(setScoreCardsConceptsEmpty());
      }
      dispatch(setFetchingScoreCardsConcepts(false));
    })
      .catch(error => {
        console.log(error);
        dispatch(setScoreCardsConcepts([]));
        dispatch(setFetchingScoreCardsConcepts(false));
      });
  };
}

export const fetchEmbeddedReportsInfo = (params) => {
  return (dispatch, getState) => {
    const token = getState().login.authToken;
    return Api.post(
      `EmbeddedReportsInfo`,
      params,
      token
    ).then(response => {
      const { success, results } = response.data;
      // console.log('fetchEmbeddedReportsInfo response.data = ', response.data)
      if (success) {
        return results
      }
    })
      .catch(error => {
        console.log(error);
      });
  };
}
