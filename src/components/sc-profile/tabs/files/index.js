import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { Modal } from 'react-bootstrap';

import FilterFiles from './filter';
import * as filesActions from './actions';
import PTable from '../../../common/ptable';
import Utils from '../../../../lib/utils';
import AddFileModal from './addFileModal';

class Files extends React.Component {
  constructor(props) {
    super(props);
    const subcontractorId = props.match.params.scId;
    this.state = {
      filter: {
        pageNumber: 1,
      },
      filterBox: {
        searchTerm: '',
        dateFrom: '',
        dateTo: '',
      },
      tableOrderActive: 'fileName',
      order: {
        fileName: 'asc',
        fileDescription: 'desc',
        uploadDate: 'desc',
        fileTypeId: 'desc',
      },
      showFilterBox: false,
      showModal: false,
      subcontractorId,
      filesPerPage: 10,
      totalAmountOfFiles: '',
    };

    this.downloadFile = this.downloadFile.bind(this);
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.addFile = this.addFile.bind(this);


  }

  defineAndFetchQuery(hiringClientId, roleId) {

    const pageNumber          = 1;
    const filesPerPage        = this.state.filesPerPage;
    const field               = this.state.tableOrderActive;
    const orderDirection      = this.state.order[field] === 'asc' ? 'ASC' : 'DESC';
    const { subcontractorId } = this.state;

    const query = Utils.getFetchQuery(
      field,
      pageNumber,
      orderDirection,
      filesPerPage
    );

    query.subcontractorId = subcontractorId;
    query.hiringClientId = hiringClientId;
    query.roleId = roleId;

    this.props.filesActions.fetchFiles(query);
  }

  clickOnColumnHeader = (e, field) => {
    if (field === 'viewFile') return;
    // get base query
    const pageNumber     = this.state.filter.pageNumber;
    const filesPerPage   = this.state.filesPerPage;
    const orderDirection = this.state.order[field] === 'asc' ? 'DESC' : 'ASC';

    let query = Utils.getFetchQuery(
      field,
      pageNumber,
      orderDirection,
      filesPerPage
    );
    query.subcontractorId = this.state.subcontractorId;
    query.hiringClientId = this.props.hcId;
    query.roleId = this.props.loginProfile.RoleID;
    // add search filters
    query = Utils.addSearchFiltersToQuery(query, this.state.filterBox);
    // fetch using query
    this.props.filesActions.fetchFiles(query);
    // save new active tab and order
    const newState = {
      tableOrderActive: field,
      order: {
        formName: field === 'formName' ? 'asc' : 'desc',
        submissionDate: field === 'submissionDate' ? 'asc' : 'desc',
        status: field === 'status' ? 'asc' : 'desc',
      },
    };
    newState.order[field] = this.state.order[field] === 'asc' ? 'desc' : 'asc';
    this.setState(newState);
  };

  setPageFilter = (e, pageNumber, force) => {
    if (force || this.state.filter.pageNumber !== pageNumber) {
      // get base query
      const filesPerPage   = this.state.filesPerPage;
      const field          = this.state.tableOrderActive;
      const orderDirection = this.state.order[field] === 'asc' ? 'ASC' : 'DESC';

      let query = Utils.getFetchQuery(
        field,
        pageNumber,
        orderDirection,
        filesPerPage
      );

      query.subcontractorId = this.state.subcontractorId;
      query.hiringClientId = this.props.hcId;
      query.roleId = this.props.loginProfile.RoleID;
      // add search filters
      query = Utils.addSearchFiltersToQuery(query, this.state.filterBox);
      // fetch using query
      this.props.filesActions.fetchFiles(query);
      // save page number
      this.setState({
        filter: {
          pageNumber,
        },
      });
    }
  };

  toggleFilterBox = () => {
    this.setState({ showFilterBox: !this.state.showFilterBox });
  };

  submitFilterForm = values => {
    // get base query
    const filesPerPage   = this.state.filesPerPage;
    const field          = this.state.tableOrderActive;
    const pageNumber     = 1;
    const orderDirection = this.state.order[field] === 'asc' ? 'ASC' : 'DESC';

    let query = Utils.getFetchQuery(
      field,
      pageNumber,
      orderDirection,
      filesPerPage
    );

    query.subcontractorId = this.state.subcontractorId;
    query.hiringClientId = this.props.hcId;
    query.roleId = this.props.loginProfile.RoleID;
    // add search filters
    const filterBox = {
      searchTerm: values.keywords || '',
      dateFrom: values.dateFrom || '',
      dateTo: values.dateTo || '',
    };
    query = Utils.addSearchFiltersToQuery(query, filterBox);
    // fetch using query
    this.props.filesActions.fetchFiles(query);
    // save searchterm and pagenumber
    this.setState({
      filterBox,
      filter: {
        pageNumber: 1,
      },
    });
  };

  // table's row handlers
  renderHeader = value => value === '' ? null : <span className="col-th-arrow" />;

  componentWillMount() {
    const hcId = this.props.hcId;
    const roleId = this.props.loginProfile.RoleID;

    if (hcId) {
      this.defineAndFetchQuery(hcId, roleId);
    }
  }

  componentWillReceiveProps(nextProps) {
    const newHcId      = nextProps.hcId;
    const oldHcId        = this.props.hcId;
    const newRoleId      = nextProps.loginProfile.RoleID;
    const oldRoleId          = this.props.loginProfile.RoleID;
    const roleId             = newRoleId ? newRoleId : oldRoleId;
    const oldTotal           = this.props.files.totalAmountOfFiles;
    const totalAmountOfFiles = nextProps.files.totalAmountOfFiles;

    if (newHcId && newHcId !== oldHcId) {
      this.defineAndFetchQuery(newHcId, roleId);
    }
    // console.log('this.props.files = ', this.props.files)
    if (
      oldTotal !== totalAmountOfFiles &&
      typeof totalAmountOfFiles !== 'undefined'
    ) {
      this.setState({
        totalAmountOfFiles,
      });
    }
  }

  render() {
    const { fetchingFiles, list } = this.props.files;

    const {
      headers,
      viewFile,
      filterFiles,
      uploadFile,
    } = this.props.local.strings.scProfile.files;

    const {
      fileName,
      fileDescription,
      uploadDate,
      uploadedFrom
    } = headers;

    const tableMetadata = {
      fields: [
        'fileName',
        'fileDescription',
        'uploadDate',
        'fileTypeId',
        'viewFile',
      ],
      header: {
        fileName,
        fileDescription,
        uploadDate,
        fileTypeId: uploadedFrom,
        viewFile: '',
      },
    };

    const tableBody = list.map(file => {
      const { fileName, fileDescription, uploadDate, type, url } = file;
      return {
        fileName,
        fileDescription,
        uploadDate: Utils.getFormattedDate(uploadDate),
        fileTypeId: type,
        viewFile: this.props.files.downloadingFile ?
          (
          <div className="download-file">
            <div className="spinner-wrapper">
              <div className="spinner" />
            </div>
          </div>
        ) : (
          <a
            className="cell-table-link icon-quick_view"
            onClick={() => {
              this.downloadFile(url);
            }}
          >
            {viewFile}
          </a>
        ),
      };
    });

    const tableData = {
      fields: tableMetadata.fields,
      header: tableMetadata.header,
      body: tableBody,
    };



    const paginationSettings = {
      total: this.state.totalAmountOfFiles,
      itemsPerPage: this.state.filesPerPage,
      setPageHandler: this.setPageFilter,
      currentPageNumber: this.state.filter.pageNumber,
    };

    // console.log('paginationSettings = ', paginationSettings)

    return (
      <div className="files-list forms-view list-view admin-view-body">
        <Modal
          show={this.state.showModal}
          onHide={this.closeModal}
          className="add-item-modal noteEditorModal"
        >
          <Modal.Body>
            <AddFileModal onSubmit={this.addFile} />
          </Modal.Body>
        </Modal>

        <section className="forms-view-header">
          <div className="row">

            <div className="col-sm-12">
              <nav className="forms-nav">
                <ul>

                  <li>
                    <a
                      className="forms-nav-link nav-bn icon-search_icon"
                      onClick={this.toggleFilterBox}
                    >
                      {filterFiles}
                    </a>
                  </li>

                  <li>
                    <a
                      className="forms-nav-link nav-bn  icon-add"
                      onClick={this.openModal}
                    >
                      {uploadFile}
                    </a>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </section>

        {
          this.state.showFilterBox
            ? (
                <section className="forms-view-filters">
                  <FilterFiles onSubmit={this.submitFilterForm} hideSentTo={true} />
                </section>
              )
            : <div />
        }

        <PTable
          sorted
          items={tableData}
          wrapperState={this.state}
          tableOrderActive={this.state.tableOrderActive}
          clickOnColumnHeader={this.clickOnColumnHeader}
          isFetching={fetchingFiles}
          customClass="forms-table"
          pagination={paginationSettings}
        />
      </div>
    );
  }

  downloadFile(fileName) {
    const payload = {
      fileName
    };
    this.props.filesActions.viewFileLink(payload);
    // this.props.filesActions.downloadFile(payload);
  }

  openModal() {
    this.setState({
      showModal: true,
    });
  }

  closeModal(err) {
    if (err) {
      console.log('Error uploading file into Files tab: ', err)
    } else {
      console.log('File uploaded successfully')
    }
    this.setState(
      {
        showModal: false,
      },
      () => this.setPageFilter(null, 1, true)
    );
  }

  addFile(formValues) {
    const fileInput = document.getElementById('documentFile');
    const formData = new FormData();
    const finBoolean = formValues.FinancialDataFlag ? 1 : null;
    formData.append('subcontractorId', this.state.subcontractorId);
    formData.append('description', formValues.description);
    formData.append('FinancialDataFlag', finBoolean);
    formData.append('fileTypeId', 2);
    formData.append('payloadId', this.state.subcontractorId);
    formData.append('documentFile', fileInput.files[0]);
    formData.append('hiringClientId', this.props.hcId);

    for (let key of formData.keys()) {
      console.log(`${key}: ${formData.get(key)}`)
   }

    this.props.filesActions.saveFile(formData, this.closeModal);
  }
}

const mapStateToProps = state => ({
    hcId: state.SCProfile.hcId,
    common: state.common,
    files: state.files,
    loginProfile: state.login.profile,
    local: state.localization
  });

const mapDispatchToProps = dispatch => ({
    filesActions: bindActionCreators(filesActions, dispatch)
  });

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Files)
);
