import React from 'react';
import PropTypes from 'prop-types';

import PTable from '../../../common/ptable';

import './../search.css';

class Table extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      filter: {
        pageNumber: 1
      },
      filterBox: {
        searchTerm: '',
      },
      tableOrderActive: 'name',
      order: {
        name: 'asc',
      },
    };
  }

  clickOnColumnHeader = (e, field) => {
    e.preventDefault();
    this.props.clickOnColumnHeaderHandler(field);
  }

  // table's row handlers
  renderHeader = (value) => {
    return value === '' ? null : <span className="col-th-arrow"></span>
  }

  render () {
    const {data, paginationSettings, isFetching} = this.props;    
    return (
      <PTable
        sorted={true}
        items={data}
        wrapperState={this.state}
        clickOnColumnHeader={this.clickOnColumnHeader}
        isFetching={isFetching}
        customClass='forms-table'
        pagination={paginationSettings}
      />
    )
  }
};

Table.propTypes = {
  data: PropTypes.instanceOf(Object).isRequired,
}

export default Table;