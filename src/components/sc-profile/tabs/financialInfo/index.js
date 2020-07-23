import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { Modal } from 'react-bootstrap';
import _ from 'lodash';
import classnames from 'classnames';
import moment from 'moment';

import Utils from '../../../../lib/utils';
import NoteEditorModal from '../../modals/noteEditor';
import * as financialActions from './actions';
import * as scPorfileActions from '../../actions';
import './financials.css';

const Alerts = require('../../../alerts');

class FinancialInfo extends React.Component {

  constructor(props) {
    super(props);

    this.totalEquityEndYear = 0;
    this.showAlerts = this.showAlerts.bind(this);
    this.onScorecardVariablesChange = this.onScorecardVariablesChange.bind(this);
    this.onSelectChange = this.onSelectChange.bind(this);
    this.onDateChange = this.onDateChange.bind(this);
    this.onParentClicked = this.onParentClicked.bind(this);
    this.onShowTable = this.onShowTable.bind(this);
    this.onModifyAccountValue = this.onModifyAccountValue.bind(this);
    this.onBlurAccountValue = this.onBlurAccountValue.bind(this);
    this.onSaveChanges = this.onSaveChanges.bind(this);
    this.onSaveChangesAndComplete = this.onSaveChangesAndComplete.bind(this);
    this.onCalculateAccounts = this.onCalculateAccounts.bind(this);
    this.getPayload = this.getPayload.bind(this);
    this.renderParentListGroup = this.renderParentListGroup.bind(this);
    this.renderAccountListGroup = this.renderAccountListGroup.bind(this);
    this.renderAccount = this.renderAccount.bind(this);
    this.addAccountRow = this.addAccountRow.bind(this);
    this.onEditNoteTask = this.onEditNoteTask.bind(this);
    this.closeNoteEditor = this.closeNoteEditor.bind(this);
    this.saveAccountNote = this.saveAccountNote.bind(this);
    this.prequalDateChange = this.prequalDateChange.bind(this);
    this.refreshHeader = this.refreshHeader.bind(this);
    this.formatAccountsList = this.formatAccountsList.bind(this);

    this.calculateTotalEquityEndYear = this.calculateTotalEquityEndYear.bind(this);
    this.addToTotalEquityEndYear = this.addToTotalEquityEndYear.bind(this);
    this.checkIfShouldShowSaveAndComplete = this.checkIfShouldShowSaveAndComplete.bind(this)
    this.updateShowsaveAndCompleteConditions = this.updateShowsaveAndCompleteConditions.bind(this)
    this.autoSuggestRenewalDate = this.autoSuggestRenewalDate.bind(this);
    this.setDiscreteAccountsSelected = this.setDiscreteAccountsSelected.bind(this);



    let scId = ''
    let hcId = ''
    scId = props.scIdFromTabs ? Number(props.scIdFromTabs) : (props.scId ? Number(props.scId) : '')
    hcId = props.scProfile.hcId ? Number(props.scProfile.hcId) : ''

    // console.log('financialInfoTab props.scProfile.hcId = ', props.scProfile.hcId)
    // console.log('financialInfoTab props.scProfile.headerDetails.id = ', props.scProfile.headerDetails.id)

    // console.log('financialInfoTab scId = ', scId)

    if (hcId && scId) {
      props.actions.fetchAccountsList(hcId, scId, null, 'FinInfo constructor');
    }

    this.state = {
      scId,
      hcId,
      savedFormId: '',
      accountsList: [],
      accountsListData: {},
      closedParents: [],
      closedAccordions: [],
      basicAccounts: [],
      discreteAccounts: [],
      finInfoAccountDisplayTypeId: 1,
      discreteAccountsSelected: [],
      avgProjectAccounts: [],
      avgVolumeAccounts: [],
      editedNotes: [],
      scorecardVariables: {},
      visibleHiddenRows: {},
      addAccountRowSelectValues: {},
      selectedAccountForNoteEdition: {},
      pendingChanges: false,
      showNoteEditor: false,
      calculatedAccountsFetched: false,
      shouldShowSaveAndComplete: false,
      // saveAndCompleteConditions is an array of booleans that need to be true in order for the Save and Complete button to display.
      saveAndCompleteConditions: {
        'dateOfFinancialStatement': false,
        'creditHistoryId': false,
        'legalStatusId': false,
        'referencesStatusId': false,
        'bankLineUsageId': false,
        'turnOverRateId': false,
        'analysisTypeId': false,
        'discreteAccounts': false,
      },
    };
  }

  autoSuggestRenewalDate() {
    const {
      turnOverRateId,
      dateOfFinancialStatement,
      dateOfFinancialStatementPrepared,
      financialStatementTypeId,
    } = this.state.accountsListData

    // console.log('turnOverRateId = ', turnOverRateId)
    // console.log('financialStatementTypeId = ', financialStatementTypeId)
    // console.log('dateOfFinancialStatement = ', dateOfFinancialStatement)
    // console.log('dateOfFinancialStatementPrepared = ', dateOfFinancialStatementPrepared)

    if (turnOverRateId && financialStatementTypeId && dateOfFinancialStatement && dateOfFinancialStatementPrepared) {
      // console.log('autoSuggestRenewalDate kicked off')

      const cpaIdsPreparedStatements = [1, 2, 3];
      const internallyPreparedStatements = [4, 5, 6];
      const isCpaPreparedStatement = _.includes(cpaIdsPreparedStatements, Number(financialStatementTypeId));
      const isInternallyPreparedStatements = _.includes(internallyPreparedStatements, Number(financialStatementTypeId));
      const momentFinancialStatement = moment(dateOfFinancialStatement);
      const momentFinancialStatementPrepared = moment(dateOfFinancialStatementPrepared);
      let turnOverMonths = ''

      switch (Number(turnOverRateId)) {
        case 1:
          turnOverMonths = 6
          break;
        case 2:
          turnOverMonths = 9
          break;
        case 3:
          turnOverMonths = 12
          break;
      }

      // console.log('turnOverMonths = ', turnOverMonths)

      if (!turnOverMonths) return;

      // isLastDayOfYear function
      const isLastDayOfYear = (date) => {
        let isLastDayOfYear = false;

        if (date) {
          const momentDate = moment(date);
          const lastDayOfYear = moment([momentDate.year(), '11', '31']); //11 represents December in moment()

          isLastDayOfYear = momentDate.isSame(lastDayOfYear, 'day'); //check just day, month, and year
        }

        return isLastDayOfYear;
      }

      // isDateAfterLastDayOfMay function
      const isDateAfterLastDayOfMay = (date) => {
        const momentDate = moment(date);
        const lastDayOfMay = moment([momentDate.year(), '04', '31']); //04 represents May in moment()

        return momentDate.isAfter(lastDayOfMay);
      }

      //Logic
      let renewalDate;
      if (turnOverMonths === 12 && isCpaPreparedStatement && isLastDayOfYear(dateOfFinancialStatement)) {
        renewalDate = momentFinancialStatementPrepared.add(12, 'months');

        if (isDateAfterLastDayOfMay(renewalDate)) {
          renewalDate.month('04').date('01'); //04 represents May in moment()
        }
      } else if (turnOverMonths === 12 && isInternallyPreparedStatements && isLastDayOfYear(dateOfFinancialStatement)) {
        renewalDate = momentFinancialStatement.add(14, 'months');

        if (isDateAfterLastDayOfMay(renewalDate)) {
          renewalDate.month('04').date('01'); //04 represents May in moment()
        }
      } else if (turnOverMonths === 12 && isCpaPreparedStatement && !isLastDayOfYear(dateOfFinancialStatement)) {
        renewalDate = momentFinancialStatementPrepared.add(12, 'months');
      } else if (turnOverMonths === 12 && isInternallyPreparedStatements && !isLastDayOfYear(dateOfFinancialStatement)) {
        renewalDate = momentFinancialStatement.add(12, 'months');
      } else if (turnOverMonths === 9 && isCpaPreparedStatement) {
        renewalDate = momentFinancialStatement.add(7, 'months');
      } else if (turnOverMonths === 9 && isInternallyPreparedStatements) {
        renewalDate = momentFinancialStatement.add(4, 'months');
      } else if (turnOverMonths === 6 && isCpaPreparedStatement) {
        renewalDate = momentFinancialStatement.add(8, 'months');
      } else if (turnOverMonths === 6 && isInternallyPreparedStatements) {
        renewalDate = momentFinancialStatement.add(7, 'months');
      }

      const { accountsListData } = this.state;

      accountsListData['dateOfRenewal'] = renewalDate;

      this.setState({
        accountsListData
      });
    }
  }

  accountMapper = (account) => {
    const accountValues = {
      adjustment: Utils.formatNumberWithCommas(account.adjustment) || 0,
      value: Utils.formatNumberWithCommas(account.value) || 0,
      note: {
        assignedToUserId: this.props.login.profile.Id,
        description: account.noteDescription,
        name: account.noteName,
        taskId: account.noteId || null,
      }
    }

    Object.assign(account, accountValues);
  };


  formatAccountsList(accountsList) {
    accountsList.forEach(parent => {
      parent.groups.forEach(group => {
        group.accounts.forEach(this.accountMapper);
      });
    });

    return accountsList
  }

  componentWillReceiveProps(nextProps) {
    // let oldHcId = Number(this.props.scProfile.hcId)
    let oldHcId = this.state.hcId
    let newHcId = Number(nextProps.scProfile.hcId)
    // let oldScId = Number(this.props.scProfile.headerDetails.id)
    let oldScId = this.state.scId
    let newScId = nextProps.scIdFromTabs ? Number(nextProps.scIdFromTabs) : (nextProps.scProfile.headerDetails.id ? Number(nextProps.scProfile.headerDetails.id) : '')

    // console.log('CWRP newHcId = ', newHcId)
    // console.log('CWRP newScId = ', newScId)

    // console.log('CWRP oldHcId = ', oldHcId)
    // console.log('CWRP oldScId = ', oldScId)

    if (newHcId != oldHcId || newScId != oldScId) {
      if (newHcId && newScId) {
        this.setState({
          scId: newScId,
          hcId: newHcId
        }, () => {
          this.props.actions.fetchAccountsList(newHcId, newScId, null, 'FinInfo CWRP');
        })
      }
    }
    // checking to see if fetching has ended and if nested data is present
    if (!nextProps.financials
      || !nextProps.financials.subcontractorData
      || !nextProps.financials.basicAccounts
      || !nextProps.financials.avgProjectAccounts
      || !nextProps.financials.avgVolumeAccounts
      || !nextProps.financials.basicAccounts.accounts
      || !nextProps.financials.avgProjectAccounts.accounts
      || !nextProps.financials.avgVolumeAccounts.accounts
      || !nextProps.financials.basicAccounts.accounts.length
      || !nextProps.financials.avgProjectAccounts.accounts.length
      || !nextProps.financials.avgVolumeAccounts.accounts.length
      || nextProps.financials.fetchingAccountsList
      || !nextProps.financials.subcontractorData.savedFormId
      || !nextProps.financials.discreteAccounts) {
      return
    }

    this.showAlerts(nextProps);

    let {
      accountsList,
      accountsListData,
      scorecardConcetpsList,
      basicAccounts,
      discreteAccounts,
      avgProjectAccounts,
      avgVolumeAccounts,
      subcontractorData,
      finInfoAccountDisplayTypeId,
    } = nextProps.financials;

    const turnOverRateId = accountsListData.turnOverRateId                                      // nextProps var
    const analysisTypeId = accountsListData.analysisTypeId                                      // nextProps var

    const bankLineUsage = _.find(scorecardConcetpsList, { 'scorecardConceptId': 9 }) || {};     // nextProps var
    const legalStatus = _.find(scorecardConcetpsList, { 'scorecardConceptId': 10 }) || {};      // nextProps var
    const referencesStatus = _.find(scorecardConcetpsList, { 'scorecardConceptId': 11 }) || {}; // nextProps var
    const creditHistory = _.find(scorecardConcetpsList, { 'scorecardConceptId': 12 }) || {};    // nextProps var

    // const {
    //   bankLineUsageId,
    //   legalStatusId,
    //   referencesStatusId,
    //   creditHistoryId
    // } = this.state.scorecardVariables

    const date = subcontractorData.dateOfFinancialStatement              // nextProps var
    const datePrep = subcontractorData.dateOfFinancialStatementPrepared  // nextProps var
    const dateRenew = subcontractorData.dateOfRenewal                    // nextProps var
    const datePrequal = subcontractorData.dateOfPrequal                  // nextProps var
    const savedFormId = subcontractorData.savedFormId                    // nextProps var

    accountsListData['dateOfFinancialStatement'] = date                  // nextProps var
    accountsListData['dateOfFinancialStatementPrepared'] = datePrep      // nextProps var
    accountsListData['dateOfRenewal'] = dateRenew                        // nextProps var
    accountsListData['dateOfPrequal'] = datePrequal                      // nextProps var

    const BLUID = bankLineUsage
      && bankLineUsage.value
      ? bankLineUsage.value
      : ''

    const LSID = legalStatus
      && legalStatus.value
      ? legalStatus.value
      : ''

    const RSID = referencesStatus
      && referencesStatus.value
      ? referencesStatus.value
      : ''

    const CHID = creditHistory
      && creditHistory.value
      ? creditHistory.value
      : ''

    const scorecardVariables = {
      bankLineUsageId: BLUID,
      legalStatusId: LSID,
      referencesStatusId: RSID,
      creditHistoryId: CHID
    }

    //formating values

    accountsList = this.formatAccountsList(accountsList)     // nextProps var
    basicAccounts.accounts.forEach(this.accountMapper);      // nextProps var
    avgProjectAccounts.accounts.forEach(this.accountMapper); // nextProps var
    avgVolumeAccounts.accounts.forEach(this.accountMapper);  // nextProps var

    if ((Number(this.state.savedFormId) != Number(savedFormId)) && accountsList.length !== 0 && basicAccounts && basicAccounts.accounts.length !== 0) {
      let data = {};
      let subcontractorData = {};

      subcontractorData.companyTypeId = accountsListData.companyTypeId

      data.savedFormId = savedFormId
      // data.basicAccounts = basicAccounts.accounts.map(this.basicAccountMapper);
      data.subcontractorData = subcontractorData
      data = this.addValuesToAccountsList(data, accountsList)
      this.props.actions.fetchWorkingCapital({ data })
    }

    // Discrete accounts
    let discreteAccountsSelected = discreteAccounts.map(element => {
      return {
        accountId: element.id,
        name: element.name,
        valueSelected: element.valueSeleted,
        options: element.options,
        note: element.note,
        discreteValueId: element.discreteValueId,
      };
    });

    this.setState({
      savedFormId,        // set to prioritize nextProps
      accountsList,       // set to prioritize nextProps
      accountsListData,   // set to prioritize nextProps
      scorecardVariables, // updated to prioritize nextProps
      basicAccounts,
      discreteAccounts,      // set to prioritize nextProps
      avgProjectAccounts, // set to prioritize nextProps
      avgVolumeAccounts,   // set to prioritize nextProps
      discreteAccountsSelected: [ ...discreteAccountsSelected ],
      finInfoAccountDisplayTypeId: finInfoAccountDisplayTypeId,
    }, () => {
      this.updateShowsaveAndCompleteConditions('dateOfFinancialStatement', date);
      this.updateShowsaveAndCompleteConditions('bankLineUsageId', this.state.scorecardVariables.bankLineUsageId);
      this.updateShowsaveAndCompleteConditions('legalStatusId', this.state.scorecardVariables.legalStatusId);
      this.updateShowsaveAndCompleteConditions('referencesStatusId', this.state.scorecardVariables.referencesStatusId);
      this.updateShowsaveAndCompleteConditions('creditHistoryId', this.state.scorecardVariables.creditHistoryId);
      this.updateShowsaveAndCompleteConditions('turnOverRateId', turnOverRateId);
      this.updateShowsaveAndCompleteConditions('analysisTypeId', analysisTypeId);
      this.updateShowsaveAndCompleteConditions('discreteAccounts', discreteAccountsSelected);
    });

  }

  componentDidUpdate() {
    const el = document.getElementById('financial-info-page');

    if (this.state.accountsListData.finIsComplete && el) {
      const inputs = el.getElementsByTagName('input');
      const selects = el.getElementsByTagName('select');
      const textArea = el.getElementsByTagName('textarea');

      for (let i = 0; i < inputs.length; i++) {
        inputs[i].disabled = true;
      }

      for (let j = 0; j < selects.length; j++) {
        selects[j].disabled = (selects[j].className !== 'sciInput addAccountSelect' && selects[j].className !== 'sciInput changeSubmission');
      }

      textArea[0].disabled = true;
    }
  }

  setDiscreteAccountsSelected(event, accountIdSelected, accountName) {
    let discreteAccounts = [];

    const value = event.target.value;

    if (value && accountIdSelected) {
      discreteAccounts = this.state.discreteAccountsSelected.map((element) => {
        if (element.accountId == accountIdSelected) {
          element.valueSelected = value.trim();
        }

        return element;
      });

      this.setState({
        discreteAccountsSelected: [...discreteAccounts],
      }, () => {
        this.updateShowsaveAndCompleteConditions('discreteAccounts', [...discreteAccounts]);
      });
    }
  }

  refreshHeader() {
    const {
      hiringClientId,
      subcontractorId
    } = this.state.accountsListData;

    const { savedFormId } = this.state
    this.props.scPorfileActions.fetchHeaderDetails(subcontractorId, hiringClientId, 'financialInfo tab refreshHeader');
    this.props.actions.fetchAccountsList(hiringClientId, subcontractorId, null, 'FinInfo refresh header');
    this.props.actions.fetchSubmitionDates(hiringClientId, subcontractorId, `FinInfo refresh header`)
    this.props.actions.fetchScoreCardsConcepts(savedFormId, 'ScoreCards CWRP');
    window.location.reload(true);
  }

  showAlerts(nextProps) {
    if (this.props.financials.fetchingAccountsList && !nextProps.financials.fetchingAccountsList) {
      if (nextProps.financials.error) {
        Alerts.showInformationAlert(
          'Error',
          nextProps.financials.error,
          'Accept',
          false,
          () => { }
        );
        this.props.actions.setError(null);
        this.props.actions.setSuccessMsg(null);
      } else if (nextProps.financials.successMsg) {
        this.props.actions.setError(null);
        this.props.actions.setSuccessMsg(null);
        this.setState({ pendingChanges: false })
      }
    }
  }

  prequalDateChange(event) {
    const value = event.target.value;

    if (value >= 0) {
      this.setState({
        savedFormId: value,
        calculatedAccountsFetched: false
      }, () => {

        this.props.actions.fetchAccountsList(null, null, value, 'line 279');
      })
    }
  }

  onScorecardVariablesChange(e, fieldName) {
    const { scorecardVariables } = this.state;
    const val = e.target.value
    scorecardVariables[fieldName] = val;
    this.updateShowsaveAndCompleteConditions(fieldName, val)
    this.setState({ scorecardVariables, pendingChanges: true });
  }

  onSelectChange(e, fieldName) {
    const { accountsListData } = this.state;
    const val = e.target.value
    accountsListData[fieldName] = val;
    this.updateShowsaveAndCompleteConditions(fieldName, val)
    this.setState({
      accountsListData,
      pendingChanges: true
    }, () => {
      if (fieldName == 'financialStatementTypeId' || fieldName == 'turnOverRateId') {
        this.autoSuggestRenewalDate()
      }
    });
  }

  onDateChange(e, fieldName) {
    const val = e.target.value
    if (val.length > 1) {
      const dObj = new Date(val)
      const y = dObj.getFullYear()
      const m = dObj.getMonth()
      const d = dObj.getDate()
      const date = new Date(y, m, d + 1, 18, 59, 59, 0)

      const { accountsListData } = this.state;

      accountsListData[fieldName] = date.toISOString();
      if (fieldName === 'dateOfFinancialStatement') {
        this.updateShowsaveAndCompleteConditions('dateOfFinancialStatement', val)
      }
      this.setState({
        accountsListData,
        pendingChanges: true
      }, () => {
        if (fieldName == 'dateOfFinancialStatement' || fieldName == 'dateOfFinancialStatementPrepared') {
          this.autoSuggestRenewalDate()
        }
      });
    }
  }

  onParentClicked(parentId) {
    const closedParents = this.state.closedParents;
    const index = closedParents.indexOf(parentId);
    if (index !== -1) {
      closedParents.splice(index, 1);
    } else {
      closedParents.push(parentId);
    }
    this.setState({ closedParents });
  }

  onShowTable(groupId) {

    const closedAccordions = this.state.closedAccordions;
    const index = closedAccordions.indexOf(groupId);
    if (index !== -1) {
      closedAccordions.splice(index, 1);
    } else {
      closedAccordions.push(groupId);
    }
    this.setState({ closedAccordions });
  }

  onModifyAccountValue(value, account, fieldName) {
    const {
      accountsList,
      basicAccounts,
      avgProjectAccounts,
      avgVolumeAccounts
    } = this.state;

    let basicAccountIndex = _.findIndex(basicAccounts.accounts, { accountId: account.accountId });
    let avgProjectAccountsIndex = -1;
    let avgVolumeAccountsIndex = -1;

    if (basicAccountIndex !== -1) {
      basicAccounts.accounts[basicAccountIndex][fieldName] = value
      this.setState({ basicAccounts, pendingChanges: true });

      return;
    } else {
      avgProjectAccountsIndex = _.findIndex(avgProjectAccounts.accounts, { accountId: account.accountId });
    }

    if (avgProjectAccountsIndex !== -1) {
      avgProjectAccounts.accounts[avgProjectAccountsIndex][fieldName] = value
      this.setState({ avgProjectAccounts, pendingChanges: true });

      return;
    } else {
      avgVolumeAccountsIndex = _.findIndex(avgVolumeAccounts.accounts, { accountId: account.accountId });
    }

    if (avgVolumeAccountsIndex !== -1) {
      avgVolumeAccounts.accounts[avgVolumeAccountsIndex][fieldName] = value
      this.setState({ avgVolumeAccounts, pendingChanges: true });

      return;
    } else {
      const parentIdx = _.findIndex(accountsList, (o) => {
        return o.id.toString() === account.parentGroupId.toString()
      });

      const groupIdx = _.findIndex(accountsList[parentIdx].groups, (o) => {
        return o.id.toString() === account.groupId.toString()
      });

      const accountIdx = _.findIndex(accountsList[parentIdx].groups[groupIdx].accounts, (o) => {
        return o.accountId.toString() === account.accountId.toString()
      });

      accountsList[parentIdx].groups[groupIdx].accounts[accountIdx][fieldName] = value;
      this.setState({ accountsList, pendingChanges: true });
    }
  }

  onBlurAccountValue(value, account, fieldName) {
    value = Utils.formatNumberWithCommas(value);
    this.onModifyAccountValue(value, account, fieldName);
  }

  onSaveChangesAndComplete() {
    this.props.actions.setSavedFormAsCompleted();
    this.onSaveChanges(null, 1);
  }

  onSaveChanges(event, completeForm) {
    const payload = this.getPayload(completeForm);
    payload.update = true;


    // Notify Backend to Send Prequalification Auto-Notification Email to HC Requestors where hcOption = 1 (Currently only CRB)
    if (completeForm && this.props.scProfile && this.props.scProfile.headerDetails && this.props.scProfile.headerDetails.hcOption && this.props.scProfile.headerDetails.hcOption == 1) {
      const {
        hcOption,
        emailToHCactivityId,
        requestorName,
        requestorEmail,
        emailToHCSubject,
        emailToHCBody,
        emailToHCFromAddress,
        name,
        id,
        emailToHCtemplateId
      } = this.props.scProfile.headerDetails


      payload.hcOption = hcOption
      payload.emailToHCactivityId = emailToHCactivityId
      payload.emailParams = {
        subject: `${emailToHCSubject}: ${name}`,
        body: emailToHCBody,
        hiringClientId: this.state.hcId,
        subcontractorId: id,
        subcontractorName: name,
        isRequestorEmail: true,
        requestorName: requestorName,
        requestorEmail,
        emailToHCFromAddress,
        templateId: emailToHCtemplateId
      }
    }

    this.props.actions.saveAccountsList({ data: payload }, this.refreshHeader);
  }

  onCalculateAccounts() {
    const payload = this.getPayload();
    payload.update = false;

    this.setState({
      calculatedAccountsFetched: true
    });

    this.props.actions.fetchCalculatedAccounts({ data: payload });

  }

  addValuesToAccountsList = (payload, accountsList) => {

    payload.accountsList = [];
    accountsList.forEach(parent => {
      parent.groups.forEach(group => {
        group.accounts.forEach(account => {
          const note = this.state.editedNotes[account.accountId] || (account.note.name ? account.note : null);

          payload.accountsList.push({
            accountId: account.accountId,
            value: Utils.normalizeNumber(account.value) || 0,
            adjustment: Utils.normalizeNumber(account.adjustment) || 0,
            note: note
          });
        });
      });
    });

    return payload

  }

  basicAccountMapper = (account) => {
    return {
      ...account,
      value: Utils.normalizeNumber(account.value),
      account: Utils.normalizeNumber(account.adjustment),
      note: this.state.editedNotes[account.id] || account.note
    }
  }

  basicDiscreteAccountMapper = (account) => {
    let note = this.state.editedNotes[account.accountId];
    return {
      ...account,
      note: note
    }
  }

  getPayload(completeForm) {
    const {
      accountsListData,
      accountsList,
      scorecardVariables,
      finInfoAccountDisplayTypeId,
    } = this.state;

    let payload = {};

    //Subcontractor Data
    payload.subcontractorData = {
      savedFormId: this.state.savedFormId,
      hiringClientId: accountsListData.hiringClientId,
      subcontractorId: accountsListData.subcontractorId,
      dateOfPrequal: accountsListData.dateOfPrequal,
      dateOfFinancialStatement: accountsListData.dateOfFinancialStatement,
      dateOfFinancialStatementPrepared: accountsListData.dateOfFinancialStatementPrepared,
      scorecardSourceId: accountsListData.scorecardSourceId,
      companyTypeId: accountsListData.companyTypeId,
      turnOverRateId: accountsListData.turnOverRateId,
      dateOfRenewal: accountsListData.dateOfRenewal,
      analysisTypeId: accountsListData.analysisTypeId,
      financialStatementTypeId: _.toInteger(accountsListData.financialStatementTypeId) || 1,
      commentary: accountsListData.commentary,
      finIsComplete: completeForm
    };

    //AccountList
    payload = this.addValuesToAccountsList(payload, accountsList)

    //Scorecard Variables
    const {
      referencesPossibleValues,
      legalPossibleValues,
      creditHistoryPossibleValues,
      bankLinePossibleValues
    } = this.props.financials;


    const bankLine = _.find(bankLinePossibleValues, { id: _.toInteger(scorecardVariables.bankLineUsageId) });
    const legal = _.find(legalPossibleValues, { id: _.toInteger(scorecardVariables.legalStatusId) });
    const references = _.find(referencesPossibleValues, { id: _.toInteger(scorecardVariables.referencesStatusId) });
    const creditHistory = _.find(creditHistoryPossibleValues, { id: _.toInteger(scorecardVariables.creditHistoryId) });

    payload.scorecardConcetpsList = []

    if (bankLine) {
      payload.scorecardConcetpsList.push({
        scorecardConceptId: '9',
        id: bankLine.id,
        value: bankLine.name,
        color: bankLine.color
      });
    }

    if (legal) {
      payload.scorecardConcetpsList.push({
        scorecardConceptId: '10',
        id: legal.id,
        value: legal.name,
        color: legal.color
      });
    }

    if (references) {
      payload.scorecardConcetpsList.push({
        scorecardConceptId: '11',
        id: references.id,
        value: references.name,
        color: references.color
      });
    }

    if (creditHistory) {
      payload.scorecardConcetpsList.push({
        scorecardConceptId: '12',
        id: creditHistory.id,
        value: creditHistory.name,
        color: creditHistory.color
      });
    }

    //Save Account Mapper

    //Basic Accounts
    payload.basicAccounts = this.state.basicAccounts.accounts.map(this.basicAccountMapper);

    //Average Project
    payload.avgProjectAccounts = this.state.avgProjectAccounts.accounts.map(this.basicAccountMapper);;

    //Average Volume
    payload.avgVolumeAccounts = this.state.avgVolumeAccounts.accounts.map(this.basicAccountMapper);;

    //Discrete Accounts
    payload.discreteAccounts = this.state.discreteAccountsSelected;
    payload.noteDiscreteAccount = this.state.editedNotes.filter(x => x.typeAccount == 'discreteAccount');

    //Account Display Type
    payload.accountDisplayTypeId = finInfoAccountDisplayTypeId;

    return payload;
  }

  getParentTotals(parent) {
    const groups = parent.groups || [];
    let totalValue = 0;
    let totalAdjustment = 0;
    let totalAdjusted;

    for (var i = 0; i < groups.length; i++) {
      const { value, adjustment } = this.getGroupTotals(groups[i]);
      totalValue += Utils.normalizeNumber(value);
      totalAdjustment += Utils.normalizeNumber(adjustment);
    }

    totalAdjusted = Utils.formatNumberWithCommas((totalValue + totalAdjustment));
    totalValue = Utils.formatNumberWithCommas(totalValue);
    totalAdjustment = Utils.formatNumberWithCommas(totalAdjustment);

    return { value: totalValue, adjustment: totalAdjustment, adjusted: totalAdjusted }
  }

  getWorkingCapitalAdjustment() {
    let workingCapitalAdjustment = 0;
    let distributionsAccount = _.find(this.state.basicAccounts.accounts, { 'accountName': 'Distributions' });
    let netIncomeAccount = _.find(this.state.basicAccounts.accounts, { 'accountName': 'Net Income' });
    let revenueAccount = _.find(this.state.basicAccounts.accounts, { 'accountName': 'Revenue' });

    let distributions = Utils.normalizeNumber(distributionsAccount.value) + Utils.normalizeNumber(distributionsAccount.adjustment);
    let netIncome = Utils.normalizeNumber(netIncomeAccount.value) + Utils.normalizeNumber(netIncomeAccount.adjustment);

    if (this.props.financials.subcontractorData.companyTypeId === 2) {
      let totalRevenue = Utils.normalizeNumber(revenueAccount.value);

      // IF Net Income < 0
      if (netIncome < 0) {
        workingCapitalAdjustment = 0;
      }
      else {
        if (totalRevenue >= 10000000) {
          if (distributions >= 0.25 * netIncome) {
            workingCapitalAdjustment = 0;
          }
          else {
            workingCapitalAdjustment = (0.25 * netIncome) - distributions;
          }
        }
        else {
          if (distributions >= 0.125 * netIncome) {
            workingCapitalAdjustment = 0;
          }
          else {
            workingCapitalAdjustment = (0.125 * netIncome) - distributions;
          }
        }
      }
    }

    return workingCapitalAdjustment;
  }

  formatAccountName(name) {

    return name.toLowerCase().trim().replace(/ /g, '')

  }

  addToTotalEquityEndYear(account) {

    const accountsToSum = [
      "advancestoaffiliates",
      "advancestostockholders-currentportion",
      "duefromaffiliates/advancestoaffiliates",
      "duefromaffiliates-net",
      "duefromemployees/advancestoempoloyees",
      "duefromrelatedparties-net",
      "duefromrelatedparties/advancestorelatedparties",
      "duefromstockholdersandpartners/advancestostockholdersandpartners",
      "equityinaffiliatedcompanies",
      "equityinjointventures",
      "investmentinaffiliatedcompanies",
      "investmentinjointventures",
      "duefromshareholders/members/owners/partners-net",
      "goodwill",
      "tradename"
    ]

    //if(this.formatAccountName(account.accountName) === accountsToSum[0]) this.totalEquityEndYear = 0;

    if (accountsToSum.indexOf(this.formatAccountName(account.accountName)) > -1) {

      this.totalEquityEndYear += Utils.normalizeNumber(account.adjustment) || 0;

    }

  }

  calculateTotalEquityEndYear() {
    this.totalEquityEndYear = 0;
    const { accountsList, basicAccounts, avgProjectAccounts, avgVolumeAccounts } = this.state;

    accountsList.forEach(parent => {
      parent.groups.forEach(group => {
        group.accounts.forEach(account => {
          this.addToTotalEquityEndYear(account);
        });
      });
    });

    if (basicAccounts.accounts) {
      basicAccounts.accounts.forEach(account => {
        this.addToTotalEquityEndYear(account);
      });
    }

    if (avgProjectAccounts.accounts) {
      avgProjectAccounts.accounts.forEach(account => {
        this.addToTotalEquityEndYear(account);
      });
    }

    if (avgVolumeAccounts.accounts) {
      avgVolumeAccounts.accounts.forEach(account => {
        this.addToTotalEquityEndYear(account);
      });
    }
  }

  getGroupTotals(group) {
    const accounts = group.accounts || [];
    let value = 0;
    let adjustment = 0;
    let adjusted;
    let elements = 0;

    for (var i = 0; i < accounts.length; i++) {
      if (accounts[i].accountName === "Total Equity at the End of the Year") {
        accounts[i].adjustment = this.totalEquityEndYear
      }
      //this.calculateTotalEquityEndYear(accounts[i])
      const actualValue = Utils.normalizeNumber(accounts[i].value) || 0;
      value += actualValue;
      adjustment += Utils.normalizeNumber(accounts[i].adjustment) || 0;

      if (group.totalType === 'average' && actualValue > 0) {
        elements += 1;
      }
    }

    if (group.totalType === 'average') {
      value = value / elements;
      value = Math.trunc(value);
    }

    if (group.name === "Current Liabilities") {
      adjustment += this.getWorkingCapitalAdjustment();
    }

    adjusted = Utils.formatNumberWithCommas((value + adjustment));
    value = Utils.formatNumberWithCommas(value);
    adjustment = Utils.formatNumberWithCommas(adjustment);

    return { value, adjustment, adjusted }
  }

  renderParentListGroup(parent, idx) {
    const accountListGroups = parent.groups || [];
    const showGroups = this.state.closedParents.indexOf(parent.id) === -1;
    const { value, adjustment, adjusted } = this.getParentTotals(parent);
    const arrowClass = showGroups ? "sci-arrow-up" : "sci-arrow-down";

    return (
      <div key={idx} className="sciParentGroup">
        <div className="sciGroupTitle" onClick={() => { this.onParentClicked(parent.id) }} >
          <div className={arrowClass}></div>
          {parent.name}
        </div>
        {
          showGroups &&
          <div className="sciParentGroupsContainer">
            {accountListGroups.map(this.renderAccountListGroup)}
          </div>
        }
        <div className="row sciGroupTotal">
          <div className="col col-lg-3">
            Total {parent.name}
          </div>
          <div className="col col-lg-3">
            <input value={value} disabled />
          </div>
          <div className="col col-lg-3">
            <input value={adjustment} disabled />
          </div>
          <div className="col col-lg-3">
            <input value={adjusted} style={{ fontWeight: 600 }} disabled />
          </div>
        </div>
      </div>
    );
  }

  renderAccountListGroup(group, idx) {
    const accounts = group.accounts || [];
    const sortedAccounts = _.sortBy(accounts, ['orderIndex']);
    const accountsToShow = _.filter(sortedAccounts, (account) => ((Utils.normalizeNumber(account.value) && !account.visible) || (account.alwaysVisible === 'true' || account.alwaysVisible === true)));
    const showTable = this.state.closedAccordions.indexOf(group.id) === -1;
    const { value, adjustment, adjusted } = this.getGroupTotals(group);
    const arrowClass = showTable ? 'sci-arrow-up' : 'sci-arrow-down';
    const colClassname = classnames({
      'col': true,
      'col-lg-3': !group.hideAdjustment,
      'col-lg-6': group.hideAdjustment,
    });

    return (
      <div key={idx} className="sciGroup">
        <div className="sciGroupTitle" onClick={() => { this.onShowTable(group.id) }} >
          <div className={arrowClass}></div>
          {group.name}
        </div>
        {
          showTable &&
          <div className="row sciGroupTableHeader">
            <div className={colClassname}>
              {group.name}
            </div>
            <div className={colClassname}>
              {'Value'}
            </div>
            {
              !group.hideAdjustment &&
              <div className={colClassname}>
                {'Allowances and Adjustments'}
              </div>
            }
            {
              !group.hideAdjustment &&
              <div className={colClassname}>
                {'Adjusted Balance'}
              </div>
            }
          </div>
        }
        {
          showTable &&
          <div className="sciGroupTable">
            {accountsToShow.map(this.renderAccount)}
            {this.renderHiddenAccounts(group)}
          </div>
        }
        {
          group.totalType !== 'none' &&
          <div className="row sciGroupTotal">
            <div className={colClassname}>
              {!group.hideAdjustment && 'TOTAL'} {group.totalLabel || group.name}
            </div>
            <div className={colClassname}>
              <input value={value} disabled />
            </div>
            {
              !group.hideAdjustment &&
              <div className={colClassname}>
                <input value={adjustment} disabled />
              </div>
            }
            {
              !group.hideAdjustment &&
              <div className={colClassname}>
                <input value={adjusted} style={{ fontWeight: 600 }} disabled />
              </div>
            }
          </div>
        }
      </div>
    );
  }

  renderDiscreteAccountListGroup(group, idx) {
    const showTable = this.state.closedAccordions.indexOf('discreteAccounts') === -1;
    const arrowClass = showTable ? 'sci-arrow-up' : 'sci-arrow-down';
    const colClassname = classnames({
      'col': true,
      'col-lg-3': !group.hideAdjustment,
      'col-lg-6': group.hideAdjustment,
    });

    return (
      <div key={idx} className="sciGroup">
        <div className="sciGroupTitle" onClick={() => { this.onShowTable('discreteAccounts') }} >
          <div className={arrowClass}></div>
          Discrete Accounts
        </div>
        {
          showTable &&
          <div className="row sciGroupTableHeader">
            <div className={colClassname}>
              Discrete Account
            </div>
            <div className={colClassname}>
              Value
            </div>

          </div>
        }
        {
          showTable &&
          <div className="sciGroupTable">
            {group.map(this.renderDiscreteAccount)}
          </div>
        }

      </div>
    );
  }



  renderAccount(account, idx) {
    const value = Utils.normalizeNumber(account.value) || 0;
    const adjustment = Utils.normalizeNumber(account.adjustment) || 0;
    const adjustedValue = Utils.formatNumberWithCommas(value + adjustment);
    const colClassname = classnames({
      'col': true,
      'col-lg-3': !account.hideAdjustment,
      'col-lg-6': account.hideAdjustment,
    });

    // because this account is calculated
    const disableAdjustment = (account.accountName === "Total Equity at the End of the Year");

    return (
      <div key={idx} className="row sciTableRow">
        <div className={colClassname}>
          <div className="d-flex align-items-center justify-content-between">
            {account.accountName}
            <a onClick={() => this.onEditNoteTask(account)} className="edit-note-button cell-table-link icon-edit" >
              {account.note.name || this.state.editedNotes[account.accountId] ? 'Edit' : 'Note'}
            </a>
          </div>
        </div>
        <div className={colClassname}>
          <input
            type="text"
            value={account.value}
            onChange={(e) => { this.onModifyAccountValue(e.target.value, account, 'value'); }}
            onBlur={(e) => { this.onBlurAccountValue(e.target.value, account, 'value'); }} />
        </div>
        {
          !account.hideAdjustment &&
          <div className={colClassname}>
            {
              disableAdjustment ?
                <input value={account.adjustment} style={{ fontWeight: 600 }} disabled />
                :
                <input
                  type="text"
                  value={account.adjustment}
                  onChange={(e) => this.onModifyAccountValue(e.target.value, account, 'adjustment')}
                  onBlur={(e) => { this.onBlurAccountValue(e.target.value, account, 'adjustment'); }} />
            }
          </div>
        }
        {
          !account.hideAdjustment &&
          <div className={colClassname}>
            <input value={adjustedValue} style={{ fontWeight: 600 }} disabled />
          </div>
        }
      </div>
    );
  }



  renderDiscreteAccount = (account, idx) => {

    const colClassname = classnames({
      'col': true,
      'col-lg-3': true
    });

    return (
      <div key={idx} className="row sciTableRow">
        <div className={colClassname}>
          <div className="d-flex align-items-center justify-content-between">
            {account.name}

            <a onClick={() => this.onEditNoteTaskDisceteAccount(account)} className="edit-note-button cell-table-link icon-edit" >
              {!account.note ? 'Note' : 'Edit'}
            </a>
          </div>
        </div>

        <div className="col sciSelectWrapper col-lg-2 no-padd">
          <select className="sciInput" value={account.valueSelected} onChange={(e) => this.setDiscreteAccountsSelected(e, account.accountId, account.name)}>
            <option key={idx} value="0">Select a value</option>

            {account.options.map((item, idx) => {
              return <option key={idx} value={item}>{item}</option>;
            })}
          </select>
        </div>
      </div>
    );
  }

  renderHiddenAccounts(group) {
    const accounts = group.accounts || [];
    const {
      visibleHiddenRows
    } = this.state;
    const hiddenAccounts = visibleHiddenRows[group.id] || [];
    const hiddenAccountsToShow = hiddenAccounts.map(this.renderAccount);
    const remainingHiddenAccounts = _.filter(accounts, (account) => ((account.alwaysVisible === 'false' || account.alwaysVisible === false) && !account.visible && !Utils.normalizeNumber(account.value)));
    const remainingHiddenAccountsOptions = Utils.getOptionsList('', remainingHiddenAccounts, 'accountName', 'accountId', 'accountName');
    const opts = remainingHiddenAccountsOptions.map((opt, idx) => <option value={opt.value} key={opt.value}>{opt.label}</option>);

    return (
      <div>
        {hiddenAccountsToShow}
        {
          !_.isEmpty(remainingHiddenAccounts) &&
          <div className="row sciTableRow justify-content-center">
            <div className='sciSelectWrapper col-sm-2 no-padd'>
              <select className="sciInput addAccountSelect" onChange={(e) => this.onAddAccountRowSelectChange(e, group.id)}>
                {opts}
              </select>
            </div>
            <button className="addAccountButton list-view-nav-link nav-bn icon-add" onClick={() => { this.addAccountRow(group) }} />
          </div>
        }
      </div>
    )
  }

  addAccountRow(group) {
    const {
      addAccountRowSelectValues
    } = this.state;
    const accounts = group.accounts || [];
    const selectedValue = addAccountRowSelectValues[group.id];
    const selectedAccount = _.find(accounts, { accountId: parseFloat(selectedValue) });

    if (selectedAccount) {
      selectedAccount.visible = true;

      const visibleHiddenRows = { ...this.state.visibleHiddenRows };
      const addAccountRowSelectValues = { ...this.state.addAccountRowSelectValues };

      if (_.isEmpty(visibleHiddenRows[group.id])) {
        visibleHiddenRows[group.id] = [];
      }

      visibleHiddenRows[group.id].push(selectedAccount);
      addAccountRowSelectValues[group.id] = '';

      this.setState({
        visibleHiddenRows,
        addAccountRowSelectValues
      });
    }
  }

  renderScorecardVariables() {
    const id = 'scorecardVariables';

    const {
      referencesPossibleValues,
      legalPossibleValues,
      creditHistoryPossibleValues,
      bankLinePossibleValues
    } = this.props.financials;

    const {
      scorecardVariables
    } = this.state;

    const showRow = this.state.closedParents.indexOf(id) === -1;
    const arrowClass = showRow ? 'sci-arrow-up' : 'sci-arrow-down';

    return (
      <div className="sciParentGroup">
        <div className="sciGroupTitle" onClick={() => { this.onParentClicked(id) }} >
          <div className={arrowClass}></div>
          Scorecard Variables
        </div>
        {
          showRow &&
          <div className="row sciGroupVariables">
            <div>
              Credit History
            </div>
            <div className='sciSelectWrapper col-sm-2 no-padd'>
              <select className="sciInput" onChange={(e) => this.onScorecardVariablesChange(e, 'creditHistoryId')} value={scorecardVariables.creditHistoryId}>
                {
                  creditHistoryPossibleValues.map((item, idx) => {
                    return (
                      <option key={idx} value={item.id}>{item.name}</option>
                    )
                  })
                }
              </select>
            </div>
            <div>
              Legal Status
            </div>
            <div className='sciSelectWrapper col-sm-2 no-padd'>
              <select className="sciInput" onChange={(e) => this.onScorecardVariablesChange(e, 'legalStatusId')} value={scorecardVariables.legalStatusId}>
                {
                  legalPossibleValues.map((item, idx) => {
                    return (
                      <option key={idx} value={item.id}>{item.name}</option>
                    )
                  })
                }
              </select>
            </div>
            <div>
              References Status
            </div>
            <div className='sciSelectWrapper col-sm-2 no-padd'>
              <select className="sciInput" onChange={(e) => this.onScorecardVariablesChange(e, 'referencesStatusId')} value={scorecardVariables.referencesStatusId}>
                {
                  referencesPossibleValues.map((item, idx) => {
                    return (
                      <option key={idx} value={item.id}>{item.name}</option>
                    )
                  })
                }
              </select>
            </div>

            <div>
              Bank Line Usage
            </div>

            <div className='sciSelectWrapper col-sm-2 no-padd'>
              <select className="sciInput" onChange={(e) => this.onScorecardVariablesChange(e, 'bankLineUsageId')} value={scorecardVariables.bankLineUsageId}>
                {bankLinePossibleValues.map((item, idx) => {
                  return (
                    <option key={idx} value={item.id}>{item.name}</option>
                  )
                })}
              </select>
            </div>
          </div>
        }
      </div>
    )
  }


  onAddAccountRowSelectChange(event, groupId) {

    const currentValue = event.target.value;
    const addAccountRowSelectValues = { ...this.state.addAccountRowSelectValues };
    addAccountRowSelectValues[groupId] = currentValue;

    this.setState({
      addAccountRowSelectValues
    });
  }

  renderCalculatedAccountsGroup() {
    const { finInfoAccountDisplayTypeId } = this.state;

    const calculatedAccounts = _.get(this.props.financials, 'calculatedAccounts.calculatedAccounts') || {};

    const groupName = 'calculatedAccounts';
    const showTable = this.state.closedAccordions.indexOf(groupName) === -1;
    const arrowClass = showTable ? 'sci-arrow-up' : 'sci-arrow-down';
    const colClassname = classnames({
      'col': true,
      'col-lg-6': true,
    });

    const calculatedAccountsArray = [
      {
        name: 'Single Project Limit',
        value: calculatedAccounts.singleProjectLimitValue
      },
      {
        name: 'Aggregate Project Limit',
        value: calculatedAccounts.aggregateProjectExposure
      },
      ...([1, 3].includes(finInfoAccountDisplayTypeId) ? [
        {
          name: 'Total Accounts Receivable',
          value: calculatedAccounts.totalAccountsReceivable
        },
        {
          name: 'Total Accounts Payable',
          value: calculatedAccounts.totalAccountsPayable
        },
        {
          name: 'Cost of Backlog',
          value: calculatedAccounts.costOfBacklog
        },
        {
          name: 'Working Capital (Adjusted)',
          value: calculatedAccounts.adjustedWorkingCapital
        },
        {
          name: 'Total Liabilities',
          value: calculatedAccounts.totalLiabilities
        }
      ] : []),
    ];

    return (
      <div className="sciGroup">
        <div className="sciGroupTitle" onClick={() => { this.onShowTable(groupName) }} >
          <div className={arrowClass}></div>
          Calculated Accounts
        </div>
        {
          showTable &&
          <div className="row sciGroupTableHeader">
            <div className={colClassname}>
              Calculated Accounts
            </div>
            <div className={colClassname}>
              Value
            </div>
          </div>
        }
        {
          showTable &&
          <div className="sciGroupTable">
            {calculatedAccountsArray.map(this.renderCalculatedAccount)}
          </div>
        }
      </div>
    )
  }

  renderCalculatedAccount(account, index) {
    const colClassname = classnames({
      'col': true,
      'col-lg-6': true,
    });

    const value = account.value ? Utils.formatNumberWithCommas(account.value.toFixed(2)) : account.value;

    return (
      <div key={index} className="row sciTableRow">
        <div className={colClassname}>
          <div className="d-flex align-items-center justify-content-between">
            {account.name}
          </div>
        </div>
        <div className={colClassname}>
          {value}
        </div>
      </div>
    );
  }

  renderRatiosGroup() {
    const ratios = _.get(this.props.financials, 'calculatedAccounts.ratios') || {};

    const groupName = 'ratiosAccounts';
    const showTable = this.state.closedAccordions.indexOf(groupName) === -1;
    const arrowClass = showTable ? 'sci-arrow-up' : 'sci-arrow-down';
    const colClassname = classnames({
      'col': true,
      'col-lg-4': true,
    });

    const getAccountObject = (accountKey) => {
      const account = ratios[accountKey];
      return {
        value: account,
        color: ''
      }
    }

    const ratiosAccounts = [
      {
        name: 'Current Ratio',
        ...getAccountObject('currentRatio')
      },
      {
        name: 'Work Capital to Backlog',
        ...getAccountObject('workCapitalToBacklog')
      },
      {
        name: 'Number of Days Cash',
        ...getAccountObject('numberOfDaysCash')
      },
      {
        name: 'AR Turnover',
        ...getAccountObject('ARTurnover')
      },
      {
        name: 'AP Turnover',
        ...getAccountObject('APTurnover')
      },
      {
        name: 'Debt to Net Worth',
        ...getAccountObject('debtToNetWorth')
      },
      {
        name: 'Net Worth to Backlog',
        ...getAccountObject('netWorthToBacklog')
      },
      {
        name: 'Profitability',
        ...getAccountObject('profitability')
      },
      {
        name: 'Tier Rating',
        ...getAccountObject('tierRating')
      },

    ]

    return (
      <div className="sciGroup">
        <div className="sciGroupTitle" onClick={() => { this.onShowTable(groupName) }} >
          <div className={arrowClass}></div>
          Calculated Accounts
        </div>
        {
          showTable &&
          <div className="row sciGroupTableHeader">
            <div className={colClassname}>
              Calculated Accounts
            </div>
            <div className={colClassname}>
              Value
            </div>
            <div className={colClassname}>
              Color
            </div>
          </div>
        }
        {
          showTable &&
          <div className="sciGroupTable">
            {ratiosAccounts.map(this.renderRatiosAccount)}
          </div>
        }
      </div>
    )
  }

  renderRatiosAccount(account, index) {
    const colClassname = classnames({
      'col': true,
      'col-lg-4': true,
    });

    const value = (account.value && Utils.isValidNumber(account.value)) ? Utils.formatNumberWithCommas(account.value.toFixed(2)) : account.value;

    return (
      <div key={index} className="row sciTableRow">
        <div className={colClassname}>
          <div className="d-flex align-items-center justify-content-between">
            {account.name}
          </div>
        </div>
        <div className={colClassname}>
          {value}
        </div>
        <div className={colClassname}>
          {account.color}
        </div>
      </div>
    );
  }

  renderCalculatedAccordions(spinner) {
    const { finInfoAccountDisplayTypeId } = this.state;

    if (!this.state.calculatedAccountsFetched) {
      return <p className="d-flex justify-content-center">Press the button to get calculated accounts</p>;
    } else if (this.props.financials.fetchingCalculateAccounts) {
      return spinner;
    } else {
      return (
        <div>
          {this.renderCalculatedAccountsGroup()}

          {[1, 3].includes(finInfoAccountDisplayTypeId) && this.renderRatiosGroup()}
        </div>
      );
    }
  }

  onEditNoteTask(account) {

    this.setState({
      selectedAccountForNoteEdition: account,
      showNoteEditor: true
    });
  }

  onEditNoteTaskDisceteAccount(account) {

    let discreteAccount = {
      accountId: account.accountId,
      accountName: account.name,
      value: account.valueSelected,
      typeAccount: 'discreteAccount',
      note: account.note ? account.note : {}
    }

    this.setState({
      selectedAccountForNoteEdition: discreteAccount,
      showNoteEditor: true
    });
  }

  closeNoteEditor() {
    this.setState({
      showNoteEditor: false
    });
  }

  saveAccountNote(note) {
    const newArray = this.state.editedNotes.concat([]);
    const mappedNote = {
      taskId: note.taskId || null,
      assignedToUserId: note.assignedToUserId == undefined ? this.state.selectedAccountForNoteEdition.accountId : note.assignedToUserId,
      description: note.description,
      name: note.name
    };

    if (this.state.selectedAccountForNoteEdition.typeAccount != undefined) {
      mappedNote.typeAccount = this.state.selectedAccountForNoteEdition.typeAccount;
      this.state.discreteAccountsSelected.map(element => {
        if (element.accountId == this.state.selectedAccountForNoteEdition.accountId) {
          mappedNote.taskId = element.note && element.note.taskId ? element.note.taskId : null;
          element.note = mappedNote;
        }
        return element;
      });
    } else {
      newArray[this.state.selectedAccountForNoteEdition.accountId] = mappedNote;

      this.setState({
        editedNotes: newArray,
      });
    }
  }

  checkIfShouldShowSaveAndComplete() {
    const { saveAndCompleteConditions, finInfoAccountDisplayTypeId } = this.state;

    const keys = Object.keys(saveAndCompleteConditions);

    let quorum = false;
    if (finInfoAccountDisplayTypeId === 1) {
      quorum = keys.every(key => {
        if (key === 'discreteAccounts') {
          return true;
        }

        return saveAndCompleteConditions[key];
      });
    } else if (finInfoAccountDisplayTypeId === 2) {
      quorum = saveAndCompleteConditions.discreteAccounts;
    } else if (finInfoAccountDisplayTypeId === 3) {
      quorum = keys.every(key => saveAndCompleteConditions[key]);
    }

    this.setState({
      shouldShowSaveAndComplete: quorum,
    });
  }

  updateShowsaveAndCompleteConditions(fieldName, val) {
    const { saveAndCompleteConditions } = this.state;

    if (fieldName === 'dateOfFinancialStatement') {
      saveAndCompleteConditions[fieldName] = val ? true : false;
    }

    const value = Number(val)
    if (fieldName === 'creditHistoryId') {
      saveAndCompleteConditions[fieldName] = (value && value !== 4) ? true : false;
    }

    if (fieldName === 'legalStatusId') {
      saveAndCompleteConditions[fieldName] = (value && value !== 8) ? true : false;
    }

    if (fieldName === 'referencesStatusId') {
      saveAndCompleteConditions[fieldName] = (value && value !== 8) ? true : false;
    }

    if (fieldName === 'bankLineUsageId') {
      saveAndCompleteConditions[fieldName] = (value && value !== 9) ? true : false;
    }

    if (fieldName === 'turnOverRateId') {
      saveAndCompleteConditions[fieldName] = value ? true : false;
    }

    if (fieldName === 'analysisTypeId') {
      saveAndCompleteConditions[fieldName] = value ? true : false;
    }

    if (fieldName === 'discreteAccounts') {
      saveAndCompleteConditions[fieldName] = val.every(discreteAccount => Number(discreteAccount.valueSelected) !== 0);
    }

    this.setState({
      saveAndCompleteConditions,
    }, () => {
      this.checkIfShouldShowSaveAndComplete();
    })
  }

  render() {
    const {
      shouldShowSaveAndComplete,
      accountsListData,
      finInfoAccountDisplayTypeId,
    } = this.state;

    const dateOfFinancialStatement = Utils.getFormattedDateSmall(accountsListData['dateOfFinancialStatement'])
    const dateOfFinancialStatementPrepared = Utils.getFormattedDateSmall(accountsListData['dateOfFinancialStatementPrepared'])
    const dateOfRenewal = Utils.getFormattedDateSmall(accountsListData['dateOfRenewal'])
    // const dateOfPrequal = accountsListData['dateOfPrequal']

    this.calculateTotalEquityEndYear();
    const prequalDates = this.props.financials.prequalDates;
    const periodOptions = Utils.getOptionsList("Select period", this.props.financials.scorecardTurnOverRatesPossibleValues, 'name', 'id', 'id');
    const analysisTypePossibleValues = Utils.getOptionsList("Select Analysis Type", this.props.financials.analysisTypePossibleValues, 'name', 'id', 'id');
    const financialStatementTypePossibleValues = Utils.getOptionsList("Select Financial Statement Type", this.props.financials.financialStatementTypePossibleValues, 'name', 'id', 'id');

    const {
      companyType,
      turnOverRateId,
      analysisTypeId,
      financialStatementTypeId,
      companyTypeId
    } = this.props.financials.subcontractorData

    const IsPrequalRole = _.get(this.props.login, 'profile.Role.IsPrequalRole');

    let analysisTypeIdValue = analysisTypeId || '';
    let financialStatementValue = financialStatementTypeId || '';
    let companyTypeValue = companyTypeId || '';
    let commentary = accountsListData.commentary || '';

    const spinner = (
      <div style={{
        width: '100%',
        height: '300px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div className="spinner-wrapper">
          <div className="spinner"></div>
        </div>
      </div>
    );

    if (this.props.financials.fetchingAccountsList) {
      return spinner;
    }

    const companiesTypesPossibleValues = this.props.financials.companiesTypesPossibleValues || [];

    return (
      <div id="financial-info-page" className="list-view admin-view-body scoreCardInput">
        <Modal
          show={this.state.showNoteEditor}
          onHide={this.closeNoteEditor}
          className="add-item-modal noteEditorModal" >
          <Modal.Body>
            <NoteEditorModal
              closeAndRefresh={this.closeNoteEditor}
              close={this.closeNoteEditor}
              note={this.state.editedNotes[this.state.selectedAccountForNoteEdition.accountId] || this.state.selectedAccountForNoteEdition.note}
              saveNote={this.saveAccountNote}
              subcontractorId={this.props.match.params.scId}
              fromSCtab
              fromFinancialTab />
          </Modal.Body>
        </Modal>
        <div className="sciHeader">
          <div className="row">
            <div className="col-sm-6 row">
              <div className="col-sm-6">
                <div className='sciLabelWrapper'>Prequalification  Date</div>
              </div>
              <div className="col-sm-6">
                <div className='sciSelectWrapper'>
                  <select className="sciInput changeSubmission" onChange={this.prequalDateChange} value={this.state.savedFormId}>
                    {
                      prequalDates.map((item, index) => {
                        return (
                          <option key={index} value={item.id}>
                            {Utils.getFormattedDate(item.dateOfPrequal, true)}
                          </option>
                        )
                      })
                    }
                  </select>
                </div>
              </div>
            </div>

            {[1, 3].includes(finInfoAccountDisplayTypeId) &&
              <div className="col-sm-6 row">
                <div className="col-sm-6">
                  <div className='sciLabelWrapper'>Financial statement Date: </div>
                </div>
                <div className="col-sm-6" style={{ fontSize: '14px' }}>
                  <input className="sciInput" name="dateOfFinancialStatement" id="dateOfFinancialStatement" type="date" value={dateOfFinancialStatement} onChange={(e) => this.onDateChange(e, 'dateOfFinancialStatement')} />
                </div>
              </div>
            }

            <div className="col-sm-6 row" style={{ marginTop: '15px' }}>
              <div className="col-sm-6">
                <div className='sciLabelWrapper'>Corp Type: </div>
              </div>

              {
                IsPrequalRole ? (
                  <div className="col-sm-6">
                    <div className='sciSelectWrapper'>
                      <select className="sciInput" onChange={(e) => this.onSelectChange(e, 'companyTypeId')} value={companyTypeValue}>
                        {
                          companiesTypesPossibleValues.map((item, idx) => {
                            return (
                              <option key={idx} value={item.id}>{item.name}</option>
                            )
                          })
                        }
                      </select>
                    </div>
                  </div>
                ) : (
                    <div className="col-sm-6" style={{ fontSize: '14px' }}>
                      {companyType}
                    </div>
                  )}

            </div>

            {[1, 3].includes(finInfoAccountDisplayTypeId) &&
              <div className="col-sm-6 row" style={{ marginTop: '15px' }}>
                <div className="col-sm-6">
                  <div className='sciLabelWrapper'>Financial statement Date Prepared: </div>
                </div>
                <div className="col-sm-6" style={{ fontSize: '14px' }}>
                  <input className="sciInput" name="dateOfFinancialStatementPrepared" id="dateOfFinancialStatementPrepared" type="date" value={dateOfFinancialStatementPrepared} onChange={(e) => this.onDateChange(e, 'dateOfFinancialStatementPrepared')} />
                </div>
              </div>
            }

            <div className="col-sm-6 row" style={{ marginTop: '15px' }}>
              <div className="col-sm-6">
                <div className='sciLabelWrapper'>Renewal date: </div>
              </div>
              <div className="col-sm-6" style={{ fontSize: '14px' }}>
                <input className="sciInput" name="dateOfRenewal" id="dateOfRenewal" type="date" value={dateOfRenewal} onChange={(e) => this.onDateChange(e, 'dateOfRenewal')} />
              </div>
            </div>

            {[1, 3].includes(finInfoAccountDisplayTypeId) &&
              <div className="col-sm-6 row" style={{ marginTop: '15px' }}>
                <div className="col-sm-6">
                  <div className='sciLabelWrapper'>Financial statement Type: </div>
                </div>
                <div className="col-sm-6">
                  <div className='sciSelectWrapper'>
                    <select className="sciInput" onChange={(e) => this.onSelectChange(e, 'financialStatementTypeId')} value={financialStatementValue}>
                      {
                        financialStatementTypePossibleValues.map((item, idx) => {
                          return (
                            <option key={idx} value={item.value}>{item.label}</option>
                          )
                        })
                      }
                    </select>
                  </div>
                </div>
              </div>
            }

            {[1, 3].includes(finInfoAccountDisplayTypeId) &&
              <div className="col-sm-6 row" style={{ marginTop: '15px' }}>
                <div className="col-sm-6">
                  <div className='sciLabelWrapper'>Period: </div>
                </div>
                <div className="col-sm-6">
                  <div className='sciSelectWrapper'>
                    <select className="sciInput" onChange={(e) => this.onSelectChange(e, 'turnOverRateId')} value={turnOverRateId}>
                      {
                        periodOptions.map((item, idx) => {
                          return (
                            <option key={idx} value={item.value}>{item.label}</option>
                          )
                        })
                      }
                    </select>
                  </div>
                </div>
              </div>
            }
            {
              IsPrequalRole ? (
                <div className="col-sm-6 row" style={{ marginTop: '15px' }}>
                  <div className="col-sm-6">
                    <div className='sciLabelWrapper'>Analysis Type: </div>
                  </div>
                  <div className="col-sm-6">
                    <div className='sciSelectWrapper'>
                      <select className="sciInput" onChange={(e) => this.onSelectChange(e, 'analysisTypeId')} value={analysisTypeIdValue}>
                        {
                          analysisTypePossibleValues.map((item, idx) => {
                            return (
                              <option key={idx} value={item.value}>{item.label}</option>
                            )
                          })
                        }
                      </select>
                    </div>
                  </div>
                </div>
              ) : (
                  <div className="col-sm-6 row" style={{ marginTop: '15px' }} />
                )
            }
          </div>
        </div>
        <div className="sciBody">
          {[1, 3].includes(finInfoAccountDisplayTypeId) && this.renderScorecardVariables()}
          {[1, 3].includes(finInfoAccountDisplayTypeId) && this.state.accountsList.map(this.renderParentListGroup)}
          {[1, 3].includes(finInfoAccountDisplayTypeId) && this.renderAccountListGroup(this.state.basicAccounts, 0, true)}
          {[2, 3].includes(finInfoAccountDisplayTypeId) && this.renderDiscreteAccountListGroup(this.state.discreteAccountsSelected)}
          {this.renderAccountListGroup(this.state.avgProjectAccounts)}
          {this.renderAccountListGroup(this.state.avgVolumeAccounts)}

          <div className="sciFooter">
            <button onClick={this.onCalculateAccounts}>Calculate Values</button>
          </div>

          {this.renderCalculatedAccordions(spinner)}

        </div>
        <div className="sciCommentary">
          <textarea
            className="sciInput"
            placeholder="Commentary"
            maxLength="999"
            name="commentary"
            id="commentary"
            value={commentary}
            onChange={(e) => this.onSelectChange(e, 'commentary')}
          />
        </div>

        {this.state.accountsListData.finIsComplete ? null : (
          <div className="sciFooter">
            <button onClick={this.onSaveChanges}>Save</button>

            {shouldShowSaveAndComplete
              ? <button onClick={this.onSaveChangesAndComplete}>Save & Complete</button>
              : null
            }
          </div>
        )}

      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    local: state.localization,
    financials: state.financials,
    login: state.login,
    scProfile: state.SCProfile,
    scId: state.SCProfile.headerDetails.id
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(financialActions, dispatch),
    scPorfileActions: bindActionCreators(scPorfileActions, dispatch)
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(FinancialInfo));
