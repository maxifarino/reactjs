import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Modal } from 'react-bootstrap';

import PTable from '../../../common/ptable';
import AddCustomTerminologyModal from '../../modals/addCustomTerminologyModal';
import FilterCustomTerminology from './filter';
import Utils from '../../../../lib/utils';

import * as commonActions from '../../../common/actions';
import * as actions from './actions';

import './customTerminology.css';

class CustomTerminology extends Component {
  constructor(props) {
    super(props);

    this.state = {
      filter: {
        pageNumber: 1
      },
      filterBox: {
        id: '',
        holder: '',
      },
      tableOrderActive: 'id',
      order: {
        id: 'desc',
        holderName: 'desc',
        originalTerm: 'desc',
        customTerm: 'desc',
      },
      currentCustomTerm: null,
      showFilterBox: false,
    };
  }

  componentDidMount() {
    const { actions } = this.props;

    actions.fetchCustomTerminology({
      orderBy: 'customTermId',
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
    this.props.actions.fetchCustomTerminology(preQuery);

    // save new active tab and order
    let newState = {
      tableOrderActive: field,
      order: {
        id: field === 'id' ? 'asc' : 'desc',
        holderName: field === 'holderName' ? 'asc' : 'desc',
        originalTerm: field === 'originalTerm' ? 'asc' : 'desc',
        customTerm: field === 'customTerm' ? 'asc' : 'desc',
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
      this.props.actions.fetchCustomTerminology(preQuery);

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
      holderName: values.holderName || "",
      originalTerm: values.originalTerm || "",
      customTerm: values.customTerm || "",
    };
    preQuery = Utils.addSearchFiltersToQuery(preQuery, filterBox);

    // fetch using query
    this.props.actions.fetchCustomTerminology(preQuery);

    // save searchterm and pagenumber
    this.setState({
      filterBox,
      filter: {
        pageNumber: 1,
      }
    });
  }

  openEdit = (data) => {
    this.setState({ currentCustomTerm: data }, this.openModal);
  }

  onDeleteCustomTerm = (data) => {
    this.props.commonActions.setLoading(true);
    this.props.actions.deleteCustomTerminology({ customTermId: data.CustomTermId }, (success) => {
      this.props.commonActions.setLoading(false);

      if (success) {
        this.setPageFilter(null, 1, true);
      }
    });
  }

  openModal = () => {
    this.props.actions.setShowModal(true);
  }

  closeModalAndRefresh = (update) => {
    this.props.actions.setShowModal(false);
    if (update) this.setPageFilter(null, 1, true);
    this.setState({ currentCustomTerm: null });
  }

  render() {
    const {
      customTermIdColumn,
      holderColumn,
      originalTermColumn,
      customTermColumn,
      editCustomTerm,
      deleteCustomTerm,
      filterBtn,
      addBtn,
    } = this.props.local.strings.certFocusSettings.customTerminology.customTerminologyList;

    const TableMetadata = {
      fields: [
        'id',
        'holderName',
        'originalTerm',
        'customTerm',
        'edit',
        'delete',
      ],
      header: {
        id: customTermIdColumn,
        holderName: holderColumn,
        originalTerm: originalTermColumn,
        customTerm: customTermColumn,
        edit: '',
        delete: '',
      },
    };

    const TableBody = this.props.customTerminology.list.map((custom) => {
      const {
        CustomTermId,
        HolderName,
        OriginalTerm,
        CustomTerm,
      } = custom;

      return {
        id: CustomTermId,
        holderName: HolderName,
        originalTerm: OriginalTerm,
        customTerm: CustomTerm,
        edit: (
          <a
            onClick={() => this.openEdit(custom)}
            className="cell-table-link icon-edit"
          >
            {editCustomTerm}
          </a>
        ),
        delete: (
          <a
            onClick={() => this.onDeleteCustomTerm(custom)}
            className="cell-table-link icon-delete"
          >
            {deleteCustomTerm}
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
      totalAmountOfCustomTerminology,
      customTerminologyPerPage,
      fetching,
      showModal,
    } = this.props.customTerminology;

    const paginationSettings = {
      total: totalAmountOfCustomTerminology,
      itemsPerPage: customTerminologyPerPage,
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
            <AddCustomTerminologyModal
              selectedCustomTerm={this.state.currentCustomTerm}
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
            <FilterCustomTerminology
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
    customTerminology: state.customTerminologySettings,
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

export default connect(mapStateToProps, mapDispatchToProps)(CustomTerminology);
