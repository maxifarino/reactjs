import * as types from './types';
import Api from '../../../lib/api';

export const clearForm = () => {
  return (dispatch, getState) => {
    dispatch({type: types.CLEAR_LINK_FORM });
  }
}

export const getFormAndValuesFromSubmissionId = (submissionId) => {
  return (dispatch, getState) => {
    dispatch({type: types.SET_LINK_RETRIEVING});
    const loginState = getState().login;
    // get the saved form id using the link hash
    getSavedForm (submissionId, null, loginState, function(savedFormRes){
      const savedForm = savedFormRes.data.savedForms && savedFormRes.data.savedForms.length > 0? savedFormRes.data.savedForms[0]:null;
      if (savedFormRes.success && savedForm) {
        // an incomplete saved form was found, now get the form template
        getForm (savedForm.formId, loginState, function(formRes){
          const form = formRes.data.forms && formRes.data.forms.length > 0? formRes.data.forms[0]:null;
          if (formRes.success && form) {
            // a form was found, lets get the saved values if any
            getFormFieldValues(savedForm.id, loginState, function(valuesRes){
              let savedValues = [];
              if (valuesRes.success && valuesRes.data.totalCount > 0) {
                savedValues = valuesRes.data.savedValues;
              }
              dispatch({type: types.ASSIGN_LINK_SC, form, subcontractorId: savedForm.subcontractorID});
              dispatch({type: types.ASSIGN_LINK_FORM, form, savedFormId: savedForm.id, savedValues, savedFormStatus: savedForm.status});
            });

          } else {
            // no form was found with that id, maybe the form was deleted (very unlikely error)
            dispatch({type: types.SET_LINK_ERROR, error: 'Seems like the form is unavailable, check that the link is correct', redirect:true});
          }

        });

      } else {
        // no incomplete form was retrieved
        dispatch({type: types.SET_LINK_ERROR, error: 'Seems like the form is unavailable, check that the link is correct', redirect:true });
      }
    });
  }
}

export const getFormAndValuesFromLink = (linkHash) => {
  return (dispatch, getState) => {
    dispatch({type: types.SET_LINK_RETRIEVING});
    const loginState = getState().login;
    // get the saved form id using the link hash
    getSavedFormIdFromLink(linkHash, loginState, function(idRes){
      if (idRes.success) {
        // saved form id was retrieved, now get the full saved form
        // second parameter must be false when getting only incomplete forms
        getSavedForm (idRes.savedFormId, null, loginState, function(savedFormRes){
          const savedForm = savedFormRes.data.savedForms && savedFormRes.data.savedForms.length > 0? savedFormRes.data.savedForms[0]:null;
          if (savedFormRes.success && savedForm) {
            // an incomplete saved form was found, now get the form template
            getForm (savedForm.formId, loginState, function(formRes){
              const form = formRes.data.forms && formRes.data.forms.length > 0? formRes.data.forms[0]:null;
              if (formRes.success && form) {
                // a form was found, lets get the saved values if any
                getFormFieldValues(savedForm.id, loginState, function(valuesRes){
                  let savedValues = [];
                  if (valuesRes.success && valuesRes.data.totalCount > 0) {
                    savedValues = valuesRes.data.savedValues;
                  }
                  dispatch({type: types.ASSIGN_LINK_SC, form, subcontractorId: idRes.subcontractorId});
                  dispatch({type: types.ASSIGN_LINK_FORM, form, savedFormId: savedForm.id, savedValues, savedFormStatus: savedForm.status});
                });

              } else {
                // no form was found with that id, maybe the form was deleted (very unlikely error)
                dispatch({type: types.SET_LINK_ERROR, error: 'Seems like the form is unavailable, check that the link is correct', redirect:true});
              }

            });

          } else {
            // no incomplete form was retrieved
            dispatch({type: types.SET_LINK_ERROR, error: 'Seems like this form was already submited, or the link is invalid', redirect:true });
          }
        });
      } else {
        // the link didnt have a saved form
        dispatch({type: types.SET_LINK_ERROR, error: 'The link is invalid', redirect:true });
      }

    });
  }
}

const getSavedFormIdFromLink = (linkHash, loginState, callback) => {
  //callback({success: true, savedFormId: linkHash});
  const token = loginState.authToken;
  Api.get(
    `subcontractors/submission?submissionCode=${linkHash}`,
    token
  ).then((data) => {
    callback(data.data);
  })
}

const getSavedForm = (savedFormId, isComplete, loginState, callback) => {
  const token = loginState.authToken;
  const queryParams = {
    savedFormId
  };
  if (isComplete !== null){
    queryParams.isComplete = isComplete;
  }
  const urlParameters = `?${Object.keys(queryParams).map(i => `${i}=${queryParams[i]}`).join('&')}`;

  Api.get(
    `forms/savedforms${urlParameters}`,
    token
  ).then((data) => {
    //console.log(data.data);
    callback(data.data);
  })
}

const getForm = (formId, loginState, callback) => {
  const token = loginState.authToken;

  Api.get(
    `forms?formId=${formId}&justFormData=false`,
    token
  ).then((data) => {
    callback(data.data);
  })
}

const getFormFieldValues = (savedFormId, loginState, callback) => {
  const token = loginState.authToken;
  Api.get(
    `forms/savedformfieldsvalues?savedFormId=${savedFormId}`,
    token
  ).then((data) => {
    callback(data.data);
  })
}

/* SAVE FORM VALUES */
export const saveFormValues = (savedFormId, savedValues, isComplete) => {
  return (dispatch, getState) => {
    dispatch({type: types.SET_LINK_LOADING});
    const loginState = getState().login;

    putFieldValuesRequest(savedFormId, savedValues, loginState, function(valuesRes){
      if (valuesRes.success && valuesRes.data.valuesSaved) {
        if(isComplete) {
          // all values were successfully saved, lets submit the saved form
          markSavedFormAsComplete(savedFormId, loginState, function(completeRes){
            if (completeRes.success && completeRes.data.formUpdated) {
              dispatch({
                type: types.VALUES_SUCCESSFULLY_SAVED,
                successMsg: "The form was successfully submitted. Your prequalification will be reviewed and completed shortly and @HiringClient@ will be notified. No further action is required at this time.",
                savedValues,
                redirect:true
              });

            } else {
              dispatch({ type: types.SET_LINK_ERROR, error: "There was an error submitting the form", redirect:false });
            }
          });

        } else {
          // values saved but the form is not submitted
          dispatch({
            type: types.VALUES_SUCCESSFULLY_SAVED,
            successMsg: "The form was successfully saved",
            savedValues,
            redirect:false
          });
        }

      } else {
        dispatch({ type: types.SET_LINK_ERROR, error: "There was an error saving the values", redirect:false });
      }
    });

  };
}

const putFieldValuesRequest = (savedFormId, savedValues, loginState, callback) => {
  const token = loginState.authToken;
  const body = {
    savedFormId,
    savedValues
  };

  Api.put(
    `forms/savedformfieldsvalues`,
    body,
    token
  ).then((data)=> {
    callback(data.data);
  });

}

const markSavedFormAsComplete = (savedFormId, loginState, callback) => {
  const token = loginState.authToken;
  const body = {
    savedFormId,
    isComplete: "true"
  };

  Api.put(
    `forms/savedforms`,
    body,
    token
  ).then((data)=> {
    callback(data.data);
  });
}
