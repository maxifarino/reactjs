import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import FormFilter from './filter'

import * as formsActions from './actions';
import * as registerActions from '../register/actions';
import * as builderActions from '../formBuilder/actions';
import * as sendTemplateActions from '../sendTemplateDialog/actions';
import * as formSubmissionActions from '../formSubmissions/actions';

import PTable from '../common/ptable';
import SendTemplateDialog from '../sendTemplateDialog';
import Utils from '../../lib/utils';

import './forms.css';

class Forms extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      filter: {
        pageNumber: 1
      },
      filterBox: {
        searchTerm: '',
        searchByCreator: '',
        searchBySentTo: '',
      },
      tableOrderActive: 'name',
      order: {
        name: 'asc',
        creatorFullName: 'asc',
        dateCreated: 'asc'
      },
      currentEditingForm: {},
      name: '',
      showFilterBox: false,
    };

    props.actions.fetchFormCreatorUsers();
    props.actions.fetchFormSCSentTo();
    props.actions.fetchForms({justFormData: true});
  }

  clickOnColumnHeader = (e, field) => {
    if (field === 'formSubmissionsLink' || field === 'sendFormLink' || field === 'editFormLink') return;
    // get base query
    const pageNumber = this.state.filter.pageNumber;
    const orderDirection = this.state.order[field] === 'asc' ? 'DESC' : 'ASC'
    let query = Utils.getFetchQuery(field, pageNumber, orderDirection);
    query.justFormData = true;
    // add search filters
    query = Utils.addSearchFiltersToQuery(query, this.state.filterBox);
    // fetch using query
    this.props.actions.fetchForms(query);
    // save new active tab and order
    let newState = {
      tableOrderActive: field,
      order: {
        name: 'asc',
        creatorFullName: 'asc',
        dateCreated: 'asc'
      }
    };
    newState.order[field] = this.state.order[field] === 'asc' ? 'desc' : 'asc';
    this.setState(newState);
  }

  setPageFilter = (e, pageNumber) => {
    if(this.state.filter.pageNumber !== pageNumber) {
      // get base query
      const field = this.state.tableOrderActive;
      const orderDirection = this.state.order[field] === 'asc' ? 'ASC' : 'DESC'
      let query = Utils.getFetchQuery(field, pageNumber, orderDirection);
      query.justFormData = true;
      // add search filters
      query = Utils.addSearchFiltersToQuery(query, this.state.filterBox);
      // fetch using query
      this.props.actions.fetchForms(query);
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
    query.justFormData = true;
    // add search filters
    const filterBox = {
      searchTerm: values.keywords || "",
      searchByCreator: values.formCreator || "",
      searchBySentTo: values.sentTo || ""
    };
    query = Utils.addSearchFiltersToQuery(query, filterBox);
    // fetch using query
    this.props.actions.fetchForms(query);
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

  goToSubmissions = (form) => {
    this.props.formSubmissionActions.setFormIdForFetching(form.id);
    this.props.history.push('/forms/submissions');
  }

  onAddNewForm = () => {
    this.props.builderActions.clearForm();
    localStorage.removeItem('formBuilderForm');
    this.props.history.push('/forms/new-form');
  }

  onEditForm = (form) => {
    this.props.builderActions.getFormById(form.id);
    this.props.history.push('/forms/new-form');
  }

  componentWillReceiveProps(props){
    this.setState({name: `${props.login.profile.FirstName} ${props.login.profile.LastName}`})
  }

  render() {
    if (!this.props.common.checkingAuthorizations) {
      if(!this.props.common.formBuilderAuth) {
        return <Redirect push to="/dashboard" />;
      }
    }

    let {
      tableHeaderName,
      tableHeaderCreator,
      tableHeaderDateCreater,
      buttonFilterForm,
      buttonFormSubmissions,
      buttonAddForm,
    } = this.props.local.strings.formList;

    let { sendForm, editForm, formSubmissions } = this.props.local.strings.formList.table;

    const formsTableMetadata = {
      fields: [
        'name',
        'creatorFullName',
        'dateCreated',
        'formSubmissionsLink',
        'sendFormLink',
        'editFormLink',
      ],
      header: {
        name: tableHeaderName,
        creatorFullName: tableHeaderCreator,
        dateCreated: tableHeaderDateCreater,
        formSubmissionsLink: '',
        sendFormLink: '',
        editFormLink: ''
      }
    };

    let formsRows = this.props.forms.list.map((formItem, idx) => {
      let formRow = {};
      formsTableMetadata.fields.forEach(fieldName => {
        let fieldValue = '';
        switch(fieldName) {
          case 'urlImgProfile':
            fieldValue = <img
              src={formItem[fieldName]}
              alt={formItem['name']}
            />;
            break;
          case 'formSubmissionsLink':
            fieldValue = (
              <a
                className='icon-quick_view cell-table-link'
                onClick={() => {this.goToSubmissions(formItem)}} >
                {formSubmissions}
                {/* <RowPopOver row={row} idx={idx} />*/}
              </a>
            );
            break;
          case 'sendFormLink':
            fieldValue = (
              <a
                className='icon-send cell-table-link'
                onClick={
                  (event) =>{
                    this.props.sendTemplateActions.openDialog(formItem);
                  }
                }>
                {sendForm}
                {/* <RowPopOver row={row} idx={idx} />*/}
              </a>

            );
            break;
          case 'editFormLink':
            fieldValue = (
              <a
                className='icon-edit cell-table-link'
                onClick={() => {this.onEditForm(formItem)}}
              >
                {editForm}
              </a>
            );
            break;
          case 'status':
            fieldValue = (
              <span
                className={`status-cell ${(formItem[fieldName].toLowerCase()).replace(/\s/g, '')}`}
              >
                  {formItem[fieldName]}
                </span>
            );
            break;
          case 'creatorFullName':
            fieldValue = formItem['creator'];
            break;
          default:
            fieldValue = formItem[fieldName];
            break;
        }
        formRow[fieldName] = fieldValue;
      });
      return formRow;
    });

    const formsTableData = {
      fields: formsTableMetadata.fields,
      header: formsTableMetadata.header,
      body: formsRows
    };

    let {totalAmountOfForms, formsPerPage} = this.props.forms;

    const paginationSettings = {
      total: totalAmountOfForms,
      itemsPerPage: formsPerPage,
      setPageHandler: this.setPageFilter,
      currentPageNumber: this.state.filter.pageNumber,
    };

    return (

      <div className="forms-view list-view admin-view-body">
        <SendTemplateDialog
              ref={ (instance) => {this.templateDialog = instance; }}
              templateId = '0'
              templateName = 'templateName'
        />
        <section className="forms-view-header">
          <div className="row">

            <div className="col-sm-12">
              <nav className="forms-nav">
                <ul>
                  <li>
                    <a className="forms-nav-link nav-bn icon-login-door"
                      onClick={this.toggleFilterBox} >
                      {buttonFilterForm}
                    </a>
                  </li>
                  <li>
                    <a className="forms-nav-link nav-bn icon-log"
                      onClick={this.goToSubmissions} >
                      {buttonFormSubmissions}
                    </a>
                  </li>
                  <li>
                    <a className="forms-nav-link nav-bn icon-add"
                      onClick={this.onAddNewForm}>
                      {buttonAddForm}
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
              <FormFilter
                hiringClients={this.props.forms}
                onSubmit={this.submitFilterForm}
              ></FormFilter>
            </section> :
            <div></div>
        }

        <PTable
          sorted={true}
          items={formsTableData}
          wrapperState={this.state}
          clickOnColumnHeader={this.clickOnColumnHeader}
          isFetching={this.props.forms.fetchingForms}
          customClass='forms-table'
          pagination={paginationSettings}
        />
      </div>
    );
  };
};

const mapStateToProps = (state, ownProps) => {
  return {
    common: state.common,
    forms: state.forms,
    login: state.login,
    local: state.localization
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(formsActions, dispatch),
    registerActions: bindActionCreators(registerActions, dispatch),
    builderActions: bindActionCreators(builderActions, dispatch),
    sendTemplateActions: bindActionCreators(sendTemplateActions, dispatch),
    formSubmissionActions: bindActionCreators(formSubmissionActions, dispatch),
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(Forms);
