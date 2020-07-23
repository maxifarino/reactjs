import React, {Component} from 'react';
import PropTypes from 'prop-types';
import SystemSwitch from "../auth/systemSwitch";
import {connect} from "react-redux";
import MailComposer from "../mailComposer";
import * as commonActions from '../common/actions';
import {bindActionCreators} from "redux";

class Mail extends Component {

  constructor(props) {
    super(props);
    const encodedData = this.props.match.params.mailData;
    let mailData = {};
    if (encodedData) {
      const decodedData = window.atob(encodedData);
      mailData = JSON.parse(decodedData);
    }

    this.state = {
      mailData,
    }
  }

  render() {
    const { currentSystem } = this.props.login;

    return (
      <React.Fragment>
        <SystemSwitch
          onChange={(system) => {
            this.props.commonActions.fetchUserHiringClients(system);
            this.forceUpdate();
          }
          }
        />
        <MailComposer
          mailData={this.state.mailData}
          system={currentSystem}/>
      </React.Fragment>
    );
  }
}

Mail.propTypes = {};

const mapStateToProps = (state) => {
  return {
    login: state.login
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
    commonActions: bindActionCreators(commonActions, dispatch)
  }
};

export default connect(mapStateToProps,mapDispatchToProps)(Mail);