import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import _ from 'lodash';

import Utils from '../../../../../lib/utils';

import * as commonActions from '../../../../common/actions';
import * as actions from './actions';

import './holderSettings.css';

class Settings extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      settings: {
        CFCompliantAndAccepted: '',
        CFNonDateFields: '',
        CFRevisedDates: '',
        CFRevisedWordingPresent: '',
        CFApplyingCertificates: ''
      },
    };
  }

  componentDidMount() {
    const { commonActions, common, holderId, actions } = this.props;

    if (common.certificateOptions.length <= 0) {
      commonActions.fetchCertificateOptions();
    }

    if (common.dataEntryOptions.length <= 0) {
      commonActions.fetchDataEntryOptions();
    }

    actions.fetchSettings(holderId, (settings) => {
      if (!_.isEmpty(settings)) {
        this.setState({ settings });
      }
    });
  }

  onSettingChange = (e) => {
    const { settings } = this.state;
    const { name, value } = e.target;
    const { holderId } = this.props;
    const newSettings = { ...settings, [name]: Number(value) };

    this.props.actions.sendSettings({ ...newSettings, holderId }, () => {
      this.setState({ settings: newSettings });
    });
  }

  renderSetting = (setting, idx) => {
    const { label, name, value, options } = setting;
    return (
      <div key={idx} className="admin-form-field-wrapper">
        <label htmlFor={name}>{`${label}:`}</label>
        <div className="select-wrapper">
          <select
            disabled={this.props.holderSettings.fetchingSettings}
            value={value || 1}
            name={name}
            onChange={this.onSettingChange}
          >
            {options.map(this.renderOptions)}
          </select>
        </div>
      </div>
    );
  }

  renderOptions = (opt, idx) => {
    return <option value={opt.value} key={idx}>{opt.label}</option>
  }

  render() {
    const {
      labelDataEntryRules,
      labelRevisedWordingPresent,
      labelCompliantAndAccepted,
      labelRevisedDates,
      labelNonDateFields,
      labelApplyingCertificates
    } = this.props.local.strings.holderSettings;

    const {
      CFRevisedWordingPresent,
      CFCompliantAndAccepted,
      CFRevisedDates,
      CFNonDateFields,
      CFApplyingCertificates
    } = this.state.settings;

    const dataEntryRuleOptions = Utils.getOptionsList(null, this.props.common.dataEntryOptions, 'OptionName', 'OptionId');
    const applyingCertificatesOptions = Utils.getOptionsList(null, this.props.common.certificateOptions, 'OptionName', 'OptionId');

    const DERSettings = [
      {
        label: labelRevisedWordingPresent, name: 'CFRevisedWordingPresent',
        value: CFRevisedWordingPresent, options: dataEntryRuleOptions
      },
      {
        label: labelCompliantAndAccepted, name: 'CFCompliantAndAccepted',
        value: CFCompliantAndAccepted, options: dataEntryRuleOptions
      },
      {
        label: labelRevisedDates, name: 'CFRevisedDates',
        value: CFRevisedDates, options: dataEntryRuleOptions
      },
      {
        label: labelNonDateFields, name: 'CFNonDateFields',
        value: CFNonDateFields, options: dataEntryRuleOptions
      },
    ];
    const ACSetting = {
      label: labelApplyingCertificates, name: 'CFApplyingCertificates',
      value: CFApplyingCertificates, options: applyingCertificatesOptions
    };

    if (this.props.holderSettings.errorSettings) {
      return (
        <div className="holder-settings mt-3">
          <div className="settings-error">
            {this.props.holderSettings.errorSettings}
          </div>
        </div>
      );
    }

    return (
      <div className="add-item-view add-entity-form-small">
        <section className="white-section holder-settings">
          <div className="add-item-form-subsection">
            <div className="add-item-header">
              <h1>{labelDataEntryRules}</h1>
            </div>

            <div className="container-fluid">
              <div className="row">
                <div className="col-5">
                  <div className="entity-info-form">
                    {DERSettings.map(this.renderSetting)}
                  </div>
                </div>
              </div>
            </div>

            <div className="container-fluid">
              <div className="row">
                <div className="col-5">
                  <div className="entity-info-form ml-0">
                    {this.renderSetting(ACSetting,0)}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="settings-error">
            {this.props.holderSettings.errorSendSettings}
          </div>
        </section>
      </div>
    );
  }
};

const mapStateToProps = (state) => {
  return {
    holderSettings: state.holderSettings,
    local: state.localization,
    common: state.common,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(actions, dispatch),
    commonActions: bindActionCreators(commonActions, dispatch),
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Settings));
