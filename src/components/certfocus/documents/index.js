import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { Modal } from 'react-bootstrap';
import moment from 'moment';

import PTable from '../../common/ptable';
import Utils from '../../../lib/utils';

import ProcessingModal from '../modals/processingModal';
import FilterDocuments from './filter';

import * as actions from './actions';
import * as commonActions from '../../common/actions';
import * as documentQueueDefinitionsActions from './../settings/documentQueueDefinitions/actions';

import './Documents.css';
class Documents extends React.Component {  
  constructor(props) {
    super(props);
    this.state = {
      filter: {
        pageNumber: 1
      },
      filterBox: {
        holderId: '',
        insuredId: '',
        projectId: '',
        documentStatus: '',
        documentType: '',
        garbage: '',
        urgent: '',
      },
      tableOrderActive: 'UrgentFlag',
      order: {
        fileName: 'asc',
        dateCreated: 'desc',
        holderName: 'desc',
        projectName: 'desc',
        insuredName: 'desc',
        documentTypeId: 'desc',
        documentStatus: 'desc',
        urgentFlag: 'desc',
        garbageFlag: 'desc',
      },
      showFilterBox: true,
      currentDocument: '',
      showProcessingModal: false,
      queueId: null,
    };
  }

  componentDidMount() {
    const { actions, documentQueueDefinitionsActions } = this.props;
    let query = Utils.getFetchQuery('UrgentFlag', 1, 'DESC');
    query = Utils.addSearchFiltersToQuery(query);
    actions.fetchDocuments(query);
    documentQueueDefinitionsActions.fetchDocumentQueueDefinitions({ withoutPag: true, documentsPage: true });
  }


  clickOnColumnHeader = (e, field) => {
    if (field === 'edit' || field === 'view') return;
    // get base query
    const pageNumber = this.state.filter.pageNumber;
    const orderDirection = this.state.order[field] === 'asc' ? 'DESC' : 'ASC'
    let query = Utils.getFetchQuery(field, pageNumber, orderDirection);
    // add search filters
    query = Utils.addSearchFiltersToQuery(query, this.state.filterBox);
    // fetch using query
    this.props.actions.fetchDocuments(query);
    // save new active tab and order
    let newState = {
      tableOrderActive: field,
      order: {
        fileName: field === 'fileName' ? 'asc' : 'desc',
        dateCreated: field === 'dateCreated' ? 'asc' : 'desc',
        holderName: field === 'holderName' ? 'asc' : 'desc',
        projectName: field === 'projectName' ? 'asc' : 'desc',
        insuredName: field === 'insuredName' ? 'asc' : 'desc',
        documentTypeId: field === 'documentTypeId' ? 'asc' : 'desc',
        documentStatus: field === 'documentStatus' ? 'asc' : 'desc',
        urgentFlag: field === 'urgentFlag' ? 'asc' : 'desc',
        garbageFlag: field === 'garbageFlag' ? 'asc' : 'desc',
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
      this.props.actions.fetchDocuments(query);
      // save pagenumber
      this.setState({
        filter: {
          pageNumber
        }
      });
    }
  }

  submitFilterForm = (values) => {
    //console.log('VAL', values);    
    // get base query
    const field = this.state.tableOrderActive;
    const pageNumber = 1;
    const orderDirection = this.state.order[field] === 'asc' ? 'ASC' : 'DESC'
    let query = Utils.getFetchQuery(field, pageNumber, orderDirection);
    // add search filters
    const filterBox = {
      holderId: (values.holderId) ? values.holderId.value : "",
      insuredId: (values.insuredId) ? values.insuredId.value : "",
      projectId: (values.projectId) ? values.projectId.value : "",
      documentStatusId: values.documentStatus || "",
      documentTypeId: values.documentType || "",
      garbage: values.garbage || "",
      urgent: values.urgent || "",
      queueId: this.state.queueId || "",
    };
    //console.log('filterBox', filterBox);
    query = Utils.addSearchFiltersToQuery(query, filterBox);
    // fetch using query
    this.props.actions.fetchDocuments(query);
    // save searchterm and pagenumber
    this.setState({
      filterBox,
      filter: {
        pageNumber: 1
      }
    });
  }

  openModal = () => {
    this.setState({ currentProjectInsured: null });
    this.props.actions.setShowModal(true);
  }

  closeModal = () => {
    this.props.actions.setShowModal(false);
  }

  closeModalAndRefresh = () => {
    this.props.actions.setShowModal(false);
    this.setPageFilter(null, 1, true);
  }

  editDocument = (document) => {
    this.setState({ currentDocument: document });
    this.props.actions.setShowModal(true);
  }

  renderOptions = (opt, idx) => {
    return <option value={opt.value} key={idx}>{opt.label}</option>
  }

  onChangeQueue = (e) => {
    const { value } = e.target;
    this.setState({ queueId: value }, () => {
      let query = Utils.getFetchQuery('UrgentFlag', 1, 'DESC');
      const filterBox = this.state.filterBox;
      filterBox.queueId = this.state.queueId;
      query = Utils.addSearchFiltersToQuery(query, filterBox);
      this.props.actions.fetchDocuments(query);
    })  
  }

  openProcessingModal = (e, documentData, canViewDataEntry) => {
    //console.log('currentDocument: ', documentData);
    documentData.canViewDataEntry = canViewDataEntry;   
    this.setState({ showProcessingModal: true, currentDocument: documentData });
  }

  closeProcessingModal = () => {
    this.setState({ showProcessingModal: false, currentDocument: null });
    this.setPageFilter(null, 1, true);
  }

  render() {
    const {
      filterBtn,
      headers,
      viewDocument,
      processDocument,
      viewDataEntry,
    } = this.props.local.strings.documents.documentsList;   

    const {
      fileNameColumn,
      dateCreatedColumn,
      hiringClientColumn,
      projectColumn,
      insuredColumn,
      documentTypeColumn,
      documentStatusColumn,
      urgentColumn,
      garbageColumn,
    } = headers;
    
    const fields = [      
      'fileName',
      'dateCreated',
      'holderName',
      'projectName',
      'insuredName',
      'documentTypeId',
      'documentStatus',
      'urgentFlag',
      'garbageFlag',
      'view',
      'viewDataEntry',
      'process',
    ];   

    const userId = Number(this.props.login.userId);

    const projectInsuredsTableMetadata = {
      fields: fields,
      header: {
        fileName: fileNameColumn,
        dateCreated: dateCreatedColumn,
        holderName: hiringClientColumn,
        projectName: projectColumn,
        insuredName: insuredColumn,
        documentTypeId: documentTypeColumn,
        documentStatus: documentStatusColumn,
        urgentFlag: urgentColumn,
        garbageFlag: garbageColumn,
        view: '',
        viewDataEntry: '',
        edit: '',
      }
    };

    const documentsTableBody = this.props.documents.list.map((document) => {
      const {
        DocumentID,
        FileName,
        DateCreated,
        HolderID,
        HolderName,
        ProjectID,
        ProjectName,
        InsuredID,
        InsuredName,
        ProjectInsuredID,
        DocumentTypeId,
        DocumentStatusID,
        DocumentStatus,
        UrgentFlag,
        GarbageFlag,
        CertificateID,
        DocumentUrl,
        UploadedByUserID,
      } = document;
      
      let canViewDataEntry = (CertificateID) ? true : false;      

      return {
        fileName: FileName,
        dateCreated: moment(DateCreated).format('MM/DD/YYYY'),
        holderName: HolderName,
        projectName: ProjectName,
        insuredName: InsuredName,
        documentTypeId: DocumentTypeId,
        documentStatus: DocumentStatus,
        urgentFlag: (UrgentFlag) ? 'yes' : 'no',
        garbageFlag: (GarbageFlag) ? 'yes' : 'no',
        view: (
          <a 
            href={DocumentUrl} 
            className="cell-table-link icon-quick_view"
            style={{ whiteSpace: 'nowrap' }}
            target = "_blank"
          >
            {viewDocument}          
          </a>
        ),
        viewDataEntry: (
          (canViewDataEntry === true) && (
          <a
            href={`/certfocus/processing/${CertificateID}`}
            className="cell-table-link icon-quick_view"
            style={{ whiteSpace: 'nowrap' }}
          >
            {viewDataEntry}
          </a>
          )
        ),
        process: (
          <a
            onClick={(e) => this.openProcessingModal(e, document, canViewDataEntry)}
            className="cell-table-link icon-edit" 
            style={{ whiteSpace: 'nowrap' }}
          >
            {processDocument}
          </a>
        ),
      };
    });

    const templatesTableData = {
      fields: projectInsuredsTableMetadata.fields,
      header: projectInsuredsTableMetadata.header,
      body: documentsTableBody
    };

    let {
      totalAmountOfDocuments, 
      documentsPerPage,
      fetchingDocuments,
    } = this.props.documents;

    const paginationSettings = {
      total: totalAmountOfDocuments,
      itemsPerPage: documentsPerPage,
      setPageHandler: this.setPageFilter,
      currentPageNumber: this.state.filter.pageNumber,
    };

    const queueOptions = Utils.getOptionsList(` Non configured queue `, this.props.documentQueueDefinitions.list, 'Name', 'QueueId', 'Name');
    
    return (
      <div className="container-fluid">
        <Modal
          show={this.state.showProcessingModal}
          onHide={this.closeProcessingModal}
          className="add-item-modal add-hc">
          <Modal.Body className="add-item-modal-body mt-0">
            <ProcessingModal
              onHide={this.closeProcessingModal}
              close={this.closeProcessingModal}
              document={this.state.currentDocument}
              onSubmit={this.onProcessing}
            />
          </Modal.Body>
        </Modal>

        <section className="list-view-header">
          <div className="row">
            <div className="col-sm-12">
              <nav className="list-view-nav">
                <ul>
                  <li>
                    <div className="form-group documents-queue">
                      <label htmlFor="queue">Choose a Queue: </label>
                      <div className="select-wrapper">
                        <select
                          name="queue"
                          onChange={this.onChangeQueue}
                          style={{ width: '230px' }}
                        >
                          {queueOptions.map(this.renderOptions)}
                        </select>
                      </div>
                    </div>
                  </li>
                  <li>
                    <a
                      className="list-view-nav-link nav-bn icon-login-door no-overlapping"
                      onClick={() => { this.setState({ showFilterBox: !this.state.showFilterBox }) }}
                    >
                      {filterBtn}
                    </a>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </section>

        {
          this.state.showFilterBox &&
          <section className="list-view-filters">
            <FilterDocuments
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
          customClass='documents-list'
          pagination={paginationSettings}
        />

      </div>
    )

  }
};

const mapStateToProps = (state) => {
  return {
    documents: state.documents,
    local: state.localization,
    login: state.login,
    documentQueueDefinitions: state.documentQueueDefinitions,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(actions, dispatch),
    commonActions: bindActionCreators(commonActions, dispatch),
    documentQueueDefinitionsActions: bindActionCreators(documentQueueDefinitionsActions, dispatch)
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Documents));
