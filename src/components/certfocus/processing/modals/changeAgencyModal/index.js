import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Swal from 'sweetalert2';

import * as actions from '../../actions';

import './changeAgencyModal.css';

class ChangeAgencyModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      agencyId: this.props.currentAgency || '',
      processingData: false
    }
  };

  onChangeAgency = (e) => {
    this.setState({ agencyId: e.target.value });
  }

  onSave = () => {
    const { agencyId } = this.state;

    if (agencyId) {
      const payload = {
        agencyId: agencyId
      };
      this.setState({ processingData: true });
      this.props.actions.fetchDataEntrySelectedAgency(payload, (success) => {
        if (success) {
          this.props.close();
        } else {
          this.setState({ processing: false });
        }
      });
    } else {
      Swal({
        type: 'error',
        title: 'Error',
        text: 'Please select an Agency',
      });
    }
  }

  render() {
    const {
      agencyTitle,
      addAgencyLabel,
      cancelButton,
      saveButton,
    } = this.props.local.strings.processing.dataEntry;

    const {
      agencies
    } = this.props.processing;

    return (
      <div className="change-agency-modal">
        <header className="change-agency-modal-header">{agencyTitle}</header>

        <div className="change-agency-content container-fluid filter-fields">
          <div className="row">
            <div className="col-md-12">
              {
                this.state.processing?
                  <div className="spinner-wrapper">
                    <div className="spinner"></div>
                  </div>
                  :
                  <div className="agencyContainer">
                    <div>
                      <label>{addAgencyLabel}:</label>
                    </div>
                    <select
                      className="modalSelect"
                      value={this.state.AgencyId}
                      onChange={this.onChangeAgency}
                    >
                      <option value=""></option>
                      {
                        agencies && agencies.map((item, idx) => (
                          <option key={idx} value={item.AgencyId}>{item.Name}</option>
                        ))
                      }
                    </select>
                  </div>
              }
            </div>
          </div>

          {
            !this.state.processingData ?
              <div className="text-right">
                <button className="bg-sky-blue-gradient bn" onClick={this.props.close}>{cancelButton}</button>
                <button className="bg-sky-blue-gradient bn action-button" onClick={this.onSave}>{saveButton}</button>
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
    local: state.localization,
    login: state.login,
    common: state.common,
    processing: state.processing,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(actions, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ChangeAgencyModal);
