import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as actions from './actions';
import * as loginActions from '../auth/login/actions';
import DropIn from './DropIn';
import './payments.css';
import logo from '../../assets/img/prequal-logo-2017-v.2.1.svg';
import { env } from '../../environmentSwitch'

const Alerts = require ('../alerts');

class Payments extends React.Component {
  instance;

	constructor(props) {
    super(props);
    this.state = {
      dropInInstance: null
    };

    this.renderLogos = this.renderLogos.bind(this);

    const { paymentStatus } = props.scProfile;

    const redirectUrl =    props.scProfile
                        && props.scProfile.headerDetails
                        && props.scProfile.headerDetails.id
                        ?  `/subcontractors/${props.scProfile.headerDetails.id}`
                        :  '/profile'

    if (paymentStatus && paymentStatus.MustPayToHCId && (paymentStatus.MustPayRegistration || paymentStatus.MustPayRenewal)) {
      this.props.actions.getBraintreeClientToken();
      this.props.actions.fetchHCInfo(paymentStatus.MustPayToHCId);
    } else {
      // console.log(`payments components is DEFINITELY pushing '/profile' to history`)
      this.props.actions.setBraintreeClientToken(null);
      this.props.history.push(redirectUrl);
    }
  }

  componentWillReceiveProps(nextProps) {
    // braintree errors
    if(this.props.payments.loadingBraintree && !nextProps.payments.loadingBraintree){
      if(nextProps.payments.braintreeWarning) {
        Alerts.showInformationAlert(
          'Warning',
          nextProps.payments.braintreeWarning,
          'Accept',
          false,
          ()=>{}
        );
      }
      if(nextProps.payments.braintreeError) {
        Alerts.showInformationAlert(
          'Error',
          nextProps.payments.braintreeError,
          'Accept',
          false,
          ()=>{
            console.log('braintree error!, redirecting to login')
            this.props.history.push('/login');
            //this.props.actions.getBraintreeClientToken();
          }
        );
      }
    }
    // hc error
    if(this.props.payments.fetchingHC && !nextProps.payments.fetchingHC){
      if(nextProps.payments.hcError) {
        Alerts.showInformationAlert(
          'Error',
          nextProps.payments.hcError,
          'Accept',
          false,
          ()=>{
            console.log('hcError, redirecting to login!')
            this.props.history.push('/login');
            //this.props.actions.fetchHCInfo(this.props.login.profile.MustPayToHCId);
          }
        );
      }
    }
  }

  componentWillUnmount() {
    this.setState({dropInInstance: null});
  }

	async buy() {
		// Send the nonce to your server
    try {
      this.props.actions.setLoadingBraintree(true);
      const { nonce } = await this.state.dropInInstance.requestPaymentMethod();
      // console.log(nonce);
      this.props.actions.sendNonceToBackend(nonce, this.props.history);
    } catch (e) {
      console.log(e);
      this.props.actions.setLoadingBraintree(false);
    }
	}

  onContinue() {
    this.props.loginActions.setProfile({});
    this.props.actions.setBraintreeClientToken(null);
    console.log('onContinue => this.props.payments.redirectUrl = ', this.props.payments.redirectUrl)
    this.props.history.push(this.props.payments.redirectUrl);
  }

  renderLogos() {
    const hcLogo = this.props.payments.hcLogo !== "" ? `data:image/jpeg;base64,${this.props.payments.hcLogo}` : null;
    return (
      <div className="payments-logos-container">
        {
          hcLogo?
            <img className="payments-logo" src={hcLogo} alt="Skender"/>
            :null
        }
        <img className="payments-logo" src={logo} alt="Prequal"/>
      </div>
    );
  }

  render() {
    const spinnerContainerStyle = {
      position:'fixed',
      top:'0',
      left:'0',
      backgroundColor:'#80808087',
      width:'100%',
      height:'100%',
    };
    const spinnerStyle = {
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    };

    let message = "";
    let feeMessage = "";
    let subcontractorFee = "";
    const { paymentStatus } = this.props.scProfile;

    const conditionalMessage =  env == 'dev1' || 
                                env == 'dev2' 
                                ? "use this as the CC#: 4111111111111111" 
                                : ( env == 'stag' 
                                    ? "Enter live Credit Card # and Expiration Date To Test payment" 
                                    : "Please enter your Credit Card information")
    // console.log('env =', env)                                    
    // console.log('conditionalMessage =', conditionalMessage)

    if (paymentStatus) {
      const { SubcontractFeeRegMsg, SubcontractFeeRenewMsg } = paymentStatus;
      subcontractorFee = paymentStatus.SubcontractorFee;
      if (paymentStatus && paymentStatus.MustPayRegistration){
        message = SubcontractFeeRegMsg || conditionalMessage;
        feeMessage = `Registration Fee: $${subcontractorFee}`;
      } else {
        message = SubcontractFeeRenewMsg || conditionalMessage;
        feeMessage = `Renewal Fee: $${subcontractorFee}`;
      }
    } else {
      return (
        <div style={spinnerContainerStyle} >
          <div className="spinner-wrapper" style={spinnerStyle} >
            <div className="spinner"></div>
          </div>
        </div>
      );
    }

    return (
      <div className="container-fluid">
        {
          this.props.payments.clientToken && subcontractorFee !== ""?
            <div className="payment-method-container" >
              {this.renderLogos()}
              <div className="payments-message-container">
                {message}
              </div>
              <div className="payments-fee-message-container">
                {feeMessage}
              </div>
              <DropIn
                options={{ authorization: this.props.payments.clientToken }}
                onInstance={instance => (this.setState({dropInInstance: instance}))}
              />
              {
                !this.props.payments.loadingBraintree &&
                this.state.dropInInstance &&
                !this.props.payments.redirectUrl
                  ? <button className="payments-purchase-btn" onClick={this.buy.bind(this)}>Purchase</button>
                  : null
              }
              {
                !this.props.payments.loadingBraintree && this.props.payments.redirectUrl?
                  <button className="payments-continue-btn" onClick={this.onContinue.bind(this)}>Continue</button>
                  :
                  null
              }
            </div>
            :
            <div style={spinnerContainerStyle} >
              <div className="spinner-wrapper" style={spinnerStyle} >
                <div className="spinner"></div>
              </div>
            </div>
        }
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    scProfile: state.SCProfile,
    local: state.localization,
    login: state.login,
    payments: state.payments,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(actions, dispatch),
    loginActions: bindActionCreators(loginActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Payments);
