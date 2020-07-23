import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as applyActions from './actions';

import RegisterSidebar from './RegisterSidebar';
import RegisterMain from './RegisterMain';

import './register.css';

const Alerts = require ('../../alerts');

class Apply extends React.Component {
  constructor(props) {
    super(props);
        
    let testingDomaindFlag= false;
    
    if (testingDomaindFlag) {  // For local veleopment testing purposes 
      let hc = 'testing.prequalusa.com';
      console.log('hc', hc);
      props.actions.checkHC({registrationUrl: hc}, (error, data) => {
        if(! error) {
          console.log(data);
          let hcId = data[0].Id;
          this.props.actions.setHiringClientId(hcId);
        }
      });
    } else if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
      console.log('is localhost');      
      const qs = new URLSearchParams(this.props.location.search);
      this.props.actions.setHiringClientId(qs.get('hcId'));

    } else {
      // Prod: search for registrationUrl
      let hc = window.location.href.match('^(?:https?:)?(?:\/\/)?([^\/\?]+)')[1];
      console.log('hc', hc);
      props.actions.checkHC({registrationUrl: hc}, (error, data) => {
        if(! error) {
          console.log(data);
          let hcId = data[0].Id;
          if (data[0].AllowApplications) {
            this.props.actions.setHiringClientId(hcId);
          } else {
            this.props.history.push('/login');    
          }
        }
      });
    }        
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.apply.hiringClientId !== this.props.apply.hiringClientId) {
      if (! nextProps.apply.hiringClientId) {
        this.props.history.push('/login');
      } else {
        this.props.actions.fetchApplyResources(nextProps.apply.hiringClientId);
        this.props.actions.setHiringClientId(nextProps.apply.hiringClientId);
      }
    }

    if(nextProps.apply.registrationSuccess) {
      Alerts.showInformationAlert(
        'Success',
        nextProps.apply.registrationSuccess,
        'Accept',
        false,
        ()=>{       
          this.props.history.push('/login');
        }
      );
    }
    if(nextProps.reviewApplications.reviewApplicationsSuccess) {
      Alerts.showInformationAlert(
        'Success',
        'SubContractor data was applied',
        'Accept',
        false,
        ()=>{       
          this.props.history.push('/login');
        }
      );
    }
    if(nextProps.reviewApplications.reviewApplicationsError) {
      Alerts.showInformationAlert(
        'Error',
        nextProps.reviewApplications.reviewApplicationsError,
        'Accept',
        false,
        ()=>{}
      );
    }
  }

  render() {
    // {this.props.register.userExists ? <RegisterSecondary /> : <RegisterMain />}
    return (
      <div className="container-fluid">
        <div className="row">
          <RegisterSidebar hcLogo={this.props.apply.hcLogo}/>
          <RegisterMain 
            onSubmit={this.onSubmit}
          />
        </div>
      </div>
    );
  };
}

const mapStateToProps = (state, ownProps) => {
  return {
    apply: state.apply,
    reviewApplications: state.reviewApplications
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(applyActions, dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Apply);
