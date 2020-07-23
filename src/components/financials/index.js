import React from 'react';
// import Utils from '../../lib/utils';
import { connect } from 'react-redux';
import { Modal, Button } from 'react-bootstrap';
import { bindActionCreators } from 'redux';
import * as localActions from '../../localization/actions';
import './financials.css';

class Financials extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
        accounts: [],
        hiringClientId: null,
        subContractorId: null,
        submissionId: null            
    }
  }

  getToken() {
    return this.props.global.login.authToken;
  }

  getUserProfile() {
    return this.props.global.login.profile;
  }

  render() {
    return (
      <div className="financials">
        Financials WIP
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    local: state.localization
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(localActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Financials);