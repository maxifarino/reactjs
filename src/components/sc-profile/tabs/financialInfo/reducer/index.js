import _ from 'lodash';

import * as types from '../actions/types';

export default function FinancialInfoReducer(state = {
  // state vars below set by SET_ACCOUNTS_LIST (fetchAccountsList
  // in actions), to populate Financial Info Tab
  accountsList: [],
  accountsListData: {},
  analysisTypePossibleValues: [],
  avgProjectAccounts: [],
  avgVolumeAccounts: [],
  bankLinePossibleValues: [],
  basicAccounts: [],
  discreteAccounts: [],
  companiesTypesPossibleValues: [],
  creditHistoryPossibleValues: [],
  financialStatementTypePossibleValues: [],
  legalPossibleValues: [],
  referencesPossibleValues: [],
  scorecardConcetpsList: [],
  scorecardCompaniesTypesPossibleValues: [],
  scorecardSourcePossibleValues: [],
  scorecardTurnOverRatesPossibleValues: [],
  subcontractorData: {},
  // state vars below set by SET_SCORE_CARDS_CONCEPTS
  // (fetchScoreCardsConcepts in actions), to populate ScoreCard Tab
  averageConcepts: {},
  scoreCardsdiscreteAccounts: [],
  finInfoAccountDisplayTypeId: 1,
  scorecardAccountDisplayTypeId: 1,
  commentary: '',
  emrAccounts: [],
  nevadaSingleLimit: {},
  scoreCardsConcepts: [],
  subcontractorDataConcepts: {},
  scorecardMainParameters: {},
  isScoreCardEmpty: '',
  scorecardHiddenFields: [],
  isCovid19Form: false,
  // state vars below set by SET_SUBMITION_DATES
  // (fetchSubmitionDates in actions), to populate ScoreCardS wrapper with
  // SUBMISSION DATE Select Options Values
  submitionDates: [],
  isSubDatesEmpty: '',
  // state var below set by SET_PREQUAL_DATES
  // (fetchPrequalDates in actions), to populate Fin Info Tab with
  // Prequal Date Select Options Values
  prequalDates: [],
  // state vars below set by SET_CALCULATED_ACCOUNTS
  // (fetchCalculatedAccounts in actions), as a result of Fin Info Tab Calculate button action (onCalculateAccounts()).
  // "adjWorkingCapital" is also set by SET_WORKING_CAPITAL (fetchWorkingCapital in actions)
  adjWorkingCapital: 0,
  calculatedAccounts: {},
  // FETCHING DATA and misc.
  fetchingAccountsList: false,
  fetchingCalculateAccounts: false,
  fetchingScoreCardsConcepts: false,
  error: null,
  successMsg: null
}, action) {
  switch (action.type) {
    case types.SET_FETCHING_ACCOUNTS_LIST:
      return Object.assign({}, state, {
        fetchingAccountsList: action.isFetching
      });
    case types.SET_FETCHING_CALCULATE_ACCOUNTS:
      return Object.assign({}, state, {
        fetchingCalculateAccounts: action.isFetching
      });
    case types.SET_ACCOUNTS_LIST:
      return Object.assign({}, state, {
        accountsList: action.accountsList,
        accountsListData: action.accountsListData,
        analysisTypePossibleValues: action.analysisTypePossibleValues,
        avgProjectAccounts: action.avgProjectAccounts,
        avgVolumeAccounts: action.avgVolumeAccounts,
        bankLinePossibleValues: action.bankLinePossibleValues,
        basicAccounts: action.basicAccounts,
        companiesTypesPossibleValues: action.companiesTypesPossibleValues,
        creditHistoryPossibleValues: action.creditHistoryPossibleValues,
        financialStatementTypePossibleValues: action.financialStatementTypePossibleValues,
        legalPossibleValues: action.legalPossibleValues,
        referencesPossibleValues: action.referencesPossibleValues,
        scorecardConcetpsList: action.scorecardConcetpsList,
        scorecardCompaniesTypesPossibleValues: action.scorecardCompaniesTypesPossibleValues,
        scorecardSourcePossibleValues: action.scorecardSourcePossibleValues,
        scorecardTurnOverRatesPossibleValues: action.scorecardTurnOverRatesPossibleValues,
        subcontractorData: action.subcontractorData,
        discreteAccounts: action.discreteAccounts,
        finInfoAccountDisplayTypeId: action.accountDisplayTypeId,
      });
    case types.SET_FETCHING_SCORE_CARDS_CONCEPTS:
      return Object.assign({}, state, {
        fetchingScoreCardsConcepts: action.isFetching
      });
    case types.SET_SCORE_CARDS_CONCEPTS:
      return Object.assign({}, state, {
        scorecardAccountDisplayTypeId: action.accountDisplayTypeId,
        scoreCardsdiscreteAccounts: action.discreteAccountsList,
        averageConcepts: action.averageConcepts,
        commentary: action.commentary,
        emrAccounts: action.emrAccounts,
        nevadaSingleLimit: action.nevadaSingleLimit,
        scoreCardsConcepts: action.scoreCardsConcepts,
        subcontractorDataConcepts: action.subcontractorData,
        scorecardMainParameters: action.scorecardMainParameters,
        isScoreCardEmpty: action.isScoreCardEmpty,
        scorecardHiddenFields: action.scorecardHiddenFields,
        isCovid19Form: action.isCovid19Form,
      });
    case types.SET_FINANCIALS_ERROR:
      return Object.assign({}, state, {
        error: action.error,
      });
    case types.SET_FINANCIALS_SUCCESS_MSG:
      return Object.assign({}, state, {
        successMsg: action.successMsg
      });
    case types.SET_SUBMITION_DATES:
      return Object.assign({}, state, {
        submitionDates: action.data,
        isSubDatesEmpty: action.data.length == 0 ? true : false
      });
    case types.SET_PREQUAL_DATES:
      return Object.assign({}, state, {
        prequalDates: action.data
      });
    case types.SET_CALCULATED_ACCOUNTS:
      return Object.assign({}, state, {
        calculatedAccounts: action.data,
        adjWorkingCapital: _.get(action, 'data.calc.workingCapital', 0),
        discreteAccounts: action.data.discreteAccountsList
      });
    case types.SET_WORKING_CAPITAL:
      return Object.assign({}, state, {
        adjWorkingCapital: action.data
      });
    case types.SET_SAVED_FORM_AS_COMPLETED:
      const accountsListData = { ...state.accountsListData };
      accountsListData.finIsComplete = 1;
      return Object.assign({}, state, {
        accountsListData
      });

    default:
      return state;
  }
};
