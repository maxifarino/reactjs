import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Modal } from 'react-bootstrap';
import { Link, withRouter } from 'react-router-dom';

import AddSCModal from './addSCModal';
import PTable from '../common/ptable';

import * as scActions from './actions';
import * as hcActions from '../hiringclients/actions';
import * as registerActions from '../register/actions';
import * as scProfileActions from '../sc-profile/actions';

import Utils from '../../lib/utils';
import FilterSC from './filter';

class Subcontractors extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      filter: {
        pageNumber: 1
      },
      filterBox: {
        searchTerm: '',
        searchByHCId: '',
        searchByStatusId: '',
        searchByTradeId: '',
        searchByTieRatingId: '',
        searchByStateName: '',
        searchByMaxSingleLimit: '',
        searchByMaxAggregateLimit: ''
      },
      tableOrderActive: 'name',
      showFilterBox: false,
      order: {
        name: 'asc',
        mainTrade: 'desc',
        taxID: 'desc',
        tierDesc: 'desc',
        status: 'desc',
        singleProjectLimit: 'desc',
      },
      hcOption: false
    };

    this.viewSubcontractor = this.viewSubcontractor.bind(this);

    // props.hcActions.fetchHiringClients({ withoutPag: true });
    props.actions.fetchSCStatusWithCounts(props.hcId);
    props.actions.fetchSCTierRates();
    props.registerActions.fetchResources();
    props.registerActions.fetchGeoStates();

    if (this.props.fromHCtab) {
      props.actions.fetchTrades('tradesbyhc', {
        hiringClientId: props.hcId
      });
    } else {
      props.actions.fetchTrades('tradesbyuserid');
    }

    if (props.loginProfile.Id) {
      let query = Utils.getFetchQuery('name', 1, 'ASC');
      query.userId = props.loginProfile.Id;
      this.addHCId(query);
      this.props.actions.fetchSubcontractors(query);
    }
  }

  componentWillReceiveProps(nextProps) {
    const oldHcOption = this.state.hcOption
    const newHcOption = nextProps.sc && nextProps.sc.list && nextProps.sc.list[0] && nextProps.sc.list[0].hcOption ? nextProps.sc.list[0].hcOption : null

    if (newHcOption && newHcOption != oldHcOption) {
      this.setState({
        hcOption: newHcOption
      }, () => {
        if (this.state.hcOption == 1) {

          const order = this.state.order
          order.requestorName = 'desc'
          order.requestorEmail = 'desc'

          this.setState({
            order
          })
        }
      })
    }

    if (nextProps.loginProfile.Id !== this.props.loginProfile.Id) {
      const field = this.state.tableOrderActive;
      const pageNumber = this.state.filter.pageNumber;
      const orderDirection = this.state.order[field] === 'asc' ? 'ASC' : 'DESC'
      let query = Utils.getFetchQuery(field, pageNumber, orderDirection);
      query.userId = nextProps.loginProfile.Id;
      this.addHCId(query);
      this.props.actions.fetchSubcontractors(query);
    }

    let
      oldHcId = this.props.hcId,
      newHcId = nextProps.hcId,
      hcId = oldHcId ? oldHcId : newHcId

    if (oldHcId !== newHcId) {
      console.log('hcId = ', hcId)
      this.props.actions.fetchSCStatusWithCounts(hcId);
    }

  }

  addHCId(query) {
    if (this.props.fromHCtab) {
      query.searchByHCId = this.props.hcId;
    }

    return query;
  }

  renderAssignSCUser() {
    let { assignSCUser } = this.props.local.strings.subcontractors;
    
    let component = '';
    if (this.props.loginProfile.Role && (this.props.loginProfile.Role.Name != 'Subcontractor')) {
      component =
        <a
          className='cell-table-link icon-add'
          onClick={(e) => { /*this.openAddHCUserModal(e, sc.id) */ }}>
          {assignSCUser}
        </a>
    }
    return component;
  }

  viewSubcontractor(scId) {
    console.log(scId);
    console.log(this.props.fromHCtab);

    if (this.props.fromHCtab) {
      this.props.scProfileActions.setHiringClientId(this.props.hcId);
    }
    console.log(`/subcontractors/${scId}`);
    this.props.history.push(`/subcontractors/${scId}`);
  }

  clickOnColumnHeader = (e, field) => {
    if (field === 'assignSCUser' || field === 'view' || field === 'singleProjectLimit') return;
    // get base query
    const pageNumber = this.state.filter.pageNumber;
    const orderDirection = this.state.order[field] === 'asc' ? 'DESC' : 'ASC'
    let query = Utils.getFetchQuery(field, pageNumber, orderDirection);
    query.userId = this.props.loginProfile.Id;
    // add search filters
    query = Utils.addSearchFiltersToQuery(query, this.state.filterBox);
    this.addHCId(query);
    // fetch using query
    // console.log('query = ', query)
    this.props.actions.fetchSubcontractors(query);
    // save new active tab and order
    let newState = {
      tableOrderActive: field,
      order: {
        name: field === 'name' ? 'asc' : 'desc',
        mainTrade: field === 'mainTrade' ? 'asc' : 'desc',
        taxID: field === 'taxID' ? 'asc' : 'desc',
        tierDesc: field === 'tierDesc' ? 'asc' : 'desc',
        status: field === 'status' ? 'asc' : 'desc',
        singleProjectLimit: field === 'singleProjectLimit' ? 'asc' : 'desc'
      }
    };

    if (this.state.hcOption == 1) {
      newState.order.requestorName = field === 'requestorName' ? 'asc' : 'desc'
      newState.order.requestorEmail = field === 'requestorEmail' ? 'asc' : 'desc'
    }

    newState.order[field] = this.state.order[field] === 'asc' ? 'desc' : 'asc';
    this.setState(newState);
  }

  setPageFilter = (e, pageNumber) => {
    if (this.state.filter.pageNumber !== pageNumber) {
      // get base query
      const field = this.state.tableOrderActive;
      const orderDirection = this.state.order[field] === 'asc' ? 'ASC' : 'DESC'
      let query = Utils.getFetchQuery(field, pageNumber, orderDirection);
      query.userId = this.props.loginProfile.Id;
      // add search filters
      query = Utils.addSearchFiltersToQuery(query, this.state.filterBox);
      this.addHCId(query);
      // fetch using query
      this.props.actions.fetchSubcontractors(query);
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

  submitFilterForm = values => {
    // get base query
    const field = this.state.tableOrderActive;
    const pageNumber = 1;
    const orderDirection = this.state.order[field] === 'asc' ? 'ASC' : 'DESC'
    let query = Utils.getFetchQuery(field, pageNumber, orderDirection);
    query.userId = this.props.loginProfile.Id;
    // add search filters
    const filterBox = {
      searchTerm: values.keywords || "",
      searchByHCId: values.associatedHCs || "",
      searchByStatusId: values.status || "",
      searchByTradeId: values.trade || "",
      searchByTierRatingId: values.tierRating || "",
      searchByStateName: values.state || "",
      searchByMaxSingleLimit: values.maxSingle || "",
      searchByMaxAggregateLimit: values.maxAggregate || ""
    };
    query = Utils.addSearchFiltersToQuery(query, filterBox);
    this.addHCId(query);
    // fetch using query
    this.props.actions.fetchSubcontractors(query);
    // save searchterm and pagenumber
    this.setState({
      filterBox,
      filter: {
        pageNumber: 1
      }
    });
  }

  openAddSCModal = (e) => {
    this.props.actions.setAddSCShowModal(true);
  }

  closeAddSCModal = (e) => {
    this.props.actions.setAddSCShowModal(false);
  }

  getSCTableData() {
    let {
      assignSCUser,
      viewSC,
      tableHeader,
    } = this.props.local.strings.subcontractors;

    const {
      scName,
      tierRating,
      status,
      trade,
      state
    } = tableHeader;

    const scTableMetadata = {
      fields: [
        'name',
        'status',
        'mainTrade',
        'state',
        'tierDesc',
        'view',
        'assignSCUser',
      ],
      header: {
        name: scName,
        status: status,
        mainTrade: trade,
        state: state,
        tierDesc: tierRating,
        view: '',
        assignSCUser: ''
      }
    };

    const SCTableBody = this.props.sc.list.map((sc, idx) => {
      if (sc.status === null || sc.status === undefined) sc.status = "None";
      const body = {
        name: sc.name,
        status: (
          <span
            className={`status-cell ${(sc.status.toLowerCase()).replace(/\s/g, '')}`}
          >
            {sc.status}
          </span>
        ),
        mainTrade: sc.trade.description,
        state: sc.state,
        tierDesc: `${sc.tier.id} - ${sc.tier.description}`,
        view: (
          <Link
            to={`/subcontractors/${sc.id}`}
            className='cell-table-link icon-quick_view'>
            {viewSC}
          </Link>
        ),

        assignSCUser: (this.renderAssignSCUser())

      };

      return body
    });

    return {
      fields: scTableMetadata.fields,
      header: scTableMetadata.header,
      body: SCTableBody
    };
  }

  getFromHCTabSCTableData() {
    let {
      viewSC,
      tableHeader,
    } = this.props.local.strings.subcontractors;

    const {
      scName,
      tierRating,
      status,
      trade,
      state,
      requestorName,
      requestorEmail
    } = tableHeader;

    const scTableMetadata = {
      fields: [
        'name',
        'tierDesc',
        'status',
        'mainTrade',
        'state',
        'view'
      ],
      header: {
        name: scName,
        tierDesc: tierRating,
        status: status,
        mainTrade: trade,
        state: state,
        view: ''
      }
    };

    if (this.state.hcOption == 1) {
      scTableMetadata.fields = [
        'name',
        'tierDesc',
        'status',
        'mainTrade',
        'requestorName',
        'requestorEmail',
        'state',
        'view'
      ]
      scTableMetadata.header.requestorName = requestorName
      scTableMetadata.header.requestorEmail = requestorEmail
    }

    const SCTableBody = this.props.sc.list.map((sc, idx) => {
      if (sc.status === null || sc.status === undefined) sc.status = "None";
      const body = {
        name: sc.name,
        tierDesc: `${sc.tier.id} - ${sc.tier.description}`,
        status: (
          <span
            className={`status-cell ${(sc.status.toLowerCase()).replace(/\s/g, '')}`}
          >
            {sc.status}
          </span>
        ),
        mainTrade: sc.trade.description,
        requestorName: sc.requestorName ? sc.requestorName : '',
        requestorEmail: sc.requestorEmail ? sc.requestorEmail : '',
        state: sc.state,
        view: (
          <a
            onClick={(e) => { this.viewSubcontractor(sc.id) }}
            className='cell-table-link icon-quick_view'>
            {'viewSC'}
          </a>
        )
      };

      if (this.state.hcOption != 1) {
        delete body.requestorName
        delete body.requestorEmail
      }

      return body
    });

    return {
      fields: scTableMetadata.fields,
      header: scTableMetadata.header,
      body: SCTableBody
    };
  }

  renderAddButonSC() {
    let { addButton } = this.props.local.strings.subcontractors;
    let component = '';

    if (this.props.loginProfile.Role && (this.props.loginProfile.Role.Name != 'Subcontractor')) {
      component = <a
        onClick={this.openAddSCModal}
        className="list-view-nav-link nav-bn icon-add" >
        {addButton}
      </a>
    }

    return component;
  }

  render() {
    let {
      addButton,
      filterSC
    } = this.props.local.strings.subcontractors;

    let { totalAmountOfSC, SCPerPage } = this.props.sc;

    const paginationSettings = {
      total: totalAmountOfSC,
      itemsPerPage: SCPerPage,
      setPageHandler: this.setPageFilter,
      currentPageNumber: this.state.filter.pageNumber,
    };

    return (
      <div className="list-view admin-view-body">
        <Modal
          show={this.props.showModal}
          onHide={this.closeAddSCModal}
          className="add-item-modal add-sc"
        >
          <Modal.Body className="add-item-modal-body">
            <AddSCModal close={this.closeAddSCModal} />
          </Modal.Body>
        </Modal>

        <section className="list-view-header">
          <div className="row">
            <div className="col-sm-6">
            </div>
            <div className="col-sm-6">
              <nav className="list-view-nav">
                <ul>
                  <li>
                    <a onClick={this.toggleFilterBox}
                      className="list-view-nav-link nav-bn icon-login-door">
                      {filterSC}
                    </a>
                  </li>
                  <li>
                    {this.renderAddButonSC()}
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </section>

        {
          this.state.showFilterBox ?
            <section className="list-view-filters">
              <FilterSC
                onSubmit={this.submitFilterForm}
                fromHCtab={this.props.fromHCtab}
              ></FilterSC>
            </section> :
            <div></div>
        }

        <PTable
          sorted={true}
          items={this.props.fromHCtab ? this.getFromHCTabSCTableData() : this.getSCTableData()}
          wrapperState={this.state}
          tableOrderActive={this.state.tableOrderActive}
          clickOnColumnHeader={this.clickOnColumnHeader}
          isFetching={this.props.sc.fetchingSC}
          customClass='sc-list'
          pagination={paginationSettings}
        />
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const { showModal } = state.sc;
  return {
    sc: state.sc,
    local: state.localization,
    loginProfile: state.login.profile,
    showModal
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(scActions, dispatch),
    hcActions: bindActionCreators(hcActions, dispatch),
    registerActions: bindActionCreators(registerActions, dispatch),
    scProfileActions: bindActionCreators(scProfileActions, dispatch),
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Subcontractors));
