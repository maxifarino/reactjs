import React from 'react';

class Pagination extends React.Component {
  render() {
    const {
      total, 
      itemsPerPage, 
      setPageHandler,
      currentPageNumber
    } = this.props;
    let pagesLength;

    if(total % itemsPerPage > 0) {
      pagesLength = parseInt(total/itemsPerPage, 10) + 1;
    }
    else {
      pagesLength = total/itemsPerPage;
    }

    let pagesButtons = [];

    for (let i = 1; i <= pagesLength; i++) {
      pagesButtons.push(<li key={i}>
        <a 
          className={`pagination-link ${currentPageNumber === i ? 'active': ''}`}
          onClick={(e) => { setPageHandler(e, i) }}
        >
          {i}
        </a>
      </li>);
    }

    return (
      total > itemsPerPage ?
        <section className="pagination">
          <div className="pagination-wrapper">
            <span className={`pag-arrow ${currentPageNumber - 1 <= 0 ? 'hide-pag-arrow' : ''}`}>
              <a 
                className="pagination-link prev"
                onClick={(e) => { setPageHandler(e, currentPageNumber - 1) }}
              >
                {'<'}
              </a>
            </span>
            <ul className="table-pagination">
              {pagesButtons.slice(currentPageNumber - 1, currentPageNumber + 4)}
            </ul>
            <span className={`pag-arrow ${currentPageNumber + 1 > pagesLength ? 'hide-pag-arrow' : ''}`}>
              <a 
                className="pagination-link next"
                onClick={(e) => { setPageHandler(e, currentPageNumber + 1) }}
              >
                {'>'}
              </a>
            </span>
          </div>
        </section> :
        null
    );
  }
};

export default Pagination;