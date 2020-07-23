import React from 'react';
import { connect } from 'react-redux';

import RenderList from './RenderList';

class ExtendedNavigation extends React.Component {

  render() {
    let navList = this.props.local.strings.common.sidebar.navigation;
    this.navTabList = [
      {
        title: 'Hiring Clients',
        to: '/',
        child: []
      },
      {
        title: 'Subcontractors',
        to: '/'
      },
      {
        title: 'Users',
        to: '/'
      },
      {
        title: 'Forms',
        to: '/'
      },
      {
        title: 'Comm. Templates',
        to: '/'
      },
    ];
    return (
      <div className='sidebar-wrapper'>
        <RenderList list={this.navTabList} />
      </div>
    );
  };
};

const mapStateToProps = (state) => {
  return {
    local: state.localization
  };
};

export default connect(mapStateToProps)(ExtendedNavigation);
