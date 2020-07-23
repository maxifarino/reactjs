import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Modal } from 'react-bootstrap';
import { withRouter, Redirect, Link } from 'react-router-dom';

import * as usersActions from './actions';
import * as registerActions from '../register/actions';
import * as commonActions from '../common/actions'
import * as departmentsActions from '../certfocus/settings/departments/actions';

import Utils from '../../lib/utils';
import AddUser from './adduser';
import PTable from '../common/ptable';
import UserFilter from './filter';
import UserQuickView from './userquickview';

import { showQuickConfirmation } from '../alerts'
import RolAccess from './../common/rolAccess';


import './users.css';
// import { set } from 'mongoose';

class Users extends React.Component {
  constructor(props) {
    super(props);

    let query = Utils.getFetchQuery('name', 1, 'ASC');
    query.associatedOnly = 1

    this.addHCorSubId(query);

    const isAdmin = props.location.pathname == '/admin/users/'

    this.state = {
      isAdmin,
      filter: {
        pageNumber: 1
      },
      filterBox: {
        searchTerm: '',
        hiringClientId: '',
        roleId: 0,
        CFRoleId: 0
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

    props.actions.fetchUsers(query);
    props.registerActions.fetchResources();
    props.actions.fetchHiringClients();
    // props.actions.fetchSubContractors();

    this.props.departmentsActions.getDepartments({
      orderBy: 'name',
      orderDirection: 'ASC',
      archived: 0,
    });

  }

  componentWillReceiveProps(nextProps) {
    // console.log(`nextProps.users.totalAmountOfUsers in componentWillReceiveProps() = ${nextProps.users.totalAmountOfUsers}`)
    let newTotal = nextProps.users.totalAmountOfUsers

    if (newTotal >= 0) {
      this.setState({
        totalAmountOfUsers: newTotal
      })
    }
  }

  addHCorSubId(query) {
    const {
      fromHolderTab,
      fromHCtab,
      fromSCtab,
      fromProjectTab,
      hcId,
      scId,
      projectData,
    } = this.props;

    if (fromHCtab) {
      query.hiringClientId = hcId;
      query.searchPQOnly = true;
    } else if (fromHolderTab) {
      query.hiringClientId = hcId;
      //query.filterPrequalUsers = 'true'; TODO: remove this line permanently if we aren't going to use it anymore
    } else if (fromSCtab) {
      query.subcontractorId = scId;
      query.subcontractorUsersOnly = true;
      query.searchPQOnly = true;
    } else if (fromProjectTab) {
      query.hiringClientId = projectData.holderId;
      query.associatedOnly = 1;
    }

    return query;
  }

  // THE FUNCTION BELOW IS CALLED BY A FUNCTION THT IS ITSELF NOT BEING CALLED CURRENTLY.
  // I have commented it out in order to flag it as something that is not in use yet -- PP.
  // table's filter handlers
  /*setTabFilter = (e, roleId) => {
    if(this.state.filterBox.roleId !== roleId) {
      // get base query
      let query = Utils.getFetchQuery('name', 1, 'ASC');
      query.associatedOnly = 1
      // add search filters
      const filterBox = {
        searchTerm: '',
        hiringClientId: '',
        roleId
      };
      // add filters to query and ignore roleId = 0
      const queryFilter = {...filterBox};
      queryFilter.roleId = queryFilter.roleId===0?'':queryFilter.roleId;
      queryFilter.CFRoleId = queryFilter.CFRoleId===0?'':queryFilter.CFRoleId;
      query = Utils.addSearchFiltersToQuery(query, queryFilter);
      this.addHCorSubId(query);
      // fetch using query
      this.props.actions.fetchUsers(query);
      // reset state and update filterBox
      this.setState({
        tableOrderActive: 'name',
        filterBox,
        filter: {
          pageNumber: 1
        },
        order: {
          name: 'asc',
          mail: 'desc',
          role: 'desc',
          CFRole: 'desc',
          status: 'desc',
        }
      });
    }
  }*/

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

    this.addHCorSubId(query);
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
      query.associatedOnly = 1
      // add filters to query and ignore roleId = 0
      const queryFilter = this.state.filterBox;
      queryFilter.roleId = queryFilter.roleId === 0 ? '' : queryFilter.roleId;
      queryFilter.CFRoleId = queryFilter.CFRoleId === 0 ? '' : queryFilter.CFRoleId;
      query.showBothHCandSCusers = this.state.showBothHCandSCusers
      query = Utils.addSearchFiltersToQuery(query, queryFilter);
      this.addHCorSubId(query);
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

  submitFilterForm = values => {
    // get base query
    const field = this.state.tableOrderActive;
    const pageNumber = 1;
    const orderDirection = this.state.order[field] === 'asc' ? 'ASC' : 'DESC'
    let query = Utils.getFetchQuery(field, pageNumber, orderDirection);
    query.associatedOnly = 1
    // add search filters
    const filterBox = {
      searchTerm: values.keywords || '',
      hiringClientId: values.hiringClient || '',
      roleId: values.userType || '',
      CFRoleId: values.CFUserType || '',
    };

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

    // check to see if Admin is doing the Filtering, if so set admin flag = true, this allows pq users to be returned
    const allowedIds = new Set([1, 2, 5, 7])
    const roleId = Number(this.props.login.profile.RoleID)
    const cfroleId = Number(this.props.login.profile.CFRoleId)
    if (allowedIds.has(roleId) || cfroleId == 8) {
      query.admin = true
    }

    query = Utils.addSearchFiltersToQuery(query, queryFilter);
    this.addHCorSubId(query);
    // fetch using query
    this.props.actions.fetchUsers(query);
    // save searchterm and pagenumber
    this.setState({
      filterBox,
      filter: {
        pageNumber: 1
      }
    });
    // this.clickOnColumnHeader('', field, orderDirection)
  }

  // open and close

  toggleFilterBox = e => {
    e.preventDefault();
    this.setState({ showFilterBox: !this.state.showFilterBox });
    // RESET all filters on toggle
    /*if(this.state.showFilterBox) {
      const query = Utils.getFetchQuery('name', 1, 'ASC');
      this.props.actions.fetchUsers(query);
      this.setState({
        filter: {
          pageNumber: 1
        },
        tableOrderActive: 'name',
        order: {
          name: 'asc',
          mail: 'asc',
          company: 'asc',
          role: 'asc',
          status: 'asc',
        },
        filterBox: {
          searchTerm: '',
          hiringClientId: '',
          roleId: 0
        }
      });
    }*/
  }

  openAddUserModal = (e, userData) => {
    e.preventDefault();
    //this.props.commonActions.checkPermission(32, this.props.history);
    // if (!this.props.common.checkingAuthorizations) {
    //   if(!this.props.common.usersAuth) {
    //     this.props.history.push('/dashboard');
    //   }
    // }

    this.setState({
      showAddUserModal: true,
      currentEditingUser: userData
    });
  }

  closeAddUserModal = () => {
    this.setState({
      showAddUserModal: false
    });
  }

  // Submit UserForm
  submitUserForm = (values) => {
    // Sub from Sub Profile Page
    if (this.props.fromSCtab) {
      values.role = 4
      values.subContractorId = this.props.scId
      // HC from HC Profile Page
    } else if (this.props.fromHCtab || this.props.fromHolderTab) {
      values.HiringClientId = this.props.hcId;
      values.subContractorId = '';
      // HC from Project Page
    } else if (this.props.fromProjectTab) {
      values.HiringClientId = this.props.projectData.holderId;
      values.subContractorId = '';
    } else if (this.state.isAdmin) {
      //FIXME this definition must match with the one at src/components/users/adduser/index.js line 356
      const canSeeHCs = new Set([3, 6, 10, 23, 21, 20, 22]);
      const canSeeSCs = new Set([4, 11]);

      if (canSeeHCs.has(Number(values.cfRole)) || canSeeHCs.has(Number(values.role))) {
        // console.log('values = ', values)
        if (this.props.users.HiringClientsTags.length > 1) {
          values.HiringClientsMultiple = this.props.users.HiringClientsTags
          values.HiringClientId = null
        } else {
          // console.log('this.props.users.HiringClientsTags[0] = ', this.props.users.HiringClientsTags[0])
          const singleHCidOrNull = this.props.users.HiringClientsTags &&
            this.props.users.HiringClientsTags[0] && this.props.users.HiringClientsTags[0].id
            ? this.props.users.HiringClientsTags[0].id
            : null
          values.HiringClientId = singleHCidOrNull
          values.HiringClientsMultiple = null
        }
      }

      // TODO: Add and OR condition with the CFRole in case a CF only role user cannot be associated with a Insured
      if (canSeeSCs.has(Number(values.role))) {
        if (this.props.users.SubContractorsTags.length > 1) {
          values.SubcontractorsMultiple = this.props.users.SubContractorsTags
          values.subContractorId = null
        } else {
          // console.log('this.props.users.SubContractorsTags[0] = ', this.props.users.SubContractorsTags[0])
          const singleSubIdOrNull = this.props.users.SubContractorsTags &&
            this.props.users.SubContractorsTags[0] && this.props.users.SubContractorsTags[0].id
            ? this.props.users.SubContractorsTags[0].id
            : null
          values.subContractorId = singleSubIdOrNull
          values.SubcontractorsMultiple = null
        }
      }

    }
    // console.log('values = ', values)
    const { currentEditingUser } = this.state;
    this.props.commonActions.setLoading(true);
    const callback = (success, data) => {
      this.props.commonActions.setLoading(false);
      if (success) {

        if (typeof values.department !== 'undefined') {
          const queryParams = {
            departmentId: values.department,
            userId: (currentEditingUser) ? currentEditingUser.id : data.userId,
          }

          this.props.departmentsActions.addDepartmentUser(queryParams, (success) => {
            this.props.actions.fetchUsers(this.state.standardQuery)
          });

        } else {
          if (currentEditingUser && currentEditingUser.extraUserInfo.department) {
            const queryDelParams = {
              departmentId: currentEditingUser.extraUserInfo.department,
              userId: currentEditingUser.id,
            }
            this.props.departmentsActions.removeDepartmentUser(queryDelParams, (success) => {
              this.props.actions.fetchUsers(this.state.standardQuery)
            });
          } else {
            this.props.actions.fetchUsers(this.state.standardQuery)
          }
        }

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
    }

    if (currentEditingUser) {
      this.props.actions.sendUser(values, callback, currentEditingUser.id);

    }  else {
      this.props.actions.sendUser(values, callback);
    }



  }

  submitFailLoadReset = () => {
    this.props.commonActions.setLoading(false);
  }

  adjustSidebar = () => {
    const sidebar = document.querySelector('.viewport .sidebar-col');
    if (sidebar) {
      sidebar.style.height = document.body.scrollHeight + "px";
    }
  }

  handleMouseEnter = (e, userId) => {
    // this.props.actions.fetchHiringClients(userId);
    this.props.actions.fetchSubContractorsForPopover(userId);
    this.props.actions.fetchLogs(userId);

    setTimeout(this.adjustSidebar, 1000);

    // TO DO: set callback in the previous fetch resources actions so you can execute the resizing once the async was actually solved
  }

  handleMouseLeave = (e) => {
    this.props.actions.setPopoverHiringClients([]);
    this.props.actions.setPopoverSubcontractors([]);

    const sidebar = document.querySelector('.viewport .sidebar-col');
    if (sidebar) {
      sidebar.style.height = "auto";
    }
  }

  // THE FUNCTION BELOW IS NOT BEING CALLED CURRENTLY.
  // I have commented it out in order to flag it as something that is not in use yet -- PP.
  /*renderQuickFilterTabs () {
    let {
      filterNameAll,
      filterNameAdmin,
      filterNameOperator,
      filterNameHC,
      filterNameSC
    } = this.props.local.strings.users;

    const quickFilters = [
      {
        filterId: 0,
        filterName: filterNameAll,
        roleId: 0
      },
      {
        filterId: 1,
        filterName: filterNameAdmin,
        roleId: 1
      },
      {
        filterId: 2,
        filterName: filterNameOperator,
        roleId: 2
      },
      {
        filterId: 3,
        filterName: filterNameHC,
        roleId: 3
      },
      {
        filterId: 4,
        filterName: filterNameSC,
        roleId: 4
      },
    ];

    return (
      <ul className={`filter-tabs ${this.state.showFilterBox ? 'filter-tabs-disabled' : ''}`}>
        {
          quickFilters.map((filter, idx) => {
            const {filterId, filterName, roleId} = filter;
            return (
              <li key={idx}>
                <button
                  onClick={(e) => { this.setTabFilter(e, filterId) }}
                  className={`filter-tab ${parseInt(this.state.filterBox.roleId, 10) === roleId ? 'active': ''}`}>
                  {filterName}
                </button>
              </li>
            );
          })
        }
      </ul>
    );
  }*/

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
    let { quickViewLink, edituserLink /*, reviewApplicationsLink */ } = table;
    const { Role, CFRole } = this.props.login.profile;
    const { fromHCtab, fromSCtab, fromHolderTab, fromProjectTab, hcId } = this.props;
    const showMail = !fromHCtab && !fromSCtab && !fromHolderTab;
    const showCompany = !fromHolderTab && !fromProjectTab;
    //const showQuickView = !fromHCtab && !fromSCtab && !fromHolderTab && !fromProjectTab;
    const showPhone = fromProjectTab ? true : false;

    const usersTableMetadata = {
      fields: [
        'name',
        ...showPhone ? ['phone'] : [],
        ...showMail ? ['mail'] : [],
        ...showCompany ? ['company'] : [],
        ...Role ? ['role'] : [],
        ...CFRole ? ['CFRole'] : [],
        'status',
        'editUserLink'
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
        // reviewApplicationsLink: ''
      }
    };

    const usersRows = this.props.users.list.map((userItem, idx) => {
      return {
        editUserLink: (
          <RolAccess
            masterTab="users"
            sectionTab="edit_user"
            component={(e) => this.renderButtonEditUser(e, userItem)}>
          </RolAccess>
        ),
        status: (
          <span
            className={`status-cell ${(userItem.status.toLowerCase()).replace(/\s/g, '')}`}
          >
            {userItem.status}
          </span>
        ),
        phone: (userItem.extraUserInfo.phone)? Utils.formatPhoneNumber(userItem.extraUserInfo.phone) : '',
        mail: userItem.email,
        company: userItem.company,
        role: userItem.userType || '---',
        CFRole: userItem.CFUserType || '---',
        name: userItem.name
      }
    });

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
        onClick={this.openAddUserModal}>
        {this.props.local.strings.users.buttonAddUser}
      </a>
    );

    return component;
  }

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

  renderButtonLogUser() {
    let component = (
      <li>
        <Link className="list-view-nav-link nav-bn icon-log" to="/admin/users/log">{this.props.local.strings.users.buttonUserLog}</Link>
      </li>
    );

    return component;
  }

  render() {
    let {
      buttonFilterUser,
      buttonAddUser,
      buttonUserLog
    } = this.props.local.strings.users;
    const { fromHCtab, fromSCtab, fromHolderTab, fromProjectTab } = this.props;

    if (!fromHCtab && !fromSCtab && this.props.login.profile.Role) {
      const { Role } = this.props.login.profile;
      if (Role.IsHCRole || Role.IsSCRole) {
        // HC and SC should not be here
        return <Redirect push to="/profile" />;
      }
    }

    let { usersPerPage } = this.props.users;
    let { totalAmountOfUsers } = this.state
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
              fromAdmin={this.state.isAdmin}
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
              <UserFilter
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
};

const mapStateToProps = (state, ownProps) => {
  return {
    common: state.common,
    users: state.users,
    local: state.localization,
    login: state.login,
    projectData: state.projectDetails.projectData,
    departments: state.departments,
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(usersActions, dispatch),
    registerActions: bindActionCreators(registerActions, dispatch),
    commonActions: bindActionCreators(commonActions, dispatch),
    departmentsActions: bindActionCreators(departmentsActions, dispatch),
  }
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Users));
