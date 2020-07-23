import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import moment from 'moment';

import PTable from '../../../../common/ptable';
import Utils from '../../../../../lib/utils';
import StatusModal from './modals/statusModal';
import AgencyModal from './modals/agencyModal';
import LayersList from './LayersList/LayersList';

import * as commonActions from '../../../../common/actions';
import * as actions from './actions';

import './Coverages.css';

class Coverages extends Component {
  constructor(props) {
    super(props);

    this.state = {
      filter: {
        pageNumber: 1,
      },
      tableOrderActive: 'documentID',
      order: {
        documentID: 'asc',
        name: 'asc',
        status: 'desc',
        expireDate: 'desc',
        majorDef: 'desc',
        minorDef: 'desc',
        agencyName: 'desc',
      },
      currentModal: null,
      currentModalData: null,
      currentLayer: null,
    };
  }

  componentDidMount() {
    const { actions, insuredId } = this.props;

    actions.fetchCoverages({
      orderBy: 'documentID',
      orderDirection:'ASC',
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
    if (field === 'layer' || field === 'view') return;

    // get base query
    const pageNumber = this.state.filter.pageNumber;
    const orderDirection = this.state.order[field] === 'asc' ? 'DESC' : 'ASC';
    let preQuery = Utils.getFetchQuery(field, pageNumber, orderDirection);

    const query = this.addId(preQuery);

    // fetch using query
    this.props.actions.fetchCoverages(query);

    // save new active tab and order
    let newState = {
      tableOrderActive: field,
      order: {
        documentID: field === 'documentID' ? 'asc' : 'desc',
        name: field === 'name' ? 'asc' : 'desc',
        status: field === 'status' ? 'asc' : 'desc',
        expireDate: field === 'expireDate' ? 'asc' : 'desc',
        majorDef: field === 'majorDef' ? 'asc' : 'desc',
        minorDef: field === 'minorDef' ? 'asc' : 'desc',
        agencyName: field === 'agencyName' ? 'asc' : 'desc',
      },
    };

    newState.order[field] = this.state.order[field] === 'asc' ? 'desc' : 'asc';
    this.setState(newState);
  }

  setPageFilter = (e, pageNumber, force) => {
    if(force || this.state.filter.pageNumber !== pageNumber) {

      // get base query
      const field = this.state.tableOrderActive;
      const orderDirection = this.state.order[field] === 'asc' ? 'ASC' : 'DESC';
      let preQuery = Utils.getFetchQuery(field, pageNumber, orderDirection);

      const query = this.addId(preQuery);

      // fetch using query
      this.props.actions.fetchCoverages(query);

      // save page number
      this.setState({
        filter: {
          pageNumber,
        },
      });
    }
  }

  openModal = (data, modal) => {
    this.setState({
      currentModal: modal,
      currentModalData: data,
    });

    this.props.actions.setShowModal(true);
  }

  closeModalAndRefresh = (update) => {
    this.props.actions.setShowModal(false);

    this.setState({
      currentModal: null,
      currentModalData: null,
    });

    if (update) this.setPageFilter(null, 1, true);
  }

  viewLayers = (coverage) => {
    this.setState({
      currentLayer: coverage,
    });
  }

  closeLayers = () => {
    this.setState({
      currentLayer: null
    });
  }

  renderModal = () => {
    const { currentModal } = this.state;

    switch(currentModal) {
      case 'status':
        return <StatusModal
          coverage={this.state.currentModalData}
          close={this.closeModalAndRefresh}
        />;
      case 'agency':
        return <AgencyModal
          agencyId={this.state.currentModalData}
          close={this.closeModalAndRefresh}
        />;
      default:
        return null;
    }
  }

  render() {
    const {
      documentIdColumn,
      nameColumn,
      statusColumn,
      expireDateColumn,
      majorDefColumn,
      minorDefColumn,
      agencyColumn,
      viewEditLink,
      viewDeficiencies,
      layerLink,
      addCoverageBtn,
    } = this.props.local.strings.coverages.list;

    const TableMetadata = {
      fields: [
        'documentID',
        'name',
        'status',
        'expireDate',
        'majorDef',
        'minorDef',
        'agencyName',
        'view',
        'def',
        'layer',
      ],
      header: {
        documentID: documentIdColumn,
        name: nameColumn,
        status: statusColumn,
        expireDate: expireDateColumn,
        majorDef: majorDefColumn,
        minorDef: minorDefColumn,
        agencyName: agencyColumn,
        view: '',
        def: '',
        layer: '',
      },
    };

    const TableBody = this.props.coverages.list.map((coverage) => {
      const {
        Name,
        Status,
        ExpirationDate,
        MajorDef,
        MinorDef,
        AgencyName,
        AgencyID,
        DocumentID,
      } = coverage;

      // TODO: change status in backend
      let currentStatus = (MajorDef === 0 && MinorDef === 0) 
        ? 'COMPLIANT'
        : 'NOT COMPLIANT';

      return {
        documentID: DocumentID,
        name: Name,
        status: (
          <a
            onClick={() => this.openModal(coverage, 'status')}
            className="cell-table-link"
          >
            {currentStatus}
          </a>
        ),
        expireDate: moment(ExpirationDate).format('MM/DD/YYYY'),
        majorDef: MajorDef,
        minorDef: MinorDef,
        agencyName: (
          <a
            onClick={() => this.openModal(AgencyID, 'agency')}
            className="cell-table-link"
          >
            {AgencyName}
          </a>
        ),
        view: (
          <Link
            to={`/certfocus/processing/${DocumentID}`}
            className="cell-table-link icon-quick_view"
          >
            {viewEditLink}
          </Link>
        ),
        def: (
          <Link
            to={`/certfocus/deficiency/${DocumentID}`}
            className="cell-table-link icon-quick_view"
          >
            {viewDeficiencies}
          </Link>
        ),
        layer: (
          <a
            onClick={() => this.viewLayers(coverage)}
            className="cell-table-link icon-log"
          >
            {layerLink}
          </a>
        ),
      };
    });

    const templatesTableData = {
      fields: TableMetadata.fields,
      header: TableMetadata.header,
      body: TableBody
    };

    let {
      totalAmountOfCoverages,
      coveragesPerPage,
      fetching,
      showModal,
    } = this.props.coverages;

    const paginationSettings = {
      total: totalAmountOfCoverages,
      itemsPerPage: coveragesPerPage,
      setPageHandler: this.setPageFilter,
      currentPageNumber: this.state.filter.pageNumber,
    };

    return (
      <div className="list-view admin-view-body coverages-list">
        <Modal
          show={showModal}
          onHide={this.closeModalAndRefresh}
          className={`add-item-modal add-entity${this.state.currentModal !== 'agency' ? '-medium' : ''}`}
        >
          <Modal.Body>
            {this.renderModal()}
          </Modal.Body>
        </Modal>

        <section className="list-view-header">
          <div className="row">
            <div className="col-sm-12">
              <nav className="list-view-nav">
                <ul>
                  <li>
                    <Link
                      to={{
                        pathname: `/certfocus/processing`,
                        state: { insuredData: this.props.insuredData },
                      }}
                      className="list-view-nav-link nav-bn icon-add no-overlapping"
                    >
                      {addCoverageBtn}
                    </Link>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </section>

        {this.state.currentLayer ? (
          <LayersList
            openModal={this.openModal}
            closeLayers={this.closeLayers}
            coverage={this.state.currentLayer}
          />
        ) : (
          <PTable
            sorted={true}
            items={templatesTableData}
            wrapperState={this.state}
            tableOrderActive={this.state.tableOrderActive}
            clickOnColumnHeader={this.clickOnColumnHeader}
            isFetching={fetching}
            pagination={paginationSettings}
          />
        )}
      </div>
    );
  }
};

const mapStateToProps = (state) => {
  return {
    coverages: state.coverages,
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

export default connect(mapStateToProps, mapDispatchToProps)(Coverages);
