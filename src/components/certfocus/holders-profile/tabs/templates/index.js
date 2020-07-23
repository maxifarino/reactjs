import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';

import * as listActions from '../../../../communication-templates/list/actions';
import * as builderActions from '../../../../communication-templates/builder/actions';
import PTable from "../../../../common/ptable";


class CFTemplates extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      filter: {
        pageNumber: 1
      },
      tableOrderActive: 'templateName',
      order: {
        templateName: 'asc',
        subject: 'desc',
      },
      hiringClientId : props.holderId,
    };

    this.goToBuilder = this.goToBuilder.bind(this);

    props.actions.fetchTemplates({
      hiringClientId: this.state.hiringClientId,
      orderBy: 'templateName',
      orderDirection: 'ASC'
    });
  }

  getFetchQuery = (activeField, pageNumber, orderDirection) => {
    let orderBy = activeField;
    const query = {
      pageNumber,
      orderBy,
      orderDirection
    };
    return query;
  }

  clickOnColumnHeader = (e, field) => {
    if (field === 'edit') return;
    const pageNumber = this.state.filter.pageNumber;
    const orderDirection = this.state.order[field] === 'asc' ? 'DESC' : 'ASC';
    let query = this.getFetchQuery (field, pageNumber, orderDirection);
    query.hiringClientId = this.state.hiringClientId;

    this.props.actions.fetchTemplates(query);

    let newState = {
      tableOrderActive: field,
      order: {
        templateName: field === 'templateName' ? 'asc' : 'desc',
        subject: field === 'subject' ? 'asc' : 'desc',
      }
    };

    newState.order[field] = this.state.order[field] === 'asc' ? 'desc' : 'asc';

    this.setState(newState);
  }

  setPageFilter = (e, pageNumber) => {
    if(this.state.filter.pageNumber !== pageNumber) {
      const field = this.state.tableOrderActive;
      const orderDirection = this.state.order[field] === 'asc' ? 'ASC' : 'DESC';
      let query = this.getFetchQuery (field, pageNumber, orderDirection);
      query.hiringClientId = this.state.hiringClientId;

      this.props.actions.fetchTemplates(query);

      this.setState({
        filter: {
          pageNumber
        }
      });

    }
  }

  goToBuilder(template) {
    this.props.builderActions.setTemplate(template);
    if(!template){
      this.props.builderActions.setHiringClient(this.props.holderId);
    }
    this.props.history.push(`/communication-templates/builder/${this.props.match.params.holderId}`);
  }

  render() {
    const {
      editTemplate,
      addNewTemplate,
      templateTitle,
      templateDescription
    } = this.props.local.strings.hcProfile.template;

    const templatesTableMetadata = {
      fields: [
        'templateName',
        'subject',
        'edit'
      ],
      header: {
        templateName: templateTitle,
        subject: templateDescription,
        edit: '',
      }
    };

    const templatesTableBody = this.props.templates.list.map((template, idx) => {
      const {templateName, subject} = template;
      return {
        templateName,
        subject,
        edit: (
          <a
            className="cell-table-link icon-edit"
            onClick={()=> this.goToBuilder(template)}
          >
            {editTemplate}
          </a>
        ),
      };
    });

    const templatesTableData = {
      fields: templatesTableMetadata.fields,
      header: templatesTableMetadata.header,
      body: templatesTableBody
    };

    let {totalAmountOfTemplates, templatesPerPage, fetchingTemplates} = this.props.templates;
    const paginationSettings = {
      total: totalAmountOfTemplates,
      itemsPerPage: templatesPerPage,
      setPageHandler: this.setPageFilter,
      currentPageNumber: this.state.filter.pageNumber,
    };

    const colsWidth = [
      '30%',
      '50%',
      '20%',
    ];

    return (
      <div className="list-view admin-view-body">
        <section className="list-view-header templates-view-header">
          <div className="row">
            <div className="col-sm-6">
            </div>
            <div className="col-sm-6">
              <nav className="list-view-nav">
                <ul>
                  <li>
                    <a
                      className="list-view-nav-link nav-bn icon-add"
                      onClick={()=> this.goToBuilder()}
                    >
                      {addNewTemplate}
                    </a>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </section>

        <PTable
          sorted={true}
          items={templatesTableData}
          wrapperState={this.state}
          tableOrderActive={this.state.tableOrderActive}
          clickOnColumnHeader={this.clickOnColumnHeader}
          isFetching={fetchingTemplates}
          customClass='templates-list'
          pagination={paginationSettings}
          colsConfig={colsWidth}
        />
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    local: state.localization,
    templates: state.templates
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(listActions, dispatch),
    builderActions: bindActionCreators(builderActions, dispatch),
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CFTemplates));
