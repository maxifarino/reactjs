import React from 'react';
import { withRouter } from 'react-router-dom';
import ReviewApplications from './../../../reviewApplications';

class ApplicationsTab extends React.Component {
  render() {
    return (
      <ReviewApplications fromHCtab hcId={this.props.match.params.hcId}/>
    );
  }
}


export default withRouter(ApplicationsTab);