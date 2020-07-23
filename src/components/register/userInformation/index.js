import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';

import * as registerActions from '../actions';
import UserInformationForm from './form';
import Utils from '../../../lib/utils';

class UserInformationTab extends React.Component {

  submit = values => {
    /*const {Id} = this.props.login.profile;
    let userInfo = Object.assign({}, values, {
      id: Id
    });
    console.log(values);*/
    //this.props.actions.sendUserInformation(userInfo, this.props.history, this.props.continueHandler);

    const userPayload = {
      firstName: values.firstName,
      lastName: values.lastName,
      titleId: (parseInt(values.title, 10) || 0) + '',
      phone: Utils.normalizePhoneNumber(values.phone),
      cellPhone: values.cellphone? Utils.normalizePhoneNumber(values.cellphone):'',
      email: values.email,
      pass: values.password,
    }
    this.props.actions.setUserPayload(userPayload);
    this.props.continueHandler();
  };

  render() {
    return (
      <UserInformationForm onSubmit={this.submit} />
    );
  };
};

const mapStateToProps = (state, ownProps) => {
  return {
    register: state.register,
    login: state.login,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(registerActions, dispatch)
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(UserInformationTab));
