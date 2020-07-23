import * as types from './types';
import Api from '../../../../lib/api';

export const setTemplatesList = (list) => {
  return {
    type: types.SET_TEMPLATES_LIST,
    list
  };
};

export const setTemplate = (id) => {
  return (dispatch, getState)=> {
    dispatch({
      type: types.SET_CURRENT_TEMPLATE,
      currentTemplate: getState().templates.list[id]
    })
  };
};

export const setTemplatesListError = (error) => {
  return {
    type: types.SET_TEMPLATES_LIST_ERROR,
    error
  };
};

export const setFetchingTemplates = (isFetching) => {
  return {
    type: types.SET_FETCHING_TEMPLATES,
    isFetching
  };
};

export const setTotalAmountOfTemplates = (templatesLength) => {
  return {
    type: types.SET_TOTAL_AMOUNT_OF_TEMPLATES,
    templatesLength
  };
};

export const setPossibleCommTypes = (communicationTypesPossibleValues) => {
  return {
    type: types.SET_POSSIBLE_COMM_TYPES,
    communicationTypesPossibleValues
  };
};

export const setPossibleActivities = (templateActivitiesPossibleValues) => {
  return {
    type: types.SET_POSSIBLE_ACTIVITIES,
    templateActivitiesPossibleValues
  };
};

export const fetchTemplates = (queryParams) => {
  return (dispatch, getState) => {
    const token = getState().login.authToken;
    let urlParameters = '';

    dispatch(setFetchingTemplates(true));
    dispatch(setTotalAmountOfTemplates(0));
    dispatch(setTemplatesList([]));
    dispatch(setPossibleCommTypes([]));
    dispatch(setPossibleActivities([]));

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

    queryParams.pageSize = getState().templates.templatesPerPage;
    urlParameters = `?${Object.keys(queryParams).map(i => `${i}=${queryParams[i]}`).join('&')}`;
    return Api.get(`communications/templates${urlParameters}`, token)
    .then(response => {
      const { success, data } = response.data;
      //console.log(data);
      if(success) {
        dispatch(setTotalAmountOfTemplates(data.templatesList.totalCount));
        dispatch(setTemplatesList(data.templatesList.templates));
        dispatch(setPossibleCommTypes(data.communicationTypesPossibleValues));
        dispatch(setPossibleActivities(data.templateActivitiesPossibleValues));
      }
      else {
        let errorMsg = '';
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
          case 10011:
            errorMsg = 'Error: your current template is disabled. Please, contact an admin to enable this account and login again to continue.';
            break;
          default:
            errorMsg = '';
            break;
        }
        dispatch(setTemplatesListError(errorMsg));
      }
      dispatch(setFetchingTemplates(false));
    })
    .catch(error => {
      console.log(error)
      dispatch(setTemplatesListError('Connection error - Please, check your Internet service.'));
    });
  };
};
