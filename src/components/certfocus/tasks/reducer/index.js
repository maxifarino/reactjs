import * as types from '../actions/types';

const INITIAL_STATE = {
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
  error: '',
  savingTaskError: '',
};

export default (state = INITIAL_STATE, action) => {
  switch(action.type) {
    case types.SET_CERTFOCUS_TASKS_ERROR:
      return { ...state, error: action.payload, fetchingTasks: false };
    case types.SET_CERTFOCUS_FETCHING_TASKS:
      return { ...state, fetchingTasks: true, totalAmountOfTasks: 0, error: '', tasks: [] };
    case types.SET_CERTFOCUS_TASKS_LIST:
      const {
        totalCount,
        totalUrgentTasks,
        unassignedTasks,
        urgentUnassignedTasks,
        tasks: {
          tasksList,
          TaskTypesPossibleValues,
          PriorityPossibleValues,
          ContactsTypesPossibleValues,
          StatusPossibleValues,
        },
      } = action.payload;

      return {
        ...state,
        fetchingTasks: false,
        totalAmountOfTasks: totalCount,
        totalUrgentTasks: totalUrgentTasks,
        totalUnassigned: unassignedTasks,
        totalUrgentUnassignedTasks: urgentUnassignedTasks,
        tasks: tasksList,
        taskTypesPossibleValues: TaskTypesPossibleValues,
        taskPriorityPossibleValues: PriorityPossibleValues,
        contactsTypesPossibleValues: ContactsTypesPossibleValues,
        statusPossibleValues: StatusPossibleValues,
      };
    case types.SET_CERTFOCUS_ROLES_POSSIBLE_VALUES:
      return { ...state, cfRolesPossibleValues: action.payload.CFRoles };
    case types.SET_CERTFOCUS_SAVING_TASK_ERROR:
      return { ...state, savingTaskError: action.payload };
    default:
      return state;
  }
};
