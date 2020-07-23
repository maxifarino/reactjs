import * as types from '../actions/types';

const initialState = {
  showModal: false,
  documentId: null,
  documentUrl: null,
  project: {},
  holder: {},
  projectInsuredId: null,
  reqSetId: null,
  deficiencies: {},
  fetching: {
    deficiencies: false,
  },
  deficienciesError: '',
  deficiencyUpdateError: [],
  deficiencyUpdateFetching: [],
  deficiencyUpdate: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    // Deficiencies to populate the Def. Viewer
    case types.SET_DEFICIENCY_FETCHING:
      return { ...state, deficiencies: {}, deficienciesError: '', fetching: { ...state.fetching, deficiencies: true } };
    case types.SET_DEFICIENCY_ERROR:
      return { ...state, deficienciesError: action.payload, fetching: { ...state.fetching, deficiencies: false }};
    case types.SET_DEFICIENCY_SUCCESS:
      return { 
        ...state,
        deficiencies: action.payload.data.deficiencies,
        holder: action.payload.data.holder,
        project: action.payload.data.project,
        projectInsuredId: action.payload.data.projectInsuredId,
        reqSetId: action.payload.data.reqSetId,
        documentId: action.payload.data.documentId,
        documentUrl: action.payload.data.url,
        fetching: { ...state.fetching, deficiencies: false }
      };
    case types.SET_DEFICIENCY_UPDATE_FETCHING:
      return { ...state,
        deficiencyUpdateFetching: [ ...state.deficiencyUpdateFetching, action.payload ],
        deficiencyUpdateError: state.deficiencyUpdateError.filter(deficiency => deficiency.id !== action.payload),
      };
    case types.SET_DEFICIENCY_UPDATE_ERROR:
      return { ...state,
        deficiencyUpdateFetching: state.deficiencyUpdateFetching.filter(deficiency => deficiency !== action.payload.id),
        deficiencyUpdateError: [ ...state.deficiencyUpdateError, { id: action.payload.id, error: action.payload.error }],
      };
    case types.SET_DEFICIENCY_UPDATE_SUCCESS:
      return { ...state,
        deficiencyUpdateFetching: state.deficiencyUpdateFetching.filter(deficiency => deficiency !== action.payload.id),
        deficiencyUpdate: [ ...state.deficiencyUpdate, { id: action.payload.id, status: action.payload.status }],
      };

    default:
      return state;
  }
};