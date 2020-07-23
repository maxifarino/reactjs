import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Swal from 'sweetalert2';

import * as actions from '../../actions';

import './changeInsuredModal.css';

class ChangeInsuredModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      insuredId: this.props.currentInsured || '',
      processingData: false
    }
  };

  onChangeInsured = (e) => {
    this.setState({ insuredId: e.target.value });
  }

  onSave = () => {
    const { insuredId } = this.state;
    if (insuredId) {
      const selectedInsured = this.props.projectInsureds.list.find(insured => insured.InsuredID === Number(insuredId));
      const payload = {
        insuredId: insuredId,
      };

      this.setState({ processingData: true });
      this.props.actions.fetchDataEntrySelectedInsured(payload, selectedInsured, (success) => {
        if (success) {
          this.props.close();
        } else {
          this.setState({ processingData: false });
        }
      });
    } else {
      Swal({
        type: 'error',
        title: 'Error',
        text: 'Please select an Insurer',
      });
    }
  }

  render() {
    const {
      insuredTitle,
      addInsuredLabel,
      cancelButton,
      saveButton,
    } = this.props.local.strings.processing.dataEntry;

    return (
      <div className="change-insured-modal">
        <header className="change-insured-modal-header">{insuredTitle}</header>

        <div className="change-insured-content container-fluid filter-fields">
          <div className="row">
            <div className="col-md-12">
              {
                this.state.processing?
                  <div className="spinner-wrapper">
                    <div className="spinner"></div>
                  </div>
                  :
                  <div className="insuredContainer">
                    <div>
                      <label>{addInsuredLabel}:</label>
                    </div>
                    <select
                      className="modalSelect"
                      value={this.state.insuredId}
                      onChange={this.onChangeInsured}
                    >
                      <option value=""></option>
                      {
                        this.props.projectInsureds.list.map((item, idx) => (
                          <option key={idx} value={item.InsuredID}>{item.InsuredName}</option>
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
    projectInsureds: state.projectInsureds,
    common: state.common,
    processing: state.processing,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(actions, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ChangeInsuredModal);
