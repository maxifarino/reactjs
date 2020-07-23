import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Modal } from 'react-bootstrap';

import PTable from '../../common/ptable';
import AddAttachmentsModal from '../modals/addAttachment';
import Utils from '../../../lib/utils';
import FilterDocuments from './filter';

import * as commonActions from '../../common/actions';
import * as actions from './actions';

import './Attachments.css';
import RolAccess from './../../common/rolAccess';

class Attachments extends Component {
  constructor(props) {
    super(props);

    this.state = {
      filter: {
        pageNumber: 1
      },
      filterBox: {
        fileName: '',
        holderId: '',
        projectId: '',
        dateCreated: '',
      },
      showFilterBox: false,
      tableOrderActive: 'dateCreated',
      order: {
        fileName: 'asc',
        documentType: 'asc',
        dateCreated: 'desc',
        uploadedBy: 'asc',
        holderName: 'desc',
        projectName: 'desc',
        documentStatus: 'desc',
      },
    };
  }

  componentDidMount() {
    const { actions, projectId, insuredId } = this.props;

    actions.fetchAttachments({
      orderBy: 'dateCreated',
      orderDirection: 'DESC',
      ...(projectId && { projectId }),
      ...(insuredId && { insuredId }),
    });
  }

  addId = (query) => {
    const { projectId, insuredId } = this.props;

    if (projectId) {
      return { ...query, projectId };
    } else if (insuredId) {
      return { ...query, insuredId };
    }

    return query;
  }

  clickOnColumnHeader = (e, field) => {
    if (field === 'download') return;

    // get base query
    const pageNumber = this.state.filter.pageNumber;
    const orderDirection = this.state.order[field] === 'asc' ? 'DESC' : 'ASC';
    let preQuery = Utils.getFetchQuery(field, pageNumber, orderDirection);

    // add search filters
    preQuery = Utils.addSearchFiltersToQuery(preQuery, this.state.filterBox);

    const query = this.addId(preQuery);

    // fetch using query
    this.props.actions.fetchAttachments(query);

    // save new active tab and order
    let newState = {
      tableOrderActive: field,
      order: {
        fileName: field === 'fileName' ? 'asc' : 'desc',
        documentType: field === 'documentType' ? 'asc' : 'desc',
        dateCreated: field === 'dateCreated' ? 'asc' : 'desc',
        uploadedBy: field === 'uploadedBy' ? 'asc' : 'desc',
        holderName: field === 'holderName' ? 'asc' : 'desc',
        projectName: field === 'projectName' ? 'asc' : 'desc',
        documentStatus: field === 'documentStatus' ? 'asc' : 'desc',
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
      this.props.actions.fetchAttachments(query);

      // save page number
      this.setState({
        filter: {
          pageNumber,
        },
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
    let preQuery = Utils.getFetchQuery(field, pageNumber, orderDirection);

    let date;
    if (values.dateCreated) {
      date = new Date(values.dateCreated).toISOString();
    } else {
      date = values.dateCreated
    }

    // add search filters
    const filterBox = {
      fileName: values.fileName || '',
      holderId: values.holderId ? values.holderId.value : '',
      projectId: values.projectId ? values.projectId.value : '',
      dateCreated: date || '',
    };

    preQuery = Utils.addSearchFiltersToQuery(preQuery, filterBox);

    const query = this.addId(preQuery);

    // fetch using query
    this.props.actions.fetchAttachments(query);

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
  }

  closeModal = () => {
    this.props.actions.setShowModal(false);
  }

  renderButtonAddAttachment() {
    let component = (
      <a onClick={this.openModal}
        className="nav-btn nav-bn icon-add"
      >
        {this.props.local.strings.attachments.list.addBtn}
      </a>
    );

    return component;
  }

  renderButtonDownloadDocument(Url) {
    let component = (
      <a
        href={Url}
        className="cell-table-link icon-save"
        target="_blank"
      >
        {this.props.local.strings.attachments.list.downloadLink}
      </a>
    );

    return component;
  }

  render() {
    const {
      nameColumn,
      documentTypeColumn,
      dateUploadedColumn,
      uploadedByColumn,
      holderNameColumn,
      projectColumn,
      documentStatusColumn,
      downloadLink,
      addBtn,
      filterBtn,
    } = this.props.local.strings.attachments.list;

    const { insuredId } = this.props;

    const showHolderAndProject = insuredId ? true : false;

    const TableMetadata = {
      fields: [
        'fileName',
        'documentType',
        'dateCreated',
        'uploadedBy',
        ...(showHolderAndProject ? [
          'holderName',
          'projectName'
        ] : []),
        'documentStatus',
        'download',
      ],
      header: {
        fileName: nameColumn,
        documentType: documentTypeColumn,
        dateCreated: dateUploadedColumn,
        uploadedBy: uploadedByColumn,
        holderName: holderNameColumn,
        projectName: projectColumn,
        documentStatus: documentStatusColumn,
        download: '',
      },
    };

    const TableBody = this.props.attachments.list.map((attachment) => {
      const {
        FileName,
        DateCreated,
        Url,
        HolderName,
        ProjectName,
        DocumentStatus,
        DocumentType,
        FirstName,
        LastName,
        UploadedByUser
      } = attachment;

      return {
        fileName: FileName,
        documentType: DocumentType,
        dateCreated: Utils.getFormattedDateSmall(DateCreated, true),
        uploadedBy: (FirstName && LastName) ?  FirstName + ' ' + LastName : UploadedByUser,
        holderName: HolderName,
        projectName: ProjectName,
        documentStatus: DocumentStatus,
        download: (
          <RolAccess
            masterTab="insured_documents"
            sectionTab="download_document"
            component={() => this.renderButtonDownloadDocument(Url)}>
          </RolAccess>
        )
      };
    });

    const templatesTableData = {
      fields: TableMetadata.fields,
      header: TableMetadata.header,
      body: TableBody
    };

    let {
      totalAmountOfAttachments,
      attachmentsPerPage,
      fetching,
      showModal,
    } = this.props.attachments;

    const paginationSettings = {
      total: totalAmountOfAttachments,
      itemsPerPage: attachmentsPerPage,
      setPageHandler: this.setPageFilter,
      currentPageNumber: this.state.filter.pageNumber,
    };
    
    return (
      <div className="list-view admin-view-body attachments-list">
        <Modal
          show={showModal}
          onHide={this.closeModal}
          className="add-item-modal add-entity-small"
        >
          <Modal.Body>
            <AddAttachmentsModal
              close={this.closeModalAndRefresh}
              projectId={this.props.projectId}
              insuredId={this.props.insuredId}
              onHide={this.closeModal}
            />
          </Modal.Body>
        </Modal>

        <div className="attachments-list-header">
          <div>
            <a onClick={this.toggleFilterBox}
              className="nav-btn icon-login-door">
              {filterBtn}
            </a>
          </div>

          <div>
            <RolAccess
              masterTab="insured_documents"
              sectionTab="add_attachment"
              component={() => this.renderButtonAddAttachment()}>
            </RolAccess>
          </div>
        </div>

        {this.state.showFilterBox &&
          <section className="list-view-filters">
            <FilterDocuments
              onSubmit={this.submitFilterForm}
              insuredId={insuredId}
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
    attachments: state.attachments,
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

export default connect(mapStateToProps, mapDispatchToProps)(Attachments);
