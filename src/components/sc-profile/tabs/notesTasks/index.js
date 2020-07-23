import React from 'react';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { Modal } from 'react-bootstrap';

import NoteEditorModal from '../../modals/noteEditor';
import ViewTaskModal from '../../../tasks/viewTaskModal';
import PTable from '../../../common/ptable';
import Filter from './filter';
import Utils from '../../../../lib/utils';
import * as actions from './actions';
import * as userActions from '../../../users/actions';
import { isEmpty } from 'lodash';
import RolAccess from "../../../common/rolAccess";

const Alerts = require('../../../alerts');

const consoleOn = false;

class NotesTasks extends React.Component {
  constructor(props) {
    super(props);

    const subcontractorId = props.match.params.scId;

    this.state = {
      filter: {
        pageNumber: 1
      },
      filterBox: {
        searchTerm: '',
        userId: '',
        enteredDate: ''
      },
      tableOrderActive: 'dueDate',
      order: {
        name: 'desc',
        enteredDate: 'desc',
        createdBy: 'desc',
        dueDate: 'asc',
        status: 'desc',
        assignedToUserId: 'desc',
        typeId: 'desc',
        contactType: 'desc',
        description: 'desc'
      },
      showFilterBox: false,
      selectedNoteTask: null,
      showNoteEditor: false,
      modal: '',
      subcontractorId
    };

    if (props.fromSidebar) {
      this.state.order.dueDate = 'DESC';
      this.state.tableOrderActive = 'dueDate';
    } else {
      this.state.order.enteredDate = 'DESC';
      this.state.tableOrderActive = 'enteredDate';
    }

    this.onEditNoteTask = this.onEditNoteTask.bind(this);
    this.onCreateNoteTask = this.onCreateNoteTask.bind(this);
    this.showAlerts = this.showAlerts.bind(this);

    // if (!this.props.fromHCtab && !this.props.fromSidebar) {
    //   props.userActions.fetchUsers({ withoutPag: true, orderBy: 'name', subcontractorId });
    // }
  }

  routeTasks = (origin, qry, accessPoint, nextPropId, hcIdFromFilter) => {
    let
      query,
      fHCtab = this.props.fromHCtab,
      sidebar = this.props.fromSidebar,
      neither = !fHCtab && !sidebar,
      subId = this.state.subcontractorId;

    // if no custom query was passed in, create standard query
    if (!qry) {
      query = Utils.getFetchQuery(this.state.tableOrderActive, 1, sidebar ? this.state.order.dueDate : this.state.order.enteredDate);
    } else {
      query = qry;
    }

    // Customizing queries depending on how this component is accessed.  Whether the component was accessed from sidebar -- or rather, the bell-icon in the navbar -- or from the HC Profile page or from the SC profile.
    if (sidebar || accessPoint === 'fromSidebar') {
      query.assignedToUserId = this.props.userId;
      query.statusId = '1';
      query.alltasks = '1';
      query.system = 'pq';

      if (hcIdFromFilter) {
        query.hiringClientId = hcIdFromFilter;
      }
    } else if (fHCtab || accessPoint === 'fromHCtab') {

      query.hiringClientId = this.props.hcId;
      query.assetId = this.props.hcId;
      query.assetTypeId = '1';
      query.system = 'pq';

    } else if (neither || accessPoint === 'fromSCtab') {

      if (consoleOn) {
        console.log('this.props.hcIdFromSub = ', this.props.hcIdFromSub);
        console.log('nextPropId = ', nextPropId);
      }

      query.hiringClientId = (nextPropId && nextPropId !== this.props.hcIdFromSub) ? nextPropId : this.props.hcIdFromSub;
      query.subcontractorId = isEmpty(subId) ? '' : subId;
      query.assetId = isEmpty(subId) ? '' : subId;
      query.assetTypeId = '2';
      query.system = 'pq';
    }

    // Rather strict console.log diagnostic to catch badly defined queries:

    if (consoleOn) {
      console.log(origin)
      console.log(`${fHCtab ? 'fromHCtab' : (sidebar ? 'fromSidebar' : (subId ? 'from SCTab' : 'no access point determined'))}`)

      if (neither && !this.state.subcontractorId && !accessPoint) {
        console.log('undetermined access point')
      }

      Utils.checkObjForUndefinedOrNullProps(query)

      // console.log(query)
    }

    this.props.actions.fetchTasks(query);
  }

  componentWillMount() {
    this.routeTasks('origin: componentWillMount');
    this.props.actions.fetchRoles();
  }

  componentWillReceiveProps(nextProps) {

    let
      fHCtab = this.props.fromHCtab,
      newFHCtab = nextProps.fromHCtab,
      sidebar = this.props.fromSidebar,
      newSidebar = nextProps.fromSidebar,
      hcIdFromSub = this.props.hcIdFromSub,
      newHcIdFromSub = nextProps.hcIdFromSub,
      subId = this.state.subcontractorId,
      undefHcIdFromSub = !fHCtab && !sidebar && subId && !hcIdFromSub,
      accessPoint = fHCtab ? 'fromHCtab' : (sidebar ? 'fromSidebar' : (subId ? 'fromSCtab' : null)),
      newAccessPoint = newFHCtab ? 'fromHCtab' : (newSidebar ? 'fromSidebar' : (newHcIdFromSub ? 'fromSCtab' : null))

    if (consoleOn) {
      console.log('hcIdFromSub = ', hcIdFromSub)
      console.log('newHcIdFromSub = ', newHcIdFromSub)
      console.log('undefHcIdFromSub = ', undefHcIdFromSub)
    }

    if (newHcIdFromSub && hcIdFromSub !== newHcIdFromSub) {
      if (consoleOn) {
        console.log('first conditional accessed')
      }
      accessPoint = accessPoint === newAccessPoint ? accessPoint : (newAccessPoint ? newAccessPoint : (accessPoint ? accessPoint : null))
      this.routeTasks('origin: componentWillReceiveProps, first conditional', null, accessPoint, newHcIdFromSub)
    }

    if (!undefHcIdFromSub && newAccessPoint && accessPoint !== newAccessPoint) {
      this.routeTasks('origin: componentWillReceiveProps, second conditional', null, newAccessPoint)
    }

    if (nextProps.notesTasks.savingTask) return;
    this.showAlerts(nextProps);

  }

  showAlerts(nextProps) {
    if (this.props.notesTasks.savingTask && !nextProps.notesTasks.savingTask) {
      if (nextProps.notesTasks.error) {
        Alerts.showInformationAlert(
          'Error',
          nextProps.notesTasks.error,
          'Accept',
          false,
          () => { }
        );
        this.props.actions.setError(null);
      } else {
        this.props.actions.setError(null);
        //Refresh handled on closeNoteEditorAndRefresh
        /*
        let query = Utils.getFetchQuery('name', 1, 'ASC');
        this.addAsset(query);
        this.props.actions.fetchTasks(query);
        */
      }
    }
  }

  clickOnColumnHeader = (e, field) => {
    if (field === 'editNoteTask' || field === 'viewNoteTask') return;
    // get base query
    const pageNumber = this.state.filter.pageNumber;
    const orderDirection = this.state.order[field] === 'asc' || this.state.order[field] === 'ASC' ? 'DESC' : 'ASC'

    // save new active tab and order
    let newState = {
      tableOrderActive: field,
      order: {
        name: field === 'name' ? 'asc' : 'desc',
        enteredDate: field === 'enteredDate' ? 'desc' : 'asc',
        createdBy: field === 'createdBy' ? 'asc' : 'desc',
        dueDate: field === 'dueDate' ? 'asc' : 'desc',
        status: field === 'status' ? 'asc' : 'desc',
        assignedToUserId: field === 'assignedToUserId' ? 'asc' : 'desc',
        typeId: field === 'typeId' ? 'asc' : 'desc',
        contactType: field === 'contactType' ? 'asc' : 'desc',
        description: field === 'description' ? 'asc' : 'desc'
      }
    };
    newState.order[field] = this.state.order[field] === 'asc' || this.state.order[field] === 'ASC' ? 'desc' : 'asc';
    this.setState(newState);

    if (field === 'createdBy') {
      field = 'enteredByUser'
    }

    let query = Utils.getFetchQuery(field, pageNumber, orderDirection);
    query = Utils.addSearchFiltersToQuery(query, this.state.filterBox);
    this.routeTasks('origin: clickOncolumnHeader', query)
  }

  setPageFilter = (e, pageNumber, force) => {
    if (force || this.state.filter.pageNumber !== pageNumber) {
      // get base query
      const field = this.state.tableOrderActive;
      const orderDirection = this.state.order[field] === 'asc' || this.state.order[field] === 'ASC' ? 'ASC' : 'DESC'
      let query = Utils.getFetchQuery(field, pageNumber, orderDirection);
      // add search filters
      query = Utils.addSearchFiltersToQuery(query, this.state.filterBox);
      this.routeTasks('origin: setPageFilter', query)
      // console.log('filterbox = ', this.state.filterBox)
      // console.log('query w/ filterbox = ', query)
      // save page number
      this.setState({
        filter: {
          pageNumber
        }
      });

    }
  }

  submitFilterForm = (values) => {
    // get base query
    const field = this.state.tableOrderActive;
    const pageNumber = 1;
    const orderDirection = this.state.order[field] === 'asc' || this.state.order[field] === 'ASC' ? 'ASC' : 'DESC'
    let query = Utils.getFetchQuery(field, pageNumber, orderDirection);
    // add search filters
    const filterBox = {
      searchTerm: values.keywords || '',
      assignedToUserId: values.assignedTo || '',
      assignedToRoleId: values.assignedToRoleId || '',
      enteredDate: values.enteredDate || '',
      dueDate: values.dueDate || '',
      statusId: values.statusId || '',
      typeId: values.typeId || '',
      hiringClientId: values.hiringClient || null
    };
    query = Utils.addSearchFiltersToQuery(query, filterBox);

    // console.log('filter query = ', query)

    // save searchterm and pagenumber
    this.setState({
      filterBox,
      filter: {
        pageNumber: 1
      }
    }, () => {
      this.routeTasks('origin: submitFilterForm', query, null, null)
    });
  }

  onCreateNoteTask = () => {
    this.setState({
      modal: 'new',
      selectedNoteTask: null,
      showNoteEditor: true
    });
  }

  onEditNoteTask = (task, modal) => {
    this.setState({
      modal,
      selectedNoteTask: task,
      showNoteEditor: true
    });
  }

  closeNoteEditor = () => {
    this.setState({
      showNoteEditor: false
    });
  }

  closeNoteEditorAndRefresh = () => {
    this.setPageFilter(null, 1, true);

    this.setState({
      showNoteEditor: false
    });
  }

  getSidebarTasksTable = () => {
    const {
      viewNotesTasks,
      headers,
    } = this.props.local.strings.scProfile.notesTasks;

    const { CFRole, Role } = this.props.login.profile;

    const {
      hcName,
      scName,
      taskName,
      createdBy,
      dueDate,
      enteredDate,
      holderName,
      insuredName,
    } = headers;

    const notesTasksTableMetadata = {
      fields: [
        'hiringClient',
        'subcontractor',
        'name',
        'createdBy',
        'enteredDate',
        'dueDate',
        'viewNoteTask'
      ],
      header: {
        hiringClient: (CFRole && Role) ? `${hcName} / ${holderName}` : (Role ? hcName : holderName),
        subcontractor: (CFRole && Role) ? `${scName} / ${insuredName}` : (Role ? scName : insuredName),
        name: taskName,
        createdBy,
        enteredDate: enteredDate,
        dueDate: dueDate,
        viewNoteTask: ''
      }
    };

    const notesTasksTableBody = this.props.notesTasks.tasks.map((task, idx) => {
      const {
        name,
        dateDue,
        subcontractor,
        hiringClient,
        enteredByUser,
        enteredDate,
        HiringClientId,
        subcontractorId
      } = task;

      return {
        hiringClient: <Link to={`/hiringclients/${HiringClientId}`}>{hiringClient}</Link>,
        subcontractor: <Link to={`/subcontractors/${subcontractorId}`}>{subcontractor}</Link>,
        name,
        createdBy: enteredByUser,
        enteredDate: enteredDate ? new Date(enteredDate).toLocaleString() : '',
        dueDate: dateDue ? new Date(dateDue).toLocaleString() : '',
        viewNoteTask: (
          <a
            onClick={() => this.onEditNoteTask(task, 'view')}
            className="cell-table-link icon-quick_view viewNotesTasks" >
            {viewNotesTasks}
          </a>
        ),
      };
    });
    return {
      fields: notesTasksTableMetadata.fields,
      header: notesTasksTableMetadata.header,
      body: notesTasksTableBody
    };
  }

  getTasksTable = () => {
    const { fromHolderTab } = this.props;

    const {
      viewNotesTasks,
      editNoteTask,
      headers
    } = this.props.local.strings.scProfile.notesTasks;

    const {
      noteTaskTitle,
      enteredDate,
      dueDate,
      status,
      assignedTo,
      noteOrTask,
      createdBy,
      contactType,
      comments
    } = headers;

    const holderFields = [
      'contactType',
      'description'
    ];

    const holderHeader = {
      contactType: contactType,
      description: comments
    };

    const hcFields = [
      'enteredDate',
      'createdBy',
      'typeId',
    ];

    const hcHeader = {
      enteredDate: enteredDate,
      createdBy,
      typeId: noteOrTask,
    };

    const notesTasksTableMetadata = {
      fields: [
        'name',
        'dueDate',
        ...(fromHolderTab ? holderFields : hcFields),
        'status',
        'assignedToUserId',
        'viewNoteTask',
        'editNoteTask',
      ],
      header: {
        name: noteTaskTitle,
        dueDate: dueDate,
        ...(fromHolderTab ? holderHeader : hcHeader),
        status: status,
        assignedToUserId: assignedTo,
        viewNoteTask: '',
        editNoteTask: ''
      }
    };

    const notesTasksTableBody = this.props.notesTasks.tasks.map((task, idx) => {
      const {
        name,
        enteredDate,
        dueDate,
        status,
        assignedToUser,
        enteredByUser,
        assignedToRole,
        typeId,
        contactType,
        description } = task;

      const holderBody = {
        contactType: contactType,
        description: (
          <div className="limitedWidthText">
            {description}
          </div>
        )
      };

      const hcBody = {
        enteredDate: new Date(enteredDate).toLocaleString() || "",
        createdBy: enteredByUser,
        typeId: typeId === 1 ? 'Note' : 'Task',
      };

      return {
        name,
        dueDate: new Date(dueDate).toLocaleString() || "",
        ...(fromHolderTab ? holderBody : hcBody),
        status: status,
        assignedToUserId: assignedToUser || assignedToRole,
        viewNoteTask: (
          <a
            onClick={() => this.onEditNoteTask(task, 'view')}
            className="cell-table-link icon-quick_view" >
            {viewNotesTasks}
          </a>
        ),
        editNoteTask: status !== 'Completed'
          ? (
            <a
              onClick={() => this.onEditNoteTask(task, 'edit')}
              className="cell-table-link icon-edit" >
              {editNoteTask}
            </a>
          )
          : '',
      };
    });
    return {
      fields: notesTasksTableMetadata.fields,
      header: notesTasksTableMetadata.header,
      body: notesTasksTableBody
    };
  }

  renderModalBody() {
    if (this.state.modal === 'view') {
      return (
        <ViewTaskModal
          closeAndRefresh={this.closeNoteEditorAndRefresh}
          close={this.closeNoteEditor}
          task={this.state.selectedNoteTask} />
      )
    } else if (this.state.modal === 'edit' || this.state.modal === 'new') {
      return (
        <NoteEditorModal
          closeAndRefresh={this.closeNoteEditorAndRefresh}
          close={this.closeNoteEditor}
          note={this.state.selectedNoteTask}
          subcontractorId={this.state.subcontractorId}
          fromHCtab={this.props.fromHCtab}
          fromSCtab={this.props.fromSCtab}
          hcId={this.props.hcId} />
      )
    }
  }

  renderButtonAddTask = () => {
    const {
      addNotesTasks
    } = this.props.local.strings.scProfile.notesTasks;
    return(
      <li>
        <a
          className="list-view-nav-link nav-bn icon-add no-overlapping"
          onClick={this.onCreateNoteTask}
        >
          {addNotesTasks}
        </a>
      </li>
    );
  }

  render() {
    const {
      filterNotesTasks,
      filterTasks,
    } = this.props.local.strings.scProfile.notesTasks;

    let { totalAmountOfTasks, tasksPerPage, fetchingTasks } = this.props.notesTasks;
    const paginationSettings = {
      total: totalAmountOfTasks,
      itemsPerPage: tasksPerPage,
      setPageHandler: this.setPageFilter,
      currentPageNumber: this.state.filter.pageNumber,
    };

    return (
      <div className="list-view admin-view-body">
        <Modal
          show={this.state.showNoteEditor}
          onHide={this.closeNoteEditor}
          className="add-item-modal noteEditorModal" >
          <Modal.Body>
            {this.renderModalBody()}
          </Modal.Body>
        </Modal>

        <section className="list-view-header projects-view-header">
          <div className="row">
            <div className="col-sm-12">
              <nav className="list-view-nav">
                <ul>
                  <li className="">
                    <a
                      className="list-view-nav-link nav-bn icon-login-door no-overlapping"
                      onClick={() => this.setState({ showFilterBox: !this.state.showFilterBox })}
                    >
                      {this.props.fromSidebar ? filterTasks : filterNotesTasks}
                    </a>
                  </li>

                  {
                    (!this.props.fromSidebar &&
                      <RolAccess
                        masterTab="tasks"
                        sectionTab="create_tasks"
                        component={() => this.renderButtonAddTask()}>
                      </RolAccess>
                      )
                  }

                </ul>
              </nav>
            </div>
          </div>
        </section>

        {
          this.state.showFilterBox && !this.state.selectedProject ?
            <section className="list-view-filters">
              <Filter
                onSubmit={this.submitFilterForm}
                fromSidebar={this.props.fromSidebar}
                fromHCtab={this.props.fromHCtab}
              />
            </section> : null
        }
        <PTable
          colsConfig={this.props.fromSidebar ? ['14%', '14%', '18%', '12%', '12%', '8%', '11%'] : null}
          sorted={true}
          items={this.props.fromSidebar ? this.getSidebarTasksTable() : this.getTasksTable()}
          wrapperState={this.state}
          tableOrderActive={this.state.tableOrderActive}
          clickOnColumnHeader={this.clickOnColumnHeader}
          isFetching={fetchingTasks}
          customClass='projects-list'
          pagination={paginationSettings}
        />

      </div>
    )

  }
};

const mapStateToProps = (state) => {
  return {
    scProfile: state.SCProfile,
    hcIdFromSub: state.SCProfile.hcId,
    notesTasks: state.notesTasks,
    local: state.localization,
    login: state.login
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(actions, dispatch),
    userActions: bindActionCreators(userActions, dispatch)
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(NotesTasks));
