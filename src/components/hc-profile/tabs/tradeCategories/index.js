import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { Field, reduxForm } from 'redux-form';
import _ from 'lodash';

import PTable from '../../../common/ptable';
import renderField from '../../../customInputs/renderField';
import * as actions from './actions';

class TradeCategories extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      filter: {
        pageNumber: 1
      },
      filterBox: {
        searchTerm: '',
        tradeId: '',
      },
      tableOrderActive: 'orderIndex',
      order: {
        orderIndex: 'asc',
        value: 'desc',
        description: 'desc'
      },
      hiringClientId : props.match.params.hcId,
      showAddTradeCategoryRow: false,
      addRow: {
        orderIndex: '0',
        description: ''
      }
    };

    props.actions.fetchTradeCategories({ hiringClientId: this.state.hiringClientId });

    this.toogleAddTradeCategory = this.toogleAddTradeCategory.bind(this);
  }

  setPageFilter = (e, pageNumber, force) => {
    if(force || this.state.filter.pageNumber !== pageNumber) {
      let query = {
        hiringClientId: this.state.hiringClientId,
        pageNumber
      };

      // fetch using query
      this.props.actions.fetchTradeCategories(query);

      // save page number
      this.setState({
        filter: {
          pageNumber
        },
        showAddTradeCategoryRow: false,
        addRow: {
          orderIndex: '0',
          description: ''
        }
      });
    }
  }

  send = (data) => {
    const tradesList = data.tradesList.map((item, index) => {
      return {
        id: index === 10 ? null : _.toInteger(item.id),
        orderIndex: _.toInteger(item.orderIndex),
        description: item.description.trim()
      }
    })

    const payload = {
      hiringClientId: this.state.hiringClientId,
      tradesList
    }

    this.props.actions.saveTradeOrder(payload, () => { this.setPageFilter(null, 1, true) });

    this.setState({
      showAddTradeCategoryRow: false
    });
  }

  toogleAddTradeCategory() {
    this.setState((prevState) => {
      return {
        showAddTradeCategoryRow: !prevState.showAddTradeCategoryRow
      };
    });
  }

  render() {
    let {
      tableHeaderDescripcion,
      tableHeaderOrderIndex,
      saveOrderButton,
      addTradeCategory,
      removeNewTradeCategory,
    } = this.props.local.strings.hcProfile.tradeCategories;

    const tableMetadata = {
      fields: [
        'orderIndex',
        'description'
      ],
      header: {
        orderIndex: tableHeaderOrderIndex,
        description: tableHeaderDescripcion
      }
    };

    const tableBody = this.props.tradeCategories.list.map((item, index) => {
      return {
        orderIndex: (
          <div>
            <Field
              name={`tradesList[${index}].orderIndex`}
              type="number"
              defaultValue={item.orderIndex || item.orderIndex === 0 ? item.orderIndex.toString() : ''}
              component={renderField}
              className="text-center orderInput"
            />
            <Field
              name={`tradesList[${index}].id`}
              type="text"
              defaultValue={item.id || item.id === 0 ? item.id.toString() : ''}
              readonly
              component={renderField}
              className="d-none"
            />
          </div>
        ),
        description: (
          <Field
            name={`tradesList[${index}].description`}
            type="text"
            defaultValue={item.description || ''}
            component={renderField}
            className="text-center orderInput col-sm-8"
          />
        ),
        value: item.value
      };
    });

    if (this.state.showAddTradeCategoryRow) {
      tableBody.unshift({
        orderIndex: (
          <Field
            key="newOrderIndex"
            name="tradesList[10].orderIndex"
            type="number"
            defaultValue="0"
            component={renderField}
            className="text-center orderInput"
          />
        ),
        description: (
          <Field
            key="newDescription"
            name="tradesList[10].description"
            type="text"
            defaultValue=""
            component={renderField}
            className="text-center orderInput col-sm-8"
          />
        )
      });
    }

    const tableData = {
      fields: tableMetadata.fields,
      header: tableMetadata.header,
      body: tableBody
    };

    let {totalAmountOfTradeCategories, tradeCategoriesPerPage} = this.props.tradeCategories;

    const paginationSettings = {
      total: totalAmountOfTradeCategories,
      itemsPerPage: tradeCategoriesPerPage,
      setPageHandler: this.setPageFilter,
      currentPageNumber: this.state.filter.pageNumber,
    };

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
                    <button className="list-view-nav-link nav-bn icon-add" onClick={this.toogleAddTradeCategory}>
                      {this.state.showAddTradeCategoryRow ? removeNewTradeCategory : addTradeCategory}
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </section>

        <form className="trade-categories-form" onSubmit={this.props.handleSubmit(this.send)}>
          <PTable
            items={tableData}
            wrapperState={this.state}
            clickOnColumnHeader={this.clickOnColumnHeader}
            isFetching={this.props.tradeCategories.fetchingTradeCategories}
            customClass='trade-categories-list'
            pagination={paginationSettings}
            colsConfig={['50%', '50%']}
          />
          {
            !_.isEmpty(tableData.body) &&
            <div className="text-center">
              <button className="bg-sky-blue-gradient bn col-2 save-button">{saveOrderButton}</button>
              <br />
              {
                this.props.HCProfile.message.text &&
                <div className="error-message">
                  {this.props.HCProfile.message.text}
                </div>
              }
            </div>
          }

        </form>
      </div>
    );
  }
};

const mapStateToProps = (state) => {
  return {
    tradeCategories: state.tradeCategories,
    HCProfile: state.HCProfile,
    local: state.localization,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(actions, dispatch)
  };
};

TradeCategories = reduxForm({
  form: 'TradeCategories'
})(TradeCategories);

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(TradeCategories));
