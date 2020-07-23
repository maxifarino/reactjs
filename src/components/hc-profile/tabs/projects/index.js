import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { Modal } from 'react-bootstrap';

import PTable from '../../../common/ptable';
import AddProjectModal from './addProjectModal';
import ProjectView from './projectView';
import FilterProjects from './filter';
import Utils from '../../../../lib/utils';
import * as actions from './actions';

class Projects extends React.Component {
  constructor(props) {
    super(props);
    const hiringClientId = props.match.params.hcId;
    this.state = {
      filter: {
        pageNumber: 1
      },
      filterBox: {
        searchTerm: '',
        tradeId: '',
      },
      selectedProject: null,
      tableOrderActive: 'name',
      order: {
        name: 'asc',
        contractsTotalAmount: 'desc',//tradeTotal
        contractsCount: 'desc'//contractsAwarded
      },
      showFilterBox: false,
      hiringClientId
    };

    if (this.props.fromScTab) {
      const hcId = this.props.scProfile.hcId
      props.actions.fetchProjects({ subcontractorId: props.scId, hiringClientId: hcId });
    } else {
      props.actions.setAddProjectData({ hiringClientId });
      props.actions.fetchProjects({ hiringClientId });
    }

    props.actions.fetchProjectStatus();
  }

  componentWillUpdate(nextProps) {
    if(this.props.fromScTab){
      const { hcId } = nextProps.scProfile;
      if(hcId.toString() !== this.props.scProfile.hcId.toString()){
        this.props.actions.fetchProjects({ subcontractorId: this.props.scId, hiringClientId: hcId });
      }
    }
  }

  addId(query) {
    if (this.props.fromScTab) {
      query.subcontractorId = this.props.scId;
    } else {
      query.hiringClientId = this.state.hiringClientId;
    }
  }

  clickOnColumnHeader = (e, field) => {
    if (field === 'viewProjects' || field === 'editProject') return;
    // get base query
    const pageNumber = this.state.filter.pageNumber;
    const orderDirection = this.state.order[field] === 'asc' ? 'DESC' : 'ASC'
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
        contractsTotalAmount: field === 'contractsTotalAmount' ? 'asc' : 'desc',
        contractsCount: field === 'contractsCount' ? 'asc' : 'desc',
      }
    };
    newState.order[field] = this.state.order[field] === 'asc' ? 'desc' : 'asc';
    this.setState(newState);
  }

  setPageFilter = (e, pageNumber, force) => {
    if(force || this.state.filter.pageNumber !== pageNumber) {
      // get base query
      const field = this.state.tableOrderActive;
      const orderDirection = this.state.order[field] === 'asc' ? 'ASC' : 'DESC'
      let query = Utils.getFetchQuery(field, pageNumber, orderDirection);
      this.addId(query);
      // add search filters
      query = Utils.addSearchFiltersToQuery(query, this.state.filterBox);
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

  submitFilterForm = (values)=> {
    // get base query
    const field = this.state.tableOrderActive;
    const pageNumber = 1;
    const orderDirection = this.state.order[field] === 'asc' ? 'ASC' : 'DESC'
    let query = Utils.getFetchQuery(field, pageNumber, orderDirection);
    this.addId(query);
    // add search filters
    const filterBox = {
      searchTerm: values.keywords || "",
      tradeId: values.trade || ""
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

  displayProjects = (project) => {
    let query = {
      projectId: project.id
    }
    this.addId(query);

    this.setState({ selectedProject: project })
    this.props.actions.fetchContracts(query)
  }

  editProject = (project) => {
    let query = {
      projectId: project.id
    }
    this.addId(query);

    this.props.actions.fetchContracts(query);

    this.setState({
      currentProject: project
    }, this.openModal);
  }

  openModal = (event) => {
    this.props.actions.setShowModal(true);
  }

  closeModal = (event) => {
    this.props.actions.setShowModal(false);

    this.setState({
      currentProject: null
    });
  }

  closeModalAndRefresh = (event) => {
    this.props.actions.setShowModal(false);
    this.setPageFilter(null, 1, true);

    this.setState({
      currentProject: null
    });
  }

  render() {
    const {
      viewProjects,
      editProject,
      editContract,
      filterProjects,
      addNewProject,
      headers
    } = this.props.local.strings.hcProfile.projects;

    const {
      projectName,
      tradeTotal,
      contractsAwarded
    } = headers;

    const projectsTableMetadata = {
      fields: [
        'name',
        'contractsTotalAmount',
        'contractsCount',
        'viewProjects',
        'editProject'
      ],
      header: {
        name: projectName,
        contractsTotalAmount: tradeTotal,
        contractsCount: contractsAwarded,
        viewProjects: '',
        editProject: ''
      }
    };

    const projectsTableBody = this.props.projects.list.map((project, idx) => {
      const {
        name,
        contractsTotalAmount,
        contractsCount
      } = project;

      return {
        name,
        contractsTotalAmount: `$${contractsTotalAmount}`,
        contractsCount,
        viewProjects: (
          <a
            onClick={() => this.displayProjects(project)}
            className="cell-table-link icon-quick_view" >
            {viewProjects}
          </a>
        ),
        editProject: (
          <a
            onClick={() => this.editProject(project)}
            className="cell-table-link icon-edit" >
            {this.props.fromScTab? editContract:editProject}
          </a>
        ),
      };
    });

    const templatesTableData = {
      fields: projectsTableMetadata.fields,
      header: projectsTableMetadata.header,
      body: projectsTableBody
    };

    let { totalAmountOfProjects, projectsPerPage, fetchingProjects } = this.props.projects;
    const paginationSettings = {
      total: totalAmountOfProjects,
      itemsPerPage: projectsPerPage,
      setPageHandler: this.setPageFilter,
      currentPageNumber: this.state.filter.pageNumber,
    };

    return (
      <div className="list-view admin-view-body">

        <Modal
          show={this.props.projects.showModal}
          onHide={this.closeModal}
          className="add-item-modal add-hc" >
          <Modal.Body className="add-item-modal-body">
            <AddProjectModal
              project={this.state.currentProject}
              close={this.closeModalAndRefresh}
              fromScTab={this.props.fromScTab}
              currentSC={this.props.scId}
            />
          </Modal.Body>
        </Modal>

        <section className="list-view-header projects-view-header">
          <div className="row">
            {
              !this.state.selectedProject ?
                <div className="col-sm-12">
                  <nav className="list-view-nav">
                    <ul>
                      <li className="">
                        <a
                          className="list-view-nav-link nav-bn icon-login-door no-overlapping"
                          onClick={()=> {this.setState({showFilterBox: !this.state.showFilterBox})}}
                        >
                          {filterProjects}
                        </a>
                      </li>

                      {
                        !this.props.fromScTab &&
                        <li>
                          <a onClick={this.openModal}
                            className="list-view-nav-link nav-bn icon-add no-overlapping" >
                            {addNewProject}
                          </a>
                        </li>
                      }

                    </ul>
                  </nav>
                </div> :
                <div className="stick-left">
                  <nav className="list-view-nav">
                    <ul>
                      <li className="">
                        <a
                          className="list-view-nav-link nav-bn icon-login-door no-overlapping"
                          onClick={()=> this.setState({selectedProject: null})}
                        >
                          Back to the projects
                        </a>
                      </li>
                    </ul>
                  </nav>
                </div>
            }
          </div>
        </section>

        {
          this.state.showFilterBox && !this.state.selectedProject ?
            <section className="list-view-filters">
              <FilterProjects
                onSubmit={this.submitFilterForm}
                fromScTab={this.props.fromScTab}
              />
            </section> :
            <div/>
        }

        {
          !this.state.selectedProject ? (
              <PTable
                sorted={true}
                items={templatesTableData}
                wrapperState={this.state}
                tableOrderActive={this.state.tableOrderActive}
                clickOnColumnHeader={this.clickOnColumnHeader}
                isFetching={fetchingProjects}
                customClass='projects-list'
                pagination={paginationSettings}
              />
            )
             :
            <ProjectView project={this.state.selectedProject} contractsList={this.props.projects.contracts}/>
        }
      </div>
    )

  }
};

const mapStateToProps = (state, ownProps) => {
  return {
    projects: state.projects,
    local: state.localization,
    scProfile: state.SCProfile,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(actions, dispatch)
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Projects));
