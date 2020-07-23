import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Modal} from 'react-bootstrap';

import PTable from '../../common/ptable';
import AddCoverageTypesToHolderModal from '../modals/addCoverageTypesToHolderModal';
import FilterCoverageTypes from './filter';
import Utils from '../../../lib/utils';

import * as commonActions from '../../common/actions';
import * as actions from './actions';

import './CoverageTypes.css';
import RolAccess from './../../common/rolAccess';
import Swal from "sweetalert2";

class CoverageTypes extends Component {
  constructor(props) {
    super(props);

    this.state = {
      filter: {
        pageNumber: 1
      },
      filterBox: {
        name: '',
        archived: '',
        code: '',
      },
      tableOrderActive: 'displayOrder',
      order: {
        name: 'desc',
        code: 'desc',
        displayOrder: 'asc',
        deficiencyMessage: 'desc',
        deficiencyCode: 'desc',
        archived: 'desc',
      },
      currentCoverageType: null,
      showFilterBox: false,
      showNoEditModal: false,
    };
  }

  componentDidMount() {
    const {actions} = this.props;
    const query = this.addId({
      orderBy: 'displayOrder',
      orderDirection: 'ASC',
    });

    actions.fetchCoverageTypes(query);
  }

  addId = (query) => {
    const {holderId} = this.props;

    if (holderId) {
      return {...query, holderId};
    }

    return query;
  }

  clickOnColumnHeader = (e, field) => {
    if (field === 'remove') return;

    // get base query
    const pageNumber = this.state.filter.pageNumber;
    const orderDirection = this.state.order[field] === 'asc' ? 'DESC' : 'ASC';
    let preQuery = Utils.getFetchQuery(field, pageNumber, orderDirection);

    // add search filters
    preQuery = Utils.addSearchFiltersToQuery(preQuery, this.state.filterBox);

    const query = this.addId(preQuery);

    // fetch using query
    this.props.actions.fetchCoverageTypes(query);

    // save new active tab and order
    let newState = {
      tableOrderActive: field,
      order: {
        name: field === 'name' ? 'asc' : 'desc',
        code: field === 'code' ? 'asc' : 'desc',
        displayOrder: field === 'displayOrder' ? 'asc' : 'desc',
        deficiencyMessage: field === 'deficiencyMessage' ? 'asc' : 'desc',
        deficiencyCode: field === 'deficiencyCode' ? 'asc' : 'desc',
        archived: field === 'archived' ? 'asc' : 'desc',
      },
    };

    newState.order[field] = this.state.order[field] === 'asc' ? 'desc' : 'asc';
    this.setState(newState);
  }

  setPageFilter = (e, pageNumber, force) => {

    if (force || this.state.filter.pageNumber !== pageNumber) {

      // get base query
      const field = this.state.tableOrderActive;
      const orderDirection = this.state.order[field] === 'asc' ? 'ASC' : 'DESC';
      let preQuery = Utils.getFetchQuery(field, pageNumber, orderDirection);

      // add search filters
      preQuery = Utils.addSearchFiltersToQuery(preQuery, this.state.filterBox);

      const query = this.addId(preQuery);

      // fetch using query
      this.props.actions.fetchCoverageTypes(query);

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
    let preQuery = Utils.getFetchQuery(field, pageNumber, orderDirection);

    // add search filters
    const filterBox = {
      name: values.name || "",
      archived: values.archived || "",
      code: values.code || "",
    };
    preQuery = Utils.addSearchFiltersToQuery(preQuery, filterBox);

    const query = this.addId(preQuery);

    // fetch using query
    this.props.actions.fetchCoverageTypes(query);

    // save searchterm and pagenumber
    this.setState({
      filterBox,
      filter: {
        pageNumber: 1
      }
    });
  }

  openModal = () => {
    this.props.actions.setShowModal(true);
  }

  closeModalAndRefresh = (update) => {
    this.props.actions.setShowModal(false);

    if (update) this.setPageFilter(null, 1, true);

    this.setState({
      currentCoverageType: null
    });
  }

  removeCoverageFromHolder = (coverage, totalActiveProyects) => {
    const {holderId} = this.props;
    const {addModal} = this.props.local.strings.coverageTypes;
    const coverageTypeId = coverage.CoverageTypeID;

    if (totalActiveProyects !== 0 ){
      Swal({
        title: addModal.editCoverageType,
        html: `Are you sure you want to edit the coverage type "<b>${coverage.Name}</b>"?<br/>`
          + `It has <b>${totalActiveProyects}</b> active projects related.`,
        // `<p>Are you sure you want to edit the endorsement "<b>${data.Name}</b>"?</p>. `,
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#2E5965',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes!'
      }).then((result) => {
        if (result.value) {
          this.props.commonActions.setLoading(true);
          this.props.actions.toggleArchivedCoverageTypesAndHolder({holderId, coverageTypeId, archived: 1}, (success) => {
            this.props.commonActions.setLoading(false);
            if (success) this.setPageFilter(null, 1, true);
          });
        }
      });
    } else {
      this.props.commonActions.setLoading(true);
      this.props.actions.toggleArchivedCoverageTypesAndHolder({holderId, coverageTypeId, archived: 1}, (success) => {
        this.props.commonActions.setLoading(false);
        if (success) this.setPageFilter(null, 1, true);
      });
    }


  }

  restoreCoverageFromHolder = (coverageTypeId) => {
    const {holderId} = this.props;

    this.props.commonActions.setLoading(true);
    this.props.actions.toggleArchivedCoverageTypesAndHolder({holderId, coverageTypeId, archived: 0}, (success) => {
      this.props.commonActions.setLoading(false);
      if (success) this.setPageFilter(null, 1, true);
    });
  }

  renderButtonAddCoverageTypes() {
    let component = (
      <a onClick={this.openModal}
         className="nav-btn nav-bn icon-add"
      >
        {this.props.local.strings.coverageTypes.coverageTypesList.addBtn}
      </a>
    );
    return component;
  }

  renderButtonDeleteCoverageType(coverage, totalActiveProyects) {
    let component = (
      <a
        onClick={() => this.removeCoverageFromHolder(coverage, totalActiveProyects)}
        className="cell-table-link icon-delete"
      >
        {this.props.local.strings.coverageTypes.coverageTypesList.removeCoverageType}
      </a>
    );

    return component;
  }

  renderButtonRestoreCoverageType(CoverageTypeID, totalActiveProyects) {
    let component = (
      <a
        onClick={() => this.restoreCoverageFromHolder(CoverageTypeID)}
        className="cell-table-link icon-if_upload_103738"
      >
        {this.props.local.strings.coverageTypes.coverageTypesList.restoreCoverageType}
      </a>
    );

    return component;
  }

  render() {

    const {
      nameColumn,
      codeColumn,
      displayOrderColumn,
      deficiencyMessageColumn,
      deficiencyCodeColumn,
      removeCoverageType,
      archivedColumn,
      filterBtn,
      addBtn,
    } = this.props.local.strings.coverageTypes.coverageTypesList;

    const {holderId} = this.props;
    const {showNoEditModal} = this.state;
    const {coverageTypeId} = this.state;

    const TableMetadata = {
      fields: [
        'name',
        'deficiencyMessage',
        'deficiencyCode',
        'code',
        'displayOrder',
        'archived',
        'remove',
      ],
      header: {
        name: nameColumn,
        code: codeColumn,
        displayOrder: displayOrderColumn,
        deficiencyMessage: deficiencyMessageColumn,
        deficiencyCode: deficiencyCodeColumn,
        archived: archivedColumn,
        remove: '',
      },
    };

    const TableBody = this.props.coverageTypes.list.map((coverage) => {
      const {
        Name,
        Code,
        DisplayOrder,
        DeficiencyMessage,
        DeficiencyCode,
        Archived,
        totalActiveProyects,
      } = coverage;
      return {
        name: Name,
        code: Code,
        displayOrder: DisplayOrder,
        deficiencyMessage: DeficiencyMessage,
        deficiencyCode: DeficiencyCode,
        archived: Archived.toString().charAt(0).toUpperCase() + Archived.toString().slice(1),
        remove: !Archived ? (
          <RolAccess
            masterTab="coverage_types"
            sectionTab="edit_coverage_type"
            component={() => this.renderButtonDeleteCoverageType(coverage, totalActiveProyects)}>
          </RolAccess>
        ) : (
          <RolAccess
            masterTab="coverage_types"
            sectionTab="edit_coverage_type"
            component={() => this.renderButtonRestoreCoverageType(coverage.CoverageTypeID, totalActiveProyects)}>
          </RolAccess>
        ),
      };
    });

    const templatesTableData = {
      fields: TableMetadata.fields,
      header: TableMetadata.header,
      body: TableBody
    };

    let {
      totalAmountOfCoverageTypes,
      coverageTypesPerPage,
      fetching,
      showModal,
    } = this.props.coverageTypes;
    const {
      cancelButton,
      saveButton,
      title,
      hasProjects
    } = this.props.local.strings.coverageTypes.deleteModal;
    const paginationSettings = {
      total: totalAmountOfCoverageTypes,
      itemsPerPage: coverageTypesPerPage,
      setPageHandler: this.setPageFilter,
      currentPageNumber: this.state.filter.pageNumber,
    };

    return (
      <div className="list-view admin-view-body coverage-types-list">
        <Modal
          show={showModal}
          onHide={this.closeModalAndRefresh}
          className="add-item-modal add-entity-small"
        >
          <Modal.Body>
            <AddCoverageTypesToHolderModal
              coverage={this.state.currentCoverageType}
              holderId={holderId}
              close={this.closeModalAndRefresh}
            />
          </Modal.Body>
        </Modal>

        <div className="coverage-types-list-header">
          <div>
            <a
              onClick={() => this.setState({showFilterBox: !this.state.showFilterBox})}
              className="nav-btn icon-login-door"
            >
              {filterBtn}
            </a>
          </div>

          <div>
            <RolAccess
              masterTab="coverage_types"
              sectionTab="add_coverage_type"
              component={() => this.renderButtonAddCoverageTypes()}>
            </RolAccess>
          </div>
        </div>

        {this.state.showFilterBox &&
        <section className="list-view-filters">
          <FilterCoverageTypes
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
          isFetching={fetching}
          pagination={paginationSettings}
        />
      </div>
    );
  }
};

const mapStateToProps = (state) => {
  return {
    coverageTypes: state.coverageTypes,
    local: state.localization,
    login: state.login,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(actions, dispatch),
    commonActions: bindActionCreators(commonActions, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CoverageTypes);
