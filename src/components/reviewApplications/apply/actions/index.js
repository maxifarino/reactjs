import * as types from './types';
import Api from '../../../../lib/api';
import Utils from '../../../../lib/utils';

export const setApplyErrorMessage = (error) => {
  return {
    type: types.SET_APPLY_ERROR_MESSAGE,
    error
  };
};

export const setTitleOptions = (options) => {
  return {
    type: types.SET_TITLE_OPTIONS,
    options
  };
};

export const setTimezoneOptions = (options) => {
  return {
    type: types.SET_TIMEZONE_OPTIONS,
    options
  };
};

export const setTradeOptions = (options) => {
  return {
    type: types.SET_TRADE_OPTIONS,
    options
  };
};

export const setCountryOptions = (options) => {
  return {
    type: types.SET_COUNTRY_OPTIONS,
    options
  };
};

export const setRoleOptions = (roles, allUsersLabel) => {
  return {
    type: types.SET_ROLE_OPTIONS,
    rolesData: {
      CFRoles: roles.CFRoles,
      PQRoles: roles.PQRoles,
      allUsersLabel
    }
  };
};

export const setUserExists = (data) => {
  return {
    type: types.SET_USER_EXISTS,
    data
  }
}

const filterSelectOutOfTrades = (trades) => {
  let newTrades = [];
  for (let i=0; i<trades.length; i++) {
    let tradeObj = trades[i];
    let description = tradeObj.Description;
    //let label = tradeObj.label;
    if (!description.includes('SELECT') && !description.includes('select') && !description.includes('Select')) {
      newTrades.push(tradeObj);
    }
  }
  // console.log('newTrades = ', JSON.stringify(newTrades))
  return newTrades;
}

/*
export const fetchResources = (history) => {
  return (dispatch, getState) => {
    const { login, localization } = getState();
    let {
      error10005,
      error10006,
      error10007,
      error10011,
      errorDefault,
      errorConnection,
    } = localization.strings.register.actions;
    const {allUsersLabel} = localization.strings.register.reducer;
    const token = login.authToken;

    return Api.get(`resources/login`, token)
    .then(response => {
      const {success, data } = response.data;
      let errorMsgLogin = '', errorMsgServer = '';
      if(success) {
        //console.log(data);
        dispatch(setTitleOptions(data.titles));
        dispatch(setTimezoneOptions(data.timeZones));
        dispatch(setTradeOptions(data.trades));
        dispatch(setRoleOptions(data.roles || {PQRoles:[],CFRoles:[]}, allUsersLabel));
      }
      else {
        switch(data.errorCode) {
          case 10005:
            errorMsgLogin = error10005;
            break;
          case 10006:
            errorMsgLogin = error10006;
            break;
          case 10007:
            errorMsgLogin = error10007;
            break;
          case 10011:
            errorMsgLogin = error10011;
            break;
          default:
            errorMsgServer = errorDefault;
            break;
        }
        if(errorMsgLogin) {
          if(history) {
            dispatch({
              type: 'SET_LOGIN_EXTRA_MSG',
              extraMessage: errorMsgLogin
            });
            history.push('/login');
          }
          dispatch(setApplyErrorMessage(errorMsgLogin));
        }
        else {
          dispatch(setApplyErrorMessage(errorMsgServer));
        }
      }
    })
    .catch(error => {
      dispatch(setApplyErrorMessage(errorConnection));
    });
  };
};
*/
/* Support for Geo States */
export const setGeoStates = (geoStates) => {
  return {
    type: types.SET_GEO_STATES,
    geoStates
  };
};
export const fetchGeoStates = () => {
  return (dispatch, getState) => {
    const token = getState().login.authToken;
    return Api.get(
      `geo/states`,
      token
    ).then(response => {
      const {success, geoUSAStates } = response.data;
      if (success && geoUSAStates) {
        dispatch(setGeoStates(geoUSAStates));
      }
    })
    .catch(error => {
      console.log(error);
    });
  };
}

/* Support for registration */
export const setSubcontractorId = (subcontractorId) => {
  return {
    type: types.SET_REGISTRATION_SC_ID,
    subcontractorId
  };
};
export const setHiringClientId = (hiringClientId) => {
  return {
    type: types.SET_REGISTRATION_HC_ID,
    hiringClientId
  };
};

export const setApplyPayload = (applyPayload) => {
  return {
    type: types.SET_APPLY_PAYLOAD,
    applyPayload
  };
};
export const setApplyPayloadField = (fieldName, fieldValue) => {
  return {
    type: types.SET_APPLY_PAYLOAD_FIELD,
    fieldValue: fieldValue,
    fieldName: fieldName
  };
};
export const setRegistrationErrorMessage = (error) => {
  return {
    type: types.SET_REGISTRATION_ERROR,
    error
  };
};
export const setRegistrationSuccessMessage = (success) => {
  return {
    type: types.SET_REGISTRATION_SUCCESS,
    success
  };
};
export const setRedirectOnError = (redirect) => {
  return {
    type: types.SET_REGISTRATION_REDIRECT_ON_ERROR,
    redirect
  };
};
export const setRegitrationHcLogo = (hcLogo) => {
  return {
    type: types.SET_REGISTRATION_HC_LOGO,
    hcLogo
  };
};
export const setRegitrationTempToken = (tempToken) => {
  return {
    type: types.SET_REGISTRATION_TEMP_TOKEN,
    tempToken
  };
};
/*
export const fetchRegistrationResourcesByHash = (hash, history) => {
  return (dispatch, getState) => {
    const { localization } = getState();
    const { errorConnection, invalidHash } = localization.strings.register.actions;

    dispatch(setRegistrationErrorMessage(null));
    dispatch(setRegistrationSuccessMessage(null));
    dispatch(setRedirectOnError(false));
    dispatch(setSubcontractorId(''));
    dispatch(setApplyPayload({}));
    dispatch(setHiringClientId(''));
    dispatch(setRegitrationHcLogo(null));
    dispatch(setRegitrationTempToken(null));
    dispatch(setUserExists(null));

    return Api.get(`subcontractors/invitevalues?inviteCode=${hash}`)
    .then(response => {
      const {success, data } = response.data;
      console.log(success, data);
      
      if(success) {
        if (data.linkAlreadyVisited) {
          history.push('/login');
        } else {
          if (data.titles) dispatch(setTitleOptions(data.titles));
          if (data.trades) {
            let trades = filterSelectOutOfTrades(data.trades)
            dispatch(setTradeOptions(trades));
          }
          if (data.countries) dispatch(setCountryOptions(data.countries));
          if (data.hiringClientId) dispatch(setHiringClientId(data.hiringClientId));
          dispatch(setRegitrationHcLogo(data.logo));
          dispatch(setRegitrationTempToken(data.token));
          dispatch(setUserExists(data.userExists));
          if (data.subContractor) {
            if (data.subContractor.fullName && data.subContractor.fullName !== "") {
              const name = data.subContractor.fullName.split(" ");
              dispatch(setApplyPayloadField('firstName', name[0]));
              dispatch(setApplyPayloadField('lastName', name.length > 1 ? name[1] : ''));
            }
            dispatch(setApplyPayloadField('phone', data.subContractor.phone));
            dispatch(setApplyPayloadField('email', data.subContractor.email));
            dispatch(setApplyPayloadField('companyName', data.subContractor.name));
            dispatch(setSubcontractorId(data.subContractor.id));
          }
        }
      }
      else {
        dispatch(setRegistrationErrorMessage(invalidHash));
        dispatch(setRedirectOnError(true));
      }
    })
    .catch(error => {
      console.log(error);
      dispatch(setRegistrationErrorMessage(errorConnection));
      dispatch(setRedirectOnError(true));
    });
  };
};
*/

export const sendRegistration = (userPayload, companyPayload) => {
  return (dispatch, getState) => {
    const { register, localization } = getState();
    const {
      registrationError,
      registrationEmailError,
      registrationSuccess
    } = localization.strings.register.actions;
    const token = register.tempToken;
    let payload = {
      user: userPayload,
      subcontractor: companyPayload,
    };

    dispatch(setRegistrationErrorMessage(null));
    dispatch(setRegistrationSuccessMessage(null));
    dispatch(setRedirectOnError(false));

    return Api.post(
      `subcontractors/register`,
      payload,
      token)
    .then(response => {
      const { success, data, subAlreadyExists } = response.data;
      // PLEASE NOTE THE VAR NAME 'subAlreadyExists' refers to the prior existence of the relation between the registered subcontractor and registered-for hiringClient.  False = this sub is new to this HC.  True = there is already a row on the HC_SC table.
      // console.log('response = ', response);
      console.log('subAlreadyExists = ', subAlreadyExists)
      if (subAlreadyExists) {
        dispatch(setRegistrationErrorMessage('This Subcontractor is already registered with this Hiring Client.  Any new Users have been entered and associated with the original Subcontractor'));
      } else if (!subAlreadyExists && success) {
        dispatch(setRegistrationSuccessMessage(registrationSuccess));
      } else {
        if(data.errorCode === 10004){
          dispatch(setRegistrationErrorMessage(registrationEmailError));
        }else{
          dispatch(setRegistrationErrorMessage(registrationError));
        }
      }
      
    })
    .catch(error => {
      console.log(error);
      dispatch(setRegistrationErrorMessage(registrationError));

    });
  };
};

export const checkHC = (payload, callback) => {
  return (dispatch, getState) => {
    const { localization } = getState();
    const { errorConnection } = localization.strings.register.actions;
    
    const urlParameters = Utils.getUrlParameters(payload);
    let urlQuery = `subcontractors/applications/check`;
    
    return Api.get(`${urlQuery}${urlParameters}`)
      .then(response => {
        const {success, data} = response.data;        
        if (success) {
          if (callback) callback (null, data);
        } else {
          const errorMsg = 'Error: HC not found';
          console.log(errorMsg);          
          if (callback) callback (errorMsg);
        }
      })
      .catch(() => {        
        if (callback) callback (errorConnection);
      });
  }
};

export const fetchApplyResources = (hcId) => {
  return (dispatch, getState) => {
    const { localization } = getState();
    let {
      error10005,
      error10006,
      error10007,
      error10011,
      errorDefault,
      errorConnection,
    } = localization.strings.register.actions;
    
    let urlQuery = `subcontractors/applications/resources?hiringClientId=${hcId}`;
       
    return Api.get(`${urlQuery}`)
      .then(response => {
        const {success, data } = response.data;
        let error = '';
                
        if(success) {
          if (data.titles) dispatch(setTitleOptions(data.titles));
          if (data.trades) {
            let trades = filterSelectOutOfTrades(data.trades)
            dispatch(setTradeOptions(trades));
          }
          if (data.countries) dispatch(setCountryOptions(data.countries));
          if (data.hiringClientId) dispatch(setHiringClientId(data.hiringClientId));
          dispatch(setRegitrationHcLogo(data.logo));
        }
        else {
          switch(data.errorCode) {
            case 10005:
              error = error10005;
              break;
            case 10006:
              error = error10006;
              break;
            case 10007:
              error = error10007;
              break;
            case 10011:
              error = error10011;
              break;
            default:
              error = errorDefault;
              break;
          }
          dispatch(setApplyErrorMessage(error));
        }
    })
    .catch(error => {
      dispatch(setApplyErrorMessage(errorConnection));
    });
  };
};