import * as types from './types';
import Api from '../../../lib/api';

export const searchSubcontractors = (payload, callback) => {
  return (dispatch, getState) => {
    dispatch(setSearchTerm(payload.searchTerm));
    const { login, localization } = getState();
    let {
      error10005,
      error10006,
      error10007,
      error10011,
      error10019,
      errorDefault,
      //errorConnection,
    } = localization.strings.subcontractors.actions;
    const token = login.authToken;

    dispatch(setFetchingSCsearch(true));
    dispatch(setTotalAmountofSCsearch(0));

    const { SCPerPage } = getState().sc;
    payload.pageSize = SCPerPage

    payload.showPrequalEnabled = login.profile.RoleID ? 1 : 0;
    payload.showCertfocusEnabled = login.profile.CFRoleId ? 1 : 0;

    return Api.post(
      `subcontractors/search`,
      payload,
      token
    ).then( response => {
      const { success, data } = response.data;
      let errorMsg = '';
      if (success) {
        const { subcontratorSearchResult, totalRowsCount } = data;
        dispatch(setSubcontractorSearchResults(subcontratorSearchResult));
        dispatch(setTotalAmountofSCsearch(totalRowsCount));

        if (totalRowsCount === 0) {
          dispatch(setCountOfZero(true));
          dispatch(setSearchSCShowModal(true));
        } else if (totalRowsCount === 1) {
          const sub = subcontratorSearchResult[0];
          const hcId = sub.hcId;
          const scId = sub.ID;

          const pqEnabled = sub.pqEnabled;
          const cfEnabled = sub.cfEnabled;

          callback('', hcId, scId, { pqEnabled, cfEnabled });
          dispatch(setCountOfZero(false));
        } else {
          dispatch(setSearchSCShowModal(true));
          dispatch(setCountOfZero(false));
        }

      }
      else {
        const { data } = response.data;
        switch(data.errorCode) {
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
        dispatch(setSCsearchError(errorMsg));
        dispatch(setSubcontractorSearchResults([]));
        dispatch(setTotalAmountofSCsearch(0));
      }
      dispatch(setFetchingSCsearch(false));
    })
    .catch(error => {
      console.log(error);
    });
  };
}

export const setSearchTerm = (searchTerm) => {
  return {
    type: types.SET_SEARCH_TERM,
    searchTerm
  };
};

export const setFetchingSCsearch = (isFetching) => {
  return {
    type: types.SET_FETCHING_SC_SEARCH,
    isFetching
  };
};

export const setSCsearchError = (error) => {
  return {
    type: types.SET_SC_SEARCH_ERROR,
    error
  }
}

export const setTotalAmountofSCsearch = (SClengthSearch) => {
  return {
    type: types.SET_TOTAL_AMOUNT_OF_SC_SEARCH,
    SClengthSearch
  };
};

export const setCountOfZero = (isZero) => {
  return {
    type: types.SET_COUNT_OF_ZERO,
    isZero
  };
};

// sets

export const setSubcontractorSearchResults = (subcontractorSearchResults) => {
  return {
    type: types.SET_SUBCONTRACTOR_SEARCH_RESULTS,
    subcontractorSearchResults
  };
};

export const setSCListError = (error) => {
  return {
    type: types.SET_SC_LIST_ERROR,
    error
  };
};

export const setAddSCShowModal = (status) => {
  return {
    type: types.SET_ADD_SC_SHOW_MODAL,
    showModal: status
  };
};

export const setSearchSCShowModal = (status) => {
  return {
    type: types.SET_SEARCH_SC_SHOW_MODAL,
    showModal: status
  };
};

export const setListOfSCFromParsedFile = (list) => {
  return {
    type: types.SET_LIST_OF_SC_FROM_PARSED_FILE,
    list
  };
};

export const setListOfSCManually = (list) => {
  return {
    type: types.SET_LIST_OF_SC_MANUALLY,
    list
  };
};

export const setSCList = (list) => {
  return {
    type: types.SET_SC_LIST,
    list
  };
};

export const setFetchingSC = (isFetching) => {
  return {
    type: types.SET_FETCHING_SC,
    isFetching
  };
};


export const setTotalAmountOfSC = (SClength) => {
  return {
    type: types.SET_TOTAL_AMOUNT_OF_SC,
    SClength
  };
};


export const setTradesForFilterList = (data) => {
  return {
    type: types.SET_TRADES_FOR_FILTER_LIST,
    data
  };
};

export const setDisplayFileName = (displayFileName) => {
  return {
    type: types.SET_DISPLAY_FILE_NAME,
    displayFileName
  };
};



// fetchs

export const fetchSubcontractors = (queryParams) => {
  return (dispatch, getState) => {
    const { login, localization } = getState();
    let {
      error10005,
      error10006,
      error10007,
      error10011,
      error10019,
      errorDefault,
      errorConnection,
    } = localization.strings.subcontractors.actions;
    const token = login.authToken;
    let urlParameters = '';

    dispatch(setFetchingSC(true));
    dispatch(setTotalAmountOfSC(0));

    const { SCPerPage } = getState().sc;
    if(queryParams) {
      if(queryParams.withoutPag) {
        delete queryParams.pageNumber;
        delete queryParams.pageSize;
        delete queryParams.withoutPag;
      }
      else {
        if(!queryParams.pageNumber) {
          queryParams.pageNumber = 1;
        }
        queryParams.pageSize = SCPerPage;
      }
    }
    else {
      queryParams = {
        pageNumber: 1,
        pageSize: SCPerPage
      };
    }

    urlParameters = `?${Object.keys(queryParams).map(i => `${i}=${queryParams[i]}`).join('&')}`;

    let urlQuery = 'subcontractors';
    return Api.get(`${urlQuery}${urlParameters}`, token)
    .then(response => {
      const { success, data } = response.data;
      let errorMsg = '';
      if(success) {
        const { subContractors, totalCount } = data;
        dispatch(setSCList(subContractors));
        dispatch(setTotalAmountOfSC(totalCount));
      }
      else {
        switch(data.errorCode) {
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
        dispatch(setSCListError(errorMsg));
        dispatch(setSCList([]));
        dispatch(setTotalAmountOfSC(0));
      }
      dispatch(setFetchingSC(false));
    })
    .catch(error => {
      dispatch(setSCListError(errorConnection));
    });
  };
};

// submits

export const setHCforAddSCmodal = (hcIdForAddSCmodal) => {
  return {
    type: types.SET_HC_SELECTION_FOR_ADD_SC_MODAL,
    hcIdForAddSCmodal
  };
}

export const sendSCFile = () => {

  return (dispatch, getState) => {
    const { login, form, sc }   = getState();
    const { SCFileInputForm }   = form;
    const { hcIdForAddSCmodal } = sc
    const token                 = login.authToken;
    const { csvSCDataFile }     = SCFileInputForm.values;
    const splitedFileName       = csvSCDataFile.name.split('.');
    const extension             = splitedFileName[splitedFileName.length - 1];
    let shouldSendRequest       = true;

    if(
      !(
        extension === 'xls' ||
        extension === 'xlsx' ||
        extension === 'csv'
      )
    ) {
      shouldSendRequest = false;
    }

    let payload = new FormData();

    // console.log('hcIdForAddSCmodal = ', hcIdForAddSCmodal)

    if(shouldSendRequest) {
      payload.append("hiringClientId", hcIdForAddSCmodal);
      payload.append("csvSCDataFile", SCFileInputForm.values.csvSCDataFile);
      payload.append("extension", extension)

      return Api.post(
        'subcontractors/upload_validate',
        payload,
        token)
      .then(response => {
        const { success, data } = response.data;
        if(success) {
          dispatch(setListOfSCFromParsedFile(data));
          dispatch(setDisplayFileName(csvSCDataFile.name))
        }
        else {
          let err = response.data.error ? response.data.error : "There was an error sending the list"
          dispatch(setSendingScListError(response.data.error));
          // console.log('response.data.error', response.data.error);
        }
      })
      .catch(error => {
        console.log(error);
      });
    }

  };
};

/* SEND SC LIST SUPPORT */
export const setSendingScList = (sendingScList) => {
  return {
    type: types.SET_SENDING_SC_LIST,
    sendingScList
  };
};
export const setSendingScListSuccess = (successMsg) => {
  return {
    type: types.SET_SENDING_SC_LIST_SUCCESS,
    successMsg
  };
};
export const setSendingScListError = (errorMsg) => {
  return {
    type: types.SET_SENDING_SC_LIST_ERROR,
    errorMsg
  };
};
export const sendSCList = (values, close, isManually) => {
  return (dispatch, getState) => {

    dispatch(setDisplayFileName(''))

    const { login, sc }   = getState();
    const token                 = login.authToken;
    const { hcIdForAddSCmodal } = sc

    const payload = {
      subcontractorsList: values//JSON.stringify(values)
    };

    payload.hiringClientId = hcIdForAddSCmodal

    dispatch(setSendingScList(true));
    dispatch(setSendingScListSuccess(null));
    dispatch(setSendingScListError(null));

    return Api.post(
      `subcontractors/list_validate_save`,
      payload,
      token
    )
    .then(response => {
      const { success, data } = response.data;

      if(success) {
        // console.log('response success', success);
        // console.log('data = ', data)
        dispatch(setSendingScListSuccess("List sent successfully!"));
        if (close){
          close();
        }
      }
      else {
        if(isManually) {
          dispatch(setListOfSCManually(data));
        } else {
          dispatch(setListOfSCFromParsedFile(data));
        }
        let err = response.data.error ? response.data.error : "There was an error sending the list"
        // console.log('response.data = ', response.data)
        dispatch(setSendingScListError(err));
      }
      dispatch(setSendingScList(false));
    })
    .catch(error => {
      console.log(error);
      dispatch(setSendingScListError("There was an error sending the list"));
      dispatch(setSendingScList(false));
    });
  };
};

/* Support for SC status */
export const setSCStatus = (subcontratorStatus) => {
  return {
    type: types.SET_SC_STATUS,
    subcontratorStatus
  };
};

export const setSCStatusWithCounts = (subcontratorStatusWithCounts) => {
  return {
    type: types.SET_SC_STATUS_WITH_COUNTS,
    subcontratorStatusWithCounts
  };
};

export const fetchSCStatus = () => {
  return (dispatch, getState) => {
    const token = getState().login.authToken;
    return Api.get(
      `subcontractors/status`,
      token
    ).then(response => {
      const {success, subcontratorStatus } = response.data;
      if (success && subcontratorStatus) {
        dispatch(setSCStatus(subcontratorStatus));
      }
    })
    .catch(error => {
      console.log(error);
    });
  };
}

export const fetchSCStatusWithCounts = (hcId) => {
  return (dispatch, getState) => {
    const token = getState().login.authToken;
    const payload = {
      hcId
    };
    return Api.post(
      `subcontractors/status`,
      payload,
      token
    ).then(response => {
      const {success, subcontratorStatusWithCounts } = response.data;
      // console.log('response.data = ', response.data)
      if (success && subcontratorStatusWithCounts) {
        dispatch(setSCStatusWithCounts(subcontratorStatusWithCounts));
      }
    })
    .catch(error => {
      console.log(error);
    });
  };
}

export const setHCforms = (forms) => {
  return {
    type: types.SET_FORMS,
    forms
  };
};

export const fetchHCforms = (hcId) => {
  return (dispatch, getState) => {
    const token = getState().login.authToken;
    const payload = {
      hcId
    };
    return Api.post(
      `subcontractors/forms`,
      payload,
      token
    ).then(response => {
      const {success, data } = response.data;
      // console.log('response.data = ', response.data)
      if (success && data) {
        dispatch(setHCforms(data));
      }
    })
    .catch(error => {
      console.log(error);
    });
  };
}

/* Support for SC Tier Rates */
export const setSCTierRates = (subcontratorTierRates) => {
  return {
    type: types.SET_SC_TIER_RATES,
    subcontratorTierRates
  };
};
export const fetchSCTierRates = () => {
  return (dispatch, getState) => {
    const token = getState().login.authToken;
    return Api.get(
      `subcontractors/tierates`,
      token
    ).then(response => {
      const {success, subcontratorTieRates } = response.data;
      if (success && subcontratorTieRates) {
        dispatch(setSCTierRates(subcontratorTieRates));
      }
    })
    .catch(error => {
      console.log(error);
    });
  };
}

export const fetchTrades = (url = 'tradesbyhc', queryParams = {}) => {
  return (dispatch, getState) => {
    const { login } = getState();
    const token = login.authToken;

    const urlParameters = `?${Object.keys(queryParams).map(i => `${i}=${queryParams[i]}`).join('&')}`;

    return Api.get(`${url}${urlParameters}`, token)
      .then(response => {
        const { success, tradesList } = response.data;
        if (success) {
          dispatch(setTradesForFilterList(tradesList));
        }
      })
      .catch(error => {

      });
  };
};
