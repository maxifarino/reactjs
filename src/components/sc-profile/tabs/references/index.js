import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { Modal } from 'react-bootstrap';

import FilterReferences from './filter'
import * as referencesActions from './actions';
import ReferenceModal from './referenceModal';
import PTable from '../../../common/ptable';
import Utils from '../../../../lib/utils';

class References extends React.Component {
  constructor(props) {
    super(props);
    const subcontractorId = props.match.params.scId;
    this.state = {
      filter: {
        pageNumber: 1
      },
      filterBox: {
        searchTerm: '',
        type: '',
      },
      tableOrderActive: 'type',
      order: {
        type: 'asc',
        companyName: 'desc',
        contactName: 'desc',
        contactEmail: 'desc',
        contactPhone: 'desc',
        refDate: 'desc'
      },
      showFilterBox: false,
      showModal: false,
      subcontractorId
    };

    let query = {
      orderBy: 'type',
      orderDirection: 'ASC',
      subcontractorId
    };

    props.referencesActions.fetchReferences(query);
  }

  clickOnColumnHeader = (e, field) => {
    // get base query
    const pageNumber = this.state.filter.pageNumber;
    const orderDirection = this.state.order[field] === 'asc' ? 'DESC' : 'ASC'
    let query = Utils.getFetchQuery(field, pageNumber, orderDirection);
    query.subcontractorId = this.state.subcontractorId;
    // add search filters
    query = Utils.addSearchFiltersToQuery(query, this.state.filterBox);
    // fetch using query
    this.props.referencesActions.fetchReferences(query);
    // save new active tab and order
    let newState = {
      tableOrderActive: field,
      order: {
        formName: field === 'formName' ? 'asc' : 'desc',
        submissionDate: field === 'submissionDate' ? 'asc' : 'desc',
        status: field === 'status' ? 'asc' : 'desc',
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
      // add search filters
      query = Utils.addSearchFiltersToQuery(query, this.state.filterBox);
      // fetch using query
      this.props.referencesActions.fetchReferences(query);
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
    query.subcontractorId = this.state.subcontractorId;
    // add search filters
    const filterBox = {
      searchTerm: values.keywords || '',
      typeId: values.type || ''
    };
    query = Utils.addSearchFiltersToQuery(query, filterBox);
    // fetch using query
    this.props.referencesActions.fetchReferences(query);
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

  openEditModal  = (reference) => {
    this.setState({
      showModal: true,
      currentReference: reference
    });
  }

  openModal = (reference) => {
    this.setState({
      showModal: true,
      currentReference: null
    });
  }

  closeModal = () => {
    this.setState({
      showModal: false,
      currentReference: null
    });
  }

  closeModalAndRefresh = () => {
    this.setState({
      showModal: false,
      currentReference: null
    }, () => { this.setPageFilter(null, 1, true); });
  }

  render() {
    const {
      headers,
      filterReferences,
      addReference,
      editReference
    } = this.props.local.strings.scProfile.references;

    const {
      type,
      companyName,
      contactName,
      contactEmail,
      contactPhone,
      refDate
    } = headers;

    const tableMetadata = {
      fields: [
        'type',
        'companyName',
        'contactName',
        'contactEmail',
        'contactPhone',
        'refDate',
        'editReference'
      ],
      header: {
        type,
        companyName,
        contactName,
        contactEmail,
        contactPhone,
        refDate,
        editReference: ''
      }
    };

    const tableBody = this.props.references.list.map((reference) => {
      const { type,
        companyName,
        contactName,
        contactEmail,
        contactPhone,
        refDate
       } = reference;

      return {
        type,
        companyName,
        contactName,
        contactEmail,
        contactPhone: Utils.formatPhoneNumber(contactPhone),
        refDate: Utils.getFormattedDate(refDate),
        editReference: <a className='icon-edit cell-table-link' onClick={() => { this.openEditModal(reference) }}> { editReference } </a>
      }
    });

    const tableData = {
      fields: tableMetadata.fields,
      header: tableMetadata.header,
      body: tableBody
    };

    const { totalAmountOfReferences, referencesPerPage, fetchingReferences, referencesTypesPossibleValues } = this.props.references;

    const paginationSettings = {
      total: totalAmountOfReferences,
      itemsPerPage: referencesPerPage,
      setPageHandler: this.setPageFilter,
      currentPageNumber: this.state.filter.pageNumber,
    };

    const typeOptions = Utils.getOptionsList('', referencesTypesPossibleValues, 'type', 'id', 'id');

    return (
      <div className="references-list forms-view list-view admin-view-body">
        <Modal
          show={this.state.showModal}
          onHide={this.closeModal}
          className="add-item-modal references-modal">
            <ReferenceModal
              close={this.closeModalAndRefresh}
              currentReference={this.state.currentReference}
            />
        </Modal>
        <section className="forms-view-header">
          <div className="row">

            <div className="col-sm-12">
              <nav className="forms-nav">
                <ul>
                  <li>
                    <a className="forms-nav-link nav-bn icon-search_icon"
                      onClick={this.toggleFilterBox} >
                      {filterReferences}
                    </a>
                  </li>
                  <li>
                    <a
                      className="forms-nav-link nav-bn icon-add"
                      onClick={this.openModal}>
                      {addReference}
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
              <FilterReferences
                onSubmit={this.submitFilterForm}
                typeOptions={typeOptions}
              />
            </section> :
            <div></div>
        }

        <PTable
          sorted={true}
          items={tableData}
          wrapperState={this.state}
          tableOrderActive={this.state.tableOrderActive}
          clickOnColumnHeader={this.clickOnColumnHeader}
          isFetching={fetchingReferences}
          customClass='references-table'
          pagination={paginationSettings}
        />

        <div className="save-hc-modal-error">{this.props.references.error}</div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    common: state.common,
    references: state.references,
    login: state.login,
    local: state.localization
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    referencesActions: bindActionCreators(referencesActions, dispatch)
  }
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(References));
