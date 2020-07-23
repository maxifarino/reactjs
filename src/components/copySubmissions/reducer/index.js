import * as types from '../actions/types';

const INITIAL_STATE = {
    hiringClients: [],
    forms: [],
    formSubmissions: [],
    fetchingTable: false,
    subContractorSelected: null,
    formIdSelected: null,
    formIdIncomplete: null,
    hiringClientId: null,
    showMessageSuccess:false
};

export default (state = INITIAL_STATE, action) => {

    switch (action.type) {

        case types.SET_CERTFOCUS_HIRING_CLIENT_SUCCESS:
            return { ...state, hiringClients: [...action.payload] };

        case types.SET_CERTFOCUS_FORMS_SUCCESS:
            return { ...state, forms: [...action.payload] };

        case types.SET_CERTFOCUS_SUBMISSIONS_FORMS_SUCCESS:
            return { ...state, formSubmissions: [...action.payload] };

        case types.SET_CERTFOCUS_FETCHING_TABLE:
            return { ...state, fetchingTable: action.payload };

        case types.SET_CERTFOCUS_CLEAR_FORM_SUBMISSION:
            return { ...state, formSubmissions: [] };

        case types.SET_CERTFOCUS_SUBCONTRACTOR_SELECTED:
            return {
                ...state, subContractorSelected: action.payload.subcontractorID,
                formIdSelected: action.payload.formId, hiringClients: [], formSubmissions: [],
                formIdIncomplete: action.payload.formIdIncomplete,
                hiringClientId: action.payload.hiringClientId
            };

        default:
            return state;
    }
}

