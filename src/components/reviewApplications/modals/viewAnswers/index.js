import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Field, reduxForm, Form } from 'redux-form';

import renderField from '../../../customInputs/renderField';
import * as actions from '../../actions';

import './viewAnswers.css';

class ViewAnswersModal extends React.Component {
  constructor(props) {
    super(props);

  };

  componentDidMount() {
    /*
    this.props.change('contactFullName', this.props.scProfile.headerDetails.contactFullName);
    this.props.change('contactEmail', this.props.scProfile.headerDetails.mainEmail);
    this.props.change('contactPhone', this.props.scProfile.headerDetails.phone);
    */
  }
  
  render() {
    const {
      title,
      labelContactName,
      labelMail,
      labelPhone,
      cancelBtn
    } = this.props.local.strings.scProfile.changeBasicDataModal;

    //console.log(this.props);    

    return (       

        !this.props.application ? (
          <div className="spinner-wrapper">
            <div className="spinner" />
          </div>
        ) : (
          <div className="container-fluid">
          <div className="answers-modal">
            <header>View All Answers</header>
              <div className="row">
                <span className="subtitle">User Information (Prequal Contact)</span>
              </div>    
              <div className="row">
                <label htmlFor="">Contact Name:</label>
                <span className="answer-data">{this.props.application && this.props.application.SubcontractorContactName}</span>
              </div>
              <div className="row">
                <label htmlFor="">Contact Phone:</label>
                <span className="answer-data">{this.props.application && this.props.application.SubcontractorContactPhone}</span>
              </div>
              <div className="row">
                <label htmlFor="">Contact Email:</label>
                <span className="answer-data">{this.props.application && this.props.application.SubcontractorContactEmail}</span>
              </div>

              <div className="row">
                <span className="subtitle">Company Profile</span>
              </div>    
              <div className="row">
                <label htmlFor="">Company Name:</label>
                <span className="answer-data">{this.props.application && this.props.application.SubcontractorName}</span>
              </div>
              <div className="row">
                <label htmlFor="">Primary Trade:</label>
                <span className="answer-data">{this.props.application && this.props.application.Description}</span>
              </div>
              <div className="row">
                <label htmlFor="">Tax ID:</label>
                <span className="answer-data">{this.props.application && this.props.application.SubcontractorTaxID}</span>
              </div>

              <div className="row">
                <label htmlFor="">Address:</label>
                <span className="answer-data">{this.props.application && this.props.application.Address}</span>
              </div>
              <div className="row">
                <label htmlFor="">City:</label>
                <span className="answer-data">{this.props.application && this.props.application.City}</span>
              </div>
              <div className="row">
                <label htmlFor="">State:</label>
                <span className="answer-data">{this.props.application && this.props.application.StateID}</span>
              </div>
              <div className="row">
                <label htmlFor="">ZipCode:</label>
                <span className="answer-data">{this.props.application && this.props.application.ZipCode}</span>
              </div>
              <div className="row">
                <label htmlFor="">Country:</label>
                <span className="answer-data">{(this.props.application && this.props.application.CountryID === 1) ? 'United States' : ''}</span>
              </div>
              <div className="row">
                <label htmlFor="">Previously worked for the HC:</label>
                <span className="answer-data">{(this.props.application && this.props.application.PreviousWorkedForHC) ? 'YES' : 'NO'}</span>
              </div>
              <div className="row">
                <label htmlFor="">HC previous project name:</label>
                <span className="answer-data">{this.props.application && this.props.application.HiringClientProject}</span>
              </div>
              <div className="row">
                <label htmlFor="">HC client contact name:</label>
                <span className="answer-data">{this.props.application && this.props.application.HiringClientContactName}</span>
              </div>
              <div className="row">
                <label htmlFor="">General comments:</label>
                <span className="answer-data">{this.props.application && this.props.application.GeneralComments}</span>
              </div>
          

              <div className="text-right">
                <button type="button" className="bg-sky-blue-gradient bn" onClick={this.props.close}>{cancelBtn}</button>
              </div>
            </div>
            </div>
        )
    );
  }
};

const mapStateToProps = (state, ownProps) => {
  return {
    local: state.localization,
    login: state.login,
    reviewApplications: state.reviewApplications,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(actions, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ViewAnswersModal);
