import React from 'react';
import {connect} from "react-redux";
import { bindActionCreators } from "redux";

import LogoSidebar from './LogoSidebar';
import SidebarTabs from './SidebarTabs';
import * as commonActions from '../actions/index'

import './sidebar.css';

class Sidebar extends React.Component {
  toggleNav = (toggled)=> {
    this.props.actions.toggleSideBar(toggled);
  }
  componentWillReceiveProps(nextProps){
    const { toggled }= nextProps.common;
    document.getElementById('sidebar-menu').style.width = !toggled ? '8%' : '20%';
    document.getElementById('main').style.left = !toggled ? '8%' : '20%';
  }
  render() {
    return (
      <div
        className={`sidebar-container ${this.props.common.toggled ? 'open' : ''}`}
      >
        <div
          onMouseEnter={()=> this.toggleNav(true)}
          onMouseLeave={()=> this.toggleNav(false)}
        >
          <LogoSidebar toggled={this.props.common.toggled} toggleSideBar={this.props.actions.toggleSideBar}/>
          <SidebarTabs toggleSideBar={this.props.actions.toggleSideBar}/>
        </div>
      </div>
    );
  };
};

const mapStateToProps = (state, ownProps) => {
  return {
    common: state.common
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(commonActions, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);
