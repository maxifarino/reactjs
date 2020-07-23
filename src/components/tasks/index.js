import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import NotesTasks from '../sc-profile/tabs/notesTasks';
import CFTasks from "../certfocus/tasks";
import SystemSwitch from "../auth/systemSwitch";

class Tasks extends React.Component {

  render() {

    return (
      <React.Fragment>
        <SystemSwitch />
        {this.renderContent()}
      </React.Fragment>
    );
  }

  renderContent() {
    if (this.props.login.currentSystem === 'cf') {
      return <CFTasks />
    } else {
      const userId = _.get(this.props.login, 'profile.Id');

      return userId && <NotesTasks fromSidebar userId={userId} />;
    }

  }
}

const mapStateToProps = (state) => {
  return {
    login: state.login,
    local: state.localization
  }
};

export default connect(mapStateToProps)(Tasks);
