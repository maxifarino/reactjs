import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';

import PTable from '../../../../../common/ptable';
import Utils from '../../../../../../lib/utils';

import * as commonActions from '../../../../../common/actions';
import * as actions from '../actions';

import '../Coverages.css';

class LayersList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      filter: {
        pageNumber: 1,
      },
      tableOrderActive: 'name',
      order: {
        name: 'asc',
        status: 'desc',
        expireDate: 'desc',
        majorDef: 'desc',
        minorDef: 'desc',
        agencyName: 'desc',
      },
      currentModal: null,
      currentModalData: null,
    };
  }

  componentDidMount() {
    const { actions, coverage } = this.props;

    actions.fetchCoverages({
      orderBy: 'name',
      orderDirection:'ASC',
      ...(coverage && { parentCoverageId: coverage.CoverageID }),
    });
  }

  addId = (query) => {
    const { coverage } = this.props;

    if (coverage) {
      return { ...query, parentCoverageId: coverage.CoverageID };
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

  render() {
    const {
      nameColumn,
      statusColumn,
      expireDateColumn,
      majorDefColumn,
      minorDefColumn,
      agencyColumn,
      viewEditLink,
      layerReturn,
    } = this.props.local.strings.coverages.list;

    const TableMetadata = {
      fields: [
        'name',
        'status',
        'expireDate',
        'majorDef',
        'minorDef',
        'agencyName',
        'view',
        'layer',
      ],
      header: {
        name: nameColumn,
        status: statusColumn,
        expireDate: expireDateColumn,
        majorDef: majorDefColumn,
        minorDef: minorDefColumn,
        agencyName: agencyColumn,
        view: '',
        layer: '',
      },
    };

    let tableList = [];
    if (this.state.filter.pageNumber <= 1 && !this.props.coverages.layersError) {
      tableList = [ this.props.coverage, ...this.props.coverages.layersList ];
    } else {
      tableList = [ ...this.props.coverages.layersList ];
    }

    const TableBody = tableList.map((coverage, idx) => {
      const {
        Name,
        Status,
        ExpireDate,
        MajorDef,
        MinorDef,
        AgencyName,
        AgencyID,
        DocumentID,
      } = coverage;

      return {
        name: Name,
        status: (
          <a
            onClick={() => this.props.openModal(coverage, 'status')}
            className="cell-table-link"
          >
            {Status}
          </a>
        ),
        expireDate: ExpireDate,
        majorDef: MajorDef,
        minorDef: MinorDef,
        agencyName: (
          <a
            onClick={() => this.props.openModal(AgencyID, 'agency')}
            className="cell-table-link"
          >
            {AgencyName}
          </a>
        ),
        view: ((idx <= 0) && (this.state.filter.pageNumber <= 1)) ? (
          <Link
            to={`/certfocus/processing/${DocumentID}/1`}
            className="cell-table-link icon-quick_view"
          >
            {viewEditLink}
          </Link>
        ) : null,
        layer: ((idx <= 0) && (this.state.filter.pageNumber <= 1)) ? (
          <a
            onClick={this.props.closeLayers}
            className="cell-table-link icon-log"
          >
            {layerReturn}
          </a>
        ) : null,
      };
    });

    const templatesTableData = {
      fields: TableMetadata.fields,
      header: TableMetadata.header,
      body: TableBody
    };

    let {
      totalAmountOfCoveragesLayers,
      coveragesPerPage,
      fetchingLayers,
    } = this.props.coverages;

    const paginationSettings = {
      total: totalAmountOfCoveragesLayers,
      itemsPerPage: coveragesPerPage,
      setPageHandler: this.setPageFilter,
      currentPageNumber: this.state.filter.pageNumber,
    };

    if (this.props.coverages.layersError) {
      return (
        <div className="mt-3 text-danger text-center">
          {this.props.coverages.layersError}
        </div>
      );
    }

    return (
      <PTable
        sorted={true}
        items={templatesTableData}
        wrapperState={this.state}
        tableOrderActive={this.state.tableOrderActive}
        clickOnColumnHeader={this.clickOnColumnHeader}
        isFetching={fetchingLayers}
        pagination={paginationSettings}
      />
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

export default connect(mapStateToProps, mapDispatchToProps)(LayersList);
