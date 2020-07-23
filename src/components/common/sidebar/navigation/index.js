import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";

import RenderList from './RenderList';
import * as hcActions from '../../../hiringclients/actions';
import * as scActions from '../../../subcontractors/actions';
import * as usersActions from '../../../users/actions';

class Navigation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      navTabList: []
    };
  }

  render() {
    let navList = this.props.local.strings.common.sidebar.navigation;
    const navTabList = [];

    // tasks
    const tasksNav = {
      title: navList[0],
      to: '/tasks/',
      icon: 'icon-log',
      child: [
        {
          title: 'Tasks List',
          to: '/tasks/'
        }
      ]
    };
    // hiring clients
    const hcNav = {
      title: navList[1],
      to: '/hiringclients/',
      icon: 'icon-log',
      child: [
        {
          title: 'Add a New Hiring Client',
          to: '/hiringclients/',
          action: ()=> this.props.hcActions.setShowModal(true)
        },
        {
          title: 'Hiring Clients List',
          to: '/hiringclients/'
        }
      ]
    };
    // subcontractors
    const scNav = {
      title: this.props.common.toggled ? navList[2] : `subcon-
      tractors`,
      to: '/subcontractors/',
      icon: 'icon-workflow',
      child: [
        {
          title: 'Add a New Subcontractor',
          action: () => this.props.scActions.setAddSCShowModal(true),
          to: '/subcontractors/'
        },
        {
          title: 'Subcontractor List',
          to: '/subcontractors/'
        }
      ]
    };
    // users
    const uNav = {
      title: navList[3],
      to: '/admin/users/',
      icon: 'icon-personal_info',
      child: [
        {
          title: 'Add a New User',
          action: () => this.props.usersActions.setShowOverlayAddUser(true),
          to: '/admin/users/',
        },
        {
          title: 'Users List',
          to: '/admin/users/'
        },
        {
          title: 'Users Activity Log',
          to: '/admin/users/log'
        }
      ]
    };
    // forms
    const fbNav = {
      title: navList[4],
      to: '/forms/',
      icon: 'icon-log',
      child: [
        {
          title: 'Form Builder',
          to: '/forms/new-form/'
        },
        {
          title: 'Forms List',
          to: '/forms/'
        },
        {
          title: 'Forms Submissions',
          to: '/forms/submissions'
        }
      ]
    };

    // communication templates
    const ctNav = {
      title: navList[5],
      to: '/communication-templates/',
      icon: 'icon-log',
      child: [
        {
          title: 'Add a New Comm. Template',
          to: '/communication-templates/builder/'
        },
        {
          title: 'Comm. Templates List',
          to: '/communication-templates/'
        }
      ]
    };

    if (this.props.common && !this.props.common.checkingAuthorizations) {
      navTabList.push(tasksNav);
      navTabList.push(hcNav);
      navTabList.push(scNav);
      if(this.props.common.usersAuth) {
        navTabList.push(uNav);
      }
      if(this.props.common.formBuilderAuth) {
        navTabList.push(fbNav);
      }
      if(this.props.common.commTempAuth) {
        navTabList.push(ctNav);
      }
    }

    return (
      <div className='sidebar-wrapper'>
        <RenderList
          toggleSideBar={this.props.toggleSideBar}
          toggled={this.props.common.toggled} list={navTabList} />
      </div>
    );
  };
};

const mapStateToProps = (state) => {
  const { showModal } = state.sc;
  return {
    sc: state.sc,
    local: state.localization,
    common: state.common,
    showModal
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    hcActions: bindActionCreators(hcActions, dispatch),
    scActions: bindActionCreators(scActions, dispatch),
    usersActions: bindActionCreators(usersActions, dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Navigation);
