import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import AddContractsTab from './addContractsTab';
import ProjectTab from './projectTab';
import * as actions from '../actions';

class AddProjectModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      step: 1,
      showSteps: true
    };

    this.send = this.send.bind(this);
    this.props.actions.setProjectsError('');

    if (props.project) {
      this.state.showSteps = false;
      if (this.props.fromScTab) {
        this.state.step = 2;
      }
    }
  };

  send = () => {
    this.props.actions.sendProject(this.props.close);
  };

  setStep2 = () => {
    if (this.props.project) {
      this.send();
    } else {
      this.setState({
        step: 2
      });
    }
  };

  render() {
    const {
      title,
      titleEditProject,
      titleEditContract
    } = this.props.local.strings.hcProfile.projects.addProjectModal;

    let headerTitle = title;
    let titleStyle = {};
    if(!this.state.showSteps){
      headerTitle = this.props.fromScTab?titleEditContract:titleEditProject;
      titleStyle = {
        margin: 0,
        padding: 0
      }
    }

    return (
      <div className="newhc-form wiz-wrapper">
        <header>
          <h2 className="modal-wiz-title" style={titleStyle}>
            {headerTitle}
          </h2>
          {
            this.state.showSteps?
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
              </ul>:null
          }
        </header>
        <div className="steps-bodies add-item-view">
          <div className={`step-body add-item-form-subsection step-1 ${this.state.step === 1 ? 'active' : ''}`}>
            <ProjectTab
              project={this.props.project}
              close={this.props.close}
              continueHandler={this.setStep2}
            />
          </div>
          <div className={`step-body add-item-form-subsection step-2 ${this.state.step === 2 ? 'active' : ''}`}>
            <AddContractsTab
              fromScTab={this.props.fromScTab}
              project={this.props.project}
              close={this.props.close}
              continueHandler={this.send}
            />
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
    actions: bindActionCreators(actions, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddProjectModal);
