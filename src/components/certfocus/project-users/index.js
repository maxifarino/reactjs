import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {bindActionCreators} from "redux";
import {withRouter} from "react-router-dom";
import {connect} from "react-redux";
import Utils from "../../../lib/utils";
import * as projectUsersActions from "./actions";
import RolAccess from "../../common/rolAccess";
import PTable from "../../common/ptable";
import FilterProjectUsersForm from "./filter"

import * as registerActions from "../../register/actions";
import {Modal} from "react-bootstrap";
import AddProjectUserForm from "./ProjectAddUser";
import './projectUsers.css'
import {showQuickConfirmation} from "../../alerts";
import * as commonActions from "../../common/actions"
import Swal from "sweetalert2";

class ProjectUsers extends Component {

  constructor(props) {
    super(props);

    const {
      projectData,
    } = this.props;

    this.state = {
      filter: {
        pageNumber: 1
      },
      showFilterBox: false,
      totalAmountOfProjectUsers: 0,
      tableOrderActive: 'Name',
      order: {
        Name: 'asc',
        Mail: 'desc',
        PQRole: 'desc',
        CFRole: 'desc',
        status: 'desc',
      },
    };

    props.registerActions.fetchResources();

    let query = Utils.getFetchQuery('Name', 1, 'ASC');
    query.hiringClientId = projectData.holderId;

    query.projectId = projectData.id;
    query.Archived = 0;

    props.actions.fetchProjectUsers(query)
    props.actions.fetchAvailableProjectUsers(this.props.projectData.id, this.props.projectData.holderId)
  }

  setPageFilter = (e, pageNumber, force) => {
    if (force || this.state.filter.pageNumber !== pageNumber) {
      // get base query
      const field = this.state.tableOrderActive;
      const orderDirection = this.state.order[field] === 'asc' ? 'ASC' : 'DESC'
      let query = Utils.getFetchQuery(field, pageNumber, orderDirection);
      // add filters to query and ignore roleId = 0
      const queryFilter = this.state.filterBox;
      query = Utils.addSearchFiltersToQuery(query, queryFilter);
      query.projectId = this.props.projectData.id;
      // fetch using query
      this.props.actions.fetchProjectUsers(query);
      // save page number
      this.setState({
        filter: {
          pageNumber
        }
      });

    }
  }

  toggleFilterBox = e => {
    e.preventDefault();
    this.setState({showFilterBox: !this.state.showFilterBox});
  };

  getUsersTableData() {
    let {
      tableHeaderName,
      tableHeaderPhone,
      tableHeaderEmail,
      tableHeaderUserType,
      tableHeaderStatus
    } = this.props.local.strings.projectUsers;
    const {Role, CFRole} = this.props.login.profile;
    const showMail = true;
    const showPhone = true;

    const usersTableMetadata = {
      fields: [
        'Name',
        ...showPhone ? ['Phone'] : [],
        ...showMail ? ['Mail'] : [],
        ...Role ? ['PQRole'] : [],
        ...CFRole ? ['CFRole'] : [],
        'status',
        'editUserLink'
      ],
      header: {
        Name: tableHeaderName,
        Phone: tableHeaderPhone,
        Mail: tableHeaderEmail,
        PQRole: `${CFRole ? 'PQ' : ''} ${tableHeaderUserType}`,
        CFRole: `${Role ? 'CF' : ''} ${tableHeaderUserType}`,
        status: tableHeaderStatus,
        editUserLink: '',
      }
    };

    //TODO: fetch project users list
    let usersRows = [];
    if (this.props.projectUsers.list) {
      usersRows = this.props.projectUsers.list.map((userItem, idx) => {
        let status = (!userItem.Archived) ? 'active' : 'inactive';
        return {
          editUserLink: (!userItem.Archived) ? (
            <RolAccess
              masterTab="users"
              sectionTab="edit_user"
              component={() => this.renderButtonDeleteProjectUser(userItem.UserId)}>
            </RolAccess>
          ) : (
            <RolAccess
              masterTab="users"
              sectionTab="edit_user"
              component={() => this.renderButtonRestoreProjectUser(userItem.UserId)}>
            </RolAccess>
          ),
          status: (
            <span
              className={`status-cell ${status}`}
            >
            {status}
          </span>
          ),
          Phone: (userItem.Phone) ? Utils.formatPhoneNumber(userItem.Phone) : '',
          Mail: userItem.Mail,
          PQRole: userItem.PQRole || '---',
          CFRole: userItem.CFRole || '---',
          Name: userItem.Name
        }
      });
    }
    return {
      fields: usersTableMetadata.fields,
      header: usersTableMetadata.header,
      body: usersRows
    };
  }

  renderButtonAddUser() {
    let component = (
      <a
        className="list-view-nav-link nav-bn icon-add"
        ref="target"
        onClick={this.openProjectAddUserModal}>
        {this.props.local.strings.projectUsers.buttonAddUser}
      </a>
    );

    return component;
  }

  closeProjectAddUserModal = () => {
    const {projectData} = this.props;
    this.setState({
      showProjectAddUserModal: false
    });
    this.props.actions.fetchAvailableProjectUsers(projectData.id, projectData.holderId)

  }

  openProjectAddUserModal = (e, userData) => {
    e.preventDefault();
    this.props.actions.setProjectUsersListError('');
    this.setState({
      showProjectAddUserModal: true,
    });
  }

  handleAddProjectUser = (values) => {
    const {
      projectData,
    } = this.props;

    this.props.commonActions.setLoading(true);
    const callback = (success) => {
      this.props.commonActions.setLoading(false);
      if (success) {

        showQuickConfirmation(
          {
            title: `User has been successfully added`,
            timer: 1500
          }
        );
        this.closeProjectAddUserModal();
      } else {
        showQuickConfirmation(
          {
            title: `ERROR: User WAS NOT  added.  Please contact Administrator`,
            timer: 3000
          }
        );
      }
    };

    let payload = {
      projectId: projectData.id,
      userId: values.user,
    };

    this.props.actions.sendProjectUser(payload, callback);

  };

  clickOnColumnHeader = (e, field, _orderDirection) => {

    const orderDirection = this.state.order[field] === 'asc' ? 'DESC' : 'ASC';

    // if (field === 'quickViewLink' || field === 'editUserLink') return;
    // get base query
    const pageNumber = this.state.filter.pageNumber;

    let query = Utils.getFetchQuery(field, pageNumber, orderDirection);

    // add filters to query and ignore roleId = 0
    const queryFilter = this.state.filterBox;
    query = Utils.addSearchFiltersToQuery(query, queryFilter);
    // fetch using query
    query.projectId = this.props.projectData.id;

    this.props.actions.fetchProjectUsers(query);
    // save new active tab and order
    let newState = {
      tableOrderActive: field,
      order: {
        Name: field === 'Name' ? 'asc' : 'desc',
        Mail: field === 'Mail' ? 'asc' : 'desc',
        PQRole: field === 'PQRole' ? 'asc' : 'desc',
        CFRole: field === 'CFRole' ? 'asc' : 'desc',
        status: field === 'Archived' ? 'asc' : 'desc',
      }
    };
    newState.order[field] = this.state.order[field] === 'asc' ? 'desc' : 'asc';
    this.setState(newState);
  };

  submitFilterForm = values => {
    // get base query
    const field = this.state.tableOrderActive;
    const pageNumber = 1;
    const orderDirection = this.state.order[field] === 'asc' ? 'ASC' : 'DESC'
    let query = Utils.getFetchQuery(field, pageNumber, orderDirection);
    // query.associatedOnly = 1
    // add search filters
    const filterBox = {
      searchTerm: values.keywords || '',
      Name: values.Name || '',
      PQRoleId: values.userType || '',
      CFRoleId: values.CFUserType || '',
      Archived: values.Archived || 0,
    };
    // add filters to query and ignore roleId = 0
    const queryFilter = {...filterBox};

    // check to see if Admin is doing the Filtering, if so set admin flag = true, this allows pq users to be returned
    query = Utils.addSearchFiltersToQuery(query, queryFilter);
    query.projectId = this.props.projectData.id;
    // fetch using query
    this.props.actions.fetchProjectUsers(query);
    // save searchterm and pagenumber
    this.setState({
      filterBox,
      filter: {
        pageNumber: 1
      }
    });
  }

  renderButtonDeleteProjectUser = (userId) => {
    return (
      <a
        onClick={() => this.removeProjectUser(userId)}
        className="cell-table-link icon-delete"
      >
        {this.props.local.strings.projectUsers.removeProjectUser}
      </a>
    );
  };

  renderButtonRestoreProjectUser(userId) {
    return (
      <a
        onClick={() => this.restoreProjectUser(userId)}
        className="cell-table-link icon-if_upload_103738"
      >
        {this.props.local.strings.projectUsers.restoreProjectUser}
      </a>
    );
  }

  restoreProjectUser = (userId) => {
    let params = {
      projectId: this.props.projectData.id,
      userId
    };
    this.props.actions.toggleProjectUserStatus(params)
      .then(response => {
        this.setPageFilter(null, 1, true);
      })
  }

  removeProjectUser = (userId) => {
    Swal({
      title: this.props.local.strings.projectUsers.removeTitle,
      html: `Are you sure you want to archive this user?`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#2E5965',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes!'
    }).then((result) => {
      let params = {
        projectId: this.props.projectData.id,
        userId
      };
      if (result.value) {
        this.props.actions.toggleProjectUserStatus(params)
          .then(response => {
            this.setPageFilter(null, 1, true);
          })
      }
    });
  };

  render() {

    let {projectUsersPerPage} = this.props.projectUsers; // TODO: this value should be on the project users list
    const paginationSettings = {
      total: this.props.projectUsers.totalAmountOfProjectUsers,
      itemsPerPage: projectUsersPerPage,
      setPageHandler: this.setPageFilter,
      currentPageNumber: this.state.filter.pageNumber,
    };
    let {
      buttonFilterUser,
    } = this.props.local.strings.projectUsers;
    return (
      <div className="list-view admin-view-body">

        <Modal
          show={this.state.showProjectAddUserModal}
          onHide={this.closeProjectAddUserModal}
          className="add-item-modal add-user-modal">
          <Modal.Body>
            <AddProjectUserForm
              close={this.closeProjectAddUserModal}
              onSubmit={this.handleAddProjectUser}
              projectName={this.props.projectData.name}
              holderUsers={this.props.projectUsers.availableUsers}
            />
          </Modal.Body>
        </Modal>

        <section className="list-view-header">
          <div className="row">
            <div className="col-sm-5 filters-col">
            </div>
            <div className="col-sm-7">
              <nav className="list-view-nav">
                <ul>
                  <li>
                    <a
                      className="list-view-nav-link nav-bn icon-login-door"
                      onClick={this.toggleFilterBox}>
                      {buttonFilterUser}
                    </a>
                  </li>
                  <li>
                    <RolAccess
                      masterTab="users"
                      sectionTab="add_user"
                      component={() => this.renderButtonAddUser()}>
                    </RolAccess>
                  </li>
                </ul>

              </nav>
            </div>
          </div>
        </section>

        {
          this.state.showFilterBox ?
            <section className="list-view-filters">
              <FilterProjectUsersForm
                hiringClients={this.props.users.hiringClientsOptions}
                onSubmit={this.submitFilterForm}
              />
            </section> : ''
        }

        <PTable
          sorted={true}
          wrapperState={this.state}
          tableOrderActive={this.state.tableOrderActive}
          items={this.getUsersTableData()}
          clickOnColumnHeader={this.clickOnColumnHeader}
          isFetching={this.props.projectUsers.fetchingUsers}
          customClass='users-list'
          pagination={paginationSettings}
        />
      </div>
    );
  }
}

ProjectUsers.propTypes = {
  projectId: PropTypes.number.isRequired,
};

const mapStateToProps = (state, ownProps) => {
  return {
    common: state.common,
    local: state.localization,
    users: state.users,
    projectUsers: state.projectUsers,
    login: state.login,
    projectData: state.projectDetails.projectData,
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(projectUsersActions, dispatch),
    registerActions: bindActionCreators(registerActions, dispatch),
    commonActions: bindActionCreators(commonActions, dispatch),
  }
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ProjectUsers));

