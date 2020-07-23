import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import TradeCategories from './tradeCategories';
import Templates from './templates';
import Forms from './forms';
import Projects from './projects';
import Language from './language';
import Workflow from './workflow';
import SubContractorsTab from './subContractors';
import UsersTab from './users';
import NotesTasksTab from './notesTasks';
import ApplicationsTab from './applications';
import ProcoreTab from './procore';


class Tabs extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      currentTab: 0,
      reloadTabs: false
    };
    const {
      tradeCategories,
      communicationTemplates,
      forms,
      projects,
      language,
      workflow,
      subContractor,
      notesTasks,
      users,
      applications,
      procore
    } = props.local.strings.hcProfile.tabs;

    this.AllowApplications = props.hcprofile.profileData.AllowApplications;
    this.AllowProcoreIntegration = props.hcprofile.profileData.AllowProcoreIntegration;

    this.tabs = [
      {
        tabLabel: subContractor,
        content: <SubContractorsTab />
      },
      {
        tabLabel: projects,
        content: <Projects />
      },
      {
        tabLabel: notesTasks,
        content: <NotesTasksTab />
      },
      {
        tabLabel: workflow,
        content: <Workflow />
      },
      {
        tabLabel: communicationTemplates,
        content: <Templates fromhc/>
      },
      {
        tabLabel: forms,
        content: <Forms />
      },
      {
        tabLabel: tradeCategories,
        content: <TradeCategories />
      },
      {
        tabLabel: users,
        content: <UsersTab />
      },
      {
        tabLabel: language,
        content: <Language />
      },      
    ];

    console.log('allowApplications', this.AllowApplications);    
    if (this.AllowApplications) {
      this.tabs.push({
        tabLabel: applications,
        content: <ApplicationsTab />
      });
    }
    console.log('allowProcoreIntegration', this.AllowProcoreIntegration);    
    if (this.AllowProcoreIntegration) {
      this.tabs.push({
        tabLabel: procore,
        content: <ProcoreTab />
      });
    }
      
  }

  setCurrentTab = (e, i) => {
    e.preventDefault();
    this.setState({
      currentTab: i
    });
  };

  getAvailableTabs = () => {
    let renderedTabs = [];
    if (this.props.login.profile.Role) {
      const { Role } = this.props.login.profile;
      console.log('IsHCRole', Role.IsHCRole);      

      if (Role.IsHCRole) {
        renderedTabs.push(this.tabs[0]); // subContractors
        renderedTabs.push(this.tabs[1]); // projects
        renderedTabs.push(this.tabs[2]); // notes/tasks
        renderedTabs.push(this.tabs[6]); // trade categories
        if (this.AllowApplications) {
          renderedTabs.push(this.tabs[9]); // applications
        }
        if (this.AllowProcoreIntegration) {
          renderedTabs.push(this.tabs[10]); // procore
        }
      } else if (Role.IsSCRole) {
        // SC should not be here
        return <Redirect push to="/profile" />;
      } else {
        renderedTabs = this.tabs;
      }

    }
    return renderedTabs;
  }


  render() {    
    const renderedTabs = this.getAvailableTabs();

    return (
      <div className="tab-frame">
        <ul className="profile-tabs nav nav-tabs">
          {
            renderedTabs.map((tab,idx) => {
              if (tab !== undefined) {
                return (
                  <li className="tab-item" key={idx}>
                    <a
                      className={`tab-button ${this.state.currentTab === idx ? 'active' : ''}`}
                      onClick={(e) => {this.setCurrentTab(e, idx)}}>{tab.tabLabel}</a>
                  </li>
                );                
              }
            })
          }
        </ul>
        <div className="tab-content">
          {
            renderedTabs.map((tab,idx) => {
              if (tab !== undefined) {
                return (
                  <div
                    className={`tab-pane ${this.state.currentTab === idx ? 'active' : ''}`}
                    key={idx} >
                    { tab.content }
                  </div>
                );
              }
            })
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
    hc: state.hc,
  };
};

export default connect(mapStateToProps)(Tabs);
