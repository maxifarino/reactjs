import * as types from './types';
import Api from '../../../../lib/api';

// SETS
export const setContactsListError = (error) => {
  return {
    type: types.SET_CONTACTS_LIST_ERROR,
    payload: error
  };
};

export const setContactsList = (list, totalAmount) => {
  return {
    type: types.SET_CONTACTS_LIST,
    payload: {
      list,
      totalAmount
    }
  };
};

export const setContactTypes = (payload) => {
  return {
    type: types.SET_CONTACTS_TYPES,
    payload,
  }
}

export const setFetchingContacts = () => {
  return {
    type: types.SET_FETCHING_CONTACTS
  };
};

export const setShowModal = (show) => {
  return {
    type: types.SET_SHOW_CONTACTS_MODAL,
    payload: show
  }
}

// FETCHS
export const fetchContacts = (queryParams) => {
  return (dispatch, getState) => {
    const { login: { authToken }, localization } = getState();
    let {
      error10000,
      error10001,
      error10003,
      error10005,
      error10006,
      error10007,
      error10019,
      errorDefault,
      errorConnection,
    } = localization.strings.contacts.errors;

    dispatch(setFetchingContacts());

    const { contactsPerPage } = getState().contacts;

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
        queryParams.pageSize = contactsPerPage;
      }
    }
    else {
      queryParams = {
        pageNumber: 1,
        pageSize: contactsPerPage
      };
    }

    const urlQuery = 'cf/contacts';
    const urlParameters = `?${Object.keys(queryParams).map(i => `${i}=${queryParams[i]}`).join('&')}`;
    Api.get(`${urlQuery}${urlParameters}`, authToken)
      .then(response => {
        const { data, success } = response.data;
        let errorMsg = '';
        if(success) {
          dispatch(setContactsList(data.contacts, data.totalCount));
          dispatch(setContactTypes(data.contactsTypesPossibleValues));
        } else {
          dispatch(setContactTypes(data.contactsTypesPossibleValues));
          if (data.description) {
            errorMsg = data.description;
          } else {
            switch(data.errorCode) {
              case 10000:
                errorMsg = error10000;
                break;
              case 10001:
                errorMsg = error10001;
                break;
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
              case 10019:
                errorMsg = error10019;
                break;
              default:
                errorMsg = errorDefault;
                break;
            }
          }

          dispatch(setContactsListError(errorMsg));
        }
      })
      .catch(() => {
        dispatch(setContactsListError(errorConnection));
      });
  };
};


/* POST CONTACT */
export const setPostContactError = (error) => {
  return {
    type: types.SET_POST_CONTACT_ERROR,
    payload: error
  };
};
export const postContact = (contactPayload, callback) => {
  return (dispatch, getState) => {
    const { login: { authToken }, localization } = getState();
    const { errorConnection, errorDefault } = localization.strings.hiringClients.actions;

    dispatch(setPostContactError(null));

    return Api.post('cf/contacts', contactPayload, authToken)
    .then(response => {
      const { success, data } = response.data;

      if (success) {
        // If the contact is being edited, don't link it to the holder
        if (contactPayload.contactId) {
          if (callback) callback(data);
        } else {
          let linkPayload = { contactId: data.cId };
          let urlQuery = '';

          if (contactPayload.holderId) {
            linkPayload.holderId = contactPayload.holderId;
            urlQuery = 'cf/contacts/holderrelation';
          } else if (contactPayload.insuredId) {
            linkPayload.insuredId = contactPayload.insuredId;
            urlQuery = 'cf/contacts/insuredrelation';
          }

          Api.post(urlQuery, linkPayload, authToken)
          .then(linkResponse => {
            const { success } = linkResponse.data;
            if (success) {
              if (callback) callback(true);
            } else {
              dispatch(setPostContactError(errorDefault));
              if (callback) callback(null);
            }
          })
          .catch(() => {
            dispatch(setPostContactError(errorConnection));
            if (callback) callback(null);
          });
        }
      } else {
        console.log('* error from server', data);
        dispatch(setPostContactError(errorDefault));
        if (callback) callback(null);
      }
    })
    .catch(error => {
      console.log('error', error);
      dispatch(setPostContactError(errorConnection));
      if (callback) callback(null);
    });
  }
}
