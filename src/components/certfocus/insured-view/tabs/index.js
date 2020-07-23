import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect, withRouter } from 'react-router-dom';

import ProjectInsureds from '../../project-insureds';
import Documents from '../../attachments';
import Contacts from '../../contacts';
import Finance from './finance';
import Tasks from '../../tasks';
import Notes from '../../notes';
import Waivers from './waivers';
import Agencies from './../../agencies';

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

  componentWillReceiveProps(nextProps) {
    if (nextProps.currentTabSelected) {
      this.setState({
        currentTab: nextProps.currentTabSelected
      });
    }
  }

  render() {
    const { insuredId } = this.props.match.params;
    const { insuredData } = this.props;
    const {
      coverages,
      waivers,
      tasks,
      notes,
      contacts,
      finance,
      projects,
      documents,
      agencies,
    } = this.props.local.strings.insured.insuredView.tabs;

    const tabs = [
      {
        tabLabel: projects,
        content: <ProjectInsureds showColumnInsuredView={true} insuredId={insuredId} />
      },
      {
        tabLabel: documents,
        content: <Documents insuredId={insuredId} />
      },
      {
        tabLabel: tasks,
        content: <Tasks fromInsuredTab insuredId={insuredId} insuredName={this.props.insuredProfile.InsuredName}/>
      },
      {
        tabLabel: notes,
        content: <Notes fromInsuredTab insuredId={insuredId} />
      },
      {
        tabLabel: contacts,
        content: <Contacts isChild='true' insuredId={insuredId} />
      },
      {
        tabLabel: agencies,
        content: <Agencies insuredId={insuredId} insuredData={insuredData} />
      }
    ];

    let tabWaivers = {
      tabLabel: waivers,
      content: <Waivers insuredId={insuredId} />
    }

    let tabFinance = {
      tabLabel: finance,
      content: <Finance insuredId={insuredId} />
    }

    let hasPermission = this.props.login.rolesAccessPermissions.find(x => x.MasterTab == 'waivers' && x.SectionTab == 'view_waivers');

    if (hasPermission) {
      tabs.push(tabWaivers);
      tabs.push(tabFinance);
    } else {
      tabs.push(tabFinance);
    }


    let renderedTabs = [];
    if (this.props.login.profile.CFRole) {
      const { CFRole } = this.props.login.profile;

      if (!CFRole) {
        return <Redirect push to="/profile" />;
      } else {
        renderedTabs = [...tabs];
      }
    }

    return (
      <div className="tab-frame">
        <ul className="profile-tabs nav nav-tabs">
          {
            renderedTabs.map((tab, idx) => {
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
            renderedTabs.map((tab, idx) => {
              return (
                <div
                  className={`tab-pane ${this.state.currentTab === idx ? 'active' : ''}`}
                  key={idx} >
                  {tab.content}
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
    currentTabSelected: state.insuredDetails.tagSelected,
    insuredProfile: state.insuredDetails.insuredData,
  };
};

export default withRouter(connect(mapStateToProps)(Tabs));
