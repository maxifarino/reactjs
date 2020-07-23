import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Modal } from 'react-bootstrap';
import PTable from '../../../common/ptable';
import Utils from '../../../../lib/utils';

import AddDocumentQueueDefinitionsModal from '../../modals/addDocumentQueueDefinitionsModal';
import FilterDocumentQueueDefinitions from './filter';
import DocumentQueueUsersList from './documentQueueUsers';

import * as commonActions from '../../../common/actions';
import * as actions from './actions';

import './DocumentQueueDefinitions.css';

class DocumentQueueDefinitions extends Component {
  constructor(props) {
    super(props);

    this.state = {
      filter: {
        pageNumber: 1
      },
      filterBox: {
        name: '',
        archived: '',
      },
      tableOrderActive: 'name',
      order: {
        name: 'desc',
        archived: 'desc',
        isDefault: 'desc',
      },
      currentDocumentQueueDefinition: null,
			showFilterBox: false,
      showNoEditModal: false,
    };
  }

  componentDidMount() {
    const { actions } = this.props;

    actions.fetchDocumentQueueDefinitions({
      orderBy: 'isDefault',
      orderDirection:'DESC',
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
    this.props.actions.fetchDocumentQueueDefinitions(preQuery);

    // save new active tab and order
    let newState = {
      tableOrderActive: field,
      order: {
        name: field === 'name' ? 'asc' : 'desc',
        archived: field === 'code' ? 'asc' : 'desc',
        isDefault: field === 'isDefault' ? 'asc' : 'desc',
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
      this.props.actions.fetchDocumentQueueDefinitions(preQuery);

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
      archived: values.archived || "",
    };
    preQuery = Utils.addSearchFiltersToQuery(preQuery, filterBox);

    // fetch using query
    this.props.actions.fetchDocumentQueueDefinitions(preQuery);

    // save searchterm and pagenumber
    this.setState({
      filterBox,
      filter: {
        pageNumber: 1,
      }
    });
  }

  openEdit = (data) => {    
    this.setState({
      currentDocumentQueueDefinition: data
    }, this.openModal);
  }

  openModal = () => {
    this.props.actions.setShowModal(true);
  }

  closeModalAndRefresh = (update) => {
    this.props.actions.setShowModal(false);

    if (update) this.setPageFilter(null, 1, true);

    this.setState({
      currentDocumentQueueDefinition: null
    });
	}
  
  openDocumentQueueUsers = (data) => {
    this.setState({
      currentDocumentQueueDefinition: data,
      showDocumentQueueUsersModal: true
    }, this.openDocumentQueueUsersModal);
  }

  openDocumentQueueUsersModal = () => {
    this.props.actions.setShowDocumentQueueUsersModal(true);
  }

  closeDocumentQueueUsersModal = () => {    
		this.props.actions.setShowDocumentQueueUsersModal(false);
  }

  render() {
    const {
      nameColumn,
      dateCreatedColumn,
      archivedColumn,
      isDefaultColumn,
      editBtn,
      filterBtn,
      addBtn,
		} = this.props.local.strings.documentQueueDefinitions.documentQueueDefinitionsList;

    const TableMetadata = {
      fields: [
        'name',
        'dateCreated',
        'archived',
        'isDefault',
        'edit',
        'viewDocumentQueueUsers',
      ],
      header: {
        name: nameColumn,
        dateCreated: dateCreatedColumn,
        archived: archivedColumn,
        isDefault: isDefaultColumn,
        edit: '',
        viewDocumentQueueUsers: '',
      },
    };

    const TableBody = this.props.documentQueueDefinitions.list.map((definition) => {
      const {
        Name,
        TimeStamp,
        Archived,
        IsDefault,
      } = definition;

      return {
        name: Name,
        dateCreated: Utils.getFormattedDate(TimeStamp, true),
        archived: (Archived) ? 'Yes' : 'No',
        isDefault: (IsDefault) ? 'Yes' : 'No',
        edit: (!IsDefault) && (
          <a
            onClick={() => this.openEdit(definition)}
            className="cell-table-link icon-edit"
          >
            {editBtn}
          </a>
        ),
        viewDocumentQueueUsers: (
          <a
            onClick={() => this.openDocumentQueueUsers(definition)}
            className="cell-table-link icon-quick_view"
          >
            View Document Queue Users
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
      totalAmountOfDocumentQueueDefinitions,
      documentQueueDefinitionsPerPage,
      fetching,
      showModal,
      showDocumentQueueUsersModal,
    } = this.props.documentQueueDefinitions;

    const paginationSettings = {
      total: totalAmountOfDocumentQueueDefinitions,
      itemsPerPage: documentQueueDefinitionsPerPage,
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
            <AddDocumentQueueDefinitionsModal
              documentQueueDefinition={this.state.currentDocumentQueueDefinition}
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
            <FilterDocumentQueueDefinitions
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

        {this.state.currentDocumentQueueDefinition && (
          <Modal
            show={showDocumentQueueUsersModal}
            onHide={this.closeDocumentQueueUsersModal}
            className="add-item-modal add-entity-large"
            >
            <Modal.Body>  
              <DocumentQueueUsersList
                queueId={this.state.currentDocumentQueueDefinition.QueueId}
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
    documentQueueDefinitions: state.documentQueueDefinitions,
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

export default connect(mapStateToProps, mapDispatchToProps)(DocumentQueueDefinitions);
