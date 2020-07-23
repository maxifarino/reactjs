import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import ReferenceInfoTab from './referenceInfoTab';
import QuestionsTab from './questionsTab';
import { setModalReferenceData, saveReference, fetchAnswers  } from '../actions';

import './referenceModal.css';

class AddProjectModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      step: 1
    };

    this.send = this.send.bind(this);

    if (props.currentReference) {
      this.props.fetchAnswers({
        referenceId: props.currentReference.id
      }, this.props.close)
    }
  };

  send = (data) => {
    this.props.setModalReferenceData({ questionsTab: data, currentReference: this.props.currentReference});
    this.props.saveReference(this.props.close);
  };

  setStep2 = (data) => {
    this.props.setModalReferenceData({ referenceInfoTab: data });
    this.setState({
      step: 2,
      referenceTypeId: data.typeId
    });
  };

  render() {
    const {
      addTitle,
      editTitle,
    } = this.props.local.strings.scProfile.references.modal;
    return (
      <div className="contact-info-form add-reference-form">
        <div className="wiz-wrapper">
          <header>
            <h2 className="modal-wiz-title">
              {this.props.currentReference ? editTitle : addTitle}
            </h2>
            <ul className="step-icons">
              <li>
                <span className={`step-icon-bubble ${this.state.step === 1 ? 'active' : ''}`}>
                  1
              </span>
              </li>
              <li>
                <span className={`step-icon-bubble ${this.state.step === 2 ? 'active' : ''}`}>
                  2
              </span>
              </li>
            </ul>
          </header>
        </div>
        <div className="steps-bodies add-item-view">
          <div className={`step-body add-item-form-subsection step-1 ${this.state.step === 1 ? 'active' : ''}`}>
            <ReferenceInfoTab currentReference={this.props.currentReference} close={this.props.close} continueHandler={this.setStep2} />
          </div>
          <div className={`step-body add-item-form-subsection step-2 ${this.state.step === 2 ? 'active' : ''}`}>
            <QuestionsTab referenceTypeId={this.state.referenceTypeId} currentReference={this.props.currentReference} close={this.props.close} continueHandler={this.send} />
          </div>
        </div>
      </div>
    );
  }
};

const mapStateToProps = (state, ownProps) => {
  return {
    local: state.localization,
    projects: state.projects
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    saveReference: bindActionCreators(saveReference, dispatch),
    setModalReferenceData: bindActionCreators(setModalReferenceData, dispatch),
    fetchAnswers: bindActionCreators(fetchAnswers, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddProjectModal);
