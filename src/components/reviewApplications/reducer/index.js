import * as types from '../actions/types';

const initialState = {
  error: '',
  list: [],
  total: 0,  
  reviewApplicationsSuccess: '',
  reviewApplicationsError: '',
  itemsPerPage: 10,
  fetching: false,
  hiringClientId: '',
  hcList: [],
  applicationsApprove: null,
  applicationDecline: null,
  showModal: false,
};

export default (state = initialState, action) => {  
  switch (action.type) {    
   
    case types.SET_ADD_REVIEW_APPLICATIONS_SUCCESS:
      return {
        ...state,
        reviewApplicationsSuccess: action.payload.success
      };  

    case types.SET_ADD_REVIEW_APPLICATIONS_ERROR:
      return {
        ...state,
        reviewApplicationsError: action.payload.error
      };

    case types.SET_FETCHING_REVIEW_APPLICATIONS:
      return {
        ...state,
        fetching: action.payload.isFetching
      };
    case types.SET_REVIEW_APPLICATIONS_LIST:
      return {
        ...state,
        list: action.payload.list,
        total: action.payload.total
      };
    case types.SET_REVIEW_APPLICATIONS_LIST_ERROR:
      return {
        ...state,
        reviewApplicationsError: action.payload.error
      };
    case types.SET_REVIEW_APPLICATIONS_HIRING_CLIENT:
      return {
        ...state,
        hcList: action.payload.list,
      };
    case types.SET_REVIEW_APPLICATIONS_HIRING_CLIENT_ERROR:
      return {
        ...state,
        hcError: action.payload.error
      };  

    case types.SET_APPROVE_APPLICATIONS:
      return {
        ...state,
        applicationsApprove: action.payload.data
      };  
    case types.SET_DECLINE_APPLICATIONS:
      return {
        ...state,
        applicationDecline: action.payload.data
      };  
    case types.SET_APPLICATIONS_ERROR:
      return {
        ...state,
        error: action.payload.error
      };    
      case types.SET_SHOW_ANSWERS_MODAL:
        return { 
          ...state, 
          showModal: action.payload 
        }; 

    default:
      return state;
  }
};