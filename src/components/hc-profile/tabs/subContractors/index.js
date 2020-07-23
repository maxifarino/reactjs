import React from 'react';
import { withRouter } from 'react-router-dom';
import Subcontractors from '../../../subcontractors';

class SubContractorsTab extends React.Component {
  render() {
    return (
      <Subcontractors fromHCtab hcId={this.props.match.params.hcId}/>
    );
  }
}


export default withRouter(SubContractorsTab);
