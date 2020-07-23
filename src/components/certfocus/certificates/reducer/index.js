import * as types from '../actions/types';
import { element } from 'prop-types';

const INITIAL_STATE = {
  error: '',
  list: [],
  fetching: false,
  showModal: false,
  requirementSets: [],
  attachments: [],
  endorsements: [],
  certificatesList: [],
  certificatesAmount: 0,
  usersList: [],
  projectInsured: null
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case types.SET_REQUIREMENT_SETS_ERROR:
      return { ...state, error: action.payload.error, fetching: false };

    case types.SET_REQUIREMENT_SETS:
      return { ...state, requirementSets: action.payload.requirementSets, fetching: false };

    case types.SET_ATTACHMENTS:
      return { ...state, attachments: action.payload.attachments, fetching: false };

    case types.SET_ENDORSEMENTS:
      return { ...state, endorsements: action.payload.endorsements, fetching: false };

    case types.SET_FETCHING_DOCUMENTS:
      return { ...state, fetching: action.isFetching };

    case types.SET_DOCUMENTS_ERROR:
      return { ...state, error: action.payload.error, fetching: false };

    case types.SET_DOCUMENTS_LIST:
      return { ...state, list: action.payload.list, fetching: false };

    case types.SET_FETCH_CERTIFICATES_SUCCESS:
      return { ...state, certificatesList: action.payload, certificatesAmount: action.payload.length, fetching: false };

    case types.SET_FETCHING_CERTIFICATES:
      return { ...state, fetching: true };

    case types.TOGGLE_PROCEDURE_EMAIL:
      let listProcedure = state.certificatesList.map(element => {
        if (element.CertificateID == action.payload.CertificateID) {
          element.enableEmailProcedure = !action.payload.enableEmailProcedure;
        }
        return element;
      })
      return { ...state, certificatesList: [...listProcedure] };

    case types.TOGGLE_INSURED_EMAIL:
      let listInsured = state.certificatesList.map(element => {
        if (element.CertificateID == action.payload.CertificateID) {
          element.enableEmailInsured = !action.payload.enableEmailInsured;
        }
        return element;
      })
      return { ...state, certificatesList: [...listInsured] };

    case types.SET_FETCH_USERS_SUCCESS:
      return { ...state, usersList: [...action.payload] };

    case types.SET_FETCH_PROJECTINSURED_SUCCESS:
      return { ...state, projectInsured: { ...action.payload } };


    case types.SET_PROCEDURE_EMAIL:
      let certificatesList_procedure = state.certificatesList.map(element => {
        if (element.CertificateID == action.payload.certificateID && element.DocumentId == action.payload.documentId) {
          element.EmailProcedure = action.payload.emailProcedure;
        }
        return element;
      })
      return { ...state, certificatesList: [...certificatesList_procedure] };

    case types.SET_INSURED_EMAIL:
      let certificatesList_insured = state.certificatesList.map(element => {
        element.EmailInsured = action.payload;
        return element;
      })
      return { ...state, certificatesList: [...certificatesList_insured] };

    case types.SET_FETCH_REJECT_SUCCESS:
      let certificatesList_rejected = state.certificatesList.map(element => {
        element.disabledRejectBtn = true;
        element.disabledOnHoldBtn = false;
        element.isOnHold = false;
        return element;
      })
      return { ...state, certificatesList: [...certificatesList_rejected] };

    case types.SET_FETCH_ON_HOLD_SUCCESS:
      let certificatesList_onHold = state.certificatesList.map(element => {
        element.disabledOnHoldBtn = true;
        element.isOnHold = true;
        element.disabledRejectBtn = true;

        return element;
      })
      return { ...state, certificatesList: [...certificatesList_onHold] };

    case types.SET_FETCH_REMOVE_ON_HOLD_SUCCESS:
      let certificatesList_removeonHold = state.certificatesList.map(element => {
        element.disabledOnHoldBtn = false;
        element.isOnHold = true;
        element.disabledRejectBtn = false;

        return element;
      })
      return { ...state, certificatesList: [...certificatesList_removeonHold] };

    case types.TOGGLE_PROCEDURE_EMAIL_BTN:
      let certificatesList_procedureEmail = state.certificatesList.map(element => {
        if (element.CertificateID == action.payload.certificateId) {
          element.disabledEmailProcedureBtn = action.payload.disable;
        }
        return element;
      })
      return { ...state, certificatesList: [...certificatesList_procedureEmail] };

    default:
      return state;
  }
}
