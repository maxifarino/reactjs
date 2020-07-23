import * as types from '../actions/types';

export default function NotesTasksReducer(state = {
  savingTask: false,
  fetchingTasks: false,
  tasks: [],
  totalAmountOfTasks: 0,
  tasksPerPage: 10,
  taskTypesPossibleValues: [],
  taskPriorityPossibleValues: [],
  rolesPossibleValues: [],
  cfRolesPossibleValues: [],
  contactsTypesPossibleValues: [],
  statusPossibleValues: [],
  error: null,
}, action) {
  switch(action.type) {
    case types.SET_TASKS_ERROR:
      return Object.assign({}, state, {
        error: action.error
      });
    case types.SET_SAVING_TASK:
      return Object.assign({}, state, {
        savingTask: action.saving
      });
    case types.SET_FETCHING_TASKS:
      return Object.assign({}, state, {
        fetchingTasks: action.isFetching
      });
    case types.SET_TOTAL_AMOUNT_OF_TASKS:
      return Object.assign({}, state, {
        totalAmountOfTasks: action.total
      });
    case types.SET_TASK_TYPES_POSSIBLE_VALUES:
      return Object.assign({}, state, {
        taskTypesPossibleValues: action.taskTypesPossibleValues
      });
    case types.SET_TASK_PRIORITY_POSSIBLE_VALUES:
      return Object.assign({}, state, {
        taskPriorityPossibleValues: action.taskPriorityPossibleValues
      });
    case types.SET_CONTACTS_TYPES_POSSIBLE_VALUES:
      return Object.assign({}, state, {
        contactsTypesPossibleValues: action.contactsTypesPossibleValues
      });
    case types.SET_STATUS_POSSIBLE_VALUES:
      return Object.assign({}, state, {
        statusPossibleValues: action.statusPossibleValues
      });
    case types.SET_TASKS_LIST:
      return Object.assign({}, state, {
        tasks: action.tasks
      });
    case types.SET_ROLES_POSSIBLE_VALUES:
      return Object.assign({}, state, {
        rolesPossibleValues: action.PQRoles,
        cfRolesPossibleValues: action.CFRoles
      });

    default:
      return state;
  }
};
