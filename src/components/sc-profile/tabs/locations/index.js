import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import * as scProfileActions from '../../actions';
import { Modal } from 'react-bootstrap';

import LocationEditorModal from '../../modals/locationEditor'
import LocationQuickView from '../../modals/locationQuickView'

import PTable from '../../../common/ptable';
import Utils from '../../../../lib/utils';
import Filter from './filter'

const Alerts = require ('../../../alerts');

class Locations extends React.Component {
  constructor(props) {
    super(props);
    
    
    this.state = {
      filter: {
        pageNumber: 1
      },
      filterBox: {
        searchTerm: '',
        creatorUserId: '',
      },
      tableOrderActive: 'Primary',
      order: {
        City: 'desc',
        State: 'desc',
        ZipCode: 'desc',
        ContactName: 'desc',
        Comments: 'desc',
        Primary: 'desc',
        Active: 'desc'
      },
      pageSize: 10,
      currentEditingForm: {},
      name: '',
      showFilterBox: false,
      currentHiringClientId: '',
      subcontractorId: props.scIdFromTabs,
      showLocationEditor: false,
      selectedLocation: null
    };

    this.defineAndFetchQuery = this.defineAndFetchQuery.bind(this)
    this.onEditLocation = this.onEditLocation.bind(this);
    this.onCreateLocation = this.onCreateLocation.bind(this);
  }

  defineAndFetchQuery(_query) {
    const { subcontractorId, filter, pageSize } = this.state
    const { userId } = this.props.login
    const { pageNumber } = filter
    let query = {
      orderBy: 'Primary',
      orderDirection: 'DESC',
      pageSize,
      pageNumber,
      subcontractorId,
      userId
    }
    if (_query) {
      if (_query.orderBy) {
        delete query.orderBy
      }
      if (_query.orderDirection) {
        delete query.orderDirection
      }
      if (_query.pageNumber) {
        delete query.pageNumber
      }
      if (_query) {
        query = {...query,..._query}
      }
    }

    if (subcontractorId) {
      this.props.scProfileActions.fetchLocations(query);
    }
  }

  componentWillMount() {

    this.defineAndFetchQuery()
    this.props.scProfileActions.fetchStatesAndCountriesForRenderSelect()
  }

  componentWillReceiveProps(nextProps){
    const { scIdFromTabs } = this.props
    const newScId = nextProps.scIdFromTabs

    if (newScId && newScId != scIdFromTabs) {
      this.setState({
        subcontractorId: newScId
      }, () => {
        this.defineAndFetchQuery()
      })
    }

    const showAlert = (message) => {
      Alerts.showInformationAlert(
        'Error',
        message,
        'Accept',
        false,
        () => {
          console.log('alert callback')
        }
      );
    }

    if (nextProps.savingLocationsError && nextProps.savingLocationsError != this.props.savingLocationsError) {
      showAlert(nextProps.savingLocationsError)
    }

    if (nextProps.fetchingLocationsError && nextProps.fetchingLocationsError != this.props.fetchingLocationsError && this.props.linkVisitedDate) {
      showAlert(nextProps.fetchingLocationsError)
    }
    
  }

  clickOnColumnHeader = (e, field) => {
    console.log('field = ', field)
    if (field === 'View' || field === 'Edit' ) return;
    // get base query
    const orderDirection = this.state.order[field] === 'asc' ? 'DESC' : 'ASC'
    let query = {}
    query.orderBy = field;
    query.orderDirection = orderDirection;
    // add search filters
    query = Utils.addSearchFiltersToQuery(query, this.state.filterBox);
    // fetch using query
    this.defineAndFetchQuery(query);
    // save new active tab and order
    let newState = {
      tableOrderActive: field,
      order: {
        City: field === 'City' ? 'asc' : 'desc',
        State: field === 'State' ? 'asc' : 'desc',
        ZipCode: field === 'ZipCode' ? 'asc' : 'desc',
        ContactName: field === '[Contact Name]' ? 'asc' : 'desc',
        Comments: field === 'Comments' ? 'asc' : 'desc',
        Primary: field === 'Primary' ? 'asc' : 'desc',
        Active: field === 'Active' ? 'asc' : 'desc'
      }
    };
    newState.order[field] = this.state.order[field] === 'asc' ? 'desc' : 'asc';
    this.setState(newState);
  }

  setPageFilter = (e, pageNumber, force) => {
    if(force || this.state.filter.pageNumber !== pageNumber) {
      // get base query
      const field = this.state.tableOrderActive;
      const orderDirection = this.state.order[field] === 'asc' ? 'ASC' : 'DESC'
      let query = Utils.getFetchQuery(field, pageNumber, orderDirection);
      // add search filters
      query = Utils.addSearchFiltersToQuery(query, this.state.filterBox);
      // fetch using query
      this.defineAndFetchQuery(query);
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
    // console.log('values = ', values)
    // get base query
    const field = this.state.tableOrderActive;
    const pageNumber = 1;
    const orderDirection = this.state.order[field] === 'asc' ? 'ASC' : 'DESC'
    let query = Utils.getFetchQuery(field, pageNumber, orderDirection);
    // add search filters
    const filterBox = {
      isFilter: true,
      searchTerm: values.keywords || "",
      filterByState: values.State || "",
      Primary: values.Primary && values.searchByPrimary ? 1 : (values.searchByPrimary ? 0 : ''),
      Active:  values.Active  && values.searchByActive  ? 1 : (values.searchByActive  ? 0 : '')
    };
    query = Utils.addSearchFiltersToQuery(query, filterBox);
    
    // save searchterm and pagenumber
    this.setState({
      filterBox,
      filter: {
        pageNumber: 1
      }
    }, () => {
      // fetch using query
      this.defineAndFetchQuery(query);
    });
  }

  handleMouseEnter = (location) => {
    this.setState({
      selectedLocation: location,
      showView: true
    });
  }
  handleMouseLeave = () => {
    this.setState({
      selectedLocation: null,
      showView: false
    });
  }
  

  onCreateLocation(){
    this.setState({
      modal: 'add',
      selectedLocation: null,
      showLocationEditor: true
    });
  }

  onEditLocation(location, modal){
    this.setState({
      modal,
      selectedLocation: location,
      showLocationEditor: true
    });
  }

  closeLocationEditor = () => {
    this.setState({
      showLocationEditor: false
    });
  }

  closeLocationEditorAndRefresh = () => {
    this.setPageFilter(null, 1, true);

    this.setState({
      showLocationEditor: false
    });
  }

  renderModalBody() {
    const { modal, selectedLocation } = this.state
    const locationId = selectedLocation && selectedLocation.Id ? selectedLocation.Id : null 

    return (
      <LocationEditorModal
        closeAndRefresh={this.closeLocationEditorAndRefresh}
        states={this.props.states}
        provAndTerr={this.props.provAndTerr}
        countries={this.props.countries}
        modaltype={modal}
        close={this.closeLocationEditor}
        location={this.state.selectedLocation}
        locationId={locationId}
        subcontractorId={this.state.subcontractorId}
        callback={this.defineAndFetchQuery}
      />
    )
  }

  render() {
    let {
      city,
      state,
      zipCode,
      contactName,
      comments,
      Primary,
      active,
      view,
      edit
    } = this.props.local.strings.scProfile.locations;

    const formsTableMetadata = {
      fields: [
        'City',
        'State',
        'ZipCode',
        'ContactName',
        'Comments',
        'Primary',
        'Active',
        'QuickView',
        'Edit'
      ],
      header: {
        City: city,
        State: state,
        ZipCode: zipCode,
        ContactName: contactName,
        Comments: comments,
        Primary: Primary,
        Active: active
      }
    };

    const locationsTableBody = this.props.locations.map((location, idx) => {

      let Comments = location.Comments != 'null' ? location.Comments : ''
          Comments = Comments && Comments.length > 60 ? Comments.slice(0, 60) + '...' : Comments
      return {
        City: location.City,
        State: location.State != 'null' ? location.State : '',
        ZipCode: location.ZipCode,
        ContactName: location.ContactName != 'null' ? location.ContactName : '',
        Comments,
        Primary: location.PrimaryLocation ? 'Y' : 'N',
        Active: location.Active ? 'Y' : 'N',
        QuickView: (
          <a
            onMouseEnter={() => this.handleMouseEnter(location)}
            onMouseLeave={() => this.handleMouseLeave()}
            className='cell-table-link icon-quick_view'
          >
            {view}
            {
              this.state.selectedLocation 
              ? <LocationQuickView
                  closeAndRefresh={this.closeLocationEditorAndRefresh}
                  close={this.closeLocationEditor}
                  location={this.state.selectedLocation}
                  idx={idx}
                />
              : null
            }
          </a>
        ),
        Edit: (
          <a
            onClick={() => this.onEditLocation(location, 'edit') }
            className="cell-table-link icon-edit" >
            {edit}
          </a>
        )
      }
    });

    const locationsTableData = {
      fields: formsTableMetadata.fields,
      header: formsTableMetadata.header,
      body: locationsTableBody
    };

    let {totalAmountOfLocations, fetchingLocations} = this.props;

    const paginationSettings = {
      total: totalAmountOfLocations,
      itemsPerPage: this.state.pageSize,
      setPageHandler: this.setPageFilter,
      currentPageNumber: this.state.filter.pageNumber,
    };

    // console.log('paginationSettings = ', paginationSettings)
    // console.log('locationsTableData = ', locationsTableData)

    return (
      <div className="list-view admin-view-body">
        <Modal
          show={this.state.showLocationEditor}
          onHide={this.closeLocationEditor}
          className="add-item-modal locationEditorModal" >
          <Modal.Body>
            {this.renderModalBody()}
          </Modal.Body>
        </Modal>

        <section className="list-view-header">
          <div className="row">
            <div className="col-sm-5 filters-col">
            </div>
            <div className="col-sm-7">
              <nav className="list-view-nav">
                <ul>
                  
                  <li>
                    <a className="list-view-nav-link nav-bn icon-login-door"
                      onClick={ this.toggleFilterBox } >
                      Filter Locations
                    </a>
                  </li>
                  <li>
                    <a className="list-view-nav-link nav-bn icon-add"
                      onClick={ this.onCreateLocation } >
                      Add Location
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
              <Filter
                onSubmit={this.submitFilterForm}
                states={this.props.states}
                provAndTerr={this.props.provAndTerr}
                hideSentTo={true}
              />
            </section> :
            <div></div>
        }

        <PTable
          sorted={true}
          items={locationsTableData}
          wrapperState={this.state}
          tableOrderActive={this.state.tableOrderActive}
          clickOnColumnHeader={this.clickOnColumnHeader}
          isFetching={fetchingLocations}
          customClass='users-list'
          pagination={paginationSettings}
          // colsConfig={colsWidth}
        />
      </div>
    );
  }
};

const mapStateToProps = (state, ownProps) => {
  return {
    savingLocationsError: state.SCProfile.savingLocationsError,
    fetchingLocationsError: state.SCProfile.fetchingLocationsError,
    states: state.SCProfile.states,
    provAndTerr: state.SCProfile.provAndTerr,
    countries: state.SCProfile.countries,
    totalAmountOfLocations: state.SCProfile.totalAmountOfLocations,
    linkVisitedDate: state.SCProfile.headerDetails.linkVisitedDate,
    fetchingLocations: state.SCProfile.fetchingLocations,
    locations: state.SCProfile.locations,
    common: state.common,
    login: state.login,
    local: state.localization
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    scProfileActions: bindActionCreators(scProfileActions, dispatch)
  }
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Locations));
