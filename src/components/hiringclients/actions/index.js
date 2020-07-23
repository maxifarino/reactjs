import * as types from './types';
import Api from '../../../lib/api';
import Utils from '../../../lib/utils';
import async from 'async';

// sets
export const setHCListSuccess = (success) => {
  return {
    type: types.SET_HC_LIST_SUCCESS,
    success
  };
};

export const setHCListError = (error) => {
  return {
    type: types.SET_HC_LIST_ERROR,
    error
  };
};

export const setShowModal = (status) => {
  return {
    type: types.SET_SHOW_MODAL,
    showModal: status
  };
};

export const setShowHoldersModal = (status) => {
  return {
    type: types.SET_SHOW_HOLDERS_MODAL,
    showModal: status
  };
};

export const setAssociatingHCUser = (associatingHCUser) => {
  return {
    type: types.SET_ASSOCIATING_HCUSER,
    associatingHCUser
  };
};

export const setAssociatingOperator = (associatingOperator) => {
  return {
    type: types.SET_ASSOCIATING_OPERATOR,
    associatingOperator
  };
};

export const setHCList = (list) => {
  return {
    type: types.SET_HC_LIST,
    list
  };
};

export const setParentsHCList = (list) => {
  return {
    type: types.SET_PARENTS_HC_LIST,
    list
  };
};

export const setHCUsers = (list) => {
  return {
    type: types.SET_HC_USERS,
    list
  };
};

export const setOperators = (list) => {
  return {
    type: types.SET_OPERATORS,
    list
  };
};

export const setFetchingHC = (isFetching) => {
  return {
    type: types.SET_FETCHING_HC,
    isFetching
  };
};

export const setTotalAmountOfHC = (HClength) => {
  return {
    type: types.SET_TOTAL_AMOUNT_OF_HC,
    HClength
  };
};

export const addSerializedHcData = (serializedHcObj) => {
  return {
    type: types.ADD_SERIALIZED_HC_DATA,
    serializedHcObj
  }
}

// fetchs

export const fetchHiringClients = (queryParams) => {
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
    } = localization.strings.hiringClients.actions;
    const token = login.authToken;
    let urlParameters = '';

    dispatch(setFetchingHC(true));
    dispatch(setTotalAmountOfHC(0));

    const { HCPerPage } = getState().hc;
    if (queryParams) {
      if (queryParams.withoutPag) {
        delete queryParams.pageNumber;
        delete queryParams.pageSize;
        delete queryParams.withoutPag;
      }
      else {
        if (!queryParams.pageNumber) {
          queryParams.pageNumber = 1;
        }
        queryParams.pageSize = HCPerPage;
      }
    }
    else {
      queryParams = {
        pageNumber: 1,
        pageSize: HCPerPage
      };
    }

    let urlQuery = 'hiringclients';
    return Api.get(`users/profile`, token).then((response) => {
      const id = response.data.data.profile.Id;
      let additionalParams = ''
      if (!Utils.isObjEmpty(queryParams)) {
        additionalParams = `&${Object.keys(queryParams).map(i => `${i}=${queryParams[i]}`).join('&')}`
      }
      urlParameters = `?userId=${id}${additionalParams}`;
      const url = `${urlQuery}${urlParameters}`
      // console.log('/hiringclients/actions -> url = ', url) 
      Api.get(url, token)
        .then(response => {
          const { success, data } = response.data;
          let errorMsg = '';
          if (success) {
            // console.log('fetchHiringClients data = ', data)
            dispatch(setHCList(data.hiringClients ? data.hiringClients : []));
            dispatch(setTotalAmountOfHC(data.totalCount ? data.totalCount : 0));
          }
          else {
            switch (data.errorCode) {
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
            dispatch(setHCListError(errorMsg));
            dispatch(setTotalAmountOfHC(0));
            dispatch(setHCList([]));
          }
          dispatch(setFetchingHC(false));
        })
        .catch(error => {
          dispatch(setHCListError(errorConnection));
        });
    })
  };
};

export const fetchHolders = (queryParams) => {
  return (dispatch, getState) => {
    const {
      login: { authToken },
      localization,
      hc: { HCPerPage },
    } = getState();

    let {
      errorDefault,
      errorConnection,
    } = localization.strings.hiringClients.actions;

    dispatch(setFetchingHC(true));
    dispatch(setTotalAmountOfHC(0));

    if (queryParams) {
      if (queryParams.withoutPag) {
        delete queryParams.pageNumber;
        delete queryParams.pageSize;
        delete queryParams.withoutPag;
      } else {
        if (!queryParams.pageNumber) {
          queryParams.pageNumber = 1;
        }

        queryParams.pageSize = HCPerPage;
      }
    } else {
      queryParams = {
        pageNumber: 1,
        pageSize: HCPerPage,
      };
    }

    let urlQuery = 'cf/holders';
    return Api.get(`users/profile`, authToken).then((response) => {
      const { Id } = response.data.data.profile;
      const urlParameters = `?userId=${Id}&${Object.keys(queryParams).map(i => `${i}=${queryParams[i]}`).join('&')}`;

      Api.get(`${urlQuery}${urlParameters}`, authToken)
        .then(response => {
          const { success, data: { holders, totalCount } } = response.data;
          if (success) {
            dispatch(setHCList(holders ? holders : []));
            dispatch(setTotalAmountOfHC(totalCount ? totalCount : 0));
          } else {
            dispatch(setHCListError(errorDefault));
            dispatch(setTotalAmountOfHC(0));
            dispatch(setHCList([]));
          }
          dispatch(setFetchingHC(false));
        })
        .catch(error => {
          dispatch(setHCListError(errorConnection));
        });
    })
  };
};

export const fetchParentsHC = (onlyParents) => {
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
    } = localization.strings.hiringClients.actions;
    const token = login.authToken;
    let urlParameters = '';
    let urlQuery = `hiringclients?onlyParents=${onlyParents}`;
    return Api.get(`${urlQuery}${urlParameters}`, token)
      .then(response => {
        const { success, data } = response.data;
        let errorMsg = '';
        if (success) {
          dispatch(setParentsHCList(data.hiringClients));
        }
        else {
          switch (data.errorCode) {
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
          dispatch(setHCListError(errorMsg));
        }
        dispatch(setFetchingHC(false));
      })
      .catch(error => {
        dispatch(setHCListError(errorConnection));
      });
  };
};

export const fetchUsersByType = (type) => {
  return (dispatch, getState) => {
    const { login, localization } = getState();
    let {
      error10003,
      error10005,
      error10006,
      error10007,
      error10011,
      errorDefault,
      errorConnection
    } = localization.strings.users.actions;
    const token = login.authToken;
    let urlParameters = '';
    let queryParams = {};
    if (type) {
      if (type === 'operator') {
        queryParams.roleId = 2;
      }
      else {
        queryParams.roleId = 3;
      }
    }
    else {
      if (login.userId) {
        queryParams.userId = login.userId;
      } else {
        queryParams.roleId = 3;
      }
    }
    queryParams.orderBy = 'name';
    queryParams.orderDirection = 'ASC';

    urlParameters = `?${Object.keys(queryParams).map(i => `${i}=${queryParams[i]}`).join('&')}`;
    return Api.get(`users${urlParameters}`, token)
      .then(response => {
        const { success, data } = response.data;
        let errorMsg = '';
        if (success) {
          let usersResponse = data.users;
          if (queryParams.roleId === 2) {
            dispatch(setOperators(usersResponse));
          }
          else {
            dispatch(setHCUsers(usersResponse));
          }
        }
        else {
          switch (data.errorCode) {
            case 10003:
              errorMsg = error10003;
              break;
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
            default:
              errorMsg = errorDefault;
              break;
          }
          dispatch(setHCListError(errorMsg));
        }
      })
      .catch(error => {
        dispatch(setHCListError(errorConnection));
      });
  };
};

// submits

// serializedHcObj object contains the entire information from hc wizard form
export const sendNewHC = (serializedHcObj, closeModal) => {
  return (dispatch, getState) => {

    const { login, localization } = getState();
    const token = login.authToken;
    const {
      // error10001,
      // error10003,
      // error10004,
      // error10005,
      // error10006,
      // error10007,
      // error10008,
      // error10011,
      // error10013,
      // error10014,
      // errorDefault,
      errorConnection,
    } = localization.strings.hiringClients.actions;

    _log('hc wizar creation series');

    let hcId, userId;

    async.series(
      [
        (callback) => {
          // step 1: create company info (hc)
          const companyInfo = serializedHcObj.companyInfo;
          _log('step 1: create company info (hc)');

          const hcPayload = {
            name: companyInfo.companyName,
            parentHiringClientId: 0,
            subdomain: companyInfo.subdomain ? companyInfo.subdomain : 'not available',
            country: companyInfo.country ? companyInfo.companyName : 'not available',
            phone: Utils.normalizePhoneNumber(companyInfo.phone),
            phone2: Utils.normalizePhoneNumber(companyInfo.phone2, 'not available'),
            fax: Utils.normalizePhoneNumber(companyInfo.fax, 'not available'),
            address1: companyInfo.companyAddress1 ? companyInfo.companyAddress1 : 'not available',
            address2: companyInfo.companyAddress2 ? companyInfo.companyAddress2 : 'not available',
            city: companyInfo.city ? companyInfo.city : 'not available',
            state: companyInfo.state ? companyInfo.state : 'not available',
            zipCode: companyInfo.postalCode ? companyInfo.postalCode : 'not available'
          }

          if (companyInfo.hiringClientId) {
            _log("updating hiring client");
            hcPayload.hiringClientId = companyInfo.hiringClientId;
          }

          Api.post(
            `hiringclients`,
            hcPayload,
            token)
            .then(response => {
              const { success, data } = response.data;
              hcId = data.hcId;
              if (success) {
                // new user created
                _log('* new user created', hcPayload);
                _log('* data from server', data);
                callback(null);
              } else {
                dispatch(setHCListError(response.data.description));
                callback(response.data.description);
              }
            })
            .catch(error => {
              dispatch(setHCListError(errorConnection));
              callback(null);
            });

        },
        (callback) => {
          // step 2: create hc
          const contactInfo = serializedHcObj.contactInfo;
          _log('step 2: create hc ');

          if (contactInfo.hcUser) {
            // assign existing hc
            _log('using exiting hc user', contactInfo.hcUser);
            userId = contactInfo.hcUser;

            let hcUserPayload = {
              id: contactInfo.hcUser,
              isContact: 1
            };

            Api.put(
              `users/profile`,
              hcUserPayload,
              token)
              .then(response => {
                const { success } = response.data;
                if (success) {
                  _log('* user updated', hcUserPayload);

                  callback(null);
                }
                else {
                  dispatch(setHCListError(response.data.description));
                  callback(response.data.description);
                }
              })
              .catch(error => {
                dispatch(setHCListError(errorConnection));
                callback(null);
              });
          } else {
            // create new hc user
            let hcUserPayload = {
              roleId: '3',
              firstName: contactInfo.firstName,
              lastName: contactInfo.lastName,
              mail: contactInfo.email,
              password: contactInfo.password,
              phone: Utils.normalizePhoneNumber(contactInfo.phone),
              mustRenewPass: (contactInfo.changeuponlogin ? 1 : 0) + '',
              timeZoneId: (parseInt(contactInfo.timezone, 10) || 0) + '',
              isContact: 1
            };

            Api.post(
              `users/profile`,
              hcUserPayload,
              token)
              .then(response => {
                const { success, data } = response.data;
                userId = data.userId;
                // let errorMsg = '';
                if (success) {
                  // new user created
                  _log('* new user created', hcUserPayload);
                  _log('* data from server', data);
                  callback(null);
                }
                else {
                  dispatch(setHCListError(response.data.description));
                  callback(response.data.description);
                }
              })
              .catch(error => {
                dispatch(setHCListError(errorConnection));
                callback(null);
              });
          }
        },
        (callback) => {
          // step 3: assigning hc user to company (hc)
          _log('step 3: assigning hc user to company (hc) ');

          const relationPayload = {
            userId: parseInt(userId, 10),
            hiringClientId: parseInt(hcId, 10)
          }

          _log('*userId', userId);
          _log('*hcId', hcId);
          _log('*payload sent', relationPayload);

          Api.post(
            `hiringclients/userrelation`,
            relationPayload,
            token)
            .then(response => {
              const { success, data } = response.data;
              if (success) {
                // new relation
                _log('* successful hc');
                callback(null);
              } else {
                // Todo: manage error
                _log('* error from server', data);
                dispatch(setHCListError(response.data.description));
                callback(response.data.description);
              }
            })
            .catch(error => {
              dispatch(setHCListError(errorConnection));
              callback(null);
            });

        },
        (callback) => {
          /* step 4: uploading the logo */

          const fileInput = document.getElementById('companyLogo');
          const formData = new FormData();
          formData.append('hiringClientId', parseInt(hcId, 10));
          formData.append("logoFile", fileInput.files[0]);

          if (fileInput.files[0]) {
            Api.post(
              `hiringclients/logo`,
              formData,
              token)
              .then(response => {
                const { success, data } = response.data;
                if (success) {
                  // new relation
                  _log('* successful image upload');
                  callback(null);
                } else {
                  // Todo: manage error
                  _log('* error from server', data);
                  dispatch(setHCListError(response.data.description));
                  callback(response.data.description);
                }
              })
              .catch(error => {
                dispatch(setHCListError(errorConnection));
                callback(null);
              });
          }
          else {
            _log("ignoring image upload");
            callback(null);
          }

        }
      ],
      (err) => {
        if (err) {
          _log('error ', err);
        } else {
          _log('hc creation completed');
          closeModal(true);
        }

      }
    )
  }
}

export const sendUpdateHC = (serializedHcObj, closeModal) => {
  return (dispatch, getState) => {

    const { login, localization } = getState();
    const token = login.authToken;
    const {
      errorConnection,
    } = localization.strings.hiringClients.actions;

    let hcId;
    console.log(serializedHcObj);

    async.series(
      [
        (callback) => {
          // step 1: update company info (hc)
          const companyInfo = serializedHcObj.companyInfo;

          const hcPayload = {
            hiringClientId: companyInfo.hiringClientId,
            name: companyInfo.companyName,
            parentHiringClientId: 0,
            subdomain: companyInfo.subdomain ? companyInfo.subdomain : 'not available',
            country: companyInfo.country ? companyInfo.companyName : 'not available',
            phone: Utils.normalizePhoneNumber(companyInfo.phone),
            phone2: Utils.normalizePhoneNumber(companyInfo.phone2, 'not available'),
            fax: Utils.normalizePhoneNumber(companyInfo.fax, 'not available'),
            address1: companyInfo.companyAddress1 ? companyInfo.companyAddress1 : 'not available',
            address2: companyInfo.companyAddress2 ? companyInfo.companyAddress2 : 'not available',
            city: companyInfo.city ? companyInfo.city : 'not available',
            state: companyInfo.state ? companyInfo.state : 'not available',
            zipCode: companyInfo.postalCode ? companyInfo.postalCode : 'not available',
            allowApplications: companyInfo.allowApplications ? 1 : 0,
            autoApproveApplications: companyInfo.autoApproveApplications ? 1 : 0
          }

          console.log(hcPayload);

          Api.post(
            `hiringclients`,
            hcPayload,
            token)
            .then(response => {
              const { success, data } = response.data;
              hcId = data.hcId;
              if (success) {
                // user updated
                dispatch(setHCListSuccess(success));
                callback(null);
              } else {
                dispatch(setHCListError(response.data.description));
                callback(response.data.description);
              }
            })
            .catch(error => {
              dispatch(setHCListError(errorConnection));
              callback(null);
            });

        },
        (callback) => {
          /* step 2: uploading the logo */

          const fileInput = document.getElementById('companyLogo');
          const formData = new FormData();
          formData.append('hiringClientId', parseInt(hcId, 10));
          formData.append("logoFile", fileInput.files[0]);

          if (fileInput.files[0]) {
            Api.post(
              `hiringclients/logo`,
              formData,
              token)
              .then(response => {
                const { success, data } = response.data;
                if (success) {
                  // new relation
                  _log('* successful image upload');
                  callback(null);
                } else {
                  // Todo: manage error
                  _log('* error from server', data);
                  dispatch(setHCListError(response.data.description));
                  callback(response.data.description);
                }
              })
              .catch(error => {
                dispatch(setHCListError(errorConnection));
                callback(null);
              });
          }
          else {
            callback(null);
          }

        }
      ],
      (err) => {
        if (err) {
          _log('error ', err);
        } else {
          _log('hc upload completed');
          closeModal(true);
        }

      }
    )
  }
}

export const sendNewHCOld = (serializedHcObj, closeModal) => {
  //export const sendNewHC = (closeModal) => {
  return (dispatch, getState) => {
    const { login, localization, form } = getState();
    const {
      error10001,
      error10003,
      error10004,
      error10005,
      error10006,
      error10007,
      error10008,
      error10011,
      error10013,
      error10014,
      errorDefault,
      errorConnection,
    } = localization.strings.hiringClients.actions;

    const token = login.authToken;
    let method = 'post';
    dispatch(setHCListError(''));

    const {
      CompanyInfoForm,
      ContactForm,
      // OperatorForm
    } = form;
    const hcUserValues = ContactForm.values;
    const { values } = CompanyInfoForm;
    const operatorId = serializedHcObj.operator;
    let payload = {
      name: values.companyName,
      registrationUrl: 'test.website',
      country: 'TestCountry',
      phone: Utils.normalizePhoneNumber(values.phone),
      fax: Utils.normalizePhoneNumber(values.fax),
      address1: values.companyAddress1,
      city: values.city,
      state: values.state,
      zipCode: values.postalCode,
    };

    _log('payload ', payload);

    if (values.parentHC) {
      payload.parentHiringClientId = values.parentHC;
    }

    return Api[method](
      `hiringclients`,
      payload,
      token)
      .then(response => {

        const { success, data } = response.data;
        const { hcId } = data;
        let errorMsg = '';
        if (success) {
          dispatch(fetchHiringClients());
          if (ContactForm.values.tab === 'create') {

            const {
              error10001,
              error10003,
              error10004,
              error10005,
              error10006,
              error10007,
              error10008,
              error10011,
              error10013,
              error10014,
              errorDefault,
              errorConnection,
            } = localization.strings.users.actions;
            let hcUserPayload = {
              roleId: '3',
              firstName: hcUserValues.firstName,
              lastName: hcUserValues.lastName,
              mail: hcUserValues.email,
              password: hcUserValues.password,
              phone: Utils.normalizePhoneNumber(hcUserValues.phone),
              mustRenewPass: (hcUserValues.changeuponlogin ? 1 : 0) + '',
              timeZoneId: (parseInt(hcUserValues.timezone, 10) || 0) + '',
            };

            Api.post(
              `users/profile`,
              hcUserPayload,
              token)
              .then(response => {
                const { success, data } = response.data;
                const { userId } = data;
                let errorMsg = '';
                if (success) {
                  // new user created
                  dispatch(assignUserToHC(hcId, userId, closeModal, 'hiringclient'));
                }
                else {
                  switch (data.errorCode) {
                    case 10000:
                    case 10001:
                      errorMsg = error10001;
                      break;
                    case 10003:
                      errorMsg = error10003;
                      break;
                    case 10004:
                      errorMsg = error10004;
                      break;
                    case 10005:
                      errorMsg = error10005;
                      break;
                    case 10006:
                      errorMsg = error10006;
                      break;
                    case 10007:
                      errorMsg = error10007;
                      break;
                    case 10008:
                      errorMsg = error10008;
                      break;
                    case 10011:
                      errorMsg = error10011;
                      break;
                    case 10013:
                      errorMsg = error10013;
                      break;
                    case 10014:
                      errorMsg = error10014;
                      break;
                    default:
                      errorMsg = errorDefault;
                      break;
                  }
                  dispatch(setHCListError(errorMsg));
                }
              })
              .catch(error => {
                dispatch(setHCListError(errorConnection));
              });
          }
          else {
            // admin is not creating a new hcUser
            const hcUserId = hcUserValues.hcUser;
            dispatch(assignUserToHC(hcId, hcUserId, closeModal, 'hiringclient'));
          }
          dispatch(assignUserToHC(hcId, operatorId, closeModal, 'operator'));

        }
        else {
          switch (data.errorCode) {
            case 10000:
            case 10001:
              errorMsg = error10001;
              break;
            case 10003:
              errorMsg = error10003;
              break;
            case 10004:
              errorMsg = error10004;
              break;
            case 10005:
              errorMsg = error10005;
              break;
            case 10006:
              errorMsg = error10006;
              break;
            case 10007:
              errorMsg = error10007;
              break;
            case 10008:
              errorMsg = error10008;
              break;
            case 10011:
              errorMsg = error10011;
              break;
            case 10013:
              errorMsg = error10013;
              break;
            case 10014:
              errorMsg = error10014;
              break;
            default:
              errorMsg = errorDefault;
              break;
          }
          dispatch(setHCListError(errorMsg));
        }
      })
      .catch(error => {
        dispatch(setHCListError(errorConnection));
      });
  };

};

export const assignUserToHC = (hiringClientId, userId, closeModal, userType) => {
  return (dispatch, getState) => {
    const { login, localization } = getState();
    const {
      error10001,
      error10003,
      error10004,
      error10005,
      error10006,
      error10007,
      error10008,
      error10011,
      error10013,
      error10014,
      errorDefault,
      errorConnection,
    } = localization.strings.hiringClients.actions;
    let associatingAction;

    switch (userType) {
      case 'operator':
        associatingAction = setAssociatingOperator;
        break;
      case 'hiringclient':
        associatingAction = setAssociatingHCUser;
        break;
      default:
        break;
    }

    if (associatingAction) {
      dispatch(associatingAction(true));
    }

    const token = login.authToken;
    let method = 'post';
    dispatch(setHCListError(''));

    let payload = {
      hiringClientId,
      userId
    };

    return Api[method](
      `hiringclients/userrelation`,
      payload,
      token)
      .then(response => {
        const { success, data } = response.data;
        let errorMsg = '';
        if (success) {
          if (userType) {
            const { associatingHCUser, associatingOperator } = getState().hc;
            if (userType === 'operator' && !associatingHCUser) {
              closeModal();
            }
            else {
              if (userType === 'hiringclient' && !associatingOperator) {
                closeModal();
              }
            }
            dispatch(associatingAction(false));
          }
        }
        else {
          switch (data.errorCode) {
            case 10000:
            case 10001:
              errorMsg = error10001;
              break;
            case 10003:
              errorMsg = error10003;
              break;
            case 10004:
              errorMsg = error10004;
              break;
            case 10005:
              errorMsg = error10005;
              break;
            case 10006:
              errorMsg = error10006;
              break;
            case 10007:
              errorMsg = error10007;
              break;
            case 10008:
              errorMsg = error10008;
              break;
            case 10011:
              errorMsg = error10011;
              break;
            case 10013:
              errorMsg = error10013;
              break;
            case 10014:
              errorMsg = error10014;
              break;
            default:
              errorMsg = errorDefault;
              break;
          }
          dispatch(setHCListError(errorMsg));
        }
      })
      .catch(error => {
        dispatch(setHCListError(errorConnection));
      });
  };
};

const _log = (msg, data = ' ') => {
  const isDev = true;
  if (isDev) {
    console.log(msg, data)
  }
}

export const assignHCUser = (userId, hiringClientId) => {
  return (dispatch, getState) => {
    const { authToken } = getState().login;
    Api.post(`hiringclients/userrelation`, { userId, hiringClientId }, authToken).then((response) => {
      _log(response);
    })
  }
}

export const fetchHolderArchive = (holderId, status, callback) => {
  return (dispatch, getState) => {
    const { authToken } = getState().login;
    Api.post(`cf/holders/archive`, { holderId, status }, authToken).then((response) => {
      _log(response);
      if (callback) callback(true);
    })
  }
}