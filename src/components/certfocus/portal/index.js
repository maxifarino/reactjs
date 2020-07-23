import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { reset } from 'redux-form';
import { Link } from 'react-router-dom';

import PortalForm from './infoForm';
import PaymentForm from './paymentForm';

import * as commonActions from '../../common/actions';
import * as portalActions from './actions';

import logo from '../../../assets/img/certFocusLogo.png';

import './Portal.css'

class Portal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      step: 1,
    };
  }

  componentDidMount() {
    const { commonActions } = this.props;

    commonActions.fetchUSStates();
    commonActions.fetchCountries();
  }

  onSubmit = (values) => {
    const { commonActions, actions } = this.props;

    commonActions.setLoading(true);
    actions.sendPortalForm(values, (success) => {
      commonActions.setLoading(true);

      if (success) {
        this.setState({ step: 2 });
      }
    });
  }

  onSubmitPayment = (values) => {
    const { commonActions, actions } = this.props;

    commonActions.setLoading(true);
    actions.sendPortalPayment(values, (success) => {
      commonActions.setLoading(true);

      if (success) {
        this.setState({ step: 3 });
      }
    });
  }

  resetForm = () => {
    this.props.dispatch(reset('PortalURLForm'));
  }

  renderStep = () => {
    const { step } = this.state;

    switch(step) {
      case 1:
        return (
          <PortalForm
            resetForm={this.resetForm}
            onSubmit={this.onSubmit}
          />
        );
      case 2:
        return <PaymentForm onSubmit={this.onSubmitPayment} />;
      default:
        return null;
    }
  }

  render() {
    const { header } = this.props.local.strings.portal;
    const { step } = this.state;

    return (
      <div className="container-fluid portal-form-container p-0">
        <header>
          <Link to="/login">
            <img src={logo} alt="certfocus-logo" />
          </Link>
          <h2 className="ml-4 mb-0">{header}</h2>
        </header>

        <div className="portal-url-form">
          <div className="new-entity-form wiz-wrapper">
            <div className="steps-bodies add-item-view">
              <div className='step-body add-item-form-subsection active'>
                {step === 1 && (
                  <PortalForm
                    resetForm={this.resetForm}
                    onSubmit={this.onSubmit}
                  />
                )}
                {step === 2 && <PaymentForm onSubmit={this.onSubmitPayment} />}
                {step === 3 && (
                  <div className="entity-info-form wiz-form pt-3">
                    <div className="container-fluid">
                      <div className="card">
                        <div className="card-block">
                          Thank You text explaining that the Certs will be reviewed and processed. We will contact you if there are issues.
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

const mapStateToProps = (state) => {
  return {
    local: state.localization,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(portalActions, dispatch),
    commonActions: bindActionCreators(commonActions, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Portal);
