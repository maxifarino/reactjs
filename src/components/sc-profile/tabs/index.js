import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

import TradeContracts from './tradeContracts';
import NotesTasks from './notesTasks';
import Forms from './forms';
import Files from './files';
import FinancialInfo from './financialInfo';
import Users from './users';
import References from './references';
import ScoreCards from './scorecards';
import Locations from './locations';

class Tabs extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      currentTab: 0,
      financialInfoInitialized: false
    };

    const {
      tradeContracts,
      notesTasks,
      forms,
      files,
      financialInfo,
      users,
      references,
      scoreCards,
      locations
    } = props.local.strings.scProfile.tabs;

    this.tabs = [
      {
        tabLabel: notesTasks,
        content: <NotesTasks fromSCtab/>
      },
      {
        tabLabel: tradeContracts,
        content: <TradeContracts />
      },
      {
        tabLabel: financialInfo,
        content : <FinancialInfo scIdFromTabs={props.scId} />
      },
      {
        tabLabel: forms,
        content: <Forms />
      },
      {
        tabLabel: files,
        content: <Files />
      },
      {
        tabLabel: users,
        content: <Users />
      },
      {
        tabLabel: references,
        content: <References />
      },
      {
        tabLabel: scoreCards,
        content: <ScoreCards scIdFromTabs={props.scId} />
      },
      {
        tabLabel: locations,
        content: <Locations scIdFromTabs={props.scId} />
      }
    ];

  }

  // componentWillReceiveProps(nextProps) {
  //   console.log('nextProps.status = ', nextProps.status)
  //   console.log('nextProps.scId = ', nextProps.scId)
  //   console.log('this.state.financialInfoInitialized = ', this.state.financialInfoInitialized)
  //   console.log('!this.state.financialInfoInitialized && nextProps.status && nextProps.scId = ', !this.state.financialInfoInitialized && nextProps.status && nextProps.scId)
  //   if ( !this.state.financialInfoInitialized && nextProps.status && nextProps.scId ){
  //     this.tabs[2].content = <FinancialInfo status={nextProps.status} scId={nextProps.scId} />;

  //     this.setState({
  //       financialInfoInitialized: true
  //     });
  //   }
  // }

  // resetFinancial() {
  //   if (this.state.financialInfoInitialized && this.state.currentTab !== 2) {
  //     this.tabs[2].content = <FinancialInfo status={this.props.status} scId={this.props.scId} key={Date.now().toString()} fromSCtab />;
  //   }
  // }

  // setCurrentTab = (e, i) => {
  //   e.preventDefault();
  //   this.setState({
  //     currentTab: i
  //   }, this.resetFinancial);
  // };

  setCurrentTab = (e, i) => {
    e.preventDefault();
    this.setState({
      currentTab: i
    });
  };

  render() {
    const {
      forms,
    } = this.props.local.strings.scProfile.tabs;

    let renderedTabs = [];
    if (this.props.login.profile.Role) {
      const { Role } = this.props.login.profile;
      if (Role.IsSCRole) {
        // Check if the necessay data for the payment are ready to render forms tab
        renderedTabs.push(_.isEmpty(this.props.headerDetails) ? { tabLabel: forms, content: null } : this.tabs[3]);// forms
        renderedTabs.push(this.tabs[4]);// files
      } else if (Role.IsHCRole) {
        renderedTabs.push(this.tabs[0]);// notes/tasks
        renderedTabs.push(this.tabs[1]);// trade contracts
        // id=6 non financial hc
        if(Role.Id !== 6)renderedTabs.push(this.tabs[2]);
        renderedTabs.push(this.tabs[3]);// forms
        renderedTabs.push(this.tabs[4]);// files
        renderedTabs.push(this.tabs[6]);// references
        renderedTabs.push(this.tabs[7]);// scorecards
      } else {
        renderedTabs = this.tabs;
      }
      if (Role.IsSCRole || Role.IsHCRole || Role.IsPrequalRole) {
        if (!renderedTabs.includes(this.tabs[8])) {
          renderedTabs.push(this.tabs[8]);// locations
        }
      }
    }

    return (
      <div className="tab-frame scprofile-tabs">
        <ul className="profile-tabs nav nav-tabs">
          {
            renderedTabs.map((tab,idx) => {
              return (
                <li className="tab-item" key={idx}>
                  <a
                    className={`tab-button ${this.state.currentTab === idx ? 'active' : ''}`}
                    onClick={(e) => {this.setCurrentTab(e, idx)}}>{tab.tabLabel}</a>
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

const mapStateToProps = (state, ownProps) => {
  return {
    local: state.localization,
    login: state.login,
  };
};

export default connect(mapStateToProps)(Tabs);
