import React, { Component } from 'react';
import { connect } from 'react-redux';

class StatusModal extends Component {
  renderStatusHistory = (record, idx) => {
    return (
      <tr key={idx}>
        <td>{record.status}</td>
        <td>{record.date}</td>
        <td>{record.updatedBy}</td>
      </tr>
    );
  }

  render() {
    const {
      title,
      statusHeader,
      dateHeader,
      updatedByHeader,
      closeBtn,
      noHistory,
    } = this.props.local.strings.coverages.statusModal;

    // TODO: REPLACE FOR REAL DATA
    const recordsMock = [
      {
        status: 'Accepted',
        date: '10/31/18',
        updatedBy: 'Fred',
      },
      {
        status: 'Accepted',
        date: '10/31/18',
        updatedBy: 'Fred',
      },
    ];

    return (
      <div className="add-item-view add-entity-form-small">
        <div className="add-item-header ml-0">
          <h1>{title}</h1>
        </div>

        <section className="white-section">
          <div className="add-item-form-subsection">
            <div className="entity-info-form">
              <table className="table table-sm">
                <thead className="color-green-dark">
                  <tr>
                    <th>{statusHeader}</th>
                    <th>{dateHeader}</th>
                    <th>{updatedByHeader}</th>
                  </tr>
                </thead>
                <tbody>
                  {recordsMock.length > 0 ?
                    recordsMock.map(this.renderStatusHistory) : (
                      <tr>
                        <td rowSpan="3">
                          <div className="error-item-form">
                            {noHistory}
                          </div>
                        </td>
                      </tr>
                    )
                  }
                </tbody>
              </table>

              <div className="add-item-bn">
                <button className="bn bn-small bg-green-dark-gradient create-item-bn" onClick={() => this.props.close(false)}>
                  {closeBtn}
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }
};

const mapStateToProps = (state) => {
  return {
    local: state.localization,
    common: state.common,
  };
};

export default connect(mapStateToProps)(StatusModal);
