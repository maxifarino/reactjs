import React, {Component} from 'react';
import './systemSwitch.css';
import {connect} from "react-redux";
import * as loginActions from '../login/actions';
import {bindActionCreators} from "redux";

class SystemSwitch extends Component {

  setCurrentSystem = (system) => {
    this.props.actions.setCurrentSystem(system);
    const {onChange} = this.props;
    if (onChange) {
      onChange(system);
    }
  }

  render() {

    const { currentSystem } = this.props.login;
    return (
      <div className={'systemSwitch'}>
        {(this.props.login.profile.Role && this.props.login.profile.CFRole) ?
          <div className="mr-auto">
            <label>View as: </label><br/>
            <div className="form-check form-check-inline">
              <label className="form-check-label pl-0">
                <input
                  className="form-check-input"
                  type="radio"
                  id="systemRadio"
                  onChange={() => this.setCurrentSystem('pq')}
                  checked={currentSystem === 'pq'}
                />
                PreQual
              </label>
            </div>
            <div className="form-check form-check-inline">
              <label className="form-check-label">
                <input
                  className="form-check-input"
                  type="radio"
                  id="systemRadio"
                  onChange={() => this.setCurrentSystem('cf')}
                  checked={currentSystem === 'cf'}
                />
                CertFocus
              </label>
            </div>
          </div> : null
        }
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    login: state.login,
    local: state.localization,
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(loginActions, dispatch)
  }
};

export default connect(mapStateToProps,mapDispatchToProps)(SystemSwitch);