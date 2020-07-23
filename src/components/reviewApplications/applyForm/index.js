import React, { Component } from 'react';
import { reduxForm, Field, formValueSelector } from 'redux-form';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Swal from 'sweetalert2';

import * as reviewApplicationsActions from '../actions';
import * as commonActions from '../../common/actions';
import ApplyForm from './form';

class Apply extends Component {  
  constructor(props) {
    super(props);

    this.state = {
      currentHCId: props.match.params.hcId,
    }
  }

  /*
  onSubmit = (data) => {
    data.hiringClientId = this.state.currentHCId;    
    this.props.commonActions.setLoading(true);
    this.props.reviewApplicationsActions.setAddReviewApplications(data, (success) => {
      this.props.commonActions.setLoading(false);
      if (success) {
        Swal({
          type: 'success',
          title: 'SC applications',
          text: 'SubContractor data was applied',
        })
        console.log('Success!!');
      }
    });
  } 
  */

  render() {
    return (
      <div>
        {this.state.currentHCId ? (
          <ApplyForm
            onSubmit={this.onSubmit}
            {...this.props}    
            />
        ) : (
          <div className="alert alert-danger" role="alert">
            Hiring Client not found
          </div>
        )}

        {this.props.reviewApplications.reviewApplicationsError && 
          <div className="alert alert-danger" role="alert">
            {this.props.reviewApplications.reviewApplicationsError}
          </div>
        }
      </div>
    )        
  }
}

const mapStateToProps = (state) => {
  return {
    local: state.localization,
    reviewApplications: state.reviewApplications,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    reviewApplicationsActions: bindActionCreators(reviewApplicationsActions, dispatch),
    commonActions: bindActionCreators(commonActions, dispatch),
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(Apply);
