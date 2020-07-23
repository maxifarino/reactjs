import * as types from '../actions/types';

const INITIAL_STATE = {
  fetchingNotes: false,
  notes: [],
  totalAmountOfNotes: 0,
  notesPerPage: 10,
  noteTypesPossibleValues: [],
  notePriorityPossibleValues: [],
  rolesPossibleValues: [],
  cfRolesPossibleValues: [],
  contactsTypesPossibleValues: [],
  statusPossibleValues: [],
  error: '',
  savingNoteError: '',
};

export default (state = INITIAL_STATE, action) => {
  switch(action.type) {
    case types.SET_CERTFOCUS_NOTES_ERROR:
      return { ...state, error: action.payload, fetchingNotes: false };
    case types.SET_CERTFOCUS_FETCHING_NOTES:
      return { ...state, fetchingNotes: true, totalAmountOfNotes: 0, error: '', notes: [] };
    case types.SET_CERTFOCUS_NOTES_LIST:
      const { totalCount, tasks: {
          tasksList,
          TaskTypesPossibleValues,
          PriorityPossibleValues,
          ContactsTypesPossibleValues,
          StatusPossibleValues,
        },
      } = action.payload;

      return {
        ...state,
        fetchingNotes: false,
        totalAmountOfTasks: totalCount,
        notes: tasksList,
        noteTypesPossibleValues: TaskTypesPossibleValues,
        notePriorityPossibleValues: PriorityPossibleValues,
        contactsTypesPossibleValues: ContactsTypesPossibleValues,
        statusPossibleValues: StatusPossibleValues,
      };
    case types.SET_CERTFOCUS_NOTES_ROLES_POSSIBLE_VALUES:
      return { ...state, cfRolesPossibleValues: action.payload.CFRoles };
    case types.SET_CERTFOCUS_SAVING_NOTE_ERROR:
      return { ...state, savingNoteError: action.payload };
    default:
      return state;
  }
};
