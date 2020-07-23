import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import PTable from '../../../../common/ptable';
import FilterWaivers from './filter';
import Utils from '../../../../../lib/utils';
import Swal from 'sweetalert2';

import * as commonActions from '../../../../common/actions';
import * as actions from './actions';

import './Waivers.css';

class Waivers extends Component {
  constructor(props) {
    super(props);

    this.state = {
      filter: {
        pageNumber: 1,
      },
      showFilterBox: false,
      tableOrderActive: 'waiverDate',
      order: {
        deficiencyText: 'desc',
        waiverDate: 'asc',
        coverageTypeId: 'desc',
        waiverStatus: 'desc',
        waiverCreatedByID: 'desc',
      },
    };
  }

  componentDidMount() {
    const { actions, insuredId } = this.props;

    actions.fetchWaivers({
      orderBy: 'waiverDate',
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
    if (field === 'view') return;

    // get base query
    const pageNumber = this.state.filter.pageNumber;
    const orderDirection = this.state.order[field] === 'asc' ? 'DESC' : 'ASC';
    let preQuery = Utils.getFetchQuery(field, pageNumber, orderDirection);

    const query = this.addId(preQuery);

    // fetch using query
    this.props.actions.fetchWaivers(query);

    // save new active tab and order
    let newState = {
      tableOrderActive: field,
      order: {
        deficiencyText: field === 'deficiencyText' ? 'asc' : 'desc',
        waiverDate: field === 'waiverDate' ? 'asc' : 'desc',
        coverageTypeId: field === 'coverageTypeId' ? 'asc' : 'desc',
        waiverStatus: field === 'waiverStatus' ? 'asc' : 'desc',
        waiverCreatedById: field === 'waiverCreatedById' ? 'asc' : 'desc',
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
      this.props.actions.fetchWaivers(query);

      // save page number
      this.setState({
        filter: {
          pageNumber,
        }
      });
    }
  }

  toggleFilterBox = () => {
    this.setState({ showFilterBox: !this.state.showFilterBox });
  }

  submitFilterForm = (values) => {
    // get base query
    const field = this.state.tableOrderActive;
    const pageNumber = 1;
    const orderDirection = this.state.order[field] === 'asc' ? 'ASC' : 'DESC'
    let preQuery = Utils.getFetchQuery(field, pageNumber, orderDirection);

    let date;
    if (values.waiverDate) {
      date = new Date(values.waiverDate).toISOString();
    } else {
      date = values.waiverDate
    }

    // add search filters
    const filterBox = {
      searchTerm: values.keywords || '',
      waiverStatusId: values.waiverStatusId || '',
      waiverDate: values.waiverDate || '',
    };

    preQuery = Utils.addSearchFiltersToQuery(preQuery, filterBox);

    const query = this.addId(preQuery);

    // fetch using query
    this.props.actions.fetchWaivers(query);

    // save searchterm and pagenumber
    this.setState({
      filterBox,
      filter: {
        pageNumber: 1
      }
    });
  }

  onChangeWaiverStatus = (record, status) => {
    const payload = {
      waiverId: record.WaiverID,
      waiverStatusId: status,
      actionById: this.props.login.profile.Id
    };
    const statusText = (status === 1) ? 'Accept' : 'Reject'

    Swal({
      title: 'Change Waiver Status',
      text: `Are you sure you want to ${statusText} waiver # ${payload.waiverId}?`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#2E5965',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes!'
    }).then((result) => {
      if (result.value) {
        this.setState({ loading: true });
        this.props.actions.changeWaiverStatus(payload, (err) => {
          this.setState({ loading: false });
          this.setPageFilter(null, 1, true);
        });
      }
    });
  }

  render() {
    const { insuredId } = this.props;
    const {
      deficiencyTextColumn,
      waiverDateColumn,
      coverageTypeIdColumn,
      waiverStatusColumn,
      waiverCreatedByIdColumn,
      waiverActionByIdColumn,
      changeStatusColumn,
    } = this.props.local.strings.waivers.list;

    const TableMetadata = {
      fields: [
        'deficiencyText',
        'waiverDate',
        'coverageTypeId',
        'waiverStatus',
        'waiverCreatedById',
        'waiverActionById',
        'changeStatus',
      ],
      header: {
        deficiencyText: deficiencyTextColumn,
        waiverDate: waiverDateColumn,
        coverageTypeId: coverageTypeIdColumn,
        waiverStatus: waiverStatusColumn,
        waiverCreatedById: waiverCreatedByIdColumn,
        waiverActionById: waiverActionByIdColumn,
        changeStatus: changeStatusColumn,
      },
    };

    const TableBody = this.props.waivers.list.map((record) => {
      const {
        DeficiencyText,
        WaiverDate,
        coverageTypeId,
        CoverageTypeName,
        WaiverStatusID,
        WaiverCreatedByID,
        FirstName,
        LastName,
        ActionByID,
        ActionByFirstName,
        ActionByLastName
      } = record;

      return {
        deficiencyText: DeficiencyText,
        waiverDate: Utils.getFormattedDateSmall(WaiverDate, true),
        coverageTypeId: CoverageTypeName,
        waiverStatus: (WaiverStatusID === 0) ? 'Pending' : (WaiverStatusID === 1) ? 'Accepted' : 'Rejected',
        waiverCreatedById: FirstName + ' ' + LastName,
        waiverActionById: (ActionByID) ? ActionByFirstName + ' ' + ActionByLastName : ' - ',
        changeStatus: (
          (WaiverStatusID === 0) && (
            <div>
              <a onClick={() => this.onChangeWaiverStatus(record, 1)} className="cell-table-link"> Accept </a> 
              <a onClick={() => this.onChangeWaiverStatus(record, 2)} className="cell-table-link" style={{ color: '#F00' }}> Reject </a>
            </div>
          )  
        ),
      };
    });

    const templatesTableData = {
      fields: TableMetadata.fields,
      header: TableMetadata.header,
      body: TableBody
    };

    let {
      totalAmountOfRecords,
      recordsPerPage,
      fetching,
    } = this.props.waivers;

    const paginationSettings = {
      total: totalAmountOfRecords,
      itemsPerPage: recordsPerPage,
      setPageHandler: this.setPageFilter,
      currentPageNumber: this.state.filter.pageNumber,
    };

    return (
      <div className="list-view admin-view-body finance-list">
        <div className="finance-list-header">
          <div>
            <a onClick={this.toggleFilterBox}
              className="nav-btn icon-login-door">
              Filter Waivers
            </a>
          </div>
        </div>

        {this.state.showFilterBox &&
          <section className="list-view-filters">
            <FilterWaivers
              onSubmit={this.submitFilterForm}
              insuredId={insuredId}
            />
          </section>
        }

        <PTable
          sorted={true}
          items={templatesTableData}
          wrapperState={this.state}
          tableOrderActive={this.state.tableOrderActive}
          clickOnColumnHeader={this.clickOnColumnHeader}
          isFetching={fetching}
          pagination={paginationSettings}
        />
      </div>
    );
  }
};

const mapStateToProps = (state) => {
  return {
    waivers: state.waivers,
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

export default connect(mapStateToProps, mapDispatchToProps)(Waivers);
