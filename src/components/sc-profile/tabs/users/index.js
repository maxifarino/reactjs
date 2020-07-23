import React from 'react';
import { withRouter } from 'react-router-dom';
import Users from '../../../users';

class UsersTab extends React.Component {
  render() {
    return (
      <Users fromSCtab scId={this.props.match.params.scId}/>
    );
  }
}


export default withRouter(UsersTab);
