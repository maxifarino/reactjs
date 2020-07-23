import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Redirect } from 'react-router-dom';
import FilterFormSubmissions from './filter'

import * as formSubmissionActions from './actions';
import * as registerActions from '../register/actions';
import * as builderActions from '../formBuilder/actions';

import PTable from '../common/ptable';
import Utils from '../../lib/utils';

import './forms.css';

class FormSubmissions extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      filter: {
        pageNumber: 1
      },
      filterBox: {
        searchTerm: '',
        creatorUserId: '',
        subcontractorId: '',
      },
      tableOrderActive: 'formName',
      order: {
        formName: 'asc',
        submitterUserName: 'asc',
        submissionDate: 'asc',
        status: 'asc',
      },
      currentEditingForm: {},
      name: '',
      showFilterBox: false,
    };

    props.formSubmissionActions.fetchSavedFormsFilters();
    let query = {
      orderBy: 'formName',
      orderDirection: 'ASC'
    };
    if (props.formSubmissions.formId) {
      query.formId = props.formSubmissions.formId;
      props.formSubmissionActions.setFormIdForFetching(null);
    }
    props.formSubmissionActions.fetchForms(query);
  }

  clickOnColumnHeader = (e, field) => {
    if (field === 'formSubmission') return;
    // get base query
    const pageNumber = this.state.filter.pageNumber;
    const orderDirection = this.state.order[field] === 'asc' ? 'DESC' : 'ASC'
    let query = Utils.getFetchQuery(field, pageNumber, orderDirection);
    // add search filters
    query = Utils.addSearchFiltersToQuery(query, this.state.filterBox);
    // fetch using query
    this.props.formSubmissionActions.fetchForms(query);
    // save new active tab and order
    let newState = {
      tableOrderActive: field,
      order: {
        formName: 'asc',
        submitterUserName: 'asc',
        submissionDate: 'asc',
        status: 'asc',
      }
    };
    newState.order[field] = this.state.order[field] === 'asc' ? 'desc' : 'asc';
    this.setState(newState);
  }

  setPageFilter = (e, pageNumber) => {
    if (this.state.filter.pageNumber !== pageNumber) {
      // get base query
      const field = this.state.tableOrderActive;
      const orderDirection = this.state.order[field] === 'asc' ? 'ASC' : 'DESC'
      let query = Utils.getFetchQuery(field, pageNumber, orderDirection);
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
    this.setState({ showFilterBox: !this.state.showFilterBox })
  }

  submitFilterForm = values => {
    // get base query
    const field = this.state.tableOrderActive;
    const pageNumber = 1;
    const orderDirection = this.state.order[field] === 'asc' ? 'ASC' : 'DESC'
    let query = Utils.getFetchQuery(field, pageNumber, orderDirection);
    // add search filters
    const filterBox = {
      searchTerm: values.keywords || "",
      creatorUserId: values.formCreator || "",
      subcontractorId: values.sentTo || ""
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

  componentWillReceiveProps(props) {
    this.setState({ name: `${props.login.profile.FirstName} ${props.login.profile.LastName}` })
  }

  render() {
    if (!this.props.common.checkingAuthorizations) {
      if (!this.props.common.formBuilderAuth) {
        return <Redirect push to="/dashboard" />;
      }
    }

    let {
      tableHeaderName,
      tableHeaderSubmittedBy,
      tableHeaderSubmissionDate,
      tableHeaderStatus,
      tableItemViewSubmission
    } = this.props.local.strings.formList;

    const formsTableMetadata = {
      fields: [
        'formName',
        'submitterUserName',
        'submissionDate',
        'status',
        'formSubmission'
      ],
      header: {
        formName: tableHeaderName,
        submitterUserName: tableHeaderSubmittedBy,
        submissionDate: tableHeaderSubmissionDate,
        status: tableHeaderStatus,
        formSubmission: ''
      }
    };

    const colsWidth = [
      '30%',
      '15%',
      '25%',
      '15%',
      '15%',
    ];

    console.log('this.props.formSubmissions.list',this.props.formSubmissions.list);
    const savedFormsTableBody = this.props.formSubmissions.list.map((savedForm) => {      
      const { formName, submitterUserName, submissionDate, status } = savedForm;
      console.log('savedFormsTableBody', formName, submitterUserName, submissionDate, status);
      return {
        formName,
        submitterUserName,
        submissionDate: Utils.getFormattedDate(submissionDate),
        status: (
          <span className={`status-cell ${status.toLowerCase()}`} >
            {status}
          </span>
        ),
        formSubmission: (
          <a
            className='icon-log cell-table-link'
            href={`/form-submission/${savedForm.id}`} target="_blank"
          >
            {tableItemViewSubmission}
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

    return (

      <div className="forms-view list-view admin-view-body">
        <section className="forms-view-header">
          <div className="row">

            <div className="col-sm-12">
              <nav className="forms-nav">
                <ul>
                  <li>
                    <a className="forms-nav-link nav-bn icon-search_icon"
                      onClick={this.toggleFilterBox} >
                      Filter Submissions
                    </a>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </section>

        {
          this.state.showFilterBox ?
            <section className="forms-view-filters">
              <FilterFormSubmissions
                onSubmit={this.submitFilterForm}
              />
            </section> :
            <div></div>
        }

        <PTable
          sorted={true}
          items={formsTableData}
          wrapperState={this.state}
          clickOnColumnHeader={this.clickOnColumnHeader}
          isFetching={fetchingForms}
          customClass='forms-table'
          pagination={paginationSettings}
          colsConfig={colsWidth}
        />
      </div>
    );
  };
};

const mapStateToProps = (state, ownProps) => {
  return {
    common: state.common,
    formSubmissions: state.formSubmissions,
    login: state.login,
    local: state.localization
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    formSubmissionActions: bindActionCreators(formSubmissionActions, dispatch),
    registerActions: bindActionCreators(registerActions, dispatch),
    builderActions: bindActionCreators(builderActions, dispatch),
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(FormSubmissions);
