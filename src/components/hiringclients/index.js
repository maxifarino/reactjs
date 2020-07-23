import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { reset } from 'redux-form';
import { Link, Redirect } from 'react-router-dom';
import { Modal } from 'react-bootstrap';

import AddHCModal from './addHCModal';
import AddHolderModal from '../certfocus/modals/addHolderModal';
import PTable from '../common/ptable';
import TypeAheadAndSearch from '../common/typeAheadAndSearch';

import Utils from '../../lib/utils';
import FilterHC from './filter';

import * as hcActions from './actions';
import * as hcProfileActions from '../hc-profile/actions';
import * as holderProfileActions from '../certfocus/holders-profile/actions';
import * as commonActions from '../common/actions';
import * as departmentsActions from '../certfocus/settings/departments/actions';

import RolAccess from './../common/rolAccess';

import './hiringClients.css';

import Swal from 'sweetalert2';
import SystemSwitch from "../auth/systemSwitch";

class HiringClients extends Component {
  constructor(props) {
    super(props);

    this.state = {
      filter: {
        pageNumber: 1
      },
      filterBox: {
        searchTerm: '',
        contactNameTerm: '',
        nameTerm: ''
      },
      tableOrderActive: 'name',
      showFilterBox: false,
      order: {
        id: 'desc',
        name: 'asc',
        parentHolder: 'desc',
        registrationUrl: 'desc',
        state: 'desc',
        portalURL: 'desc',
        contactName: 'desc',
        phone: 'desc'
      },
      currentHC: null,
      preQualView: false,
      certFocusView: false,
      fetched: false,
    };
  }

  componentDidMount() {
    // If the user profile is present, fetch the list
    const { CFRole, Role } = this.props.login.profile;
    // this.initialFetch(CFRole, Role);
    this.props.commonActions.setBreadcrumbItems([]);

    this.props.departmentsActions.getDepartments({
      orderBy: 'name',
      orderDirection: 'ASC',
      archived: 0,
    });

    this.handleSystemChange(this.props.login.currentSystem)
  }

  componentWillReceiveProps(nextProps) {
    // If the user profile was yet not fetched, wait for it and fetch the list
    const { CFRole, Role } = this.props.login.profile;
    const newCFRole = nextProps.login.profile.CFRole;
    const newRole = nextProps.login.profile.Role;

    if ((newRole && newRole != Role) || (newCFRole && newCFRole != CFRole)) {
      const _Role = newRole && newRole != Role ? newRole : Role
      const _CFRole = newCFRole && newCFRole != CFRole ? newCFRole : CFRole
      // this.initialFetch(_CFRole, _Role);
    }
  }

  initialFetch = (CFRole, Role) => {

    if ((Role || CFRole) && !this.state.fetched) {
      this.setState({ fetched: true }, () => {
        if (Role && CFRole) {
          const view = localStorage.getItem('HiringClientsHolderView');

          if (view === 'cf') {
            this.setState({ certFocusView: true });
            this.props.actions.fetchHolders({ archive: 0, orderBy: 'name', orderDirection: 'ASC' });
          } else {
            this.setState({ preQualView: true });
            this.props.actions.fetchHiringClients({ orderBy: 'name', orderDirection: 'ASC' });
          }
        } else if (Role) {
          this.setState({ preQualView: true });
          this.props.actions.fetchHiringClients({ orderBy: 'name', orderDirection: 'ASC' });
        } else if (CFRole) {
          this.setState({ certFocusView: true });
          this.props.actions.fetchHolders({ orderBy: 'name', orderDirection: 'ASC' });
        }
      });
    }
  }

  // User hc or holders EP depending on the selected system
  fetchHiringClientsBySystem = (query) => {
    const { preQualView, certFocusView } = this.state;

    if (preQualView) {
      query.system = 'pq';
      this.props.actions.fetchHiringClients(query);
    } else if (certFocusView) {
      this.props.actions.fetchHolders(query);
    }
  }

  // Reset al filters and table data when switching systems
  handleSystemChange = (system) => {
    // if (!this.props.hc.fetchingHC) {
      this.props.dispatch(reset('FilterHC'));

      this.setState({
        filter: {
          pageNumber: 1
        },
        filterBox: {
          searchTerm: '',
          contactNameTerm: '',
          nameTerm: ''
        },
        tableOrderActive: 'name',
        showFilterBox: false,
        order: {
          id: 'desc',
          name: 'asc',
          parentHolder: 'desc',
          registrationUrl: 'desc',
          state: 'desc',
          portalURL: 'desc',
          contactName: 'desc',
          phone: 'desc'
        },
      });

      localStorage.setItem('HiringClientsHolderView', system);

      if (system === 'pq') {
        this.setState({ certFocusView: false, preQualView: true }, () => {
          this.fetchHiringClientsBySystem({ orderBy: 'name', orderDirection: 'ASC' });
        });
      } else if (system === 'cf') {
        this.setState({ certFocusView: true, preQualView: false }, () => {
          this.fetchHiringClientsBySystem({ orderBy: 'name', orderDirection: 'ASC', archive: 0 });
        });
      }
    // }
  }

  clickOnColumnHeader = (e, field) => {
    if (field === 'view' || field === 'edit') return;

    // get base query
    const pageNumber = this.state.filter.pageNumber;
    const orderDirection = this.state.order[field] === 'asc' ? 'DESC' : 'ASC'
    let query = Utils.getFetchQuery(field, pageNumber, orderDirection);

    // add search filters
    query = Utils.addSearchFiltersToQuery(query, this.state.filterBox);

    // fetch using query
    this.fetchHiringClientsBySystem(query);

    // save new active tab and order
    let newState = {
      tableOrderActive: field,
      order: {
        id: field === 'id' ? 'asc' : 'desc',
        name: field === 'name' ? 'asc' : 'desc',
        parentHolder: field === 'parentHolder' ? 'asc' : 'desc',
        registrationUrl: field === 'registrationUrl' ? 'asc' : 'desc',
        state: field === 'state' ? 'asc' : 'desc',
        portalURL: field === 'portalURL' ? 'asc' : 'desc',
        contactName: field === 'contactName' ? 'asc' : 'desc',
        phone: field === 'phone' ? 'asc' : 'desc',
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

      // add search filters
      query = Utils.addSearchFiltersToQuery(query, this.state.filterBox);

      // fetch using query
      this.fetchHiringClientsBySystem(query);

      // save page number
      this.setState({
        filter: {
          pageNumber
        }
      });
    }
  }

  toggleFilterBox = () => {
    this.setState({ showFilterBox: !this.state.showFilterBox });
  }

  submitFilterForm = (values) => {
    // get base query
    const field = this.state.tableOrderActive;
    const pageNumber = 1;
    const orderDirection = this.state.order[field] === 'asc' ? 'ASC' : 'DESC'
    let query = Utils.getFetchQuery(field, pageNumber, orderDirection);

    // add search filters
    const filterBox = {
      searchTerm: values.keywords || '',
      contactNameTerm: values.contactNameTerm || '',
      nameTerm: values.nameTerm || '',
      archive: values.archive || '',
    };
    query = Utils.addSearchFiltersToQuery(query, filterBox);

    // fetch using query
    this.fetchHiringClientsBySystem(query);

    // save searchterm and pagenumber
    this.setState({
      filterBox,
      filter: {
        pageNumber: 1
      }
    });
  }

  openAddHCModal = (type) => {
    this.setState({ currentHC: null });

    if (type === 'hc') {
      this.props.actions.setShowModal(true);
    } else if (type === 'holders') {
      this.props.actions.setShowHoldersModal(true);
    }
  }

  closeAddHCModal = (type) => {
    if (type === 'hc') {
      this.props.actions.setShowModal(false);
    } else if (type === 'holders') {
      this.props.actions.setShowHoldersModal(false);
    }
  }

  closeAddHCModalAndRefresh = () => {
    this.props.actions.setShowModal(false);
    this.props.actions.setShowHoldersModal(false);
    this.setPageFilter(null, 1, true);
  }

  openEditHCModal = (hc, type) => {
    const { fetchHCProfile } = this.props.hcProfileActions;
    const { fetchHolderProfile } = this.props.holderProfileActions;
    const { setLoading } = this.props.commonActions;
    setLoading(true);

    if (type === 'hc') {
      fetchHCProfile(hc, (profile) => {
        setLoading(false);
        this.setState({ currentHC: profile || hc });
        this.props.actions.setShowModal(true);
      });
    } else if (type === 'holders') {
      fetchHolderProfile(hc, (profile) => {
        setLoading(false);
        this.setState({ currentHC: profile || hc });
        this.props.actions.setShowHoldersModal(true)
      });
    }
  }

  renderButtonAddHolder = () => {
    let component = (
      <div>
        <a onClick={() => this.openAddHCModal('holders')}
          className="nav-btn nav-bn icon-add">
          {this.props.local.strings.holders.holdersList.addHolderButton}
        </a>
      </div>
    );

    return component;
  }

  renderButtonCFRoleViewHolder = (hcId) => {
    let component = (
      <div>
        <Link
          to={`/certfocus/holders/${hcId}`}
          className='cell-table-link icon-quick_view'>
          {this.props.local.strings.holders.holdersList.viewHolders}
        </Link>
      </div>
    );

    return component;
  }

  renderButtonRoleViewHolder = (hcId) => {
    let component = (
      <div>
        <Link
          to={`/hiringclients/${hcId}`}
          className='cell-table-link icon-quick_view'
        >
          {this.props.local.strings.hiringClients.viewHC}
        </Link>
      </div>
    );

    return component;
  }

  renderButtonCFRoleEditHolder = (hcId) => {
    let component = (
      <div>
        <a
          className='cell-table-link icon-edit'
          onClick={() => this.openEditHCModal(hcId, 'holders')}
        >
          {this.props.local.strings.holders.holdersList.editHolders}
        </a>
      </div>
    )
    return component;
  }

  renderButtonRoleEditHolder = (hcId) => {
    let component = (
      <div>
        <a
          className='cell-table-link icon-edit'
          onClick={() => this.openEditHCModal(hcId, 'hc')}
        >
          {this.props.local.strings.holders.holdersList.editHC}
        </a>
      </div>
    );

    return component;
  }

  archiveHolder = (e, holderId, newArchivedStatus) => {
    const archivedTitle = (newArchivedStatus === 1) ? 'Archive' : 'Unarchive';
    const archivedText = (newArchivedStatus === 1) ? 'archive' : 'unarchive';

    Swal({
      title: `${archivedTitle} Holder`,
      text: `Are you sure you want to ${archivedText} Holder # ${holderId}?`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#2E5965',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes!'
    }).then((result) => {
      if (result.value) {
        this.props.commonActions.setLoading(true);
        this.props.actions.fetchHolderArchive(holderId, newArchivedStatus, () => {
          this.props.commonActions.setLoading(false);
          this.setPageFilter(null, this.state.filter.pageNumber, true);
        });
      }
    });
  }

  render() {
    const { preQualView, certFocusView } = this.state;

    let profile;

    if (preQualView) {
      profile = { Role: true, CFRole: false };
    } else if (certFocusView) {
      profile = { Role: false, CFRole: true };
    } else {
      profile = { ...this.props.login.profile };
    }

    if (profile.Role) {
      const { Role } = profile;
      if (Role.IsSCRole) {
        // SC should not be here
        return <Redirect push to="/profile" />;
      }
    }

    let {
      addButton,
      tableHeaderHcName,
      tableHeaderArchive,
      tableHeaderRegistrationUrl,
      tableHeaderContactName,
      tableHeaderHcPhone,
      tableHeaderHcState,
      viewHC,
      editHC,
      filterHC
    } = this.props.local.strings.hiringClients;

    let {
      addHolderButton,
      tableHeaderParentHolder,
      tableHeaderPortalUrl,
      viewHolders,
      editHolders,
    } = this.props.local.strings.holders.holdersList;

    const prequalFields = ['state'];

    const prequalHeaders = {
      state: tableHeaderHcState,
    };

    const certfocusFields = [
      'parentHolder',
      'portalURL',
      'edit',
    ];

    const certfocusHeaders = {
      parentHolder: tableHeaderParentHolder,
      portalURL: tableHeaderPortalUrl,
      edit: '',
    };

    const tableMetadata = {
      fields: [
        'name',
        ...(profile.Role ? ['registrationUrl'] : []),
        'contactName',
        'phone',
        ...Utils.returnOnRole(profile, prequalFields, certfocusFields),
        'view',
        'archive'
      ],
      header: {
        name: tableHeaderHcName,
        registrationUrl: tableHeaderRegistrationUrl,
        contactName: tableHeaderContactName,
        phone: tableHeaderHcPhone,
        ...Utils.returnOnRole(profile, prequalHeaders, certfocusHeaders),
        view: '',
        archive: ''
      }
    };

    const tableBody = this.props.hc.list.map((hc, idx) => {
      const prequalBody = {
        state: hc.state
      };

      const certfocusBody = {
        parentHolder: hc.parentHolder,
        portalURL: hc.portalURL && (
          <a
            className='hctable-link'
            target="_blank"
            href={`http://${hc.portalURL}.portal.cf.com`}>
            {`${hc.portalURL}.portal.cf.com`}
          </a>
        ),
      };

      return {
        name: hc.name,
        registrationUrl: (
          <a
            className='hctable-link'
            target="_blank"
            href={`http://${hc.registrationUrl}`}>
            {hc.registrationUrl}
          </a>
        ),
        contactName: hc.contactName,
        phone: Utils.formatPhoneNumber(hc.phone),
        ...Utils.returnOnRole(profile, prequalBody, certfocusBody),
        edit: (
          <Fragment>
            {profile.Role &&
              <RolAccess
                masterTab="hiring_clients"
                sectionTab="edit_holder"
                component={() => this.renderButtonRoleEditHolder(hc.id)}>
              </RolAccess>
            }
            {profile.CFRole &&
              <RolAccess
                masterTab="hiring_clients"
                sectionTab="edit_holder"
                component={() => this.renderButtonCFRoleEditHolder(hc.id)}>
              </RolAccess>

            }
          </Fragment>
        ),
        view: (
          <Fragment>
            {profile.Role &&
              <RolAccess
                masterTab="hiring_clients"
                sectionTab="view_holder"
                component={() => this.renderButtonRoleViewHolder(hc.id)}>
              </RolAccess>
            }
            {profile.CFRole &&
              <RolAccess
                masterTab="hiring_clients"
                sectionTab="view_holder"
                component={() => this.renderButtonCFRoleViewHolder(hc.id)}>
              </RolAccess>
            }
          </Fragment>
        ),
        archive: (
          (!hc.archive) ? (
            <a
              onClick={(e) => this.archiveHolder(e, hc.id, 1)}
              className="cell-table-link"
              style={{ color: '#F00' }}
            >
              {'ARCHIVE'}
            </a>
          ) : (
              <a
                onClick={(e) => this.archiveHolder(e, hc.id, 0)}
                className="cell-table-link"
                style={{ color: '#F00' }}
              >
                {'UNARCHIVE'}
              </a>
            )
        )
      };
    });

    const tableData = {
      fields: tableMetadata.fields,
      header: tableMetadata.header,
      body: tableBody
    };

    let { totalAmountOfHC, HCPerPage } = this.props.hc;

    const paginationSettings = {
      total: totalAmountOfHC,
      itemsPerPage: HCPerPage,
      setPageHandler: this.setPageFilter,
      currentPageNumber: this.state.filter.pageNumber,
    };

    return (
      <div className="list-view admin-view-body hiring-clients-list">
        <Modal
          show={this.props.showModal}
          onHide={() => this.closeAddHCModal('hc')}
          className="add-item-modal add-hc" >
          <Modal.Body className="add-item-modal-body">
            <AddHCModal
              close={this.closeAddHCModalAndRefresh}
              profile={this.state.currentHC}
            />
          </Modal.Body>
        </Modal>

        <Modal
          show={this.props.showHoldersModal}
          onHide={() => this.closeAddHCModal('holders')}
          className="add-item-modal add-entity" >
          <Modal.Body className="add-item-modal-body mt-0">
            <AddHolderModal
              onHide={() => this.closeAddHCModal('holders')}
              close={this.closeAddHCModalAndRefresh}
              profile={this.state.currentHC}
            />
          </Modal.Body>
        </Modal>

        {(this.props.login.profile.Role && this.props.login.profile.CFRole) ?
          <SystemSwitch
            onChange={this.handleSystemChange}/>
          : null
        }

        <div className="hiring-clients-list-header">



          <div>
            <a onClick={this.toggleFilterBox}
              className="nav-btn icon-login-door">
              {filterHC}
            </a>
          </div>

          {profile.Role && (
            <div>
              <a onClick={() => this.openAddHCModal('hc')}
                className="nav-btn nav-bn icon-add">
                {addButton}
              </a>
            </div>
          )}

          {profile.CFRole && (
            <Fragment>
              <RolAccess
                masterTab="hiring_clients"
                sectionTab="add_holder"
                component={() => this.renderButtonAddHolder()}>
              </RolAccess>

              <TypeAheadAndSearch />
            </Fragment>
          )}
        </div>

        {this.state.showFilterBox ?
          <section className="list-view-filters">
            <FilterHC
              profile={profile}
              onSubmit={this.submitFilterForm}
            />
          </section> :
          <div />
        }

        <PTable
          sorted={true}
          items={tableData}
          wrapperState={this.state}
          tableOrderActive={this.state.tableOrderActive}
          clickOnColumnHeader={this.clickOnColumnHeader}
          isFetching={this.props.hc.fetchingHC}
          customClass={profile.Role && profile.CFRole ? 'hc-list-both-roles' : 'hc-list'}
          pagination={paginationSettings}
        />
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const { showModal, showHoldersModal } = state.hc;
  return {
    hc: state.hc,
    local: state.localization,
    login: state.login,
    showModal,
    showHoldersModal,
    filterForm: state.form.filterHC,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(hcActions, dispatch),
    hcProfileActions: bindActionCreators(hcProfileActions, dispatch),
    holderProfileActions: bindActionCreators(holderProfileActions, dispatch),
    departmentsActions: bindActionCreators(departmentsActions, dispatch),
    commonActions: bindActionCreators(commonActions, dispatch),
    dispatch,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(HiringClients);
