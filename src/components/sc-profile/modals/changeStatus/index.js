import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as actions from '../../actions';

import './changeStatusModal.css';

class ChangeStatusModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      statusId: this.props.currentStatus || '',
      processing: false
    }

    this.onChangeStatus = this.onChangeStatus.bind(this);
    this.onSave = this.onSave.bind(this);
  };

  onChangeStatus(e) {
    this.setState({statusId: e});
  }

  onSave() {
    this.setState({ processing: true });
    const 
      { hcId, scId, userId } = this.props,
      { statusId } = this.state;
    
    const payload = {
      hiringClientId: hcId,
      subcontractorId: scId,
      subcontractorStatusId: statusId,
      userId
    }

    this.props.actions.changeStatus(payload, (success) => {
      if (success) {
        this.props.successCallback(this.props.close);
      } else {
        this.setState({ processing: false });
      }
    });

  }

  render() {
    const {
      title,
      statusLabel,
      cancelBtn,
      saveBtn
    } = this.props.local.strings.scProfile.changeStatusModal;

    return (
      <div className="change-status-modal">
        <header className="change-status-modal-header">{title}</header>

        <div className="change-status-content container-fluid filter-fields">
          <div className="row">
            <div className="col-md-12">
              {
                this.state.processing?
                  <div className="spinner-wrapper">
                    <div className="spinner"></div>
                  </div>
                  :
                  <div className="statusContainer" >
                    <div>
                      <label>{statusLabel}:</label>
                    </div>
                    <select
                      value={this.state.statusId}
                      onChange={(e) => {this.onChangeStatus(e.target.value)}}>
                      {
                        this.props.sc.subcontratorStatus.map((item, idx) => {return (
                          <option key={idx} value={item.Id}>{item.Status}</option>
                        )})
                      }
                    </select>
                  </div>
              }
            </div>
          </div>

          {
            !this.state.processing?
              <div className="text-right">
                <button className="bg-sky-blue-gradient bn" onClick={this.props.close}>{cancelBtn}</button>
                <button className="bg-sky-blue-gradient bn action-button" onClick={this.onSave}>{saveBtn}</button>
              </div>
              :
              null
          }

        </div>
      </div>
    );
  }
};

const mapStateToProps = (state, ownProps) => {
  return {
    sc: state.sc,
    local: state.localization,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(actions, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ChangeStatusModal);
