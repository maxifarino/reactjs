import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect, withRouter } from 'react-router-dom';

import RequirementSets from '../../requirement-sets';
import CoverageTypes from '../coverageTypes';
import CustomTerminology from '../customTerminology';
import DocumentQueueDefinitions from '../documentQueueDefinitions';
import Departments from "../departments";
import RolAccess from "../../../common/rolAccess";

class Tabs extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentTab: 0
    };
  }

  setCurrentTab = (e, i) => {
    e.preventDefault();
    this.setState({
      currentTab: i
    });
  };

  renderTab = (tab, idx) => {
    return (
      <li className="tab-item" key={idx}>
        <a
          className={`tab-button ${this.state.currentTab === idx ? 'active' : ''}`}
          onClick={e => this.setCurrentTab(e, idx)}>{tab.tabLabel}</a>
      </li>
    )
  }

  renderTabContent = (tab, idx) => {
    return (
      <div
        className={`tab-pane ${this.state.currentTab === idx ? 'active' : ''}`}
        key={idx} >
        { tab.content }
      </div>
    );
  }

  render() {
    const {
      reqSets,
      coverageTypes,
      customTerminology,
      documentQueueDefinitions,
      departments,
    } = this.props.local.strings.certFocusSettings.tabs;

    //FIXME change these access privileges
    const tabs = [
      {
        masterTab: 'default',
        sectionTab: "default",
        tabLabel: reqSets,
        content: <RequirementSets fromSettingsTab />
      },
      {
        masterTab: 'default',
        sectionTab: "default",
        tabLabel: coverageTypes,
        content: <CoverageTypes fromSettingsTab />
      },
      {
        masterTab: 'default',
        sectionTab: "default",
        tabLabel: customTerminology,
        content: <CustomTerminology fromSettingsTab />
      },
      {
        masterTab: 'default',
        sectionTab: "default",
        tabLabel: documentQueueDefinitions,
        content: <DocumentQueueDefinitions fromSettingsTab />
      },
      {
        masterTab: 'departments',
        sectionTab: "view_departments",
        tabLabel: 'departments',
        content: <Departments/>
      },
    ];



    let renderedTabs = [];
    if (this.props.login.profile.CFRole) {
      const { CFRole } = this.props.login.profile;

      if (!CFRole) {
        return <Redirect push to="/profile" />;
      } else {
        renderedTabs = [ ...tabs ];
      }
    }

    return (
      <div className="tab-frame">
        <ul className="profile-tabs nav nav-tabs">
          {
            renderedTabs.map((tab,idx) => {
              return (
                <RolAccess
                  key={tab.tabLabel+'-tab'}
                  masterTab={tab.masterTab}
                  sectionTab={tab.sectionTab}
                  component={() => this.renderTab(tab,idx)}>
                </RolAccess>
              )
            })
          }
        </ul>
        <div className="tab-content">
          {
            renderedTabs.map((tab,idx) => {
                return (
                  <RolAccess
                    key={tab.tabLabel+'-content'}
                    masterTab={tab.masterTab}
                    sectionTab={tab.sectionTab}
                    component={() => this.renderTabContent(tab,idx)}>
                  </RolAccess>
                )
            })
          }
        </div>
      </div>
    );
  }
};

const mapStateToProps = (state) => {
  return {
    local: state.localization,
    login: state.login,
  };
};

export default withRouter(connect(mapStateToProps)(Tabs));
