import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import FormFilter from './filter'
import Utils from '../../../lib/utils';

import * as searchActions from './actions';
import Tabs from './tabs';
import Table from './table';

import Accordion from './../../common/accordion'
import * as commonActions from '../../common/actions';
import './search.css';
import RolAccess from './../../common/rolAccess';

class Search extends Component {

  constructor(props) {
    super(props);

    this.state = {
      filter: {
        pageNumber: 1
      },
      filterBox: {
        searchTerm: '',
      },
      tableOrderActive: 'Name',
      order: {
        Name: 'ASC',
      },
      showFilterBox: true,
      showResultBox: false,
      activeTab: 'insureds',
      cache: {},
    }

    this.tabs = {
      insureds: {
        label: 'Insureds',
        fields: [
          'Id',
          'Name',
          'Project',
          'Status',
          'Holder',
          'State',
          'Coverage',
          'View'
        ],
        header: {
          Id: 'Id',
          Name: 'Insured',
          Project: 'Project',
          Status: 'Status',
          Holder: 'Holder',
          State: 'State',
          Coverage: 'Coverage',
        },
        defaultOrder: 'Name'
      },
      projects: {
        label: 'Projects',
        fields: [
          'Id',
          'Name',
          'Holder',
          'City',
          'State',
          'Req',
          'Pnd',
          'Rev',
          'Rej',
          'Acc',
          'Exp',
          'View'
        ],
        header: {
          Id: 'Id',
          Name: 'Name',
          Holder: 'Holder',
          City: 'City',
          State: 'State',
          Req: 'Req',
          Pnd: 'Pnd',
          Rev: 'Rev',
          Rej: 'Rej',
          Acc: 'Acc',
          Exp: 'Exp',
        },
        defaultOrder: 'Name'
      },
      holders: {
        label: 'Holders',
        fields: [
          'Id',
          'Name',
          'ParentHolder',
          'TopHolder',
          'City',
          'State',
          'View'
        ],
        header: {
          Id: 'Id',
          Name: 'Name',
          holderName: 'Holder',
          ParentHolder: 'Parent Holder',
          TopHolder: 'Top Holder',
          City: 'City',
          State: 'State',
        },
        defaultOrder: 'Id'
      },
      contacts: {
        label: 'Contacts',
        fields: [
          'ContactID',
          'FirstName',
          'LastName',
          'PhoneNumber',
          'EmailAddress',
          'Entity',
          'ContactType',
        ],
        header: {
          ContactID: 'Id',
          FirstName: 'First Name',
          LastName: 'Last Name',
          PhoneNumber: 'Phone',
          EmailAddress: 'Email',
          Entity: 'Entity',
          ContactType: 'Type',
        },
        defaultOrder: 'LastName'
      },
      agencies: {
        label: 'Agencies',
        fields: [
          'AgencyId',
          'Name',
          'City',
          'State',
        ],
        header: {
          AgencyId: 'Id',
          Name: 'Name',
          City: 'City',
          State: 'State',
        },
        defaultOrder: 'Name'
      }
    };

    this.itemsPerPage = 10;
  }

  componentDidMount() {
    this.props.actions.fetchStates();
    this.props.actions.fetchCoverageTypes();
  }

  getQueryFilters = (values, isNewSearch = false, pageNumber = 1, field = this.state.tableOrderActive) => {

    const orderDirection = (isNewSearch)
      ? 'ASC'
      : (this.state.order[field] === 'ASC')
        ? 'ASC'
        : 'DESC';

    let query = Utils.getFetchQuery(field, pageNumber, orderDirection);

    // add search filters
    const filterBox = {
      keyword: values.keyword || "",
      holderId: values.holder ? values.holder.value : "",
      projectId: values.project ? values.project.value : "",
      insuredId: values.insured ? values.insured.value : "",
      state: values.state || "",
      customerUniqueId: values.customerUniqueId || "",
      archived: values.includeArchived || "",
      compliance: values.compliance || "",
      tierRating: values.tierRating || "",
      coverageType: values.coverageType || "",
      coverageStatus: values.coverageStatus || "",
      expirationStartDate: values.expirationStartDate || "",
      expirationEndDate: values.expirationEndDate || "",
      insurer: values.insurer || "",
    };

    query = Utils.addSearchFiltersToQuery(query, filterBox);

    // save searchterm, pagenumber & query
    this.setState({
      filterBox,
      filter: {
        pageNumber: pageNumber
      },
      values: values,
    });

    return query;
  }

  onChangeTab = (activeTab) => {
    this.setState({
      activeTab: activeTab,
      tableOrderActive: this.tabs[activeTab].defaultOrder,
      order: {
        [this.tabs[activeTab].defaultOrder]: 'ASC'
      }
    }, () => {

      let queryFilters = this.getQueryFilters(this.state.values, false);
      // tab cache
      if (!this.state.cache[activeTab]) {
        let activeTabCache = this.state.cache;
        activeTabCache[activeTab] = true;
        this.setState({ cache: activeTabCache });
        this.fetchData(queryFilters);
      }
    });
  }

  setPageHandler = (e, pageNumber) => {
    if (this.state.filter.pageNumber !== pageNumber) {
      let queryFilters = this.getQueryFilters(this.state.values, false, pageNumber);
      this.fetchData(queryFilters);
    }
  }

  clickOnColumnHeaderHandler = (field) => {
    let newOrderState = {
      tableOrderActive: field,
      order: {}
    };
    newOrderState.order[field] = this.state.order[field] === 'ASC' ? 'DESC' : 'ASC';

    this.setState(newOrderState, () => {
      let queryFilters = this.getQueryFilters(this.state.values, false, this.state.filter.pageNumber, field);
      this.fetchData(queryFilters);
    });
  }

  submitFilterForm = (values) => {
    let queryFilters = this.getQueryFilters(values, true);
    this.fetchData(queryFilters);
    this.setState({ showResultBox: true, showFilterBox: false, cache: { insureds: true } });
  }

  fetchData(query) {
    switch (this.state.activeTab) {
      case 'insureds':
        this.props.actions.fetchSearchInsureds(query);
        break;
      case 'projects':
        this.props.actions.fetchSearchProjects(query);
        break;
      case 'holders':
        this.props.actions.fetchSearchHolders(query);
        break;
      case 'contacts':
        this.props.actions.fetchSearchContacts(query);
        break;
      case 'agencies':
        this.props.actions.fetchSearchAgencies(query);
        break;
      default:
    }
  }

  renderFilter = () => <FormFilter {...this.state} onSubmit={this.submitFilterForm} />

  renderResults = (data, paginationSettings, isFetching) => {
    return (
      <Fragment>
        <Tabs
          tabs={this.tabs}
          onChangeTab={this.onChangeTab}
        />
        <Table
          data={data}
          paginationSettings={paginationSettings}
          isFetching={isFetching}
          clickOnColumnHeaderHandler={this.clickOnColumnHeaderHandler}
        />
      </Fragment>
    )
  }

  renderLink(url, parameter) {
    let component = (
      <Link
        to={`/certfocus/${url}/${parameter}`}
        className="cell-table-link icon-quick_view"
      >
        view
          </Link>
    )
    return component;
  }

  renderInsuredColumn = () => {
    const tableBody = this.props.search[this.state.activeTab].list.map((element, idx) => {
      const {
        ComplianceStatusID,
        Coverage,
        Holder,
        HolderId,
        Id,
        Name,
        Project,
        ProjectId,
        State,
        Status,
      } = element;

      return {
        ComplianceStatusID: ComplianceStatusID,
        Coverage: Coverage,
        Holder: Holder,
        HolderId: HolderId,
        Id: Id,
        Name: Name,
        Project: Project,
        ProjectId: ProjectId,
        State: State,
        Status: Status,
        View: (
          <RolAccess
            masterTab="insured"
            sectionTab="view_insured"
            component={() => this.renderLink('insureds', Id)}>
          </RolAccess>
        )
      }
    });
    return tableBody || [];
  }

  renderProjectColumn = () => {
    const tableBody = this.props.search[this.state.activeTab].list.map((element, idx) => {
      const {
        Acc,
        City,
        Exp,
        HiringClientId,
        Holder,
        Id,
        Name,
        Pnd,
        Rej,
        Req,
        Rev,
        State,
      } = element;

      return {
        Acc: Acc,
        City: City,
        Exp: Exp,
        HiringClientId: HiringClientId,
        Holder: Holder,
        Id: Id,
        Name: Name,
        Pnd: Pnd,
        Rej: Rej,
        Req: Req,
        Rev: Rev,
        State: State,
        View: (
          <RolAccess
            masterTab="projects"
            sectionTab="view_project"
            component={() => this.renderLink('projects', Id)}>
          </RolAccess>          
        )
      }
    });
    return tableBody || [];
  }

  renderHoldersColumn = () => {
    const tableBody = this.props.search[this.state.activeTab].list.map((element, idx) => {
      const {
        City,
        Id,
        Name,
        ParentHolder,
        State,
        TopHolder
      } = element;

      return {
        City: City,
        Id: Id,
        Name: Name,
        ParentHolder: ParentHolder,
        State: State,
        TopHolder: TopHolder,
        View: (
          <RolAccess
            masterTab="hiring_clients"
            sectionTab="view_holder"
            component={() => this.renderLink('holders', Id)}>
          </RolAccess>          
        )
      }
    });
    return tableBody || [];
  }

  render() {
    const paginationSettings = {
      setPageHandler: this.setPageHandler,
      currentPageNumber: this.state.filter.pageNumber,
      itemsPerPage: this.itemsPerPage,
      total: this.props.search[this.state.activeTab].total || 0
    };

    const data = {
      fields: this.tabs[this.state.activeTab].fields,
      header: this.tabs[this.state.activeTab].header,
      body: this.props.search[this.state.activeTab].list || []
    };

    switch (this.state.activeTab) {
      case 'insureds':
        data.body = this.renderInsuredColumn();
        break;

      case 'projects':
        data.body = this.renderProjectColumn();
        break;

      case 'holders':
        data.body = this.renderHoldersColumn();
        break;
    }

    let isFetching = this.props.search.fetching[this.state.activeTab];

    const headerStyle = {
      background: 'linear-gradient(to bottom right, #7ED0BC, #29AEA2)',
      color: '#FFFFFF',
      paddingTop: '10px',
      paddingBottom: '10px',
    }

    const sections = [
      {
        title: <span className="accordionHeader">Criteria</span>,
        content: this.renderFilter(),
        isShown: this.state.showFilterBox
      },
      {
        title: <span className="accordionHeader">Results</span>,
        content: this.renderResults(data, paginationSettings, isFetching),
        isShown: this.state.showResultBox
      }
    ];

    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-12">
            <Accordion
              data={sections}
              headerStyle={headerStyle}
            />
          </div>
        </div>
      </div>
    );
  };
};

const mapStateToProps = (state, ownProps) => {
  return {
    common: state.common,
    login: state.login,
    local: state.localization,
    search: state.search,
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(searchActions, dispatch),
    commonActions: bindActionCreators(commonActions, dispatch)
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(Search);