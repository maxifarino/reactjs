import React from 'react';
import { withRouter } from 'react-router-dom';
import Users from '../../../users';

class UsersTab extends React.Component {
  render() {
    return (
      <Users fromHCtab hcId={this.props.match.params.hcId}/>
    );
  }
}


export default withRouter(UsersTab);
