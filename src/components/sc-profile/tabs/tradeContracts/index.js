import React from 'react';
import { withRouter } from 'react-router-dom';
import Projects from '../../../hc-profile/tabs/projects'

class TradeContracts extends React.Component {
  render() {

    return (
      <Projects fromScTab scId={this.props.match.params.scId}/>
    );
  }
};

export default withRouter(TradeContracts);
