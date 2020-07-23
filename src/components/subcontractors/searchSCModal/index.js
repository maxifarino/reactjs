import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PTable from '../../common/ptable';
import '../subcontractors.css';
import * as scActions from '../actions';
import Utils from '../../../lib/utils';
import SearchBar from './searchBar'


class SearchSCModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      filter: {
        pageNumber: 1
      },
      tableOrderActive: 'scName',
      order: {
        hcName: 'desc',
        scName: 'asc',
        status: 'desc',
        state: 'desc',
      },
      searchTerm: ''
    };

    this.getSCtableData = this.getSCtableData.bind(this)
  };

  clickOnColumnHeader = (e, field) => {
    if (field === 'view') return;
    // get base query
    const pageNumber = this.state.filter.pageNumber;
    const orderDirection = this.state.order[field] === 'asc' ? 'DESC' : 'ASC'
    let query = Utils.getFetchQuery(field, pageNumber, orderDirection);
    query.searchTerm = this.props.sc.searchTerm
    // fetch using query
    // console.log('query = ', query)
    this.props.scActions.searchSubcontractors(query);
    // save new active tab and order
    let newState = {
      tableOrderActive: field,
      order: {
        hcName: field === 'hcName' ? 'asc' : 'desc',
        scName: field === 'scName' ? 'asc' : 'desc',
        status: field === 'status' ? 'asc' : 'desc',
        state: field === 'state' ? 'asc' : 'desc'
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
      query.searchTerm = this.props.sc.searchTerm
      // fetch using query
      console.log('query = ', query)
      this.props.scActions.searchSubcontractors(query);
      // save page number
      this.setState({
        filter: {
          pageNumber
        }
      });

    }
  }

  getSCtableData() {
    let {
      viewSC,
      viewInsured,
      searchTableHeader,
    } = this.props.local.strings.subcontractors;

    const {
      scName,
      hcName,
      status,
      state
    } = searchTableHeader;

    const scTableMetadata = {
      fields: [
        'scName',
        'hcName',
        'status',
        'state',
        'view'
      ],
      header: {
        scName,
        hcName,
        status,
        state,
        view: ''
      }
    };

    const SCTableBody = this.props.sc.subcontractorSearchResults.map((sc, idx) => {
      if (sc.status === null || sc.status === undefined) sc.status = "None";
      return {
        scName: sc.SubcontractorName,
        hcName: sc.HiringClientName,
        status: (
          <span
            className={`status-cell ${(sc.SubcontractorStatus.toLowerCase()).replace(/\s/g, '')}`}
          >
            {sc.SubcontractorStatus}
          </span>
        ),
        state: sc.State,
        view: (
          <React.Fragment>
            {sc.pqEnabled && (
              <React.Fragment>
                <a
                  onClick={(e) => { this.props.viewSubcontractor(e, sc.hcId, sc.ID) }}
                  className='cell-table-link icon-quick_view'>
                  {viewSC}
                </a><br/>
              </React.Fragment>
            )}

            {sc.cfEnabled && (
              <a
                onClick={() => { this.props.viewInsured(sc.ID) }}
                className='cell-table-link icon-quick_view'>
                {viewInsured}
              </a>
            )}
          </React.Fragment>
        ),
      };
    });

    return {
      fields: scTableMetadata.fields,
      header: scTableMetadata.header,
      body: SCTableBody
    };
  }

  //http://localhost:3000/hiringclients/1134/subcontractors/5800


  render() {

    const {
      title,
      buttonCancel
    } = this.props.local.strings.subcontractors.searchSCModal;

    let {totalAmountOfSCsearch, SCPerPage, isZero} = this.props.sc;
    const paginationSettings = {
      total: totalAmountOfSCsearch,
      itemsPerPage: SCPerPage,
      setPageHandler: this.setPageFilter,
      currentPageNumber: this.state.filter.pageNumber,
    };

    return (
      <div className="add-sc-modal">
        <header>
          <h1 className="add-sc-title">{title}</h1>
        </header>
        <div className='modalSearchWrapper'>
          { totalAmountOfSCsearch === 0
            ? ''
            : <SearchBar
                viewSubcontractor={this.props.viewSubcontractor}
                viewInsured={this.props.viewInsured}
              />
          }
        </div>
        <PTable
          hide={isZero}
          sorted={true}
          items={this.getSCtableData()}
          wrapperState={this.state}
          tableOrderActive={this.state.tableOrderActive}
          clickOnColumnHeader={this.clickOnColumnHeader}
          isFetching={this.props.sc.fetchingSCsearch}
          customClass='sc-list'
          pagination={paginationSettings}
          isSearchModal
        />
        <button className='closeBtn' onClick={this.props.close}>{buttonCancel}</button>
      </div>
    );
  }
};

const mapStateToProps = (state, ownProps) => {
  return {
    sc: state.sc,
    local: state.localization,
    loginProfile: state.login.profile
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    scActions: bindActionCreators(scActions, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SearchSCModal);
