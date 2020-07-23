import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect, withRouter } from 'react-router-dom';

import Projects from './../../projects';
import Tags from './tags';
import Users from '../../../users';
import HolderUsers from "./users";
import Contacts from '../../contacts';
import CustomFields from './custom-fields';
import Tasks from '../../tasks';
import DocumentTypes from './document-types';
import Settings from './settings';
import CoverageTypes from '../../coverage-types';
import Endorsements from './endorsements';
import RequirementSets from '../../requirement-sets';
import Workflow from './workflow';
import {bindActionCreators} from "redux";
import * as actions from "../../coverage-types/actions";
import CFTemplates from "./templates";

class Tabs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentTab: 0
    };
  }

  setCurrentTab = (e, i, label) => {
    const {
      coverageTypes,
    } = this.props.local.strings.holders.holdersProfile.tabs;
    if (label === coverageTypes) {
      // todo reset filter
      const {actions} = this.props;
      const query = this.addId({
        orderBy: 'displayOrder',
        orderDirection: 'ASC',
      });

      actions.fetchCoverageTypes(query);
    }
    e.preventDefault();
    this.setState({
      currentTab: i
    });
  };
  addId = (query) => {
    const { holderId } = this.props.match.params;

    if (holderId) {
      return {...query, holderId};
    }

    return query;
  }
  render() {
    const { holderId } = this.props.match.params;

    const {
      projects,
      tasks,
      coverageTypes,
      reqSets,
      contacts,
      tags,
      customFields,
      endorsements,
      documentTypes,
      users,
      workflow,
      settings,
      holderUsers,
    } = this.props.local.strings.holders.holdersProfile.tabs;

    const tabs = [
      {
        tabLabel: projects,
        content: <Projects fromHolderTab holderId={holderId} />
      },
      {
        tabLabel: tasks,
        content: <Tasks fromHolderTab holderId={holderId} holderName={this.props.holdersProfile.name}/>
      },
      {
        tabLabel: coverageTypes,
        content: <CoverageTypes fromHolderTab holderId={holderId} />
      },
      {
        tabLabel: reqSets,
        content: <RequirementSets fromHolderTab holderId={holderId} />
      },
      {
        tabLabel: contacts,
        content: <Contacts holderId={holderId} />
      },
      {
        tabLabel: tags,
        content: <Tags holderId={holderId} />
      },
      {
        tabLabel: customFields,
        content: <CustomFields holderId={holderId} />
      },
      {
        tabLabel: endorsements,
        content: <Endorsements holderId={holderId} />
      },
      {
        tabLabel: documentTypes,
        content: <DocumentTypes holderId={holderId} />
      },
      {
        tabLabel: holderUsers,
        content: <HolderUsers fromHolderTab hcId={holderId}/>
      },
      {
        tabLabel: workflow,
        content:  <Workflow holderId={holderId} />
      },
      {
        tabLabel: settings,
        content: <Settings holderId={holderId} />
      },
      {
        tabLabel: 'Templates',
        content: <CFTemplates fromHolderTab holderId={holderId} />
      }
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
                    onClick={e => this.setCurrentTab(e, idx, tab.tabLabel)}>{tab.tabLabel}</a>
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
    holdersProfile: state.holdersProfile.profileData,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(actions, dispatch),
  };
};
export default withRouter(connect(mapStateToProps,mapDispatchToProps)(Tabs));
