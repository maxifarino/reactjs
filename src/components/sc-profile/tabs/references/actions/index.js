import * as types from './types';
import Api from '../../../../../lib/api';

export const setFetchingReferences = (isFetching) => {
  return {
    type: types.SET_FETCHING_REFERENCES,
    isFetching
  };
};

export const setReferences = (references) => {
  return {
    type: types.SET_REFERENCES,
    references
  };
};

export const setReferenceModalData = (payload) => {
  return {
    type: types.SET_REFERENCES_MODAL_DATA,
    payload
  }
}

export const setTotalAmountOfReferences = (referencesLength) => {
  return {
    type: types.SET_TOTAL_AMOUNT_OF_REFERENCES,
    referencesLength
  };
};

export const setReferencesError = (error) => {
  return {
    type: types.SET_REFERENCES_ERROR,
    error
  };
};

export const setModalReferenceData = (payload) => {
  return {
    type: types.SET_MODAL_REFERENCE_DATA_TO_SEND,
    payload
  };
};

export const fetchReferences = (query) => {
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
    } = localization.strings.scProfile.references.actions;
    const token = login.authToken;

    dispatch(setFetchingReferences(true));

    const urlQuery = 'references';
    const urlParameters = `?${Object.keys(query).map(i => `${i}=${query[i]}`).join('&')}`;

    return Api.get(`${urlQuery}${urlParameters}`, token)
      .then(response => {
        const { success, data } = response.data;
        let errorMsg = '';
        if (success) {
          dispatch(setTotalAmountOfReferences(data.totalCount));
          dispatch(setReferenceModalData({
            questions: data.questions,
            referencesTypesPossibleValues: data.referencesTypesPossibleValues,
            submissions: data.submissions
          }));
          dispatch(setReferences(data.references));
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
          dispatch(setReferencesError(errorMsg));
        }
        dispatch(setFetchingReferences(false));
      })
      .catch(error => {
        dispatch(setReferencesError(errorConnection));
        dispatch(setFetchingReferences(false));
      });
  };
};

export const fetchAnswers = (query, closeModal) => {
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
    } = localization.strings.scProfile.references.actions;
    const token = login.authToken;

    const urlQuery = 'references/responses';
    const urlParameters = `?${Object.keys(query).map(i => `${i}=${query[i]}`).join('&')}`;

    return Api.get(`${urlQuery}${urlParameters}`, token)
      .then(response => {
        const { success, data } = response.data;
        let errorMsg = '';
        if (success) {
          dispatch(setReferenceModalData({ answers: data }));
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
          dispatch(setReferencesError(errorMsg));
          closeModal();
        }
      })
      .catch(error => {
        dispatch(setReferencesError(errorConnection));
        closeModal();
      });
  };
};

export const saveReference = (closeModal) => {

  return (dispatch, getState) => {
    const { login, localization, references } = getState();
    const { currentReference, referenceInfoTab, questionsTab } = references.referenceModalData;
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
    } = localization.strings.scProfile.references.actions;
    const errors = {
      10001: error10001,
      10003: error10003,
      10004: error10004,
      10005: error10005,
      10006: error10006,
      10007: error10007,
      10008: error10008,
      100011: error10011,
      100013: error10013,
      100014: error10014
    }
    const token = login.authToken;

    dispatch(setReferencesError(''));

    const payload = currentReference && currentReference.id ?
      {
        referenceId: currentReference.id,
        companyName: referenceInfoTab.companyName,
        contactName: referenceInfoTab.contactName,
        contactEmail: referenceInfoTab.contactEmail,
        contactPhone: referenceInfoTab.contactPhone,
      } : {
        ...referenceInfoTab
      };

    const apiFunction = currentReference && currentReference.id ? Api.put : Api.post;

    return apiFunction(
      `references`,
      payload,
      token)
      .then(response => {

        const { success, data } = response.data;
        let errorMsg = '';
        if (success) {
          let referenceId = currentReference && currentReference.id ? currentReference.id : data.referenceId;

          questionsTab.questions.forEach((question) => {
            const responsePayload = {
              referenceId,
              response: question.response || '',
              referenceQuestionId: question.id
            };

            Api.post(
              `references/responses`,
              responsePayload,
              token)
              .then(response => {
                const { success, data } = response.data;
                if (success) {

                } else {
                  errorMsg = errors[data.errorCode] || errorDefault;
                  console.log(data.errorCode);
                  dispatch(setReferencesError(errorMsg));
                }
              })
              .catch(error => {
                console.log(error);
                dispatch(setReferencesError(errorConnection));
              });
          })
        } else {
          errorMsg = errors[data.errorCode] || errorDefault;
          console.log(data.errorCode);
          dispatch(setReferencesError(errorMsg));
        }

        closeModal();
      })
      .catch(error => {
        console.log(error);
        dispatch(setReferencesError(errorConnection));
      });
  };
}