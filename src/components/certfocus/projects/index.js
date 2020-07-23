import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { Modal } from 'react-bootstrap';
import Toggle from 'react-toggle';
import Swal from 'sweetalert2';

import "react-toggle/style.css";

import PTable from '../../common/ptable';
import AddProjectModal from '../modals/addProjectModal';
import FilterProjects from './filter';
import Utils from '../../../lib/utils';
import TypeAheadAndSearch from '../../common/typeAheadAndSearch';

import * as actions from './actions';
import * as commonActions from '../../common/actions';
import * as projectDetailsActions from '../project-view/actions';
import * as reqSetsActions from '../requirement-sets/actions';
import * as holderProfileActions from './../holders-profile/actions';

import RolAccess from './../../common/rolAccess';

import './Projects.css';

class Projects extends Component {
  constructor(props) {
    super(props);

    this.state = {
      filter: {
        pageNumber: 1
      },
      filterBox: {
        projectName: '',
        state: '',
        holderName: '',
        myList: '',
        searchTerm: '',
        archived: '',
        emptyReqSets: false,
      },
      tableOrderActive: 'name',
      order: {
        name: 'asc',
        holderName: 'desc',
        mylist: 'desc',
        city: 'desc',
        state: 'desc',
        status: 'desc',
      },
      showFilterBox: false,
      currentProject: null,
      filteredByEmptyReqSets: false,
    };
  }

  componentDidMount() {
    const { actions, holderId, insuredId, commonActions, fromHolderTab } = this.props;

    actions.setAddProjectData();
    commonActions.fetchUSStates();

    actions.fetchProjects({
      orderBy: 'name',
      orderDirection: 'ASC',
      ...(holderId && { holderId }),
      ...(insuredId && { insuredId }),
      ...(fromHolderTab && { archived: 0 })
    });

    this.props.commonActions.setBreadcrumbItems([]);
  }

  addId(query) {
    const { holderId, insuredId } = this.props;

    if (holderId) {
      query.holderId = holderId;
    } else if (insuredId) {
      query.insuredId = insuredId;
    }
  }

  clickOnColumnHeader = (e, field) => {
    if (field === 'viewProjects' || field === 'editProject') return;

    // get base query
    const pageNumber = this.state.filter.pageNumber;
    const orderDirection = this.state.order[field] === 'asc' ? 'DESC' : 'ASC';
    let query = Utils.getFetchQuery(field, pageNumber, orderDirection);
    this.addId(query);

    // add search filters
    query = Utils.addSearchFiltersToQuery(query, this.state.filterBox);

    // fetch using query
    this.props.actions.fetchProjects(query);

    // save new active tab and order
    let newState = {
      tableOrderActive: field,
      order: {
        name: field === 'name' ? 'asc' : 'desc',
        holderName: field === 'holderName' ? 'asc' : 'desc',
        city: field === 'city' ? 'asc' : 'desc',
        state: field === 'state' ? 'asc' : 'desc',
        status: field === 'status' ? 'asc' : 'desc',
        mylist: field === 'mylist' ? 'asc' : 'desc',
      }
    };
    newState.order[field] = this.state.order[field] === 'asc' ? 'desc' : 'asc';
    this.setState(newState);
  }

  setPageFilter = (e, pageNumber, force) => {
    if (force || this.state.filter.pageNumber !== pageNumber) {
      // get base query
      const field = this.state.tableOrderActive;
      const orderDirection = this.state.order[field] === 'asc' ? 'ASC' : 'DESC'
      let query = Utils.getFetchQuery(field, pageNumber, orderDirection);
      this.addId(query);

      // add search filters
      query = Utils.addSearchFiltersToQuery(query, this.state.filterBox);

      if (this.props.fromHolderTab && !query.archived) {
        query.archived = 0;
      }

      // filtering by empty ReqSets
      query.emptyReqSets = (this.state.emptyReqSets) ? 1 : 0;

      // fetch using query
      this.props.actions.fetchProjects(query);

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
    const orderDirection = this.state.order[field] === 'asc' ? 'ASC' : 'DESC'
    let query = Utils.getFetchQuery(field, pageNumber, orderDirection);
    this.addId(query);

    // add search filters
    const filterBox = {
      projectName: values.name || "",
      state: values.state || "",
      holderName: values.holder || "",
      myList: values.myList || "",
      searchTerm: values.keywords || "",
      archived: values.archived || "",
    };
    query = Utils.addSearchFiltersToQuery(query, filterBox);

    // fetch using query
    this.props.actions.fetchProjects(query);

    // save searchterm and pagenumber
    this.setState({
      filterBox,
      filter: {
        pageNumber: 1
      }
    });
  }

  editProject = (project) => {
    const { setLoading } = this.props.commonActions;
    setLoading(true);

    this.props.reqSetsActions.fetchRequirementSetsPossibleValues({ holderId: project.holderId });
    this.props.actions.fetchHolderCustomFields(project.holderId);
    this.props.projectDetailsActions.fetchProject(project.id, (data) => {
      setLoading(false);

      this.setState({
        currentProject: data
      }, this.openModal);
    });
  }

  archiveProject = (e, projectId, newArchivedStatus) => {
    const archivedTitle = (newArchivedStatus === 1) ? 'Archive' : 'Unarchive';
    const archivedText = (newArchivedStatus === 1) ? 'archive' : 'unarchive';

    Swal({
      title: `${archivedTitle} Project`,
      text: `Are you sure you want to ${archivedText} project # ${projectId}?`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#2E5965',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes!'
    }).then((result) => {
      if (result.value) {
        this.props.actions.archiveProject({ id: projectId, archived: newArchivedStatus }, () => {
          this.props.commonActions.setLoading(false);
          this.setPageFilter(null, 1, true);
        });
      }
    });
  }

  openModal = () => {
    this.props.actions.setShowModal(true);
  }

  closeModal = () => {
    this.props.actions.setShowModal(false);

    this.setState({
      currentProject: null
    });
  }

  closeModalAndRefresh = () => {
    this.props.actions.setShowModal(false);
    this.setPageFilter(null, 1, true);

    this.props.actions.setCustomFieldsList([]);

    this.setState({
      currentProject: null
    });
  }

  onToggleChange = (e, projectId) => {
    const { profile } = this.props.login;

    this.props.actions.sendProjectFavorite(e.target.checked, { projectId, userId: profile.Id });
  }

  renderButtonAddProject() {
    let component = (
      <div>
        <a onClick={this.openModal}
          className="nav-btn nav-bn icon-add"
        >
          {this.props.local.strings.certFocusProjects.projectsList.addBtn}
        </a>
      </div>
    );
    return component;
  }

  renderButtonEditProject(p) {
    let component = (
      <a
        onClick={() => this.editProject(p)}
        className="cell-table-link icon-edit"
      >
        {this.props.local.strings.certFocusProjects.projectsList.editProject}
      </a>
    );
    return component;
  }

  renderButtonViewProject(projectId) {
    let component = (
      <Link
        to={`/certfocus/projects/${projectId}`}
        className="cell-table-link icon-quick_view"
      >
        {this.props.local.strings.certFocusProjects.projectsList.viewProject}
      </Link>
    );

    return component;
  }

  filteredByEmptyReqSets = (e, emptyReqSets) => {
    e.preventDefault();
    this.setState({ emptyReqSets: emptyReqSets, filteredByEmptyReqSets: emptyReqSets }, () => {
      this.setPageFilter(null, 1, true);
    });
  }

  render() {
    if (!this.props.login.profile.Id) {
      return (
        <div className="spinner-wrapper">
          <div className="spinner" />
        </div>
      );
    }

    // check for missing reqSets
    let missingReqSet = false;
    if (this.props.projects && this.props.projects.list) {
      missingReqSet = this.props.projects.list.some((e => e.requirementSetId === null));
    }

    const { fromHolderTab, fromInsuredTab } = this.props;
    const {
      projectNumberColumn,
      projectColumn,
      holderColumn,
      CompliantInsuredsColumn,
      NonCompliantInsuredsColumn,
      EscalatedInsuredsColumn,
      stateColumn,
      statusColumn,
      myListColumn,
      viewProject,
      editProject,
      archiveProject,
      unarchiveProject,
      filterBtn,
      addBtn,
    } = this.props.local.strings.certFocusProjects.projectsList;

    const showEditAndView = !fromInsuredTab;

    const projectsTableMetadata = {
      fields: [
        'number',
        'name',
        'holderName',
        'CompliantInsureds',
        'NonCompliantInsureds',
        'EscalatedInsureds',
        'state',        
        'mylist',
        'viewProjects',
        'editProject',
        'archiveProject',
      ],
      header: {
        number: projectNumberColumn,
        name: projectColumn,
        holderName: holderColumn,
        CompliantInsureds: CompliantInsuredsColumn,
        NonCompliantInsureds: NonCompliantInsuredsColumn,
        EscalatedInsureds: EscalatedInsuredsColumn,
        state: stateColumn,
        status: statusColumn,
        mylist: myListColumn,
        viewProjects: '',
        editProject: '',
        archiveProject: ''
      }
    };
    const accountProjectsNonArchive = this.props.projects.list.length > 0 ? this.props.projects.list[0].accountProjectsNonArchived : 0;
    this.props.holderProfileActions.setAccountProjectsNonArchived(accountProjectsNonArchive);
    
    const projectsTableBody = this.props.projects.list.map((project, idx) => {
      const {
        id,
        number,
        name,
        holderName,
        CompliantInsureds,
        NonCompliantInsureds,
        EscalatedInsureds,
        state,
        status,
        mylist,
        archived,
      } = project;

      return {
        number: number,
        name: name,
        holderName: holderName,
        CompliantInsureds: CompliantInsureds,
        NonCompliantInsureds: NonCompliantInsureds,
        EscalatedInsureds: EscalatedInsureds,
        state: state,
        status: (
          <span
            className={`status-cell ${(status.toLowerCase()).replace(/\s/g, '')}`}
          >
            {status}
          </span>
        ),
        mylist: (
          <Toggle
            onChange={(e) => this.onToggleChange(e, id)}
            checked={mylist ? true : false}
            disabled={this.props.projects.favoriteFetching === id}
          />
        ),
        viewProjects: (
          <RolAccess
            masterTab="projects"
            sectionTab="view_project"
            component={() => this.renderButtonViewProject(project.id)}>
          </RolAccess>
        ),
        editProject: (
          <RolAccess
            masterTab="projects"
            sectionTab="edit_project"
            component={() => this.renderButtonEditProject(project)}>
          </RolAccess>
        ),
        archiveProject: (
          (!archived) ? (
            <a
              onClick={(e) => this.archiveProject(e, id, 1)}
              className="cell-table-link"
              style={{ color: '#F00' }}
            >
              {archiveProject}
            </a>
          ) : (
              <a
                onClick={(e) => this.archiveProject(e, id, 0)}
                className="cell-table-link"
                style={{ color: '#F00' }}
              >
                {unarchiveProject}
              </a>
            )
        ),
      };
    });

    const templatesTableData = {
      fields: projectsTableMetadata.fields,
      header: projectsTableMetadata.header,
      body: projectsTableBody
    };

    let {
      totalAmountOfProjects,
      projectsPerPage,
      fetchingProjects,
      showModal } = this.props.projects;

    const paginationSettings = {
      total: totalAmountOfProjects,
      itemsPerPage: projectsPerPage,
      setPageHandler: this.setPageFilter,
      currentPageNumber: this.state.filter.pageNumber,
    };

    return (
      <div className="list-view admin-view-body projects-list">
        <Modal
          show={showModal}
          onHide={this.closeModal}
          className="add-item-modal add-hc"
        >
          <Modal.Body className="add-item-modal-body mt-0">
            <AddProjectModal
              project={this.state.currentProject}
              onHide={this.closeModal}
              close={this.closeModalAndRefresh}
              fromHolderTab={fromHolderTab}
            />
          </Modal.Body>
        </Modal>

        <div className="projects-list-header">
          {!this.state.filteredByEmptyReqSets && missingReqSet && (
            <div>
              <a
                onClick={(e) => this.filteredByEmptyReqSets(e, true)}
                className="nav-btn btn-danger"
              >Missing Req Sets
              </a>
            </div>
          )}

          {this.state.filteredByEmptyReqSets && (
            <div>
              <a
                onClick={(e) => this.filteredByEmptyReqSets(e, false)}
                className="nav-btn btn-success"
              >View All Projects
              </a>
            </div>
          )}

          <div>
            <a
              onClick={() => this.setState({ showFilterBox: !this.state.showFilterBox })}
              className="nav-btn icon-login-door"
            >
              {filterBtn}
            </a>
          </div>

          {!fromInsuredTab && (
            <RolAccess
              masterTab="projects"
              sectionTab="add_project"
              component={() => this.renderButtonAddProject()}>
            </RolAccess>
          )}

          {(!fromHolderTab && !fromInsuredTab) &&
            <TypeAheadAndSearch />
          }
        </div>

        {this.state.showFilterBox &&
          <section className="list-view-filters">
            <FilterProjects
              onSubmit={this.submitFilterForm}
              fromHolderTab={fromHolderTab}
            />
          </section>
        }

        <PTable
          sorted
          items={templatesTableData}
          wrapperState={this.state}
          tableOrderActive={this.state.tableOrderActive}
          clickOnColumnHeader={this.clickOnColumnHeader}
          isFetching={fetchingProjects}
          customClass='projects-table'
          pagination={paginationSettings}
        />
      </div>
    );
  }
};

const mapStateToProps = (state) => {
  return {
    projects: state.holdersProjects,
    local: state.localization,
    login: state.login
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(actions, dispatch),
    commonActions: bindActionCreators(commonActions, dispatch),
    projectDetailsActions: bindActionCreators(projectDetailsActions, dispatch),
    reqSetsActions: bindActionCreators(reqSetsActions, dispatch),
    holderProfileActions: bindActionCreators(holderProfileActions, dispatch)
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Projects));
