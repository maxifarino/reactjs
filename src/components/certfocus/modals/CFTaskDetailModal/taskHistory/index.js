import React, {Component} from 'react';
import PropTypes from 'prop-types';
import moment from "moment";

class CFTaskHistory extends Component {
  render() {
    const {history} = this.props;
    const {date,type,user,summary,status,contact} = this.props.locale;

    return (
      <React.Fragment>
        {(history.length > 0) ?
          <section className={`list-view-table`}>
            <div className="table-wrapper">
              <table className="table">
                <thead>
                <tr>
                  <th><span className="col-th-wrapper">{date}</span></th>
                  <th><span className="col-th-wrapper">{type}</span></th>
                  <th><span className="col-th-wrapper">{user}</span></th>
                  <th><span className="col-th-wrapper">{summary}</span></th>
                  <th><span className="col-th-wrapper">{contact}</span></th>
                </tr>
                </thead>
                <tbody>
                {history.map( (elem) => {
                  return (
                    <tr key={elem.date}>
                      <td>{moment(elem.date).format('MM/DD/YYYY')}</td>
                      <td>{elem.contactType}</td>
                      <td>{elem.userName}</td>
                      <td>{elem.comment}</td>
                      <td>{elem.contactUser}</td>
                    </tr>
                  );
                })}
                </tbody>
              </table>
            </div>
          </section>
          : null
        }
      </React.Fragment>
    );
  }
}

CFTaskHistory.propTypes = {
  history: PropTypes.array,
};

export default CFTaskHistory;