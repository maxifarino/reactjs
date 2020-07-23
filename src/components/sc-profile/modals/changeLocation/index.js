import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import utils from '../../../../lib/utils'

import * as actions from '../../actions';

import './changeLocationModal.css';

class ChangeLocationModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      location: this.props.location || '',
      processing: false
    }

    this.onChangeLocation = this.onChangeLocation.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  };

  // componentDidMount() {
  //   this.setState({
  //     location: this.props.location
  //   })
  // }

  onChangeLocation(e) {
    this.setState({location: e});
  }

  handleSubmit() {
    this.setState({ processing: true });
    const 
      { hcId, scId } = this.props,
      { location } = this.state;
    
    const payload = {
      hiringClientId: hcId,
      subcontractorId: scId,
      location: utils.replaceQuotes(location)
    }

    this.props.actions.changeLocation(payload, (success) => {
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
      locationLabel,
      cancelBtn,
      saveBtn
    } = this.props.local.strings.scProfile.changeLocationModal;

    let displayLocation = utils.displayQuotes(this.state.location)

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
                      <label>{locationLabel}:</label>
                    </div>
                      <input
                        placeholder={displayLocation}
                        onChange={(e) => this.onChangeLocation(e.target.value)} 
                        type="text"
                      />
                  </div>
              }
            </div>
          </div>

          {
            !this.state.processing?
              <div className="text-right">
                <button className="bg-sky-blue-gradient bn" onClick={this.props.close}>{cancelBtn}</button>
                <button className="bg-sky-blue-gradient bn action-button" onClick={this.handleSubmit}>{saveBtn}</button>
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

export default connect(mapStateToProps, mapDispatchToProps)(ChangeLocationModal);
