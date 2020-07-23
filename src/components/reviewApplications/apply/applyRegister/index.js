import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';

import * as applyActions from '../actions';
import * as reviewApplicationsActions from '../../actions';

import ApplyRegisterForm from './form';
import Utils from '../../../../lib/utils';

class ApplyRegister extends React.Component {

  submit = values => {
    console.log(values);

    const applyPayload = {
      hiringClientId: this.props.apply.hiringClientId,
      subcontractorContactName: values.firstName + ' ' + values.lastName,
      subcontractorContactPhone: Utils.normalizePhoneNumber(values.phone),
      subcontractorContactEmail: values.email,
    	subcontractorName: values.companyName,
    	primaryTrade: (parseInt(values.trade, 10) || 0) + '',
    	subcontractorTaxId: values.taxid,
    	address: values.address,
    	city: values.city,
    	state: values.state,
    	zipcode: values.zipcode,
      countryId: values.country,
      hiringClientContactName: values.hcContactName,
      hiringClientContactEmail: values.hcContactEmail,
      hiringClientProject: values.hcProject,
      previousWorkedForHC: (values.previousWorkedForHC) ? 1 : 0,
      generalComments: values.generalComments,      
      agree: values.agree,
      pass: values.password,
    }   
    
    this.props.reviewApplicationsActions.setAddReviewApplications(applyPayload, (success) => {
      if (success) {
        console.log('Success!!');
      }
    });
  };

  render() {
    return (
      <ApplyRegisterForm onSubmit={this.submit} />
    );
  };
};

const mapStateToProps = (state, ownProps) => {
  return {
    apply: state.apply
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(applyActions, dispatch),
    reviewApplicationsActions: bindActionCreators(reviewApplicationsActions, dispatch),
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ApplyRegister));
