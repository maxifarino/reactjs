import * as types from './types';
import Api from '../../../../lib/api';
import draftToHtml from 'draftjs-to-html'
import { convertToRaw } from 'draft-js';
import _ from 'lodash';

export const setFromHC = (condition) => {
  return {
    type: types.FROM_HC,
    hc: condition,
    templateText: null
  };
};


export const setHiringClient = (hiringClientId) => {
  return {
    type: types.SET_TEMPLATE_HIRING_CLIENT,
    hiringClientId
  };
};

export const setTemplateField = (fieldName, fieldValue) => {
  return {
    type: types.SET_TEMPLATE_FIELD,
    fieldValue: fieldValue,
    fieldName: fieldName
  };
};

export const setTemplate = (template) => {
  //console.log(template);
  if (!template) {
    template = {
      id: "",
      templateName: "",
      subject: "",
      bodyHTML:  null,
      bodyText: null,
      templateActivityId: "",
      communicationTypeId: "",
      fromAddress: "",
      ownerId: "",
      templateCreator: ""
    }
  }
  return {
    type: types.SET_TEMPLATE_BUILDER_TEMPLATE,
    template
  };
};

export const setTemplateEditorState = (editorState) => {
  const text = editorState.getCurrentContent().getPlainText();
  const html = draftToHtml(convertToRaw(editorState.getCurrentContent()));
  return {
    type: types.SET_TEMPLATE_EDITOR_STATE,
    editorState,
    html: html,
    text: text
  };
};

/* SAVE TEMPLATE SUPPORT */
export const setSavingTemplate = (savingTemplate) => {
  return {
    type: types.SET_SAVING_TEMPLATE,
    savingTemplate
  };
};
export const setTemplateSuccessMessage = (successMsg) => {
  return {
    type: types.SET_TEMPLATE_SUCCESS_MSG,
    successMsg
  };
};
export const setTemplateErrorMessage = (errorMsg) => {
  return {
    type: types.SET_TEMPLATE_ERROR_MSG,
    errorMsg
  };
};
export const saveTemplate = (payload) => {
  return (dispatch, getState)=>{
    const token = getState().login.authToken;

    dispatch(setSavingTemplate(true));
    dispatch(setTemplateSuccessMessage(null));
    dispatch(setTemplateErrorMessage(null));

    return Api.post(
      'communications/templates',
      payload,
      token
    ).then(response => {
      //console.log(response.data);
      const { success } = response.data;
      if (success) {
        dispatch(setTemplateSuccessMessage("Template saved successfully!"));
      } else {
        dispatch(setTemplateErrorMessage("There was an error saving this template"));
      }
      dispatch(setSavingTemplate(false));
    })
    .catch(error => {
      console.log(error);
      dispatch(setTemplateErrorMessage("There was an error saving this template"));
      dispatch(setSavingTemplate(false));
    });
  };
};

/* Support log modules */
export const setCommPlaceholders = (commPlaceholders) => {
  return {
    type: types.SET_COMM_PLACEHOLDERS,
    commPlaceholders: sortPlaceholders(commPlaceholders)
  };
};
export const fetchCommPlaceholders = (system = 'pq') => {
  return (dispatch, getState) => {
    const token = getState().login.authToken;
    return Api.get(
      `communications/placeholders?system=${system}`,
      token
    ).then(response => {
      const {success, data } = response.data;
      if (success && data) {
        dispatch(setCommPlaceholders(data));
      }
    })
    .catch(error => {
      console.log(error);
    });
  };
}

const sortPlaceholders = (placeholders) => {
  const topSuggestions = [
    'hiring_client_company_name',
    'hiring_client_url',
    'hiring_client_logo',
    'subcontractor_company_name',
    'subcontractor_full_name',
    'url_registration',
    'url_change_pass',
    'url_submit_form',
    'url_complete_form',
  ];

  for (var i = 0; i < placeholders.length; i++) {
    const index = topSuggestions.indexOf(placeholders[i].placeholder);
    placeholders[i].order = index !== -1? index:10;
  }

  if(placeholders.length > 0){
    return _.orderBy(placeholders, ['order', 'placeholder']);
  }
  return placeholders;
}
