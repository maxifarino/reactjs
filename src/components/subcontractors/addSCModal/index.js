import React from 'react';
import _ from 'lodash';
//import { reduxForm, change } from 'redux-form';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';

import UploadManuallyTab from './uploadManuallyTab';
import UploadFileTab from './uploadFileTab';

import '../subcontractors.css';
import * as hcActions from '../../hiringclients/actions';
import * as scActions from '../actions';

import SelectHC from './selectHC';

const Alerts = require ('../../alerts');

class AddSCModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tab: _.get(this.props.login, 'profile.Role.IsPrequalRole') ? 1 : 2
    };

    const { hcId } = props.match.params;
    let defaultHcId = hcId ? hcId : (props.hc.list.length > 0 ? props.hc.list[0].id : null)

    this.props.scActions.setHCforAddSCmodal(defaultHcId)
    this.props.scActions.fetchHCforms(hcId)

  };

  componentWillReceiveProps (nextProps) {
    const sendErrorAlert = () => {
      Alerts.showInformationAlert(
        'Error',
        nextProps.sc.errorMsg,
        'Accept',
        false,
        ()=>{
          this.props.scActions.setSendingScListError(null)
        }
      );
    }
    if (nextProps.sc.errorMsg) {
      sendErrorAlert()
    }
    if(this.props.sc.sendingScList && !nextProps.sc.sendingScList){
      if(nextProps.sc.errorMsg) {
        sendErrorAlert()
      } else if(nextProps.sc.successMsg) {
        Alerts.showInformationAlert(
          'Success',
          nextProps.sc.successMsg,
          'Accept',
          false,
          ()=>{
            this.props.scActions.setListOfSCManually([{}]);
            this.props.scActions.setListOfSCFromParsedFile([]);
          }
        );
      }
    }
    if (!this.props.forms && nextProps.forms) {
      let hcId = this.props.match.params
      this.props.scActions.fetchHCforms(hcId)
    }
  }

  onChangeSelectHC = event => {
    let hcId = event.target.value ? event.target.value : this.props.sc.hcIdForAddSCmodal
    this.props.scActions.setHCforAddSCmodal(hcId)
  };

  setTab1 = () => {
    this.setState({
      tab: 1
    });
  };

  setTab2 = () => {
    this.setState({
      tab: 2
    });
  };

  renderSelectors() {
    const {
      uploadFileLabel,
      uploadManuallyLabel
    } = this.props.local.strings.subcontractors.addSCModal;

    let selectors = null;

    if (_.get(this.props.login, 'profile.Role.IsPrequalRole')) {
      selectors = (
        <ul className="add-sc-tabs">
          <li>
            <a
              className={`addsc-tab-link ${this.state.tab === 1 ? 'active' : ''}`}
              onClick={this.setTab1} >
              {uploadFileLabel}
            </a>
          </li>
          <li>
            <a
              className={`addsc-tab-link ${this.state.tab === 2 ? 'active' : ''}`}
              onClick={this.setTab2} >
              {uploadManuallyLabel}
            </a>
          </li>
        </ul>
      )
    }

    return selectors;
  }

  render() {
    const hcList = this.props.hc.list;
    const {
      title,
      chooseHCLabel,
    } = this.props.local.strings.subcontractors.addSCModal;

    return (
      <div className="add-sc-modal">
        <header>
          <h1 className="add-sc-title">{title}</h1>
          <label
            className='choose-hc'
            htmlFor="chooseHC">
            {chooseHCLabel}
          </label>
          <SelectHC
            options={hcList}
            hcIdInitialSelection={this.props.sc.hcIdForAddSCmodal}
            onChangeHCSelect={this.onChangeSelectHC}
          />
        </header>

        {this.renderSelectors()}

        {
          this.props.sc.sendingScList?
            <div style={{ width:'100%', height:'200px', display: 'flex',
            alignItems: 'center', justifyContent: 'center' }}>
              <div className="spinner-wrapper">
                <div className="spinner"></div>
              </div>
            </div>
            :
            <div className="addsc-tab-bodies add-item-view">

              <div className={`tab-body add-item-form-subsection tab-1 ${this.state.tab === 1 ? 'active' : ''}`}>
                <UploadFileTab close={this.props.close} />
              </div>

              <div className={`tab-body add-item-form-subsection tab-2 ${this.state.tab === 2 ? 'active' : ''}`}>
                <UploadManuallyTab close={this.props.close} />
              </div>

            </div>
        }

      </div>
    );
  }
};

const mapStateToProps = (state, ownProps) => {
  return {
    sc: state.sc,
    hc: state.hc,
    local: state.localization,
    login: state.login
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    scActions: bindActionCreators(scActions, dispatch),
    hcActions: bindActionCreators(hcActions, dispatch),
    dispatch
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AddSCModal));
