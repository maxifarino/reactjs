import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import PTable from '../../common/ptable';
import AddInsuredModal from '../modals/addInsuredModal';
import FilterInsureds from './filter';
import Utils from '../../../lib/utils';
import QuickView from './quickview';

import * as commonActions from '../../common/actions';
import * as actions from './actions';
import RolAccess from './../../common/rolAccess';

import './Insureds.css';
import Swal from 'sweetalert2';

class Insureds extends Component {
  constructor(props) {
    super(props);

    this.state = {
      filter: {
        pageNumber: 1
      },
      filterBox: {
        insuredName: '',
        projectName: '',
        holderName: '',
        stateId: '',
        archive: 0
      },
      tableOrderActive: 'insuredName',
      order: {
        insuredName: 'asc',
        projectName: 'desc',
        holderName: 'desc',
        status: 'desc',
        state: 'desc',
      },
      currentInsured: null,
      showFilterBox: false,
    };
  }

  componentDidMount() {
    const { actions } = this.props;

    this.props.commonActions.fetchUSStates();

    actions.fetchInsureds({
      orderBy: 'insuredName',
      orderDirection: 'ASC',
      archive: 0
    });

    this.props.commonActions.setBreadcrumbItems([]);
  }

  clickOnColumnHeader = (e, field) => {
    if (field === 'edit' || field === 'view') return;

    // get base query
    const pageNumber = this.state.filter.pageNumber;
    const orderDirection = this.state.order[field] === 'asc' ? 'DESC' : 'ASC';
    let query = Utils.getFetchQuery(field, pageNumber, orderDirection);

    // add search filters
    query = Utils.addSearchFiltersToQuery(query, this.state.filterBox);

    // fetch using query
    this.props.actions.fetchInsureds(query);

    // save new active tab and order
    let newState = {
      tableOrderActive: field,
      order: {
        insuredName: field === 'insuredName' ? 'asc' : 'desc',
        projectName: field === 'projectName' ? 'asc' : 'desc',
        holderName: field === 'holderName' ? 'asc' : 'desc',
        status: field === 'status' ? 'asc' : 'desc',
        state: field === 'state' ? 'asc' : 'desc',
      }
    };
    newState.order[field] = this.state.order[field] === 'asc' ? 'desc' : 'asc';
    this.setState(newState);
  }

  setPageFilter = (e, pageNumber, force) => {
    if (force || this.state.filter.pageNumber !== pageNumber) {

      // get base query
      const field = this.state.tableOrderActive;
      const orderDirection = this.state.order[field] === 'asc' ? 'ASC' : 'DESC';
      let query = Utils.getFetchQuery(field, pageNumber, orderDirection);

      // add search filters
      query = Utils.addSearchFiltersToQuery(query, this.state.filterBox);

      // fetch using query
      this.props.actions.fetchInsureds(query);

      // save page number
      this.setState({
        filter: {
          pageNumber,
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

    // add search filters
    const filterBox = {
      insuredName: values.insuredName || "",
      projectName: values.projectName || "",
      holderName: values.holderName || "",
      stateId: values.state || "",
      archive: values.archive || '',
    };
    query = Utils.addSearchFiltersToQuery(query, filterBox);

    // fetch using query
    this.props.actions.fetchInsureds(query);

    // save searchterm and pagenumber
    this.setState({
      filterBox,
      filter: {
        pageNumber: 1
      }
    });
  }

  editInsured = (insured) => {
    this.setState({
      currentInsured: insured
    }, this.openModal);
  }

  openModal = () => {
    this.props.actions.setShowModal(true);
  }

  closeModal = () => {
    this.props.actions.setShowModal(false);

    this.setState({
      currentInsured: null
    });
  }

  closeModalAndRefresh = (update) => {
    this.props.actions.setShowModal(false);

    if (update) this.setPageFilter(null, 1, true);

    this.setState({
      currentInsured: null
    });
  }

  renderButtonAddinsured() {
    let component = (
      <a onClick={this.openModal}
        className="nav-btn nav-bn icon-add"
      >
        {this.props.local.strings.insured.insuredList.addBtn}
      </a>
    );

    return component;
  }

  renderButtonEditInsured(insured) {
    let component = (
      <a
        onClick={() => this.editInsured(insured)}
        className="cell-table-link icon-edit"
      >
        {this.props.local.strings.insured.insuredList.editInsured}
      </a>
    );

    return component;
  }

  renderButtonViewInsured(insured) {
    
    let holderId = insured && insured.HolderId ? insured.HolderId[0] :null;
    let holderName = insured && insured.HolderName ? insured.HolderName[0] : null;

    let component = (
      <Link
        to={`/certfocus/insureds/${insured.Id}/${holderId}/${holderName}`}
        className="cell-table-link icon-quick_view"
      >
        {this.props.local.strings.insured.insuredList.viewInsured}
      </Link>
    );
    return component;
  }

  archiveHolder = (e, insuredId, newArchivedStatus) => {
    const archivedTitle = (newArchivedStatus === 1) ? 'Archive' : 'Unarchive';
    const archivedText = (newArchivedStatus === 1) ? 'archive' : 'unarchive';

    Swal({
      title: `${archivedTitle} Insured`,
      text: `Are you sure you want to ${archivedText} Insured # ${insuredId}?`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#2E5965',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes!'
    }).then((result) => {
      if (result.value) {
        this.props.commonActions.setLoading(true);
        this.props.actions.fetchInsuredArchive(insuredId,newArchivedStatus, () => {
          this.props.commonActions.setLoading(false);
          this.setPageFilter(null, this.state.filter.pageNumber, true);
        });
      }
    });
  }

  render() {
    const {
      nameColumn,
      projectColumn,
      holderColumn,
      statusColumn,
      stateColumn,
      viewProjects,
      viewHolders,
      editInsured,
      viewInsured,
      filterBtn,
      addBtn,
    } = this.props.local.strings.insured.insuredList;

    const TableMetadata = {
      fields: [
        'insuredName',
        'projectName',
        'holderName',
        'status',
        'state',
        'view',
        'edit',
        'archive'
      ],
      header: {
        insuredName: nameColumn,
        projectName: projectColumn,
        holderName: holderColumn,
        status: statusColumn,
        state: stateColumn,
        view: '',
        edit: '',
        archive:''
      }
    };

    const TableBody = this.props.insureds.list.map((insured, idx) => {      
      const {
        InsuredName,
        ProjectName,
        HolderName,
        Status,
        State,
        Id
      } = insured;
        
      return {
        insuredName: InsuredName,
        projectName: (Array.isArray(ProjectName) && ProjectName.length > 1) ? (
          <a className='icon-quick_view cell-table-link'>
            {viewProjects}
            <QuickView column="project" row={ProjectName} idx={idx} />
          </a>
        ) : ((Array.isArray(ProjectName) && ProjectName[0]) || ProjectName),
        holderName: (Array.isArray(HolderName) && HolderName.length > 1) ? (
          <a className='icon-quick_view cell-table-link'>
            {viewHolders}
            <QuickView column="holder" row={HolderName} idx={idx} />
          </a>
        ) : ((Array.isArray(HolderName) && HolderName[0]) || HolderName),
        status: Status,
        state: State,
        view: (
          <RolAccess
            masterTab="insured"
            sectionTab="view_insured"
            component={() => this.renderButtonViewInsured(insured)}>
          </RolAccess>
        ),
        edit: (
          <RolAccess
            masterTab="insured"
            sectionTab="edit_insured"
            component={() => this.renderButtonEditInsured(insured)}>
          </RolAccess>
        ),
        archive: (
          (!insured.archive) ? (
            <a
              onClick={(e) => this.archiveHolder(e, Id, 1)}
              className="cell-table-link"
              style={{ color: '#F00' }}
            >
              {'ARCHIVE'}
            </a>
          ) : (
              <a
                onClick={(e) => this.archiveHolder(e, Id, 0)}
                className="cell-table-link"
                style={{ color: '#F00' }}
              >
                {'UNARCHIVE'}
              </a>
            )
        )
      };
    });

    const templatesTableData = {
      fields: TableMetadata.fields,
      header: TableMetadata.header,
      body: TableBody
    };

    let {
      totalAmountOfInsureds,
      insuredsPerPage,
      fetchingInsureds,
      showModal,
    } = this.props.insureds;

    const paginationSettings = {
      total: totalAmountOfInsureds,
      itemsPerPage: insuredsPerPage,
      setPageHandler: this.setPageFilter,
      currentPageNumber: this.state.filter.pageNumber,
    };

    return (
      <div className="list-view admin-view-body insureds-list">
        <Modal
          show={showModal}
          onHide={this.closeModal}
          className="add-item-modal add-hc"
        >
          <Modal.Body className="add-item-modal-body mt-0">
            <AddInsuredModal
              profile={this.state.currentInsured}
              close={this.closeModalAndRefresh}
              onHide={this.closeModal}
            />
          </Modal.Body>
        </Modal>

        <div className="insureds-list-header">
          <div>
            <a
              onClick={() => this.setState({ showFilterBox: !this.state.showFilterBox })}
              className="nav-btn icon-login-door"
            >
              {filterBtn}
            </a>
          </div>

          <div>
            <RolAccess
              masterTab="insured"
              sectionTab="add_insured"
              component={() => this.renderButtonAddinsured()}>
            </RolAccess>
          </div>
        </div>

        {this.state.showFilterBox &&
          <section className="list-view-filters">
            <FilterInsureds
              onSubmit={this.submitFilterForm}
            />
          </section>
        }

        <PTable
          sorted={true}
          items={templatesTableData}
          wrapperState={this.state}
          tableOrderActive={this.state.tableOrderActive}
          clickOnColumnHeader={this.clickOnColumnHeader}
          isFetching={fetchingInsureds}
          pagination={paginationSettings}
        />
      </div>
    );
  }
};

const mapStateToProps = (state) => {

  return {
    insureds: state.insureds,
    local: state.localization,
    login: state.login
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(actions, dispatch),
    commonActions: bindActionCreators(commonActions, dispatch)    
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Insureds);
