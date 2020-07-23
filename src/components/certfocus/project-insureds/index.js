import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { Modal } from 'react-bootstrap';
import Toggle from 'react-toggle';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import Swal from 'sweetalert2';

import PTable from '../../common/ptable';
import AddProjectInsuredModal from '../modals/addProjectInsuredModal';
import UploadDocumentModal from '../modals/uploadDocumentModal';
import ProcessingModal from '../modals/processingModal';
import FilterProjectInsureds from './filter';
import Utils from '../../../lib/utils';

import * as actions from './actions';
import * as commonActions from '../../common/actions';

import './ProjectInsureds.css';
class ProjectInsureds extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      filter: {
        pageNumber: 1
      },
      filterBox: {
        insuredName: '',
        complianceStatusId: '',
        projectName: '',
        holderName: '',
        mylist: '',
      },
      tableOrderActive: 'insuredName',
      order: {
        insuredName: 'asc',
        complianceStatusId: 'desc',
        insuredState: 'desc',
        projectName: 'desc',
        holderName: 'desc',
        city: 'desc',
        projectState: 'desc',
        mylist: 'desc',
      },
      showFilterBox: false,
      currentProjectInsured: null,
      showUploadModal: false,
      currentUploadData: null,
      showProcessingModal: false,
    };
  }

  componentDidMount() {
    const { projectId, insuredId } = this.props;

    let query = Utils.getFetchQuery('insuredName', 1, 'ASC');

    if (projectId) {
      query.projectId = projectId;
    } else if (insuredId) {
      query.insuredId = insuredId;
    }

    query.archived = 0;
    this.props.actions.fetchProjectInsureds(query);

    this.props.commonActions.fetchComplianceStatus();    
  }

  addId = (query) => {
    const { projectId, insuredId } = this.props;

    if (projectId) {
      query.projectId = projectId;
    } else if (insuredId) {
      query.insuredId = insuredId;
    }
  }

  clickOnColumnHeader = (e, field) => {
    if (field === 'edit' || field === 'view') return;
    // get base query
    const pageNumber = this.state.filter.pageNumber;
    const orderDirection = this.state.order[field] === 'asc' ? 'DESC' : 'ASC'
    let query = Utils.getFetchQuery(field, pageNumber, orderDirection);
    this.addId(query);
    // add search filters
    query = Utils.addSearchFiltersToQuery(query, this.state.filterBox);
    // fetch using query
    this.props.actions.fetchProjectInsureds(query);
    // save new active tab and order
    let newState = {
      tableOrderActive: field,
      order: {
        insuredName: field === 'insuredName' ? 'asc' : 'desc',
        complianceStatusId: field === 'complianceStatusId' ? 'asc' : 'desc',
        insuredState: field === 'insuredState' ? 'asc' : 'desc',
        projectName: field === 'projectName' ? 'asc' : 'desc',
        holderName: field === 'holderName' ? 'asc' : 'desc',
        city: field === 'city' ? 'asc' : 'desc',
        projectState: field === 'projectState' ? 'asc' : 'desc',
        mylist: field === 'mylist' ? 'asc' : 'desc',
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
      this.addId(query);
      // add search filters
      query = Utils.addSearchFiltersToQuery(query, this.state.filterBox);
      // fetch using query
      this.props.actions.fetchProjectInsureds(query);
      // save page number
      this.setState({
        filter: {
          pageNumber
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
    this.addId(query);
    // add search filters
    const filterBox = {
      insuredName: values.insuredName || "",
      projectName: values.projectName || "",
      holderName: values.holderName || "",
      mylist: values.myList || "",
      complianceStatusId: values.status || "",
      keywordName: values.keyword || "",
      archived: values.archived || ""
    };
    query = Utils.addSearchFiltersToQuery(query, filterBox);
    // fetch using query
    this.props.actions.fetchProjectInsureds(query);
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

  editProjectInsured = (projectInsured) => {
    this.setState({ currentProjectInsured: projectInsured });
    this.props.actions.setShowModal(true);
  }

  openUploadModal = (e, data) => {
    const currentUploadData = { 
      holderId: data.HolderID,
      projectId: data.ProjectID,
      insuredId: data.InsuredID, 
      projectInsuredId: data.ProjectInsuredID      
    };
    this.setState({ 
      showUploadModal: true, 
      currentUploadData: currentUploadData,
      currentProcessingData: data,
    });
  }

  closeUploadModal = () => {
    this.setState({ showUploadModal: false, currentUploadData: null });
  }

  onUpload = (payload) => {
    this.props.commonActions.setLoading(true);
    this.props.actions.uploadDocument(payload, (success, data) => {
      console.log('success', success, data);
      this.setState({ showUploadModal: false, currentUploadData: null })
      this.props.commonActions.setLoading(false);
      if (success) {
        this.openProcessingModal(null, null, data);
      } else {
        Swal({
          type: 'error',
          title: 'Document Upload',
          text: 'Error uploading file. Please try again.',
        });
      }        
    });    
  }

  openProcessingModal = (e, payload, documentData) => {   
    const data = (payload) ? payload : this.state.currentProcessingData;
    const currentProcessingData = { 
      ...data,
      DocumentID: documentData.documentId,
      DocumentUrl: documentData.url 
    };
    console.log('currentProcessingData: ', currentProcessingData);    
    this.setState({ showProcessingModal: true, currentProcessingData: currentProcessingData });
  }

  closeProcessingModal = () => {
    this.setState({ showProcessingModal: false, currentProcessingData: null });
  }

  exemptProjectInsured = (e, projectInsured) => {
    let titleText = (projectInsured.Exempt) ? 'Unexempt' : 'Exempt';
    Swal({
      title: `${titleText} Project Insured`,
      text: `Are you sure you want to ${titleText} the project # ${projectInsured.ProjectNumber} for the insured # ${projectInsured.InsuredID}?`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#2E5965',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes!'
    }).then((result) => {
      if (result.value) {
        const exempt = (projectInsured.Exempt) ? 0 : 1;
        this.props.actions.exemptProjectInsured(projectInsured.ProjectInsuredID, exempt, () => {
          this.props.commonActions.setLoading(false);
          this.setPageFilter(null, 1, true);
        });
      }
    });
  }

  deficiencies = () => {
    console.log('deficiencies');
  }

  onToggleChange = (e, projectId) => {
    const { profile } = this.props.login;
    this.props.actions.sendProjectFavorite(e.target.checked, { projectId, userId: profile.Id });
  }

  assignColorToProjectInsuredComplianceStatus = (statusId) => {
    switch (statusId) {
      case 1:
        return (<div className="compliance-status compliant"></div>);
      case 2:
        return (<div className="compliance-status escalated"></div>);
      case 6:
        return (<div className="compliance-status non-compliant"></div>);
      case 15:
        return (<div className="compliance-status minor"></div>);  
      case 16:
        return (<div className="compliance-status on-hold"></div>);  
      default:
        return (<div className="compliance-status pending"></div>);
    }
  }

  archiveProject = (e, InsuredID, ProjectInsuredID, isCurrentArchived) => {
    let titleText = isCurrentArchived ? 'Unarchive' : 'Archive';    
    Swal({
      title: `${titleText} Project Insured`,
      text: `Are you sure you want to ${titleText} insured project # ${InsuredID}?`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#2E5965',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes!'
    }).then((result) => {
      if (result.value) {
        let currenArchive = isCurrentArchived ? 0 : 1;
        this.props.actions.archiveProject(ProjectInsuredID, currenArchive, () => {
          this.props.commonActions.setLoading(false);
          this.setPageFilter(null, 1, true);
        });
      }
    });
  }

  render() {
    const {
      headers,
      addBtn,
      filterBtn,
      viewInsured,
      viewProject,
      viewCoverage,
      viewCerts,
      upload,
      copyUrl,
      exempted,
      nonExempted,    
      archived,
      unarchived,
    } = this.props.local.strings.projectInsureds.projectInsuredsList;

    const { insuredId, projectId, proyectArchived, holderId } = this.props;    
    const {
      insuredIdColumn,
      insuredColumn,
      statusColumn,
      stateColumn,
      projectNameColumn,
      projectNumberColumn,
    } = headers;
    
    const showInsured = projectId ? true : false;
    const showProject = insuredId ? true : false;
    const originCertUploadURL = window.location.origin + '/certfocus/certUpload/';
    const originCertUploadURLError = window.location.origin + '/certfocus/certUploadError/';
    
    const fieldToInsured = [
      'color',
      'projectNumber',
      'projectName',
      'projectState',
      'complianceStatusId',
      'view',
      'viewCoverages',
      'viewCerts',
      'upload',
      'viewCertUploadURL',
      'exempt',
      'archived'
    ];

    const fieldToProjects = [
      'color',
      ...showInsured ? ['insuredId', 'insuredName', 'insuredState'] : [],
      ...showProject ? ['projectName', 'holderName', 'city'] : [],
      'complianceStatusId',
      'view',
      'viewCoverages',
      'viewCerts',
      'upload',
      'viewCertUploadURL',
      'exempt',
      'archived'
    ];   

    const projectInsuredsTableMetadata = {
      fields: this.props.showColumnInsuredView ? fieldToInsured : fieldToProjects,
      header: {
        color: '',
        insuredId: insuredIdColumn,
        insuredName: insuredColumn,
        projectNumber: projectNumberColumn,
        projectName: projectNameColumn,
        complianceStatusId: statusColumn,
        insuredState: stateColumn,
        projectState: stateColumn,
        view: '',
        viewCoverages: '',
        viewCerts: '',
        upload: '',
        viewCertUploadURL: '',
        exempt: '',
        archived: ''
      }
    };

    const projectInsuredsTableBody = this.props.projectInsureds.list.map((projectInsured) => {
      const {
        InsuredID,
        InsuredName,
        ComplianceStatusName,
        InsuredState,
        ProjectName,
        ProjectNumber,
        HolderID,
        HolderName,
        City,
        ProjectState,
        ProjectID,
        CertUploadHash,
        Archived,
        DocumentId,
        RequirementSetID,
        Exempt,
        ProjectInsuredID,
        HasCertificate,
        HasProcessedDocuments,
      } = projectInsured;
      
      return {
        color: this.assignColorToProjectInsuredComplianceStatus(projectInsured.ComplianceStatusID),
        insuredId: InsuredID,
        insuredName: InsuredName,
        projectNumber: ProjectNumber,
        projectName: ProjectName,
        complianceStatusId: ComplianceStatusName,
        insuredState: InsuredState,
        projectState: ProjectState,        
        view: (
          <Link
            to={projectId ? `/certfocus/insureds/${InsuredID}` : `/certfocus/projects/${ProjectID}`}
            className="cell-table-link icon-quick_view"
          >
            {projectId ? viewInsured : viewProject}
          </Link>
        ),
        viewCoverages: (
          (RequirementSetID) ? (
            <Link
              to={{
                pathname: `/certfocus/coverages/${ProjectInsuredID}/${RequirementSetID}`,
                state: { fromSection: projectId ? 'Project' : 'Insured' },
              }}
              className="cell-table-link icon-quick_view"
            >
              {viewCoverage}
            </Link>
          ) : 'No Coverages Provided'
        ),
        viewCerts: (
          (HasCertificate) ? 
            (HasProcessedDocuments) ? // Processing Complete / Pending Review status
              (
              <Link
                to={`/certfocus/certificates/${ProjectInsuredID}`}
                className="cell-table-link icon-quick_view"
              >
                {viewCerts}
              </Link>
            ) : 'Pending Processing'  
          : 'No Certs Provided'
        ),
        upload: (
          <Fragment>
          <a
            onClick={(e) => this.openUploadModal(e, projectInsured)}
            className="cell-table-link"
          >
            {upload}
          </a>          
          </Fragment>
        ),
        viewCertUploadURL: (
          <CopyToClipboard
            text={(Archived || proyectArchived) ? `${originCertUploadURLError}${HolderName}` : `${originCertUploadURL}${CertUploadHash}`}
            onCopy={() => {
              Swal({
                type: 'success',
                title: 'Certification Upload',
                text: 'Certification Upload URL was successful copied to clipboard.',
              });
            }}>
            <span className="copyToClip linear-icon-copy">Copy URL</span>
          </CopyToClipboard>
        ),
        exempt: (
          <a
            onClick={(e) => this.exemptProjectInsured(e, projectInsured)}
            className="cell-table-link"
            style={{ color: (!Exempt) ? '#8CC739' : '#F00' }}
          >
            {(!Exempt) ? nonExempted : exempted}
          </a>
        ),
        archived: (
          <a
            onClick={(e) => this.archiveProject(e, this.props.showColumnInsuredView ? ProjectNumber : InsuredID, projectInsured.ProjectInsuredID, (!Archived) ? false : true)}
            className="cell-table-link"
            style={{ color: (!Archived) ? '#8CC739' : '#F00' }}
          >
            {(!Archived) ? unarchived : archived}
          </a>
        ),
      };
    });

    const templatesTableData = {
      fields: projectInsuredsTableMetadata.fields,
      header: projectInsuredsTableMetadata.header,
      body: projectInsuredsTableBody
    };

    let {
      totalAmountOfProjectInsureds, projectInsuredsPerPage,
      fetchingProjectInsureds, showModal
    } = this.props.projectInsureds;

    const paginationSettings = {
      total: totalAmountOfProjectInsureds,
      itemsPerPage: projectInsuredsPerPage,
      setPageHandler: this.setPageFilter,
      currentPageNumber: this.state.filter.pageNumber,
    };

    return (
      <div className="list-view admin-view-body">
        <Modal
          show={showModal}
          onHide={this.closeModal}
          className="add-item-modal add-entity-small">
          <Modal.Body>
            <AddProjectInsuredModal
              onHide={this.closeModal}
              close={this.closeModalAndRefresh}
              projectId={this.props.projectId}
              projectInsured={this.state.currentProjectInsured}
              holderId={holderId}
            />
          </Modal.Body>
        </Modal>

        <Modal
          show={this.state.showUploadModal}
          onHide={this.closeUploadModal}
          className="add-item-modal add-entity-small">
          <Modal.Body>
            <UploadDocumentModal
              onHide={this.closeUploadModal}
              close={this.closeModalAndRefresh}
              currentUploadData={this.state.currentUploadData}
              onSubmit={this.onUpload}
            />
          </Modal.Body>
        </Modal>

        <Modal
          show={this.state.showProcessingModal}
          onHide={this.closeProcessingModal}
          className="add-item-modal add-hc">
          <Modal.Body className="add-item-modal-body mt-0">
            <ProcessingModal
              onHide={this.closeProcessingModal}
              close={this.closeProcessingModal}
              document={this.state.currentProcessingData}
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
                    <a
                      className="list-view-nav-link nav-bn icon-login-door no-overlapping"
                      onClick={() => { this.setState({ showFilterBox: !this.state.showFilterBox }) }}
                    >
                      {filterBtn}
                    </a>
                  </li>
                  {projectId && (
                    <li>
                      <a onClick={this.openModal}
                        className="list-view-nav-link nav-bn icon-add no-overlapping" >
                        {addBtn}
                      </a>
                    </li>
                  )}
                </ul>
              </nav>
            </div>
          </div>
        </section>

        {
          this.state.showFilterBox &&
          <section className="list-view-filters">
            <FilterProjectInsureds
              onSubmit={this.submitFilterForm}
              projectId={projectId}
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
          isFetching={fetchingProjectInsureds}
          customClass='projectInsureds-list'
          pagination={paginationSettings}
        />

      </div>
    )

  }
};

const mapStateToProps = (state) => {
  return {
    projectInsureds: state.projectInsureds,
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ProjectInsureds));
