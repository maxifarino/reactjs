import * as types from './../actions/types';

const INITIAL_STATE = {
  deficiences: [],
  showAll: false,
  showButtonConfirmAll: true,
  deficiencesList: null
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case types.SET_SHOW_ALL:      
      return { ...state, showAll: action.payload.show };

    case types.SET_CONFIRM_ALL:
      let list = [...state.deficiencesList.map(element => {
        if (element.status == null) {
          element.status = 'confirmed'
        }
        return element;
      })];

      return {
        ...state,
        deficiencesList: [...list]
      };

    case types.SET_WAIVE_ALL:
      return {
        ...state,
        deficiencesList: [...state.deficiencesList.map(element => {
          if (element.status == null) {
            element.status = 'waived'
          }
          return element;
        })]
      };

    case types.SET_CONFIRM_BY_ID:
      return {
        ...state,
        deficiencesList: [...state.deficiencesList.map(element => {
          if (action.payload == element.id) {
            element.status = 'confirmed'
          }
          return element;
        })]
      };

    case types.SET_WAIVE_BY_ID:
      return {
        ...state,
        deficiencesList: [...state.deficiencesList.map(element => {
          if (action.payload == element.id) {
            element.status = 'waived'
          }
          return element;
        })]
      };

    case types.SET_UNDO_BY_ID:
      return {
        ...state,
        deficiencesList: [...state.deficiencesList.map(element => {
          if (action.payload == element.id) {
            element.status = null
          }
          return element;
        })]
      };

    case types.SET_FETCH_DEFICIENCES_SUCCESS:
      return { ...state, deficiencesList: action.payload };

    case types.SET_SELECT_ALL_WAIVER:
      return {
        ...state,
        deficiencesList: [...state.deficiencesList.map(element => {
          if (element.ProjectInsuredDeficiencyID != null) {
            element.selected = true;
          }
          return element;
        })]
      };

    case types.SET_UNSELECTED_ALL_WAIVER:
      return {
        ...state,
        deficiencesList: [...state.deficiencesList.map(element => {
          element.selected = false;
          return element;
        })]
      };

    case types.SET_SELECT_WAIVER:
      return {
        ...state,
        deficiencesList: [...state.deficiencesList.map(element => {
          if (element.ProjectInsuredDeficiencyID == action.payload) {
            element.selected = true;
          } else {
            element.selected = false;
          }
          return element;
        })]
      };

    case types.SET_SELECT_ALL_CONFIRM:
      return {
        ...state,
        deficiencesList: [...state.deficiencesList.map(element => {
          if (element.id != null && element.status == null) {
            element.selected = true;
          }
          return element;
        })]
      };

    case types.SET_UNSELECTED_ALL_CONFIRM:
      return {
        ...state,
        deficiencesList: [...state.deficiencesList.map(element => {
          element.selected = false;
          return element;
        })]
      };

    default:
      return state;
  }
};
