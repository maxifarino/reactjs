import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Redirect } from 'react-router-dom';

import * as userActions from '../../users/actions';
import * as commonActions from '../../common/actions';

import Utils from '../../../lib/utils';
import LogFilter from './filter'
import PTable from '../../common/ptable';

class UserLog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      filter: {
        pageNumber: 1
      },
      filterBox: {
        searchTerm: '',
        userId: '',
        systemModuleId: ''
      },
      tableOrderActive: 'name',
      showFilterBox: false,
      order: {
        name: 'asc',
        readableDescription: 'asc',
        timeStamp: 'asc'
      },
    };
    props.actions.fetchLogUsers();
    props.actions.fetchLogModules();
    props.actions.fetchLogs();
  }

  clickOnColumnHeader = (e, field) => {
    // get base query
    const pageNumber = this.state.filter.pageNumber;
    const orderDirection = this.state.order[field] === 'asc' ? 'DESC' : 'ASC'
    let query = Utils.getFetchQuery(field, pageNumber, orderDirection);
    // add search filters
    query = Utils.addSearchFiltersToQuery(query, this.state.filterBox);
    // fetch using query
    this.props.actions.fetchLogs(query);
    // save new active tab and order
    let newState = {
      tableOrderActive: field,
      order: {
        name: 'asc',
        readableDescription: 'asc',
        timeStamp: 'asc'
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
      // add search filters
      query = Utils.addSearchFiltersToQuery(query, this.state.filterBox);
      // fetch using query
      this.props.actions.fetchLogs(query);
      // save page number
      this.setState({
        filter: {
          pageNumber
        }
      });

    }
  };

  toggleFilterBox = () => {
    this.setState({ showFilterBox: !this.state.showFilterBox });
  }

  submitFilterLog = values => {
    // get base query
    const field = this.state.tableOrderActive;
    const pageNumber = 1;
    const orderDirection = this.state.order[field] === 'asc' ? 'ASC' : 'DESC'
    let query = Utils.getFetchQuery(field, pageNumber, orderDirection);
    // add search filters
    const filterBox = {
      searchTerm: values.keywords || "",
      userId: values.user || "",
      systemModuleId: values.systemModule || ""
    };
    query = Utils.addSearchFiltersToQuery(query, filterBox);
    // fetch using query
    this.props.actions.fetchLogs(query);
    // save searchterm and pagenumber
    this.setState({
      filterBox,
      filter: {
        pageNumber: 1
      }
    });
  };

  render() {
    if (!this.props.common.checkingAuthorizations) {
      if(!this.props.common.usersAuth) {
        return <Redirect push to="/dashboard" />;
      }
    }

    const {
      filterLogs,
      tableHeader
    } = this.props.local.strings.logs;

    const { UserName, Activity, TimeStamp } = tableHeader;

    const logsTableMetadata = {
      fields: [
        'name',
        'readableDescription',
        'timeStamp'
      ],
      header: {
        name: UserName,
        readableDescription: Activity,
        timeStamp: TimeStamp,
      }
    };

    const logsTableBody = this.props.logs.map((log) => {
      const activity =  (
        <div>
          <span className="light-blue">{log.name} </span><span>{log.readableDescription}</span>
        </div>
      );
      const formattedDate = Utils.getFormattedDate(log.timeStamp);
      return {
        name: log.name,
        readableDescription: activity,
        timeStamp: formattedDate
      }
    });

    const logsTableData = {
      fields: logsTableMetadata.fields,
      header: logsTableMetadata.header,
      body: logsTableBody
    };

    let {totalAmountOfLogs, logsPerPage, fetchingLogs} = this.props;
    const paginationSettings = {
      total: totalAmountOfLogs,
      itemsPerPage: logsPerPage,
      setPageHandler: this.setPageFilter,
      currentPageNumber: this.state.filter.pageNumber,
    };

    const colsWidth = [
      '20%',
      '60%',
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
                      className="list-view-nav-link nav-bn icon-search_icon"
                      onClick={this.toggleFilterBox}
                    >
                      {filterLogs}
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
              <LogFilter
                logs={this.props.logs.map((log)=> ({
                  value: log.id,
                  label: `${log.firstName} ${log.lastName}`
                }))}
                onSubmit={this.submitFilterLog}
              />
            </section> :
            <div/>
        }

        <PTable
          sorted={true}
          items={logsTableData}
          wrapperState={this.state}
          clickOnColumnHeader={this.clickOnColumnHeader}
          isFetching={fetchingLogs}
          customClass='templates-list'
          pagination={paginationSettings}
          colsConfig={colsWidth}
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const {logs, fetchingLogs, totalAmountOfLogs, logsPerPage} = state.users;
  return {
    fetchingLogs,
    totalAmountOfLogs,
    logs,
    logsPerPage,
    local: state.localization,
    common: state.common
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators({...userActions, ...commonActions}, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserLog);
