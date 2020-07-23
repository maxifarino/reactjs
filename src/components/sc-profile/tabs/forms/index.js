import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Modal } from 'react-bootstrap';
import { bindActionCreators } from 'redux';
import Swal from 'sweetalert2';
import _ from 'lodash';

import FilterFormSubmissions from '../../../formSubmissions/filter'
import FormLink from '../../../formLink';

import * as formSubmissionActions from '../../../formSubmissions/actions';
import * as copySubmissionActions from './../../../copySubmissions/actions';
import * as registerActions from '../../../register/actions';
import * as builderActions from '../../../formBuilder/actions';
import * as commonActions from '../../../common/actions';
import * as scProfileActions from '../../actions';
import * as paymentsActions from '../../../payments/actions'

import PTable from '../../../common/ptable';
import Utils from '../../../../lib/utils';
import CopySubmissions from './../../../copySubmissions/index';


//import './forms.css';

class Forms extends React.Component {
  constructor(props) {
    super(props);
    this.getSubmissionIdFromList = this.getSubmissionIdFromList.bind(this)

    const subcontractorId = props.match.params.scId;
    let currentHiringClientId = ''
    let submissionId = ''

    props.formSubmissionActions.fetchSavedFormsFilters();

    if (props.hcIdFromSub && props.hcIdFromSub !== "") {
      props.formSubmissionActions.fetchFormSubmissionLink(subcontractorId, props.hcIdFromSub)
      props.scProfileActions.fetchPaymentStatus(props.hcIdFromSub, subcontractorId)
      currentHiringClientId = Number(props.hcIdFromSub)

      // THIS SETTER MAY NEED TO BE REINSTATED AND REFORMULATED IN CASE FORMS TAB IS TO DISPLAY NOT ONE BUT SEVERAL FORMS
      // if (props.formSubmissions && props.formSubmissions.list && props.formSubmissions.list.length && props.formSubmissions.list.length > 0) {
      //   submissionId = this.getSubmissionIdFromList(currentHiringClientId, subcontractorId, props.formSubmissions.list)
      // }
    }

    const shouldResetHC = props.payments
      && props.payments.redirectHcId
      ? Number(props.payments.redirectHcId)
      : false

    if (shouldResetHC) {
      currentHiringClientId = Number(shouldResetHC)
    }

    if (props.scProfile && props.scProfile.paymentStatus && props.scProfile.paymentStatus.paidOrToBePaidSavedFormId) {
      submissionId = props.scProfile.paymentStatus.paidOrToBePaidSavedFormId
    }

    const paymentStatus = props.scProfile && props.scProfile.paymentStatus ? props.scProfile.paymentStatus : null

    this.state = {
      filter: {
        pageNumber: 1
      },
      filterBox: {
        searchTerm: '',
        creatorUserId: '',
      },
      tableOrderActive: 'formName',
      order: {
        formName: 'asc',
        submissionDate: 'desc',
        status: 'desc',
      },
      currentEditingForm: {},
      name: '',
      showFilterBox: false,
      currentHiringClientId,
      subcontractorId,
      showPaidForm: false,
      submissionId,
      submissionLinkHash: null,
      paymentStatus,
      showModalCopySubmissions: false
    };

  }

  componentDidMount() {
    const { lastPayment } = this.props.scProfile;
    const { hcIdFromSub } = this.props;

    if (!_.isEmpty(lastPayment) && hcIdFromSub && lastPayment.done) {
      if (lastPayment.savedFormId) {
        this.onViewSubmission(lastPayment.savedFormId);
      } else {
        this.submitPQData();
      }

      this.props.scProfileActions.setLastPayment({});
    }
  }

  getSubmissionIdFromList(hcId, subId, list) {
    let output = null
    for (let i = 0; i < list.length; i++) {
      let item = list[i]
      if (item.hiringClientId == hcId && item.subcontractorID == subId) {
        output = item.id
      }
    }
    return output
  }

  defineAndFetchQuery(hiringClientId, formId, origin) {
    let
      { subcontractorId } = this.state,
      query = {
        orderBy: 'formName',
        orderDirection: 'ASC',
        subcontractorId,
        hiringClientId
      };
    // this.props.formSubmissions.formId
    if (formId) {
      query.formId = formId;
      this.props.formSubmissionActions.setFormIdForFetching(null);
    }
    // console.log('query = ', query)
    if (subcontractorId && hiringClientId) {
      this.props.formSubmissionActions.fetchForms(query, origin);
    }
  }

  componentWillMount() {

    let
      { formId } = this.props.formSubmissions,
      hcId = this.props.hcIdFromSub

    const shouldResetHC = this.props.payments
      && this.props.payments.redirectHcId
      ? Number(this.props.payments.redirectHcId)
      : false

    const priorityHcId = shouldResetHC ? shouldResetHC : hcId
    if (priorityHcId) {
      this.defineAndFetchQuery(priorityHcId, formId, 'forms CWM')
    }

  }

  componentWillReceiveProps(nextProps) {
    this.setState({ name: `${nextProps.login.profile.FirstName} ${nextProps.login.profile.LastName}` });

    const {
      submissionId,
      currentHiringClientId,
      paymentStatus
    } = this.state

    const mostCurrentHcId = Number(nextProps.hcIdFromSub);
    const newShouldResetHC = nextProps.payments
      && nextProps.payments.redirectHcId
      ? Number(nextProps.payments.redirectHcId)
      : false

    const hcId = newShouldResetHC ? newShouldResetHC : mostCurrentHcId

    //const { formId } = nextProps.formSubmissions;

    if (hcId && hcId !== Number(currentHiringClientId)) {
      this.setState({
        currentHiringClientId: hcId
      }, () => {
        this.props.formSubmissionActions.fetchFormSubmissionLink(this.state.subcontractorId, hcId);

        //////////////////// this.state.formId DOES NOT EXIST! //////////////////
        // console.log('SUCCESS fetchForms -> /forms/index CWRP w/ hcId = ', hcId)
        // console.log('typeof hcId = ', typeof hcId)

        this.defineAndFetchQuery(hcId, this.state.formId, 'forms CWRP')
        this.props.scProfileActions.fetchPaymentStatus(hcId, this.state.subcontractorId)
      })
    } else {
      // console.log('FAIL fetchForms -> /forms/index CWRP w/ hcId = ', mostCurrentHcId)
    }



    const newPaymentStatus = nextProps.scProfile.paymentStatus
    const shouldUpdatePaymentstatus = newPaymentStatus &&
      newPaymentStatus.paidOrYetToPayHcId &&
      (!paymentStatus ||
        !paymentStatus.paidOrYetToPayHcId ||
        (newPaymentStatus.paidOrYetToPayHcId != paymentStatus.paidOrYetToPayHcId))

    if (shouldUpdatePaymentstatus) {
      this.setState({
        paymentStatus: newPaymentStatus
      })
    }

    let newSubmissionId = newPaymentStatus && newPaymentStatus.paidOrToBePaidSavedFormId ? newPaymentStatus.paidOrToBePaidSavedFormId : ''

    if (newSubmissionId && newSubmissionId != submissionId) {
      this.setState({
        submissionId: newSubmissionId
      })
    }

  }

  clickOnColumnHeader = (e, field) => {
    if (field === 'formSubmission') return;
    // get base query
    const pageNumber = this.state.filter.pageNumber;
    const orderDirection = this.state.order[field] === 'asc' ? 'DESC' : 'ASC'
    let query = Utils.getFetchQuery(field, pageNumber, orderDirection);
    query.subcontractorId = this.state.subcontractorId;
    query.hiringClientId = this.props.hcIdFromSub;
    // add search filters
    query = Utils.addSearchFiltersToQuery(query, this.state.filterBox);
    // fetch using query
    this.props.formSubmissionActions.fetchForms(query);
    // save new active tab and order
    let newState = {
      tableOrderActive: field,
      order: {
        formName: field === 'formName' ? 'asc' : 'desc',
        submissionDate: field === 'submissionDate' ? 'asc' : 'desc',
        status: field === 'status' ? 'asc' : 'desc'
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
      query.subcontractorId = this.state.subcontractorId;
      query.hiringClientId = this.props.hcIdFromSub;
      // add search filters
      query = Utils.addSearchFiltersToQuery(query, this.state.filterBox);
      // fetch using query
      this.props.formSubmissionActions.fetchForms(query);
      // save page number
      this.setState({
        filter: {
          pageNumber
        }
      });

    }
  }

  toggleFilterBox = () => {
    this.setState({ showFilterBox: !this.state.showFilterBox });
  }

  onViewSubmission = (savedFormId) => {
    // If user is subcontractor, check if there is a payment pending
    const { paymentStatus, subcontractorId } = this.state
    if (Number(this.props.login.profile.RoleID) === 4) {
      this.props.commonActions.setLoading(true);

      if (paymentStatus) {
        this.props.commonActions.setLoading(false);
        if (paymentStatus.MustPayRegistration || paymentStatus.MustPayRenewal) {
          this.props.history.push('/payments');
          this.props.scProfileActions.setLastPayment({ hcId: this.props.hcIdFromSub, savedFormId });
        } else {
          this.setState({ showPaidForm: true, submissionId: savedFormId, submissionLinkHash: null });
        }
      } else {
        Swal({
          type: 'error',
          title: 'Error',
          text: 'Error checking the payment information',
        });
      }

    } else {
      this.setState({ showPaidForm: true, submissionId: savedFormId, submissionLinkHash: null });
    }
  }

  submitPQData = () => {
    const { submissionLink } = this.props.formSubmissions
    const {
      paymentStatus,
      subcontractorId
    } = this.state

    if (submissionLink) {
      const arr = submissionLink.split('/form-link/');

      // If user is subcontractor, check if there is a payment pending
      if (Number(this.props.login.profile.RoleID) === 4) {
        this.props.commonActions.setLoading(true);
        if (paymentStatus) {
          this.props.commonActions.setLoading(false);
          if (paymentStatus.MustPayRegistration || paymentStatus.MustPayRenewal) {
            this.props.history.push('/payments');
            this.props.scProfileActions.setLastPayment({ hcId: this.props.hcIdFromSub });
          } else {
            this.setState({ showPaidForm: true, submissionId: null, submissionLinkHash: arr[1] });
          }
        } else {
          Swal({
            type: 'error',
            title: 'Error',
            text: 'Error checking the payment information',
          });
        }

      } else {
        this.setState({ showPaidForm: true, submissionId: null, submissionLinkHash: arr[1] });
      }

      //var win = window.open(submissionLink, '_blank');
      //win.focus();
    }
  }

  onCancelSubmission = () => {
    this.setPageFilter(null, 1, true);
    this.setState({ showPaidForm: false });
  }

  submitFilterForm = values => {
    // get base query
    const field = this.state.tableOrderActive;
    const pageNumber = 1;
    const orderDirection = this.state.order[field] === 'asc' ? 'ASC' : 'DESC'
    let query = Utils.getFetchQuery(field, pageNumber, orderDirection);
    query.subcontractorId = this.state.subcontractorId;
    query.hiringClientId = this.props.hcIdFromSub;
    // add search filters
    const filterBox = {
      searchTerm: (values && values.keywords) || "",
      creatorUserId: (values && values.formCreator) || "",
    };
    query = Utils.addSearchFiltersToQuery(query, filterBox);
    // fetch using query
    this.props.formSubmissionActions.fetchForms(query);
    // save searchterm and pagenumber
    this.setState({
      filterBox,
      filter: {
        pageNumber: 1
      }
    });
  }

  // table's row handlers
  renderHeader = (value) => {
    return value === '' ? null : <span className="col-th-arrow"></span>
  }

  renderListView = () => {
    let {
      tableHeaderName,
      tableHeaderSubmissionDate,
      tableHeaderStatus,
      tableItemViewSubmission
    } = this.props.local.strings.formList;

    const formsTableMetadata = {
      fields: [
        'formName',
        'submissionDate',
        'status',
        'formSubmission',
        'copy'
      ],
      header: {
        formName: tableHeaderName,
        submissionDate: tableHeaderSubmissionDate,
        status: tableHeaderStatus,
        formSubmission: '',
        copy: ''
      }
    };

    const colsWidth = [
      '20%',
      '20%',
      '20%',
      '40%',
    ];

    const savedFormsTableBody = this.props.formSubmissions.list.map((savedForm) => {
      const { formName, submissionDate, status } = savedForm;

      return {
        formName,
        submissionDate: Utils.getFormattedDate(submissionDate, true),
        status: (
          <span className={`status-cell ${status.toLowerCase()}`} >
            {status}
          </span>
        ),
        formSubmission: (
          <a
            className='icon-log cell-table-link'
            onClick={() => { this.onViewSubmission(savedForm.id) }}
          >
            {tableItemViewSubmission}
          </a>
        ),
        copy: (status == 'Incomplete' &&
          <a
            className='icon-log cell-table-link'
            onClick={() => this.onViewCopySubmission(savedForm)}
          >
            {'Auto-fill From'}
          </a>
        )
      }
    });
    
    const formsTableData = {
      fields: formsTableMetadata.fields,
      header: formsTableMetadata.header,
      body: savedFormsTableBody
    };

    let { totalAmountOfForms, formsPerPage, fetchingForms } = this.props.formSubmissions;

    const paginationSettings = {
      total: totalAmountOfForms,
      itemsPerPage: formsPerPage,
      setPageHandler: this.setPageFilter,
      currentPageNumber: this.state.filter.pageNumber,
    };

    let isSubcontractor = true;
    let showButton = false;
    if (this.props.login.profile.Role) {
      isSubcontractor = this.props.login.profile.Role.IsSCRole;
      showButton = !isSubcontractor || (isSubcontractor && this.props.formSubmissions.submissionLink);
    }

    return (
      <div>
        <Modal
          show={this.state.showModalCopySubmissions}
          onHide={this.closeModalCopySubmissions}
          className="add-item-modal noteEditorModal"
        >
          <Modal.Body>
            <CopySubmissions onHide={this.closeModalCopySubmissions}></CopySubmissions>
          </Modal.Body>
        </Modal>
        <section className="forms-view-header">
          <div className="row">
            <div className="col-sm-12">
              {
                showButton ?
                  <nav className="forms-nav">
                    <ul>
                      {
                        isSubcontractor ?
                          <li>
                            <a className="forms-nav-link nav-bn"
                              onClick={this.submitPQData} >
                              Submit PQ Data
                            </a>
                          </li>
                          :
                          <li>
                            <a className="forms-nav-link nav-bn icon-search_icon"
                              onClick={this.toggleFilterBox} >
                              Filter Submissions
                            </a>
                          </li>
                      }
                    </ul>
                  </nav> : null
              }
            </div>
          </div>
        </section>
        {
          this.state.showFilterBox ?
            <section className="forms-view-filters">
              <FilterFormSubmissions
                onSubmit={this.submitFilterForm}
                hideSentTo={true}
              />
            </section> :
            <div></div>
        }

        <PTable
          sorted={true}
          items={formsTableData}
          wrapperState={this.state}
          tableOrderActive={this.state.tableOrderActive}
          clickOnColumnHeader={this.clickOnColumnHeader}
          isFetching={fetchingForms}
          customClass='forms-table'
          pagination={paginationSettings}
        />
      </div>
    );
  }

  closeModalCopySubmissions = () => {
    console.log('closeModalCopySubmissions');
    this.setState({ showModalCopySubmissions: false })
    this.submitFilterForm();
  }

  onViewCopySubmission = (savedForm) => {
    this.props.copySubmissions.setSubContractorSelected({hiringClientId:savedForm.hiringClientId, subcontractorID: savedForm.subcontractorID, formIdIncomplete: savedForm.id, formId: savedForm.formId });
    this.setState({ showModalCopySubmissions: true })
  }

  render() {
    return (

      <div className="forms-view list-view admin-view-body">
        {
          this.state.showPaidForm
            ? <FormLink
              fromTab
              savedFormId={this.state.submissionId}
              linkHash={this.state.submissionLinkHash}
              onCancel={this.onCancelSubmission}
            />
            : this.renderListView()
        }
      </div>
    );
  };
};

const mapStateToProps = (state, ownProps) => {
  return {
    hcIdFromSub: state.SCProfile.hcId,
    scProfile: state.SCProfile,
    common: state.common,
    formSubmissions: state.formSubmissions,
    login: state.login,
    local: state.localization,
    payments: state.payments
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    scProfileActions: bindActionCreators(scProfileActions, dispatch),
    formSubmissionActions: bindActionCreators(formSubmissionActions, dispatch),
    paymentsActions: bindActionCreators(paymentsActions, dispatch),
    registerActions: bindActionCreators(registerActions, dispatch),
    builderActions: bindActionCreators(builderActions, dispatch),
    commonActions: bindActionCreators(commonActions, dispatch),
    copySubmissions: bindActionCreators(copySubmissionActions, dispatch)
  }
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Forms));
