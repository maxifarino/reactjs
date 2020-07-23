import React from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { Modal } from 'react-bootstrap';

import PTable from '../../common/ptable';
import Utils from '../../../lib/utils';

import AddAgencyModal from '../modals/addAgencyModal';
import AgentsList from './agents';
import FilterAgencies from './filter';

import * as actions from './actions';
import * as commonActions from '../../common/actions';

class Agencies extends React.Component {  
  constructor(props) {
    super(props);
    this.state = {
      filter: {
        pageNumber: 1
      },
      filterBox: {
        name: '',
        city: '',
        state: '',
        zipCode: '',
      },
      tableOrderActive: 'name',
      order: {
        name: 'asc',
        city: 'desc',
        state: 'desc',
        zipCode: 'desc',
        mainPhone: 'desc',
        mainEmail: 'desc',
      },
      showFilterBox: false,
      currentAgency: '',
      currentAgencyId: null,
    };
  }

  componentDidMount() {
    const { actions, insuredId } = this.props;

    actions.fetchAgencies({
      orderBy: 'Name',
      orderDirection: 'ASC',
      ...(insuredId && { insuredId }),
    });
  }

  addId = (query) => {
    const { insuredId } = this.props;
    if (insuredId) {
      return { ...query, insuredId };
    }

    return query;
  }

  clickOnColumnHeader = (e, field) => {
    if (field === 'edit' || field === 'view') return;
    // get base query
    const pageNumber = this.state.filter.pageNumber;
    const orderDirection = this.state.order[field] === 'asc' ? 'DESC' : 'ASC'
    let preQuery = Utils.getFetchQuery(field, pageNumber, orderDirection);

    // add search filters
    preQuery = Utils.addSearchFiltersToQuery(preQuery, this.state.filterBox);

    const query = this.addId(preQuery);

    // fetch using query
    this.props.actions.fetchAgencies(query);
    
    // save new active tab and order
    let newState = {
      tableOrderActive: field,
      order: {
        name: field === 'name' ? 'asc' : 'desc',
        city: field === 'city' ? 'asc' : 'desc',
        state: field === 'state' ? 'asc' : 'desc',
        zipCode: field === 'zipCode' ? 'asc' : 'desc',
        mainPhone: field === 'mainPhone' ? 'asc' : 'desc',
        mainEmail: field === 'mainEmail' ? 'asc' : 'desc',
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
      let preQuery = Utils.getFetchQuery(field, pageNumber, orderDirection);

      // add search filters
      preQuery = Utils.addSearchFiltersToQuery(preQuery, this.state.filterBox);

      const query = this.addId(preQuery);

      // fetch using query
      this.props.actions.fetchAgencies(query);
      
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
    let preQuery = Utils.getFetchQuery(field, pageNumber, orderDirection);
    
    // add search filters
    const filterBox = {
      name: values.name || "",
      city: values.city || "",
      state: values.state || "",
      zipCode: values.zipCode || "",
    };
    console.log('filterBox', filterBox);

    preQuery = Utils.addSearchFiltersToQuery(preQuery, filterBox);

    const query = this.addId(preQuery);

    this.props.actions.fetchAgencies(query);
    // save searchterm and pagenumber
    this.setState({
      filterBox,
      filter: {
        pageNumber: 1
      }
    });
  }

  openModal = () => {
    this.setState({ currentAgency: null });
    this.props.actions.setShowModal(true);
  }

  closeModal = () => {
    this.props.actions.setShowModal(false);
    this.props.actions.setShowAgentsModal(false);
  }

  closeModalAndRefresh = () => {
    this.props.actions.setShowModal(false);
    this.setPageFilter(null, 1, true);
  }

  editAgency = (agency) => {
    this.setState({ currentAgency: agency });
    this.props.actions.setShowModal(true);
  }

  viewAgents = (agencyId) => {
    this.setState({ currentAgencyId: agencyId });
    this.props.actions.setShowAgentsModal(true);
  }

  render() {
    const {
      addButton,
      filterBtn,
      headers,
      viewAgents,
      editAgency,
    } = this.props.local.strings.agencies.agenciesList;

    const {
      nameColumn,
      cityColumn,
      stateColumn,
      zipCodeColumn,
      mainPhoneColumn,
      mainEmailColumn,
      viewAgentsColumn,
      agentNamesColumn,
      coverageAbbreviationColumn,
      editColumn,
    } = headers;

    const fields = (this.props.insuredId)
      ? [
        'name',
        'city',
        'state',
        'zipCode',
        'mainPhone',
        'mainEmail',
        'agentNames',
        'coverageAbbreviation',
        'edit',
      ]
      : [
        'name',
        'city',
        'state',
        'zipCode',
        'mainPhone',
        'mainEmail',
        'viewAgents',
        'edit',
      ];

    const agenciesTableMetadata = {
      fields: fields
    };

    agenciesTableMetadata.header = (this.props.insuredId) 
      ? {
        name: nameColumn,
        city: cityColumn,
        state: stateColumn,
        zipCode: zipCodeColumn,
        mainPhone: mainPhoneColumn,
        mainEmail: mainEmailColumn,
        agentNames: agentNamesColumn,
        coverageAbbreviation: coverageAbbreviationColumn,
        edit: editColumn,
      }
      : {
        name: nameColumn,
        city: cityColumn,
        state: stateColumn,
        zipCode: zipCodeColumn,
        mainPhone: mainPhoneColumn,
        mainEmail: mainEmailColumn,
        viewAgents: viewAgentsColumn,
        edit: editColumn,
      };

    const agenciesTableBody = this.props.agencies.list.map((agency) => {
      const {
        AgencyId,
        Name,
        City,
        State,
        ZipCode,
        MainPhone,
        MainEmail,
        AgentNames,
        CoverageAbbreviation,
      } = agency;
      
      return {
        name: Name,
        city: City,
        state: State,
        zipCode: ZipCode,
        mainPhone: MainPhone,
        mainEmail: MainEmail,
        agentNames: AgentNames,
        coverageAbbreviation: CoverageAbbreviation,
        viewAgents: (
          <a
            onClick={() => this.viewAgents(AgencyId)}
            className="cell-table-link icon-edit" 
            style={{ whiteSpace: 'nowrap' }}
          >
            {viewAgents}
          </a>
        ),
        edit: (
          <a
            onClick={() => this.editAgency(agency)}
            className="cell-table-link icon-edit" 
            style={{ whiteSpace: 'nowrap' }}
          >
            {editAgency}
          </a>
        ),
      };
    });

    const agenciesTableData = {
      fields: agenciesTableMetadata.fields,
      header: agenciesTableMetadata.header,
      body: agenciesTableBody
    };

    let {
      totalAmountOfAgencies, 
      agenciesPerPage,
      fetchingAgencies, 
      showModal,
      showAgentsModal,
    } = this.props.agencies;

    const paginationSettings = {
      total: totalAmountOfAgencies,
      itemsPerPage: agenciesPerPage,
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
            <AddAgencyModal
              onHide={this.closeModal}
              close={this.closeModalAndRefresh}
              agency={this.state.currentAgency}
            /> 
          </Modal.Body>
        </Modal>

        <Modal
          show={showAgentsModal}
          onHide={this.closeModal}
          className="add-item-modal add-entity-large"
          >
          <Modal.Body>  
            <AgentsList 
              agencyId={this.state.currentAgencyId}
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
                {(!this.props.insuredId) && (
                  <li>
                    <a
                      onClick={() => this.openModal()}
                      className="list-view-nav-link nav-bn icon-add" >
                      {addButton}
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
            <FilterAgencies
              onSubmit={this.submitFilterForm}
            />
          </section>
        }

        <PTable
          sorted={true}
          items={agenciesTableData}
          wrapperState={this.state}
          tableOrderActive={this.state.tableOrderActive}
          clickOnColumnHeader={this.clickOnColumnHeader}
          isFetching={fetchingAgencies}
          pagination={paginationSettings}
        />

      </div>
    )

  }
};

const mapStateToProps = (state) => {
  return {
    agencies: state.agencies,
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Agencies));
