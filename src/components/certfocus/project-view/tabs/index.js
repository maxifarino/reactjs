import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect, withRouter } from 'react-router-dom';

import ProjectInsureds from '../../project-insureds';
import Attachments from '../../attachments';
import CertText from './cert-text';
import Requirements from './requirements';
import ProjectUsers from '../../project-users';
import Users from "../../../users";
import Tasks from "../../../certfocus/tasks";
// import Users from '../../../users';

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

  render() {
    const { projectId} = this.props.match.params;
    const {holderId, projectHolderName, projectName } = this.props;
    const {
      insureds,
      requirements,
      certText,
      users,
      attachments
    } = this.props.local.strings.certFocusProjects.projectView.tabs;

    const tabs = [
      {
        tabLabel: insureds,
        content:  <ProjectInsureds 
                    showColumnInsuredView={false} 
                    projectId={projectId} 
                    proyectArchived={this.props.proyectArchived}
                    holderId={this.props.holderId}
                  />
      },
      {
        tabLabel: requirements,
        content: <Requirements projectId={projectId} />
      },
      {
        tabLabel: users,
        content: <ProjectUsers
          projectId={projectId}
        />
      },
      {
        tabLabel: attachments,
        content: <Attachments projectId={projectId} />
      },,
      {
        tabLabel: 'tasks',
        content: <Tasks fromProject
                        projectId={projectId}
                        holderId= {holderId}
                        projectName= {projectName}
                        holderName={projectHolderName} />
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
                <li className="tab-item" key={idx}>
                  <a
                    className={`tab-button ${this.state.currentTab === idx ? 'active' : ''}`}
                    onClick={e => this.setCurrentTab(e, idx)}>{tab.tabLabel}</a>
                </li>
              );
            })
          }
        </ul>
        <div className="tab-content">
          {
            renderedTabs.map((tab,idx) => {
              return (
                <div
                  className={`tab-pane ${this.state.currentTab === idx ? 'active' : ''}`}
                  key={idx} >
                  { tab.content }
                </div>
              );
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
