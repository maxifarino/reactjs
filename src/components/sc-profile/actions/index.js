import * as types from './types';
import Api from '../../../lib/api';

export const setFetchingHeader = (isFetching) => {
  return {
    type: types.SET_FETCHING_SC_HEADER,
    isFetching
  };
};
export const setHeaderDetails = (headerDetails) => {
  return {
    type: types.SET_SC_HEADER_DETAILS,
    headerDetails
  };
};

export const fetchHeaderDetails = (subcontractorId, hiringClientId, origin) => {
  return (dispatch, getState) => {
    const token = getState().login.authToken;
    dispatch(setFetchingHeader(true));
    dispatch(setHeaderDetails({}));
    const url = `subcontractors/headerdetails?subcontractorId=${subcontractorId}&hiringClientId=${hiringClientId}`
    // console.log('url = ', url)
    if (origin) {
      
      // console.log('origin = ', origin, " hiringClientId = ", hiringClientId)
    } else {
      // console.log('origin UNKNOWN, hiringClientId = ', hiringClientId)
    }
    return Api.get(
      url,
      token
    ).then(response => {
      const {success, data } = response.data;
      if (success && data) {
        data.id = subcontractorId
        dispatch(setHeaderDetails(data || {}));
        // console.log('data = ', data)
        dispatch(setHiringClientId(data.currentHiringClient));

        // if (!data.address && !data.city && !data.state && !data.zipCode && !data.phone) {
        //   dispatch(setChangingPrimary(true));
        // }
        // if (closeCallback) {
        //   closeCallback()
        // }
      } else {
        // if (closeCallback) {
        //   closeCallback()
        // }
      }
      dispatch(setFetchingHeader(false));
    })
    .catch(error => {
      console.log(error);
      dispatch(setFetchingHeader(false));
      // if (closeCallback) {
      //   closeCallback()
      // }
    });
  };
}

export const setFetchingHiringClients = (isFetching) => {
  return {
    type: types.SET_FETCHING_SC_HIRINGCLIENTS,
    isFetching
  };
};
export const setHiringClients = (hcList) => {
  return {
    type: types.SET_SC_HIRINGCLIENTS,
    hcList
  };
};
export const fetchHiringClientsForSCprofile = (subcontractorId, userId, initHeader) => {
  return (dispatch, getState) => {
    const { authToken } = getState().login;
    dispatch(setFetchingHiringClients(true));
    dispatch(setHiringClients([]));
    if (initHeader) {
      dispatch(setHeaderDetails({}));
      dispatch(setFetchingHeader(true));
    }

    const initHeaderCallback = (foundHCs) => {
      // console.log('foundHCs = ', foundHCs)
      if(initHeader){
        let hcId = getState().SCProfile.hcId;
        // console.log('getState().SCProfile.hcId = ', hcId)
        const { lastPayment } = getState().SCProfile;

        if(hcId === ""){
          const paymentHc = foundHCs.find(hc => hc.id === Number(lastPayment.hcId));

          if (paymentHc) {
            hcId = paymentHc.id;
            dispatch(setHiringClientId(paymentHc.id));
          } else {
            hcId = foundHCs.length > 0 ? foundHCs[0].id: '' ;
            // console.log('foundHCs[0].id = ', foundHCs[0].id)
            dispatch(setHiringClientId(hcId));
          }
        }
        dispatch(fetchHeaderDetails(subcontractorId, hcId, 'fetchHiringClientsForSCprofile'));
      }
    }
    // return Api.get(`users/profile`, authToken).then((response)=> {
      // const { Id, RoleID } = response.data.data.profile;
      const url = `hiringclients?userId=${userId}&subcontractorId=${subcontractorId}`
      // console.log('fetchHiringClientsForSCprofile url = ', url)
      Api.get(
        url,
        authToken

      ).then(response => {
        const {success, data } = response.data;
        if (success && data) {
          // console.log('data = ', data)
          // The variable that this setter is setting is not called from the REDUCER!  This is a DEAD END!!!
          // dispatch(setHiringClients(data.hiringClients || []));
          // The variable that this setter is setting is not called from the REDUCER!  This is a DEAD END!!!
          initHeaderCallback(data.hiringClients || []);
        }
        
        dispatch(setFetchingHiringClients(false));
      })
      .catch(error => {
        console.log(error);
        initHeaderCallback([]);
        dispatch(setFetchingHiringClients(false));
      });

    // }).catch(error => {
    //   console.log(error);
    //   initHeaderCallback([]);
    //   dispatch(setFetchingHiringClients(false));
    // });
  };
}

export const setHiringClientId = (hcId) => {
  return {
    type: types.SET_SC_HC_ID,
    hcId
  };
};

/* CHANGE BASIC DATA SUPPORT */
export const changeBasicData = (payload, callback) => {
  return (dispatch, getState) => {
    const token = getState().login.authToken;

    return Api.put(
      'subcontractors/updatebasicdata',
      payload,
      token
    ).then(response => {
      const { success } = response.data;
      if (callback) callback(success);
    })
      .catch(error => {
        if (callback) callback(false);
      });
  };
}

/* CHANGE HC OFFICE LOCATION SUPPORT */
export const changeLocation = (payload, callback) => {
  return (dispatch, getState) => {
    const token = getState().login.authToken;

    return Api.post(
      `/subcontractors/hcOfficeLocation`,
      payload,
      token
    ).then(response => {
      //console.log(response.data);
      const { success } = response.data;
      if(callback)callback(success);
    })
    .catch(error => {
      console.log(error);
      if(callback)callback(false);
    });
  };
}

/* CHANGE STATUS SUPPORT */
export const changeStatus = (payload, callback) => {
  return (dispatch, getState) => {
    const token = getState().login.authToken;

    return Api.post(
      `workflows/changescstatus`,
      payload,
      token
    ).then(response => {
      //console.log(response.data);
      const { success } = response.data;
      if(callback)callback(success);
    })
    .catch(error => {
      console.log(error);
      if(callback)callback(false);
    });
  };
}

/* CHANGE NAME SUPPORT */
export const changeSCname = (payload, callback) => {
  return (dispatch, getState) => {
    const token = getState().login.authToken;

    return Api.post(
      `/subcontractors/updateName`,
      payload,
      token
    ).then(response => {
      //console.log(response.data);
      const { success } = response.data;
      if(callback)callback(success);
    })
    .catch(error => {
      console.log(error);
      if(callback)callback(false);
    });
  };
}

/* CHANGE TIER RATING SUPPORT */
export const changeTier = (payload, callback) => {
  return (dispatch, getState) => {
    const token = getState().login.authToken;
    return Api.post(
      `subcontractors/changeTieRate`,
      payload,
      token
    ).then(response => {
      const { success } = response.data;
      if (callback) callback(success);
    })
      .catch(error => {
        if (callback) callback(false);
      });
  };
}

// CHECK IF THE USER MUST PAY THE HC FEE
const setPaymentStatus = (payment) => {
  return {
    type: types.SET_SC_PAYMENT_STATUS,
    payload: payment,
  };
};

const setPaymentError = (error) => {
  return {
    type: types.SET_SC_PAYMENT_STATUS_ERROR,
    payload: error,
  };
};

export const setLastPayment = (data) => {
  return {
    type: types.SET_SC_LAST_PAYMENT,
    payload: data,
  };
};

export const fetchPaymentStatus = (hiringClientId, subcontractorId, callback) => {
  return (dispatch, getState) => {
    const token = getState().login.authToken;

    dispatch(setPaymentStatus(null));
    dispatch(setPaymentError(''));
    const url = `/users/mustpay?hiringClientId=${hiringClientId}&subcontractorId=${subcontractorId}`
    return Api.get(url, token)
    .then(response => {
      const { success, data } = response.data;
      if (success) {
        dispatch(setPaymentStatus(data));
        if (callback) callback(data);
      } else {
        dispatch(setPaymentError('Unable to get payment information'));
        if (callback) callback(null);
      }
    })
    .catch(() => {
      dispatch(setPaymentError('Unable to get payment information'));
      if (callback) callback(null);
    });
  };
}

export const setFetchingLocations = (isFetching) => {
  return {
    type: types.SET_FETCHING_LOCATIONS,
    isFetching
  };
};

export const setTotalAmountOfLocations = (locationsLength) => {
  return {
    type: types.SET_TOTAL_AMOUNT_OF_LOCATIONS,
    locationsLength
  };
};

export const setLocationsList = (list) => {
  return {
    type: types.SET_LOCATIONS_LIST,
    list
  };
};

export const setLocationsListError = (error) => {
  return {
    type: types.SET_LOCATIONS_LIST_ERROR,
    error
  };
};

export const setStatesList = (list) => {
  return {
    type: types.SET_US_STATES_LIST,
    list
  };
};

export const setCanProvAndTerrList = (list) => {
  return {
    type: types.SET_CANADIAN_PROVINCES_AND_TERRITORIES_LIST,
    list
  };
};

export const setCountriesList = (list) => {
  return {
    type: types.SET_COUNTRIES_LIST,
    list
  };
};

export const fetchLocations = (queryParams) => {
  // console.log('actions.fetchLocations queryParams = ', queryParams)
  return (dispatch, getState) => {
    const token = getState().login.authToken;
    let urlParameters = '';

    dispatch(setFetchingLocations(true));
    dispatch(setTotalAmountOfLocations(0));

    if(queryParams) {
      if(!queryParams.pageNumber) {
        queryParams.pageNumber = 1;
      }
    }
    else {
      queryParams = {
        pageNumber: 1
      };
    }

    urlParameters = `?${Object.keys(queryParams).map(i => `${i}=${queryParams[i]}`).join('&')}`;
    // console.log('formFetch url = ', 'forms/savedforms' + urlParameters)
    return Api.get(`subcontractors/locations${urlParameters}`, token)
    .then(response => {
      const {success, data } = response.data;
      // console.log('fetchLocations response.data = ', response.data)
      let errorMsg = '';
      if(success) {
        dispatch(setTotalAmountOfLocations(data.totalCount));
        dispatch(setLocationsList(data.locations));
      } 
      else {
        switch(data.errorCode) {
          case 10003:
            errorMsg = 'Error: invalid filter data. Please, adjust the filters values and try again.';
          break;
          case 10005:
            errorMsg = 'Error: This is an invalid session. Please, sign in again.';
          break;
          case 10006:
            errorMsg = 'Error: You are not logged in. Please, sign in and try again.';
            break;
          case 10007:
            errorMsg = 'Error: Session expired. Please, sign in and try again.';
            break;
          case 10140:
            errorMsg = `Error: Could not find Subcontractor's locations.  It is possible that we have no address for this Subcontractor.  Try adding one in the Locations Tab, by clicking on "Add location"`;
            break;
          default:
            errorMsg = '';
            break;
        }
        dispatch(setLocationsListError(errorMsg));
        dispatch(setTotalAmountOfLocations(0));
        dispatch(setLocationsList([]));
      }
      dispatch(setFetchingLocations(false));
    })
    .catch(error => {
      console.log(error)
      dispatch(setLocationsListError('Connection error - Please, check your Internet service.'));
      dispatch(setTotalAmountOfLocations(0));
      dispatch(setLocationsList([]));
      dispatch(setFetchingLocations(false));
    });
  };
};

export const fetchStatesAndCountriesForRenderSelect = () => {
  return (dispatch, getState) => {
    const token = getState().login.authToken;

    return Api.get(`subcontractors/statesAndCountries`, token)
    .then(response => {
      const { success, data } = response.data;
      // console.log('states & countries response.data = ', response.data)
      let errorMsg = '';
      if(success) {
        dispatch(setStatesList(data.states));
        dispatch(setCanProvAndTerrList(data.provAndTerr));
        dispatch(setCountriesList(data.countries));
      }
      else {
        switch(data.errorCode) {
          case 10003:
            errorMsg = 'Error: invalid filter data. Please, adjust the filters values and try again.';
          break;
          case 10005:
            errorMsg = 'Error: This is an invalid session. Please, sign in again.';
          break;
          case 10006:
            errorMsg = 'Error: You are not logged in. Please, sign in and try again.';
            break;
          case 10007:
            errorMsg = 'Error: Session expired. Please, sign in and try again.';
            break;
          case 10140:
            errorMsg = `Error: Could not find Subcontractor's locations.`;
            break;
          default:
            errorMsg = '';
            break;
        }
        dispatch(setLocationsListError(errorMsg));
        dispatch(setTotalAmountOfLocations(0));
        dispatch(setLocationsList([]));
      }
      dispatch(setFetchingLocations(false));
    })
    .catch(error => {
      console.log(error)
      dispatch(setLocationsListError('Connection error - Please, check your Internet service.'));
      dispatch(setTotalAmountOfLocations(0));
      dispatch(setLocationsList([]));
      dispatch(setFetchingLocations(false));
    });
  };
};

export const setLocationError = (error) => {
  return {
    type: types.SET_LOCATIONS_ERROR,
    error
  };
};

export const setSavingLocation = (saving) => {
  return {
    type: types.SET_SAVING_LOCATION,
    saving
  };
};

export const deleteLocation = (payload) => {
  return (dispatch, getState) => {
    const token = getState().login.authToken;
    dispatch(setLocationError(null));
    const errMessage = 'Something went wrong.  Could not delete this location.  Please contact IT'
    if (payload.id) {
      Api.delete(
        `subcontractors/location/delete`,
        payload,
        token
      ).then(response => {
        const { success } = response.data
        console.log('response.data = ', response.data)
        if (!success) {
          console.log('success = ', success)
          dispatch(setLocationError(errMessage));
        }
      }).catch((error) => {
        console.log('Error: ', error)
        
        dispatch(setLocationError(errMessage + ". Error trace: " + error));
      });
    } else {
      console.log('An Id for the Location to be deleted was not passed in.  Please provide an Id')
    }
    
  };
}

export const setChangingPrimary = (isChanged) => {
  return {
    type: types.SET_CHANGING_PRIMARY,
    isChanged
  };
};

export const saveLocation = (payload, callback2) => {
  // console.log('payload = ', payload)
  return (dispatch, getState) => {
    const token = getState().login.authToken;
    dispatch(setLocationError(null));
    dispatch(setSavingLocation(true));

    const errMessage = "There was an error while saving, please try again.  If the error persists, please contact IT"

    const callback = (err, data) => {
      if (err) {
        console.log(err);
        dispatch(setLocationError(errMessage));
      } else {
        const { success } = data;
        if (!success) {
          dispatch(setLocationError(errMessage));
        } else {
          if (payload.Primary == 1) {
            dispatch(setChangingPrimary(true));
          }
        }
      }
      dispatch(setSavingLocation(false));
      // console.log('data = 1', data)
      if (callback2) {
        callback2()
      }
    }

    Api.post(
      `subcontractors/location`,
      payload,
      token
    ).then(response => {
      console.log('response.data = ', response.data)
      callback(null, response.data);
    }).catch(error => {
      callback(error, null);
    });
    
  };
}