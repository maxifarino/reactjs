import React from 'react';

import Table from './table';
import Pagination from './pagination';

import './ptable.css';

class PTable extends React.Component {
  
  render() {
    const {total, itemsPerPage, setPageHandler, currentPageNumber} = this.props.pagination;
    const {
      hide,
      isSearchModal
    } = this.props
   
    return (
      <div className={`table-with-pagination ${isSearchModal && !hide ? 'searchModal' : ''}`}>
        <Table 
          items={this.props.items}
          sorted={this.props.sorted}
          wrapperState={this.props.wrapperState}
          tableOrderActive={this.props.tableOrderActive}
          clickOnColumnHeader={this.props.clickOnColumnHeader}
          isFetching={this.props.isFetching}
          customClass={this.props.customClass}
          colsConfig={this.props.colsConfig}
          isSearchModal={this.props.isSearchModal}
        />

        <Pagination
          total={total}
          itemsPerPage={itemsPerPage}
          setPageHandler={setPageHandler}
          currentPageNumber={currentPageNumber}
        /> 
      </div>
    );
  }
};

export default PTable;