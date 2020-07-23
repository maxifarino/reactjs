import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Modal } from 'react-bootstrap';
import PTable from '../../../common/ptable';
import Utils from '../../../../lib/utils';
import Swal from 'sweetalert2';

import AddCoverageTypesModal from '../../modals/addCoverageTypeModal';
import FilterCoverageTypes from './filter';

import AttributesList from './attributes';

import * as commonActions from '../../../common/actions';
import * as actions from './actions';

import './CoverageTypes.css';

class CoverageTypes extends Component {
  constructor(props) {
    super(props);

    this.state = {
      filter: {
        pageNumber: 1
      },
      filterBox: {
        name: '',
        code: '',
      },
      tableOrderActive: 'name',
      order: {
        name: 'desc',
        code: 'desc',
        deficiencyMessage: 'desc',
        deficiencyCode: 'desc',
      },
      currentCoverageType: null,
			showFilterBox: false,
      showNoEditModal: false,
    };
  }

  componentDidMount() {
    const { actions } = this.props;

    actions.fetchCoverageTypes({
      orderBy: 'name',
      orderDirection:'ASC',
    });
  }

  clickOnColumnHeader = (e, field) => {
    if (field === 'edit') return;

    // get base query
    const pageNumber = this.state.filter.pageNumber;
    const orderDirection = this.state.order[field] === 'asc' ? 'DESC' : 'ASC';
    let preQuery = Utils.getFetchQuery(field, pageNumber, orderDirection);

    // add search filters
    preQuery = Utils.addSearchFiltersToQuery(preQuery, this.state.filterBox);

    // fetch using query
    this.props.actions.fetchCoverageTypes(preQuery);

    // save new active tab and order
    let newState = {
      tableOrderActive: field,
      order: {
        name: field === 'name' ? 'asc' : 'desc',
        code: field === 'code' ? 'asc' : 'desc',
        deficiencyMessage: field === 'deficiencyMessage' ? 'asc' : 'desc',
        deficiencyCode: field === 'deficiencyCode' ? 'asc' : 'desc',
      },
    };

    newState.order[field] = this.state.order[field] === 'asc' ? 'desc' : 'asc';
    this.setState(newState);
  }

  setPageFilter = (e, pageNumber, force) => {
    if(force || this.state.filter.pageNumber !== pageNumber) {

      // get base query
      const field = this.state.tableOrderActive;
      const orderDirection = this.state.order[field] === 'asc' ? 'ASC' : 'DESC';
      let preQuery = Utils.getFetchQuery(field, pageNumber, orderDirection);

      // add search filters
      preQuery = Utils.addSearchFiltersToQuery(preQuery, this.state.filterBox);

      // fetch using query
      this.props.actions.fetchCoverageTypes(preQuery);

      // save page number
      this.setState({
        filter: {
          pageNumber,
        }
      });
    }
  }

  submitFilterForm = (values)=> {
    // get base query
    const field = this.state.tableOrderActive;
    const pageNumber = 1;
    const orderDirection = this.state.order[field] === 'asc' ? 'ASC' : 'DESC'
    let preQuery = Utils.getFetchQuery(field, pageNumber, orderDirection);

    // add search filters
    const filterBox = {
      name: values.name || "",
      code: values.code || "",
    };
    preQuery = Utils.addSearchFiltersToQuery(preQuery, filterBox);

    // fetch using query
    this.props.actions.fetchCoverageTypes(preQuery);

    // save searchterm and pagenumber
    this.setState({
      filterBox,
      filter: {
        pageNumber: 1,
      }
    });
  }

  openEdit = (data) => {    
    if (data.totalActiveProyects && data.totalActiveProyects > 0) {
      Swal({
        title: 'Change Coverage Type',
        text: `This Coverage Type is being used in 2 active projects. Are you sure you want to modify it?`,
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#2E5965',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes!'
      }).then((result) => {
        if (result.value) {
          this.setState({
            currentCoverageType: data
          }, this.openModal);
        }
      });
    } else {
      this.setState({
        currentCoverageType: data
      }, this.openModal);
    }
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
  
  openAttributes = (data) => {
    this.setState({
      currentCoverageType: data,
      showAttributesModal: true
    }, this.openAttributesModal);
  }

  openAttributesModal = () => {
    this.props.actions.setShowAttributesModal(true);
  }

  closeAttributesModal = () => {    
		this.props.actions.setShowAttributesModal(false);
  }

  render() {
    const {
      nameColumn,
      codeColumn,
      deficiencyMessageColumn,
      deficiencyCodeColumn,
      editCoverageType,
      filterBtn,
      addBtn,
		} = this.props.local.strings.coverageTypes.coverageTypesList;

    const TableMetadata = {
      fields: [
        'name',
        'code',
        'deficiencyMessage',
        'deficiencyCode',
        'edit',
        'viewAttributes',
      ],
      header: {
        name: nameColumn,
        code: codeColumn,
        deficiencyMessage: deficiencyMessageColumn,
        deficiencyCode: deficiencyCodeColumn,
        edit: '',
        viewAttributes: '',
      },
    };

    const TableBody = this.props.coverageTypes.list.map((coverage) => {
      const {
        Name,
        Code,
        DeficiencyMessage,
				DeficiencyCode,
      } = coverage;

      return {
        name: Name,
        code: Code,
        deficiencyMessage: DeficiencyMessage,
        deficiencyCode: DeficiencyCode,
        edit: (
          <a
            onClick={() => this.openEdit(coverage)}
            className="cell-table-link icon-edit"
          >
            {editCoverageType}
          </a>
        ),
        viewAttributes: (
          <a
            onClick={() => this.openAttributes(coverage)}
            className="cell-table-link icon-quick_view"
          >
            View Attributes
          </a>
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
      showAttributesModal,
    } = this.props.coverageTypes;

    const paginationSettings = {
      total: totalAmountOfCoverageTypes,
      itemsPerPage: coverageTypesPerPage,
      setPageHandler: this.setPageFilter,
      currentPageNumber: this.state.filter.pageNumber,
    };

    return (
      <div className="list-view admin-view-body coverage-types-settings-list">
        <Modal
          show={showModal}
          onHide={this.closeModalAndRefresh}
          className="add-item-modal add-entity-small"
        >
          <Modal.Body>
            <AddCoverageTypesModal
              coverage={this.state.currentCoverageType}
              close={this.closeModalAndRefresh}
            />
          </Modal.Body>
        </Modal>

        <div className="coverage-types-list-header">
          <div>
            <a
              onClick={() => this.setState({ showFilterBox: !this.state.showFilterBox })}
              className="nav-btn icon-login-door"
            >
              {filterBtn}
            </a>
          </div>

          <div>
            <a onClick={this.openModal}
              className="nav-btn nav-bn icon-add"
            >
              {addBtn}
            </a>
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

        {this.state.currentCoverageType && (
          <Modal
            show={showAttributesModal}
            onHide={this.closeAttributesModal}
            className="add-item-modal add-entity-large"
            >
            <Modal.Body>  
              <AttributesList 
                coverageTypeId={this.state.currentCoverageType.CoverageTypeID}
                close={this.closeModalAndRefresh}
              />
            </Modal.Body>
          </Modal>
        )}    

      </div>
    );
  }
};

const mapStateToProps = (state) => {
  return {
    coverageTypes: state.coverageTypesSettings,
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
