import React, {Component} from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Modal } from 'react-bootstrap';
import { withRouter, Redirect, Link } from 'react-router-dom';
import swal from "sweetalert2"

import Utils from "../../../../../lib/utils";
import AddUser from "../../../../users/adduser";
import PTable from "../../../../common/ptable";

import RolAccess from "../../../../common/rolAccess";
import {showQuickConfirmation} from '../../../../alerts'

import * as usersActions from "../../../../users/actions";
import * as registerActions from "../../../../register/actions";
import * as commonActions from "../../../../common/actions";
import UserFilter from "../../../../users/filter";
import Swal from "sweetalert2";
import FilterHolderUsers from "./filter";

class HolderUsers extends Component {

  constructor(props) {
    super(props);

    let query = Utils.getFetchQuery('name', 1, 'ASC');
    query.associatedOnly = 1;
    query.hiringClientId = this.props.hcId;
    query.holderUsersArchived = 0;
    props.actions.fetchUsers(query);

    this.state = {
      isAdmin: false,
      filter: {
        pageNumber: 1
      },
      filterBox: {
        searchTerm: '',
        hiringClientId: this.props.hcId,
        roleId: 0,
        CFRoleId: 0,
        holderUsersArchived: 0,
        searchCFOnly: true,
        associatedOnly: 1,
      },
      showAddUserModal: false,
      showFilterBox: false,
      tableOrderActive: 'name',
      order: {
        name: 'asc',
        mail: 'desc',
        company: 'desc',
        role: 'desc',
        CFRole: 'desc',
        status: 'desc',
      },
      currentEditingUser: {},
      standardQuery: query,
      totalAmountOfUsers: 0,
      showBothHCandSCusers: false,
      showHCOptions: false,
      showSCOptions: false
    };

    props.registerActions.fetchResources();

  }

  /**
   * Build the user status toggle link
   * @param userId {Number} ID of the user to toggle
   * @param userArchived {Boolean} Bool with the archived status of the user
   * @returns {Component}
   */
  getUserStatusLink = (userId, userArchived) => {
    if (userArchived) {
      return (
        <a
          onClick={() => this.restoreHolderUser(userId)}
          className="cell-table-link icon-if_upload_103738"
        >
          {this.props.local.strings.holderUsers.table.restoreUser}
        </a>
      );
    }
    return (
      <a
        onClick={() => this.removeHolderUser(userId)}
        className="cell-table-link icon-delete"
      >
        {this.props.local.strings.holderUsers.table.archiveUser}
      </a>
    );
  }




  /**
   * Build table body for the users list available at this.props.users.list
   * @returns {{header: ({role: string, mail: *, phone: *, archiveLink: string, name: *, company: *, editUserLink: string, CFRole: string, status: *}|{role: string, mail: *, phone: *, archiveLink: string, name: *, company: *, editUserLink: string, CFRole: string, status: *}), fields: *[], body: *}}
   */
  getUsersTableData() {
    let {
      table,
      tableHeaderName,
      tableHeaderPhone,
      tableHeaderEmail,
      tableHeaderCompany,
      tableHeaderUserType,
      tableHeaderStatus
    } = this.props.local.strings.users;
    const { Role, CFRole } = this.props.login.profile;

    const usersTableMetadata = {
      fields: [
        'name',
        'phone',
        'mail',
        ...Role ? ['role'] : [],
        ...CFRole ? ['CFRole'] : [],
        'status',
        'editUserLink',
        'archiveLink'
      ],
      header: {
        name: tableHeaderName,
        phone: tableHeaderPhone,
        mail: tableHeaderEmail,
        company: tableHeaderCompany,
        role: `${CFRole ? 'PQ' : ''} ${tableHeaderUserType}`,
        CFRole: `${Role ? 'CF' : ''} ${tableHeaderUserType}`,
        status: tableHeaderStatus,
        editUserLink: '',
        archiveLink: '',
      }
    };

    const usersRows = this.props.users.list.map((userItem, idx) => {
      let userStatus = 'Active';
      let userStatusClass = 'active';
      const {holderUserArchived, phone} = userItem.extraUserInfo;
      const {id, email, userType, CFUserType, name} = userItem

      if (holderUserArchived) {
        userStatus = 'Archived';
        userStatusClass = 'inactive';
      }
      return {
        editUserLink: !holderUserArchived ? (          <RolAccess
          masterTab="users"
          sectionTab="edit_user"
          component={(e) => this.renderButtonEditUser(e, userItem)}>
        </RolAccess>) : null
        ,
        archiveLink: this.getUserStatusLink(id, holderUserArchived),
        status: (
          <span
            className={`status-cell ${userStatusClass}`}
          >
            {userStatus}
          </span>
        ),
        phone: (phone)? Utils.formatPhoneNumber(phone) : '--',
        mail: email,
        role: userType || '---',
        CFRole: CFUserType || '---',
        name: name
      }

    });

    return {
      fields: usersTableMetadata.fields,
      header: usersTableMetadata.header,
      body: usersRows
    };
  }

  /**
   * Render the add user button
   * @returns {Component}
   */
  renderButtonAddUser() {
    let component = (
      <a
        className="list-view-nav-link nav-bn icon-add"
        ref="target"
        onClick={this.openAddUserModal}>
        {this.props.local.strings.holderUsers.buttonAddUser}
      </a>
    );

    return component;
  }

  /**
   * Render the edit user link component
   * @param elem {MouseEvent} Element that triggered the mouse event
   * @param userItem {Object} Object with user data to bypass to the form
   * @returns {Component} Edit link
   */
  renderButtonEditUser(elem, userItem) {
    let component = (
      <a
        className='icon-edit cell-table-link'
        onClick={(elem) => { this.openAddUserModal(elem, userItem) }}>
        {this.props.local.strings.users.table.edituserLink}
      </a>
    );

    return component;
  }

  clickOnColumnHeader = (e, field, _orderDirection) => {

    const orderDirection = this.state.order[field] === 'asc' ? 'DESC' : 'ASC'

    if (field === 'quickViewLink' || field === 'editUserLink') return;
    // get base query
    const pageNumber = this.state.filter.pageNumber;

    let query = Utils.getFetchQuery(field, pageNumber, orderDirection);
    query.associatedOnly = 1
    // add filters to query and ignore roleId = 0
    const queryFilter = this.state.filterBox;
    queryFilter.roleId = queryFilter.roleId === 0 ? '' : queryFilter.roleId;
    queryFilter.CFRoleId = queryFilter.CFRoleId === 0 ? '' : queryFilter.CFRoleId;
    query = Utils.addSearchFiltersToQuery(query, queryFilter);
    query.showBothHCandSCusers = this.state.showBothHCandSCusers

    // this.addHCorSubId(query);
    // fetch using query

    this.props.actions.fetchUsers(query);
    // save new active tab and order
    let newState = {
      tableOrderActive: field,
      order: {
        name: field === 'name' ? 'asc' : 'desc',
        mail: field === 'mail' ? 'asc' : 'desc',
        company: field === 'company' ? 'asc' : 'desc',
        role: field === 'role' ? 'asc' : 'desc',
        CFRole: field === 'CFRole' ? 'asc' : 'desc',
        status: field === 'status' ? 'asc' : 'desc',
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
      // add filters to query and ignore roleId = 0
      const queryFilter = this.state.filterBox;
      queryFilter.roleId = queryFilter.roleId === 0 ? '' : queryFilter.roleId;
      queryFilter.CFRoleId = queryFilter.CFRoleId === 0 ? '' : queryFilter.CFRoleId;
      query = Utils.addSearchFiltersToQuery(query, queryFilter);
      // fetch using query
      this.props.actions.fetchUsers(query);
      // save page number
      this.setState({
        filter: {
          pageNumber
        }
      });

    }
  }

  /**
   * Apply filter
   * @param values
   */
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
      hiringClientId: this.props.hcId,
      roleId: values.userType || '',
      CFRoleId: values.CFUserType || '',
      searchCFOnly: true,
      holderUsersArchived: values.holderUsersArchived || '0',
      associatedOnly: 1,
    };
    //todo: check if we can remove this.
    if (values.hiringClient) {
      query.showBothHCandSCusers = true
      this.setState({
        showBothHCandSCusers: true
      })
    } else {
      this.setState({
        showBothHCandSCusers: false
      })
    }
    // add filters to query and ignore roleId = 0
    const queryFilter = { ...filterBox };

    queryFilter.roleId = queryFilter.roleId === 0 ? '' : queryFilter.roleId;
    queryFilter.CFRoleId = queryFilter.CFRoleId === 0 ? '' : queryFilter.CFRoleId;
    queryFilter.holderUsersArchived = queryFilter.holderUsersArchived === 0 ? '' : queryFilter.holderUsersArchived;

    query = Utils.addSearchFiltersToQuery(query, queryFilter);
    // fetch using query
    this.props.actions.fetchUsers(query);
    // save searchterm and pagenumber
    this.setState({
      filterBox,
      filter: {
        pageNumber: 1
      }
    });
  }

  // open and close

  toggleFilterBox = e => {
    e.preventDefault();
    this.setState({ showFilterBox: !this.state.showFilterBox });
  }

  openAddUserModal = (e, userData) => {
    e.preventDefault();

    this.setState({
      showAddUserModal: true,
      currentEditingUser: userData
    });
  }

  closeAddUserModal = () => {
    this.setState({
      showAddUserModal: false
    });
    // clear data
    this.props.actions.setHiringClientsTags([]);
    this.props.actions.setSubContractorsTags([]);
    this.props.actions.setCurrentEditingUser();
  }

  submitUserForm = (values) => {
    // we don't have to alter the HiringClientsTags that we have
    values.HiringClientId = null;
    values.HiringClientsMultiple = this.props.users.HiringClientsTags

    const { currentEditingUser } = this.state;
    this.props.commonActions.setLoading(true);
    const callback = (success) => {
      this.props.commonActions.setLoading(false);
      if (success) {
        showQuickConfirmation(
          {
            title: `User has been successfully ${currentEditingUser ? 'edited' : 'added'}`,
            timer: 1500
          }
        );
        this.closeAddUserModal();
      } else {
        showQuickConfirmation(
          {
            title: `ERROR: User WAS NOT ${currentEditingUser ? 'edited' : 'added'}.  Please contact Administrator`,
            timer: 3000
          }
        );
      }
      this.props.actions.fetchUsers(this.state.standardQuery)
    }

    if (currentEditingUser) {
      this.props.actions.sendUser(values, callback, currentEditingUser.id);
    } else if (this.props.users.currentEditingUser) {
      this.props.actions.sendUser(values, callback, this.props.users.currentEditingUser.id);
    } else {
      this.props.actions.sendUser(values, callback);
    }
  }

  submitFailLoadReset = () => {
    this.props.commonActions.setLoading(false);
  }

  removeHolderUser = (userId) => {
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
        holderId: this.props.hcId,
        userId
      };
      if (result.value) {
        this.props.actions.toggleHolderUserStatus(params)
          .then(response => {
            this.setPageFilter(null, 1, true);
          });
      }
    });
  };

  restoreHolderUser(userId) {
    let params = {
      holderId: this.props.hcId,
      userId
    };
    this.props.actions.toggleHolderUserStatus(params)
      .then(response => {
        this.setPageFilter(null, 1, true);
      })
  }

  render() {
    let {
      buttonFilterUser,
      buttonAddUser,
    } = this.props.local.strings.users;
    const { fromHCtab, fromSCtab, fromHolderTab, fromProjectTab } = this.props;

    let { usersPerPage } = this.props.users;
    let { totalAmountOfUsers } = this.state;

    const paginationSettings = {
      total: totalAmountOfUsers,
      itemsPerPage: usersPerPage,
      setPageHandler: this.setPageFilter,
      currentPageNumber: this.state.filter.pageNumber,
    };

    return (

      <div className="list-view admin-view-body">
        <Modal
          show={this.state.showAddUserModal}
          onHide={this.closeAddUserModal}
          className="add-item-modal add-user-modal" >
          <Modal.Body>
            <AddUser
              close={this.closeAddUserModal}
              submitFailLoadReset={this.submitFailLoadReset}
              onSubmit={this.submitUserForm}
              currentEditingUser={this.state.currentEditingUser}
              fromAdmin={false}
              fromHCtab={fromHCtab}
              fromSCtab={fromSCtab}
              fromHolderTab={fromHolderTab}
              fromProjectTab={fromProjectTab}
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
                  {!fromHolderTab && !fromProjectTab &&
                  <RolAccess
                    masterTab="users"
                    sectionTab="user_log"
                    component={() => this.renderButtonLogUser()}>
                  </RolAccess>
                  }
                </ul>

              </nav>
            </div>
          </div>
        </section>

        {
          this.state.showFilterBox ?
            <section className="list-view-filters">
              <FilterHolderUsers
                hiringClients={this.props.users.hiringClientsOptions}
                onSubmit={this.submitFilterForm}
                fromHCtab={fromHCtab}
                fromSCtab={fromSCtab}
                fromHolderTab={fromHolderTab}
                fromProjectTab={fromProjectTab}
              />
            </section> :
            <div></div>
        }

        <PTable
          sorted={true}
          wrapperState={this.state}
          tableOrderActive={this.state.tableOrderActive}
          items={this.getUsersTableData()}
          clickOnColumnHeader={this.clickOnColumnHeader}
          isFetching={this.props.users.fetchingUsers}
          customClass='users-list'
          pagination={paginationSettings}
        />
      </div>
    );
  };
}

const mapStateToProps = (state, ownProps) => {
  return {
    common: state.common,
    users: state.users,
    local: state.localization,
    login: state.login,
    // projectData: state.projectDetails.projectData,
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(usersActions, dispatch),
    registerActions: bindActionCreators(registerActions, dispatch),
    commonActions: bindActionCreators(commonActions, dispatch)
  }
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(HolderUsers));