import React from 'react';

import Navigation from './navigation';

class SidebarTabs extends React.Component {
  
  render() {
    return <div className='sidebar-container'>
      <div className="sidebar-tabs-bodies tab-content">
        <div className={`tab-pane active`}>
          <Navigation toggleSideBar={this.props.toggleSideBar}/>
        </div>
      </div>
    </div>;
  };
};

export default SidebarTabs