import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import PTable from '../../../../common/ptable';
import Utils from '../../../../../lib/utils';

import * as commonActions from '../../../../common/actions';
import * as actions from './actions';

import './Finance.css';

class Finance extends Component {
  constructor(props) {
    super(props);

    this.state = {
      filter: {
        pageNumber: 1,
      },
      tableOrderActive: 'transactionDate',
      order: {
        transactionDate: 'asc',
        activity: 'desc',
        transactionNumber: 'desc',
        amount: 'desc',
        amountCredits: 'desc',
        creditBalance: 'desc',
      },
    };
  }

  componentDidMount() {
    const { actions, insuredId } = this.props;

    actions.fetchFinance({
      orderBy: 'transactionDate',
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
    this.props.actions.fetchFinance(query);

    // save new active tab and order
    let newState = {
      tableOrderActive: field,
      order: {
        transactionDate: field === 'transactionDate' ? 'asc' : 'desc',
        activity: field === 'activity' ? 'asc' : 'desc',
        transactionNumber: field === 'transactionNumber' ? 'asc' : 'desc',
        amount: field === 'amount' ? 'asc' : 'desc',
        amountCredits: field === 'amountCredits' ? 'asc' : 'desc',
        creditBalance: field === 'creditBalance' ? 'asc' : 'desc',
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
      this.props.actions.fetchFinance(query);

      // save page number
      this.setState({
        filter: {
          pageNumber,
        }
      });
    }
  }

  onFinanceView = (record) => {
    console.log(record);
  }

  render() {
    const {
      dateColumn,
      activityColumn,
      transactionColumn,
      amountColumn,
      amountCreditsColumn,
      creditBalanceColumn,
      viewField,
    } = this.props.local.strings.finance.list;

    const TableMetadata = {
      fields: [
        'transactionDate',
        'activity',
        'transactionNumber',
        'amount',
        'amountCredits',
        'creditBalance',
        'view',
      ],
      header: {
        transactionDate: dateColumn,
        activity: activityColumn,
        transactionNumber: transactionColumn,
        amount: amountColumn,
        amountCredits: amountCreditsColumn,
        creditBalance: creditBalanceColumn,
        view: '',
      },
    };

    const TableBody = this.props.finance.list.map((record) => {
      const {
        TransactionDate,
        Activity,
        TransactionNumber,
        Amount,
        AmountCredits,
        CreditBalance,
      } = record;

      return {
        transactionDate: Utils.getFormattedDateSmall(TransactionDate, true),
        activity: Activity,
        transactionNumber: TransactionNumber,
        amount: Utils.formatCurrency(Amount),
        amountCredits: AmountCredits,
        creditBalance: CreditBalance,
        view: (
          <a
            onClick={() => this.onFinanceView(record)}
            className="cell-table-link icon-quick_view"
          >
            {viewField}
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
      totalAmountOfRecords,
      recordsPerPage,
      fetching,
    } = this.props.finance;

    const paginationSettings = {
      total: totalAmountOfRecords,
      itemsPerPage: recordsPerPage,
      setPageHandler: this.setPageFilter,
      currentPageNumber: this.state.filter.pageNumber,
    };

    return (
      <div className="list-view admin-view-body finance-list">
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
    finance: state.finance,
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

export default connect(mapStateToProps, mapDispatchToProps)(Finance);
