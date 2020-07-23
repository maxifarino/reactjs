import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Redirect } from 'react-router-dom';

import * as listActions from './actions';
import * as builderActions from '../builder/actions';
import * as registerActions from '../../register/actions';
import FilterCT from './filter';
import PTable from '../../common/ptable';
import Utils from '../../../lib/utils';

import './email-templates.css';

class TemplatesList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      filter: {
        pageNumber: 1
      },
      filterBox: {
        searchTerm: ''
      },
      tableOrderActive: 'templateName',
      order: {
        templateName: 'asc',
        templateCreator: 'desc',
        subject: 'desc',
      },
      currentEditingTemplate: {},
      name: '',
      showFilterBox: false
    };

    this.goToBuilder = this.goToBuilder.bind(this);
    props.actions.fetchTemplates({orderBy:'templateName', orderDirection:'ASC'});
  }

  clickOnColumnHeader = (e, field) => {
    if (field === 'editTemplateLink')return;
    // get base query
    const pageNumber = this.state.filter.pageNumber;
    const orderDirection = this.state.order[field] === 'asc' ? 'DESC' : 'ASC'
    let query = Utils.getFetchQuery(field, pageNumber, orderDirection);
    // add search filters
    query = Utils.addSearchFiltersToQuery(query, this.state.filterBox);
    // fetch using query
    this.props.actions.fetchTemplates(query);
    // save new active tab and order
    let newState = {
      tableOrderActive: field,
      order: {
        templateName: field === 'templateName' ? 'asc' : 'desc',
        templateCreator: field === 'templateCreator' ? 'asc' : 'desc',
        subject: field === 'subject' ? 'asc' : 'desc'
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
      // add search filters
      query = Utils.addSearchFiltersToQuery(query, this.state.filterBox);
      // fetch using query
      this.props.actions.fetchTemplates(query);
      // save page number
      this.setState({
        filter: {
          pageNumber
        }
      });

    }
  }

  toggleFilterBox = () => {
    this.setState({showFilterBox: !this.state.showFilterBox})
  }

  submitFilterTemplate = (values) => {
    // get base query
    const field = this.state.tableOrderActive;
    const pageNumber = 1;
    const orderDirection = this.state.order[field] === 'asc' ? 'ASC' : 'DESC'
    let query = Utils.getFetchQuery(field, pageNumber, orderDirection);
    // add search filters
    const filterBox = {
      searchTerm: values.keywords || ""
    };
    query = Utils.addSearchFiltersToQuery(query, filterBox);
    // fetch using query
    this.props.actions.fetchTemplates(query);
    // save searchterm and pagenumber
    this.setState({
      filterBox,
      filter: {
        pageNumber: 1
      }
    });
  }

  componentWillReceiveProps(props){
    this.setState({name: `${props.login.profile.FirstName} ${props.login.profile.LastName}`});
  }

  goToBuilder(template) {
    this.props.builderActions.setTemplate(template);
    this.props.history.push('/communication-templates/builder');
  }

  render() {
    if (!this.props.common.checkingAuthorizations) {
      if(!this.props.common.commTempAuth) {
        return <Redirect push to="/dashboard" />;
      }
    }

    const {
      filterCT
    } = this.props.local.strings.templates;

    const templatesTableMetadata = {
      fields: [
        'templateName',
        'templateCreator',
        'subject',
        'editTemplateLink',
      ],
      header: {
        templateName: 'Template Name',
        templateCreator: 'Template Creator',
        subject: 'Template Description',
        editTemplateLink: ''
      }
    };

    let templatesRows = this.props.templates.list.map((templateItem, idx) => {
      let templateRow = {};
      templatesTableMetadata.fields.forEach(fieldName => {
        let fieldValue = '';
        switch(fieldName) {
          case 'templateName':
            fieldValue = templateItem.templateName;
            break;
          case 'id':
            fieldValue = templateItem.id;
            break;
          case 'subject':
            fieldValue = templateItem.subject.length > 30 ? templateItem.subject.slice(0,30).concat('...') : templateItem.subject;
            break;
          case 'templateCreator':
            fieldValue = templateItem.templateCreator;
            break;
          case 'templateSections':
            fieldValue = templateItem.templateSections;
            break;
          case 'editTemplateLink':
            fieldValue = (
              <a
                className='icon-edit cell-table-link'
                onClick={()=> this.goToBuilder(templateItem)}
              >
                Edit Template
              </a>
            );
            break;
          case 'status':
            fieldValue = (
              <span
                className={`status-cell ${(templateItem[fieldName].toLowerCase()).replace(/\s/g, '')}`}
              >
                {templateItem[fieldName]}
              </span>
            );
            break
          default:
            fieldValue = templateItem[fieldName];
            break;
        }
        templateRow[fieldName] = fieldValue;
      });
      return templateRow;
    });

    const templatesTableData = {
      fields: templatesTableMetadata.fields,
      header: templatesTableMetadata.header,
      body: templatesRows
    };

    let {totalAmountOfTemplates, templatesPerPage} = this.props.templates;

    const paginationSettings = {
      total: totalAmountOfTemplates,
      itemsPerPage: templatesPerPage,
      setPageHandler: this.setPageFilter,
      currentPageNumber: this.state.filter.pageNumber,
    };

    return (

      <div className="templates-view admin-view-body">
        <section className="templates-view-header list-view-header">
          <div className="row">
            <div className="col-sm-12">
              <nav className="templates-nav">
                <ul>
                  <li>
                    <a onClick={this.toggleFilterBox}
                      className="templates-nav-link nav-bn icon-login-door">
                      {filterCT}
                    </a>
                  </li>
                  <li>
                    <a onClick={()=> this.goToBuilder(null)} className="templates-nav-link nav-bn icon-log">Add template</a>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </section>

        {
          this.state.showFilterBox ?
            <section className="list-view-filters">
              <FilterCT
                onSubmit={this.submitFilterTemplate}
              ></FilterCT>
            </section> :
            <div></div>
        }

        <PTable
          sorted={true}
          items={templatesTableData}
          wrapperState={this.state}
          tableOrderActive={this.state.tableOrderActive}
          clickOnColumnHeader={this.clickOnColumnHeader}
          isFetching={this.props.templates.fetchingTemplates}
          customClass='templates-table'
          pagination={paginationSettings}
        />
      </div>
    );
  };
};

const mapStateToProps = (state, ownProps) => {
  return {
    common: state.common,
    templates: state.templates,
    local: state.localization,
    login: state.login
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(listActions, dispatch),
    builderActions: bindActionCreators(builderActions, dispatch),
    registerActions: bindActionCreators(registerActions, dispatch)
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(TemplatesList);
