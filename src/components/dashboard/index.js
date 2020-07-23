import React from 'react';
// import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Exago from '../exago';
import * as localActions from '../../localization/actions';

class Dashboard extends React.Component {
  constructor(props) {
    super(props)
    const printReport = props.match.params.printReport;
    this.state = {
      printReport: printReport ? true : false
    }
  }

  changeLang = () => {
    this.props.actions.setLanguage('zeros');
  }

  render() {
/*
    let {
      title,
      formBuilderLink,
      formListLink,
      usersLink,
      registerLink,
      HCLink,
      templatesLink,
      templateBuilderLink,
      HCProfileLink,
    } = this.props.local.strings.dashboard; */

    let showExago = false;
    if (this.props.login.profile.Role) {
      const { profile } = this.props.login;
      showExago = profile.ReportingRole && profile.ReportingRole !== '';
    }

    return (
      <div className="dashboard">
        {
          showExago
          ? <Exago
              printReport={this.state.printReport} 
              userProfile={this.props.login.profile} 
            />
          : null
        }
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    local: state.localization,
    login: state.login
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(localActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
