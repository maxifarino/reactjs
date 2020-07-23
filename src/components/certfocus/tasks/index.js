import moment from "moment";
import {connect} from 'react-redux';
import {Form} from "react-bootstrap";
import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {withRouter} from 'react-router-dom';
import {Col, Modal} from 'react-bootstrap';

import './Tasks.css';
import Filter from './filter';
import * as actions from './actions';
import Totalizers from "./totalizers";
import * as actionsTypes from './actions/types';

import * as contactActions from '../contacts/actions';
import * as documentsActions from '../documents/actions';
import CFTaskEditorModal from "../modals/CFTaskEditorModal";
import CFTaskDetailModal from "../modals/CFTaskDetailModal";
import * as departmentActions from "../settings/departments/actions";
import * as projectsInsuredsActions from '../project-insureds/actions';

import PTable from '../../common/ptable';
import RolAccess from '../../common/rolAccess';
import * as userActions from '../../users/actions';
import * as commonActions from '../../common/actions';


import Utils from '../../../lib/utils';

class CFTasks extends Component {
  constructor(props) {
    super(props);

    this.state = {
      filter: {
        pageNumber: 1,
      },
      filterBox: {
        searchTerm: '',
        assignedToUserId: this.props.login.userId,
        assignedToRoleId: '',
        dateDue: moment().format('YYYY-MM-DD'),
        dateFrom: moment().format('YYYY-MM-DD'),
        notStatusId: actionsTypes.CERTFOCUS_TASK_FINISHED_ID,
        ContactTypeId: '',
        holderId: this.props.holderId || '',
        insuredId: this.props.insuredId || '',
        projectId: this.props.projectId || '',
      },
      tableOrderActive: 'tasksPriorityId',
      order: {
        dateDue: 'asc',
        assignedToUser: 'asc',
        assignedToRole: 'asc',
        modifyByUser: 'asc',
        tasksPriorityId: 'asc',
        holderName: 'asc',
        projectNumber: 'asc',
        projectName: 'asc',
        type: 'asc',
        modifiedDate: 'desc',
      },
      showFilterBox: true,
      selectedNoteTask: null,
      showNoteEditor: false,
      modal: '',
      currentTask: {},
      currentTaskHistory: [],
      currentProjectHistory: [],
      showTaskDetail: false,
      document: {},
    };
  }

  componentDidMount() {
    const {fromHolderTab, holderId, fromInsuredTab, insuredId} = this.props;

    let preQuery = Utils.getFetchQuery(this.state.tableOrderActive, 1, 'ASC');
    const query = Utils.addSearchFiltersToQuery(preQuery, this.state.filterBox);

    // const query = this.addId(preQuery);

    this.props.actions.fetchRoles();

    // Get filter users dropdown
    const usersQuery = Utils.getFetchQuery('name', 1, 'ASC');

    usersQuery.withoutPagination = true;

    // if (fromHolderTab) {
    //   usersQuery.hiringClientId = holderId;
    // } else if (fromInsuredTab) {
    //   usersQuery.subcontractorId = insuredId;
    // }

    usersQuery.orderBy = 'firstName, lastName';
    usersQuery.associatedOnly = 0;

      this.props.actions.fetchTasks(query);

    this.props.userActions.fetchUsers(usersQuery);

    this.props.departmentActions.getDepartments({
      orderBy: 'name',
      orderDirection: 'ASC',
      archived: 0,
    });
  }

  // componentWillReceiveProps(nextProps) {
  //
  //   if (nextProps.insuredDetails && nextProps.insuredDetails.showModalAddTask) {
  //     this.onCreateNoteTask();
  //   }
  // }

  addId = (preQuery) => {
    const {holderId, insuredId} = this.props;

    let query = preQuery;

    if (holderId) {
      query = {...query, hiringClientId: holderId, typeId: 4};
    } else if (insuredId) {
      query = {...query, subcontractorId: insuredId, typeId: 4};
    }

    return query;
  }

  clickOnColumnHeader = (e, field) => {
    if (field === 'bulkAction' || field === 'done' || field === 'actions' || field === 'description') return;
    // get base query
    const pageNumber = this.state.filter.pageNumber;
    const orderDirection = this.state.order[field] === 'asc' ? 'DESC' : 'ASC'

    // save new active tab and order
    let newState = {
      tableOrderActive: field,
      order: {
        tasksPriorityId: field === 'tasksPriorityId' ? 'asc' : 'desc',
        assignedToUser: field === 'assignedToUser' ? 'asc' : 'desc',
        assignedToRole: field === 'assignedToRole' ? 'asc' : 'desc',
        modifyByUser: field === 'modifyByUser' ? 'asc' : 'desc',
        dueDate: field === 'dueDate' ? 'asc' : 'desc',
        modifiedDate: field === 'modifiedDate' ? 'asc' : 'desc',
        holderName: field === 'holderName' ? 'asc' : 'desc',
        projectNumber: field === 'projectNumber' ? 'asc' : 'desc',
        projectName: field === 'projectName' ? 'asc' : 'desc',
        type: field === 'type' ? 'asc' : 'desc',
      },
    };
    newState.order[field] = this.state.order[field] === 'asc' ? 'desc' : 'asc';
    this.setState(newState);

    let preQuery = Utils.getFetchQuery(field, pageNumber, orderDirection);
    const query = Utils.addSearchFiltersToQuery(preQuery, this.state.filterBox);

    // const query = this.addId(preQuery);

    this.props.actions.fetchTasks(query);
  }

  setPageFilter = (e, pageNumber, force) => {
    if (force || this.state.filter.pageNumber !== pageNumber) {
      // get base query
      const field = this.state.tableOrderActive;
      const orderDirection = this.state.order[field] === 'asc' ? 'ASC' : 'DESC'
      let preQuery = Utils.getFetchQuery(field, pageNumber, orderDirection);
      // add search filters
      const query = Utils.addSearchFiltersToQuery(preQuery, this.state.filterBox);

      // const query = this.addId(preQuery);
      this.props.actions.fetchTasks(query);

      // Save page number
      this.setState({
        filter: {
          pageNumber
        }
      });
    }
  }

  submitFilterForm = (values) => {
    // Get base query
    const field = this.state.tableOrderActive;
    const pageNumber = 1;
    const orderDirection = this.state.order[field] === 'asc' ? 'ASC' : 'DESC';
    let preQuery = Utils.getFetchQuery(field, pageNumber, orderDirection);

    // Add search filters
    const defaultUser = (Utils.canPerformFunction('can see all tasks', this.props.login.profile.rolesFunctionsPermissions)) ? '' : this.props.login.userId;

    if (!values.dateFrom) values.dateFrom = moment().format('YYYY-MM-DD');

    if ( (values.dateFrom && !values.dateTo) || (!values.dateFrom)) {
      values.dateDue = values.dateFrom;
    }

    if (values.dateTo && !values.dateFrom) values.dateFrom = values.dateTo;

    if (values.dateFrom && values.dateTo) {
      const date1 = moment(values.dateFrom).format('YYYY-MM-DD');
      const date2 = moment(values.dateTo).format('YYYY-MM-DD');
      values.dateDue = '';

      if (!moment(date2).isAfter(date1, 'day')) {
        values.dateFrom = date2;
        values.dateTo = date1;
      }
    }

    const filterBox = {
      searchTerm: values.keywords || '',
      assignedToUserId: values.assignedTo || defaultUser,
      assignedToRoleId: values.assignedToRoleId || '',
      dateFrom: values.dateFrom || '',
      dateTo: values.dateTo || '',
      dateDue: values.dateDue || '',
      typeId: values.typeId || '',
      departmentId: values.departmentId || '',
      tasksPriorityId: values.tasksPriorityId || '',
      unassigned: values.unassigned || '',

    };

    if (this.props.insuredId) {
      filterBox.insuredId = this.props.insuredId;
    } else {
      filterBox.insuredKeyword = values.insuredKeyword || '';
    }

    if (this.props.holderId) {
    } else {
      filterBox.holderKeyword = values.holderKeyword || '';
    }
    if (this.props.projectId) {
      filterBox.projectId = this.props.projectId;

    }

    if (!values.statusId) {
      filterBox.notStatusId = actionsTypes.CERTFOCUS_TASK_FINISHED_ID;
    } else {
      filterBox.statusId = values.statusId;
    }

    //      formHolderTab ={this.props.fromHolderTab}
    //       holderName = { this.props.holderName }

    // if (this.props.fromHolderTab && this.props.holderId) {
    //   filterBox.holderId = this.props.holderId
    // }

    const query = Utils.addSearchFiltersToQuery(preQuery, filterBox);

    // const query = this.addId(preQuery);

    // save searchterm and pagenumber
    this.setState({
      filterBox,
      filter: {
        pageNumber: 1
      },
    }, () => {
      this.props.actions.fetchTasks(query);
    });
  }

  onEditNoteTask = (task, modal) => {
    this.setState({
      modal,
      selectedNoteTask: task,
      showNoteEditor: true
    });
  }

  closeEditor = () => {
    this.clearState( () => {
      this.props.documentsActions.setDocumentsList([], 0);
      this.props.projectsInsuredsActions.setProjectInsuredsList([], 0);
    })
  }

  closeEditorAndRefresh = () => {
    this.clearState( () => {
      this.props.documentsActions.setDocumentsList([], 0);
      this.props.projectsInsuredsActions.setProjectInsuredsList([], 0);
      this.resetFilter();
    });
  }

  renderCheckBox = () => {
    return <Form.Check type="checkbox"/>
  }

  renderDetailLink = (task) => {
    return (
      <React.Fragment>
        <a
          onClick={() => this.onViewTask(task)}
          className="cell-table-link icon-quick_view">
          {this.props.locale.viewDetail.actionLinks.detail}
        </a>
        {(task.certificateId) ?
          <a
            target={'_blank'}
            href={`certfocus/certificates/${task.certificateId}`}
            className="cell-table-link icon-link task-certificate-link">
            {this.props.locale.viewDetail.actionLinks.certificate}
          </a>
          : null}
        {(task.assetTypeId == 8 && task.ProjectInsuredId) ?
          <a
            target={'_blank'}
            href={`certfocus/certificates/${task.ProjectInsuredId}`}
            className="cell-table-link icon-link task-certificate-link">
            {this.props.locale.viewDetail.actionLinks.certificate}
          </a>
          : null}
      </React.Fragment>

    );
  }

  onViewTask = async (task) => {
    if (task.statusId === actionsTypes.CERTFOCUS_TASK_OPEN_ID) {
      const updateTaskParams = {
        taskId: task.id,
        statusId: actionsTypes.CERTFOCUS_TASK_PENDING_ID,
        assignedToUserId: this.props.login.userId,
        description: task.description,
        contactType: task.typeId,
      }
      //FIXME: Update application state for the task.
      this.props.actions.saveNoteTask(updateTaskParams, () => {
      });
    }

    const queryParams = {
      orderBy: 'firstName',
      orderDirection: 'ASC',
    };

    const taskParams = {
      taskId: task.id
    }
    if (task.ProjectId) taskParams.projectId = task.ProjectId;

    this.props.actions.fetchTaskHistory(taskParams, (success, taskHistory, projectHistory) => {
      if (success) {
        this.setState({
          currentTaskHistory: taskHistory,
          currentProjectHistory: projectHistory,
        })
      }
    });
    if (task.InsuredId) {
      queryParams.insuredId = task.InsuredId;
    } else if (task.ProjectInsuredId) {
      queryParams.insuredId = task.ProjectInsuredId;
    } else {
      queryParams.holderId = task.HolderId;
    }

    this.props.contactActions.fetchContacts(queryParams);

    if (task.DocumentId && task.ProjectId) {
      const documentQuery = {
        projectId: task.ProjectId,
        documentId: task.DocumentId,
        withoutPagination: true,
      }
      await this.props.documentsActions.fetchDocumentData(documentQuery, (err, document) => {
        console.log('document callback: ', document)
        this.setState({
          document: document,
        });
      });
    }

    if (task.ProjectInsuredId) {
      const projectInsuredParams = {
        withoutPagination: true,
        insuredId: task.ProjectInsuredId,

      }
      if (task.ProjectId) {
        projectInsuredParams.projectId = task.ProjectId;
      }
      await this.props.projectsInsuredsActions.fetchProjectInsureds(projectInsuredParams);
    }

    this.setState({
      currentTask: task,
      showTaskDetail: true,
    })
  }

  handleCloseViewTask = () => {
    this.clearState(() => {
      this.props.documentsActions.setDocumentsList([], 0);
      this.props.projectsInsuredsActions.setProjectInsuredsList([], 0);
      this.setState({
        filterBox: {
          statusId: actionsTypes.CERTFOCUS_TASK_OPEN_ID,
          dateFrom: moment().format('YYYY-MM-DD'),
          dateTo: moment().format('YYYY-MM-DD'),
        }
      })
    })

    this.setState({
      currentTask: {},
      document: {},
      showTaskDetail: false,
      filterBox: {
        statusId: actionsTypes.CERTFOCUS_TASK_OPEN_ID,
        dateFrom: moment().format('YYYY-MM-DD'),
        dateTo: moment().format('YYYY-MM-DD'),
      }
    })
  }

  handleCloseAndNewTask = () => {
    this.clearState(() => {
      this.setState({
        showNoteEditor: true,
      })
    })
  }

  clearState = (callback) => {
    this.setState({
      currentTask: {},
      document: {},
      showTaskDetail: false,
      showNoteEditor: false,
    }, callback())
  }


  getTasksTable = () => {
    const {
      viewNotesTasks,
      editNoteTask,

    } = this.props.local.strings.scProfile.notesTasks;

    const {
      headers
    } = this.props.locale.table;

    const {
      assignedToRole,
      assignedToUser,
      assignedFrom,
      dateCreated,
      dueDate,
      holder,
      insured,
      description,
      taskType,
      project,
      projectNumber,
    } = headers;

    const notesTasksTableMetadata = {
      fields: [
        // 'bulkAction',
        'tasksPriorityId',
        'assignedToUser',
        'assignedToRole',
        'modifyByUser',
        'dueDate',
        'modifiedDate',
        'holderName',
        'insuredName',
        'projectNumber',
        'projectName',
        'type',
        'description',
        'done',
        'actions',
      ],
      header: {
        // bulkAction: this.renderCheckBox(),
        tasksPriorityId: 'Urgent',
        assignedToUser: assignedToUser,
        assignedToRole: assignedToRole,
        modifyByUser: assignedFrom,
        dueDate: dueDate,
        modifiedDate: dateCreated,
        holderName: holder,
        insuredName: insured,
        projectNumber: projectNumber,
        projectName: project,
        type: taskType,
        description: description,
        actions: '',
      }
    };

    const notesTasksTableBody = this.props.notesTasks.tasks.map((task, idx) => {
      const {
        tasksPriorityId,
        assignedToUser,
        assignedToRole,
        enteredByUser,
        modifyByUser,
        dateDue,
        modifiedDate,
        description,
        type,
        holderName,
        projectName,
        projectNumber,
        insuredName
      } = task;

      return {
        // bulkAction: this.renderCheckBox(),
        tasksPriorityId: (tasksPriorityId == 1) ? 'Urgent' : '-',
        assignedToUser: assignedToUser,
        assignedToRole: assignedToRole,
        modifyByUser: modifyByUser || 'System',
        dueDate: dateDue.split('T', 1),
        modifiedDate: modifiedDate.split('T', 1),
        description: description,
        holderName: holderName,
        insuredName: insuredName,
        projectNumber: projectNumber,
        projectName: projectName,
        type: type,
        actions: this.renderDetailLink(task),
      };
    });

    return {
      fields: notesTasksTableMetadata.fields,
      header: notesTasksTableMetadata.header,
      body: notesTasksTableBody
    };
  }

  renderModalBody = () => {
    return <CFTaskEditorModal
      closeAndRefresh={this.closeEditorAndRefresh}
      fromHolderTab ={this.props.fromHolderTab}
      holderName = { this.props.holderName }
      holderId ={this.props.holderId}
      fromInsuredTab ={this.props.fromInsuredTab}
      insuredName = { this.props.insuredName }
      insuredId ={this.props.insuredId}
      projectId={this.props.projectId}
      fromProject={this.props.fromProject}
      projectName={this.props.projectName}
      close={this.closeEditor}
    />
  }

  renderButtonAddTask() {
    let component = (
      <li>
        <a
          className="list-view-nav-link nav-bn icon-add no-overlapping"
          onClick={this.onCreateNoteTask}
        >
          {this.props.local.strings.scProfile.notesTasks.addTasks}
        </a>
      </li>
    );
    return component;
  }

  onCreateNoteTask = () => {
    this.setState({
      modal: 'new',
      selectedNoteTask: null,
      showNoteEditor: true,
    });
  }

  handleTotalizerLink = (urgent, unassigned) => {

    const filterBox = this.state.filterBox;
    if (urgent) filterBox.tasksPriorityId = 1;
    if (unassigned) filterBox.unassigned = 1;
    this.submitFilterForm(filterBox)
  }

  handleTaskSubmit = (values) => {
    const queryParams = {
      contactType: this.state.currentTask.typeId,
      contactUser: values.contactUser,
      description: values.contactSummary,
      taskId: this.state.currentTask.id,
      completed: true,
    };
    this.props.actions.saveNoteTask(queryParams, () => {
      this.handleCloseViewTask();
      this.resetFilter();
      //todo: show alert saying that the task was closed and refresh.

    });
  }

  handleCommentSubmit = (values) => {
    const {id, enteredByUserId, statusId, typeId, assignedToUserId} = this.state.currentTask;
    const queryParams = {
      taskId: id,
      description: values.comment,
      statusId: statusId,
      contactType: typeId,
    }
    switch (values.action) {
      case 'reassign':
        queryParams.assignedToUserId = values.toUser.value;
        queryParams.enteredByUserId = this.props.login.userId;
        break;
      case 'postpone':
        queryParams.dateDue = `${values.toDate} 23:59:59.000`;
        queryParams.assignedToUserId = assignedToUserId
        break;
      default:
        contactId: this.props.login.userId, queryParams.isRead = 0;
        queryParams.assignedToUserId = enteredByUserId;
        queryParams.enteredByUserId = this.props.login.userId;
        break;

    }
    this.props.actions.saveNoteTask(queryParams, () => {
      this.handleCloseViewTask();
      this.resetFilter();
      //todo: show alert saying that the task was closed and refresh.

    });
  }

  resetFilter = () => {
    this.setState({
      filterBox: {
        searchTerm: '',
        assignedToUserId: this.props.login.userId,
        assignedToRoleId: '',
        dateDue: moment().format('YYYY-MM-DD'),
        dateFrom: moment().format('YYYY-MM-DD'),
        notStatusId: actionsTypes.CERTFOCUS_TASK_FINISHED_ID,
        ContactTypeId: '',
        holderId: this.props.holderId || '',
        insuredId: this.props.insuredId || '',
        projectId: this.props.projectId || '',
      },
    },() => {
      this.setPageFilter(null, 1, true);
    })
  }

  render() {
    const {
      filterTasks,
      addTask
    } = this.props.local.strings.scProfile.notesTasks;

    const {insuredName, fromInsuredTab, fromHolderTab, holderName, fromProject, projectId} = this.props;

    let {totalAmountOfTasks, tasksPerPage, fetchingTasks, totalUrgentTasks, totalUnassigned, totalUrgentUnassignedTasks} = this.props.notesTasks;

    const paginationSettings = {
      total: totalAmountOfTasks,
      itemsPerPage: tasksPerPage,
      setPageHandler: this.setPageFilter,
      currentPageNumber: this.state.filter.pageNumber,
    };

    return (
      <div className="list-view admin-view-body tasks-list">
        <Modal
          show={this.state.showNoteEditor}
          onHide={this.closeEditor}
          className="taskEditor">
          <Modal.Body>
            {this.renderModalBody()}
          </Modal.Body>
        </Modal>

        <Modal
          show={this.state.showTaskDetail}
          onHide={this.handleCloseViewTask}
          className={'taskDetail'}>
          <Modal.Body>
            <CFTaskDetailModal
              document={this.state.document}
              task={this.state.currentTask}
              taskHistory={this.state.currentTaskHistory}
              projectHistory={this.state.currentProjectHistory}
              onHide={this.handleCloseViewTask}
              closeAndNew={this.handleCloseAndNewTask}
              handleTaskSubmit={this.handleTaskSubmit}
              handleCommentSubmit={this.handleCommentSubmit}
            />
          </Modal.Body>
        </Modal>
        <section className="list-view-header projects-view-header">
          <div className="row">
            <Col sm={12} lg={2}>
              {/*  Bulk action select*/}
            </Col>
            <Col sm={12} lg={6} className={'text-center no-margin'}>
              {(!fromHolderTab && !fromInsuredTab && !fromProject)?
                <Totalizers
                  totalCount={totalAmountOfTasks}
                  urgentCount={totalUrgentTasks}
                  unassignedCount={totalUnassigned}
                  urgentUnassignedCount={totalUrgentUnassignedTasks}
                  handleLink={this.handleTotalizerLink}
                  locale={this.props.locale.totalizers}
                />
                : null}

            </Col>
            <Col sm={12} lg={4}>
              <nav className="list-view-nav">
                <ul>
                  <li>
                    <a
                      className="list-view-nav-link nav-bn icon-login-door no-overlapping"
                      onClick={() => this.setState({showFilterBox: !this.state.showFilterBox})}
                    >
                      {filterTasks}
                    </a>
                  </li>
                  <RolAccess
                    masterTab="tasks"
                    sectionTab="create_tasks"
                    component={() => this.renderButtonAddTask()}>
                  </RolAccess>
                </ul>
              </nav>
            </Col>
          </div>
        </section>

        {this.state.showFilterBox &&
        <section className="list-view-filters">
          <Filter
            userId={this.props.login.userId}
            fromInsuredTab={fromInsuredTab}
            insuredName={insuredName}
            holderName={holderName}
            fromProject={fromProject}
            projectId={projectId}
            fromHolderTab={fromHolderTab}
            onSubmit={this.submitFilterForm}
          />
        </section>
        }

        <PTable
          sorted
          items={this.getTasksTable()}
          wrapperState={this.state}
          tableOrderActive={this.state.tableOrderActive}
          clickOnColumnHeader={this.clickOnColumnHeader}
          isFetching={fetchingTasks}
          customClass='tasks-list-table'
          pagination={paginationSettings}
        />
      </div>
    )
  }
};

const mapStateToProps = (state) => {
  return {
    login: state.login,
    notesTasks: state.CFTasks,
    local: state.localization,
    // insuredDetails: state.insuredDetails,
    locale: state.localization.strings.CFTasks,
    contacts: state.contacts,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(actions, dispatch),
    userActions: bindActionCreators(userActions, dispatch),
    commonActions: bindActionCreators(commonActions, dispatch),
    contactActions: bindActionCreators(contactActions, dispatch),
    documentsActions: bindActionCreators(documentsActions, dispatch),
    departmentActions: bindActionCreators(departmentActions, dispatch),
    projectsInsuredsActions: bindActionCreators(projectsInsuredsActions, dispatch),
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CFTasks));
