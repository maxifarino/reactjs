import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';

import * as registerActions from '../actions';
import CompanyProfileForm from './form';

class CompanyProfileTab extends React.Component {

  submit = values => {
    const companyPayload = {
      id: this.props.register.subcontractorId,
      hiringClientId: this.props.register.hiringClientId,
    	companyName: values.companyName,
    	tradeId: (parseInt(values.trade, 10) || 0) + '',
    	secTradeId: (parseInt(values.secondarytrade, 10) || 0) + '',
      terTradeId: (parseInt(values.tertiarytrade, 10) || 0) + '',
      quatTradeId: (parseInt(values.quaternaryTrade, 10) || 0) + '',
      quinTradeId: (parseInt(values.quinaryTrade, 10) || 0) + '',
    	address: values.address,
    	city: values.city,
    	state: values.state,
    	zipcode: values.zipcode,
      mainEmail: this.props.register.userPayload.email,
    	countryId: values.country,
    	taxId: values.taxid,
      agree: values.agree,
    }
    this.props.actions.setCompanyPayload(companyPayload);
    this.props.actions.sendRegistration(this.props.register.userPayload, companyPayload);
  };

  render() {
    return (
      <CompanyProfileForm onSubmit={this.submit} />
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CompanyProfileTab));
