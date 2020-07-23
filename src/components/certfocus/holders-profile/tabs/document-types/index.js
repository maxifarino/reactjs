import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Modal } from 'react-bootstrap';

import PTable from '../../../../common/ptable';
import AddDocumentTypeModal from '../../../modals/addDocumentType';
import FilterDocumentTypes from './filter';
import Utils from '../../../../../lib/utils';

import * as actions from './actions';

import './DocumentTypes.css';

class DocumentTypes extends Component {
  constructor(props) {
    super(props);

    this.state = {
      filter: {
        pageNumber: 1
      },
      filterBox: {
        documentTypeName: '',
        expirePeriod: '',
        archived: '',
      },
      tableOrderActive: 'documentTypeName',
      order: {
        documentTypeName: 'asc',
        expirePeriod: 'desc',
        archived: 'desc',
      },
      currentDocumentType: null,
      showFilterBox: false,
    };
  }

  componentDidMount() {
    const { actions, holderId } = this.props;

    actions.fetchDocumentTypes({
      orderBy: 'documentTypeName',
      orderDirection: 'ASC',
      ...(holderId && { holderId }),
    });
  }

  addId = (query) => {
    const { holderId } = this.props;

    if (holderId) {
      return { ...query, holderId };
    }

    return query;
  }

  clickOnColumnHeader = (e, field) => {
    if (field === 'edit') return;

    // get base query
    const pageNumber = this.state.filter.pageNumber;
    const orderDirection = this.state.order[field] === 'asc' ? 'DESC' : 'ASC'
    let preQuery = Utils.getFetchQuery(field, pageNumber, orderDirection);

    // add search filters
    preQuery = Utils.addSearchFiltersToQuery(preQuery, this.state.filterBox);

    const query = this.addId(preQuery);

    // fetch using query
    this.props.actions.fetchDocumentTypes(query);

    // save new active tab and order
    let newState = {
      tableOrderActive: field,
      order: {
        documentTypeName: field === 'documentTypeName' ? 'asc' : 'desc',
        expirePeriod: field === 'expirePeriod' ? 'asc' : 'desc',
        archived: field === 'archived' ? 'asc' : 'desc',
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
      let preQuery = Utils.getFetchQuery(field, pageNumber, orderDirection);

      // add search filters
      preQuery = Utils.addSearchFiltersToQuery(preQuery, this.state.filterBox);

      const query = this.addId(preQuery);

      // fetch using query
      this.props.actions.fetchDocumentTypes(query);

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
      documentTypeName: values.name || "",
      expirePeriod: values.expirePeriod || "",
      archived: values.archived || "",
    };
    preQuery = Utils.addSearchFiltersToQuery(preQuery, filterBox);

    const query = this.addId(preQuery);

    // fetch using query
    this.props.actions.fetchDocumentTypes(query);

    // save searchterm and pagenumber
    this.setState({
      filterBox,
      filter: {
        pageNumber: 1
      }
    });
  }

  editDocumentType = (document) => {
    this.setState({
      currentDocumentType: document
    }, this.openModal);
  }

  openModal = () => {
    this.props.actions.setShowModal(true);
  }

  closeModal = () => {
    this.props.actions.setShowModal(false);

    this.setState({
      currentDocumentType: null
    });
  }

  closeModalAndRefresh = (update) => {
    this.props.actions.setShowModal(false);

    if (update) this.setPageFilter(null, 1, true);

    this.setState({
      currentDocumentType: null
    });
  }

  render() {
    const {
      nameColumn,
      expiresColumn,
      archiveColumn,
      editDocumentType,
      filterBtn,
      addBtn,
    } = this.props.local.strings.documentTypes;

    const TableMetadata = {
      fields: [
        'documentTypeName',
        'expirePeriod',
        'archived',
        'edit',
      ],
      header: {
        documentTypeName: nameColumn,
        expirePeriod: expiresColumn,
        archived: archiveColumn,
        edit: ''
      }
    };

    const TableBody = this.props.documentTypes.list.map((document) => {
      const {
        documentTypeName,
        expireAmount,
        expirePeriod,
        archived,
      } = document;

      return {
        documentTypeName: documentTypeName,
        expirePeriod: `${expireAmount} ${expirePeriod}`,
        archived: archived === 1 ? 'True' : 'False',
        edit: (
          <a
            onClick={() => this.editDocumentType(document)}
            className="cell-table-link icon-edit"
          >
            {editDocumentType}
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
      totalAmountOfDocuments,
      DocumentsPerPage,
      fetchingDocuments,
      showModal } = this.props.documentTypes;

    const paginationSettings = {
      total: totalAmountOfDocuments,
      itemsPerPage: DocumentsPerPage,
      setPageHandler: this.setPageFilter,
      currentPageNumber: this.state.filter.pageNumber,
    };

    return (
      <div className="list-view admin-view-body document-types-list">
        <Modal
          show={showModal}
          onHide={this.closeModal}
          className="add-item-modal add-entity-small"
        >
          <Modal.Body>
            <AddDocumentTypeModal
              document={this.state.currentDocumentType}
              close={this.closeModalAndRefresh}
            />
          </Modal.Body>
        </Modal>

        <div className="document-types-list-header">
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
            <FilterDocumentTypes
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
          isFetching={fetchingDocuments}
          pagination={paginationSettings}
        />
      </div>
    );
  }
};

const mapStateToProps = (state) => {
  return {
    documentTypes: state.documentTypes,
    local: state.localization,
    login: state.login
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(actions, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(DocumentTypes);
