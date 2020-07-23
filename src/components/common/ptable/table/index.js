import React from 'react';
import { connect } from 'react-redux';

class Table extends React.Component {

  render() {
    const { fields, body, header } = this.props.items;
    const { noResults } = this.props.local.strings.common.table;

    return (

      this.props.isFetching ?
        <div className="spinner-wrapper">
          <div className="spinner"></div>
        </div> :
        body.length === 0 ?
          <div className="no-results-msg">
            {noResults}
          </div> :
          <section className={`list-view-table ${this.props.customClass || ''}`}>
            <div className="table-wrapper">
              <table className="table">
                {
                  this.props.colsConfig ?
                    <colgroup>
                      {
                        this.props.colsConfig.map((columnWidth, idx) => {
                          return (<col span="1" style={{ width: columnWidth }} key={idx} />);
                        })
                      }
                    </colgroup> :
                    null
                }
                <thead>
                  <tr>
                    {fields.map((fieldName, idx) => {
                      return <th key={idx} style={(fieldName === 'contactName') ? { width: '140px' } : {}}>
                        <span
                          className={
                            !!this.props.sorted && fieldName === this.props.tableOrderActive ?
                              `${this.props.wrapperState.order[fieldName] === 'desc' ? '' : 'th-desc'} col-th-wrapper` : 'col-th-wrapper'
                          }
                          onClick={(e) => {
                            if (this.props.clickOnColumnHeader) {
                              this.props.clickOnColumnHeader(e, fieldName);
                            }
                          }}
                        >
                          {header[fieldName]}
                          {
                            header[fieldName] && !!this.props.sorted && fieldName === this.props.tableOrderActive ?
                              <span className="col-th-arrow"></span> :
                              null
                          }
                        </span>
                      </th>
                    })}
                  </tr>
                </thead>
                <tbody>
                  {body.map((row, idx) => {
                    return <tr key={idx}>
                      {fields.map((fieldName, cellIdx) => {
                        return <td key={cellIdx} >
                          {row[fieldName] == "undefined" || row[fieldName] == "null null" || row[fieldName] == "null null" ? "" : row[fieldName]}</td>
                      })}
                    </tr>
                  })}
                </tbody>
              </table>
            </div>
          </section>
    );
  };
};

const mapStateToProps = state => {
  return {
    local: state.localization
  };
};

export default connect(mapStateToProps)(Table);