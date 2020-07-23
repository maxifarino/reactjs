import * as types from '../actions/types';

const INITIAL_STATE = {
  errorInsured: '',
  fetching: false,
  insuredData: {},
  fetchingTags: [],
  fetchingAllTags: false,
  errorTags: '',
  tags: {},
  tagSelected: null,
  showModalAddTask: false,
  showModalAddNote: false,
  defaultValueContactType: "",
  holderSelected: null
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case types.SET_INSURED_DETAILS_ERROR:
      return { ...state, errorInsured: action.payload, fetching: false };
    case types.SET_INSURED_DETAILS_FETCHING:
      return { ...state, insuredData: {}, fetching: true, errorInsured: '' };
    case types.SET_INSURED_DETAILS:
      return { ...state, insuredData: action.payload, fetching: false };
    case types.SET_EDIT_TAG_FETCHING:
      return { ...state, fetchingTags: [...state.fetchingTags, action.payload] };
    case types.SET_EDIT_TAG_SUCCESS:
      return {
        ...state,
        fetchingTags: state.fetchingTags.filter(el => el !== action.payload.Id),
        tags: {
          ...state.tags,
          assignedTags: {
            ...state.tags.assignedTags,
            data: [...state.tags.assignedTags.data, action.payload],
          },
        },
      };
    case types.SET_DELETE_TAG_SUCCESS:
      console.log(state.tags.assignedTags.data.filter(tag => tag.Id !== action.payload));
      return {
        ...state,
        fetchingTags: state.fetchingTags.filter(el => el !== action.payload),
        tags: {
          ...state.tags,
          assignedTags: {
            ...state.tags.assignedTags,
            data: state.tags.assignedTags.data.filter(tag => tag.Id !== action.payload),
          },
        }
      };
    case types.SET_EDIT_TAG_ERROR:
      return {
        ...state,
        fetchingTags: state.fetchingTags.filter(el => el !== action.payload),
      };
    case types.SET_INSURED_TAGS_ERROR:
      return { ...state, errorTags: action.payload, fetchingAllTags: false };
    case types.SET_INSURED_TAGS_FETCHING:
      return { ...state, fetchingAllTags: true, errorTags: '', tags: [] };
    case types.SET_INSURED_TAGS:
      return { ...state, tags: action.payload, fetchingAllTags: false };

    case types.SET_SELECT_TAG_TAB:
      return { ...state, tagSelected: action.payload.tab, showModalAddTask: action.payload.showModalAddTask, showModalAddNote: action.payload.showModalAddNote, defaultValueContactType: action.payload.defaultValueContactType };

    case types.SET_HIDE_ADD_TASK:
      return { ...state, showModalAddTask: false };

    case types.SET_HIDE_ADD_NOTE:
      return { ...state, showModalAddNote: false };

    case types.SET_HOLDER_SELECTED: {      
      return { ...state, holderSelected: action.payload };
    }

    default:
      return state;
  }
};