import * as types from './types';
import Api from '../../../lib/api';
import draftToHtml from 'draftjs-to-html'
import { convertToRaw } from 'draft-js';
import Utils from '../../../lib/utils';


export const setMailHiringClientId = (hiringClientId) => {
  return {
    type: types.SET_MAIL_HC_ID,
    hiringClientId
  };
};

export const setMailTemplate = (templateId, templates) => {
  let template
  for (let i=0; i<templates.length; i++) {
    if (Number(templateId) === templates[i].id) {
      template = templates[i]
    }
  }
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
    type: types.SET_MAIL_TEMPLATE,
    template,
    subject: template.subject

  };
};

export const setMailEditorState = (editorState, text) => {
  let condText, condHtml
  if (!text) {
    condText = editorState.getCurrentContent().getPlainText();
    condHtml = draftToHtml(convertToRaw(editorState.getCurrentContent()));
  } else {
    condText = text
    let strippedHtml = draftToHtml(JSON.parse(text))
    condHtml = Utils.reconstructHTML(strippedHtml)
    
  }
  return {
    type: types.SET_MAIL_EDITOR_STATE,
    editorState,
    html: condHtml,
    text: condText
  };
};

export const setMailSubject = (subject) => {
  return {
    type: types.SET_MAIL_SUBJECT,
    subject
  };
};

/* Recipients Support */
export const setMailRecipeints = (recipients) => {
  return {
    type: types.SET_MAIL_RECIPIENTS,
    recipients
  };
};
export const setPossibleRecipeints = (possibleRecipients) => {
  return {
    type: types.SET_MAIL_POSSIBLE_RECIPIENTS,
    possibleRecipients
  };
};
export const fetchPossibleRecipeints = (hiringClientId, subcontractorId) => {
  return (dispatch, getState) => {
    const token = getState().login.authToken;
    dispatch(setPossibleRecipeints([]));
    return Api.get(
      `users/brief?hiringClientId=${hiringClientId}&subcontractorId=${subcontractorId}`,
      token
    ).then(response => {
      const {success, users } = response.data;
      //console.log(users);
      if (success && users) {
        dispatch(setPossibleRecipeints(users || []));
      }
    })
    .catch(error => {
      console.log(error);
    });
  };
}

/* TASK SUPPORT*/
export const setMailPossibleProjects = (possibleProjects) => {
  return {
    type: types.SET_MAIL_POSSIBLE_PROJECTS,
    payload: possibleProjects,
  };
};
export const setMailPossibleSubcontractors = (possibleSubcontractors) => {
  return {
    type: types.SET_MAIL_POSSIBLE_SC,
    possibleSubcontractors
  };
};
export const setMailSubcontractorId = (subcontractorId) => {
  return {
    type: types.SET_MAIL_SC,
    subcontractorId
  };
};
export const setMailDueDate = (dueDate) => {
  return {
    type: types.SET_MAIL_DUE_DATE,
    dueDate
  };
};
export const setMailTaskDetail = (taskDetail) => {
  return {
    type: types.SET_MAIL_TASK_DETAIL,
    taskDetail
  };
};
export const fetchPossibleSubcontractors = (hiringClientId) => {
  return (dispatch, getState) => {
    const token = getState().login.authToken;
    dispatch(setMailPossibleSubcontractors([]));

    return Api.get(
      `subcontractors/brief?hiringClientId=${hiringClientId}`,
      token
    ).then(response => {
      const {success, data } = response.data;
      //console.log(data);
      if (success && data) {
        dispatch(setMailPossibleSubcontractors(data || []));
      }
    })
    .catch(error => {
      console.log(error);
    });
  };
}

/* SEND MAIL SUPPORT */
export const setSendingMail = (sendingMail) => {
  return {
    type: types.SET_SENDING_MAIL,
    sendingMail
  };
};
export const setMailSuccessMessage = (successMsg) => {
  return {
    type: types.SET_MAIL_SUCCESS_MSG,
    successMsg
  };
};
export const setMailErrorMessage = (errorMsg) => {
  return {
    type: types.SET_MAIL_ERROR_MSG,
    errorMsg
  };
};
export const sendMail = (payload) => {
  return (dispatch, getState) => {
    const token = getState().login.authToken;

    dispatch(setSendingMail(true));
    dispatch(setMailSuccessMessage(null));
    dispatch(setMailErrorMessage(null));

    return Api.post(
      `communications/emails/sender`,
      payload,
      token
    ).then(response => {
      //console.log(response.data);
      const { success } = response.data;
      if (success) {
        dispatch(setMailSuccessMessage("Mail sent successfully!"));
      } else {
        dispatch(setMailErrorMessage("There was an error sending this mail"));
      }
      dispatch(setSendingMail(false));
    })
    .catch(error => {
      console.log(error);
      dispatch(setMailErrorMessage("There was an error sending this mail"));
      dispatch(setSendingMail(false));
    });
  };
}

/* Get premade E-mail Templates */

export const setTotalAmountOfTemplates = (TemplatesLength) => {
  return {
    type: types.SET_TOTAL_AMOUNT_OF_TEMPLATES,
    TemplatesLength
  };
};

// export const setEmailTemplates = (emailTemplates) => {
//   return {
//     type: types.SET_MAIL_TEMPLATES,
//     emailTemplates
//   };
// };


export const fetchPossibleProjects = (holderId) => {
  return (dispatch, getState) => {
    const token = getState().login.authToken;
    // dispatch(setMailPossibleSubcontractors([]));

    return Api.get(
      `cf/projects?holderId=${holderId}&archived=0&orderBy=name&orderDirection=ASC`,
      token
    ).then(response => {
      const {success, data } = response.data;
      console.log('fetch projects: ', data);

      //console.log(data);
      if (success && data) {
        dispatch(setMailPossibleProjects(data || []));
      }
    })
      .catch(error => {
        console.log(error);
      });
  };
}