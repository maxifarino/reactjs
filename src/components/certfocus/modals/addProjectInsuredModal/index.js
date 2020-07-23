import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import AddProjectInsuredForm from './form';

import '../addEntityModal.css';

import * as projectInsuredsActions from '../../project-insureds/actions';
import * as commonActions from '../../../common/actions';

class AddProjectInsuredModal extends Component {
  componentDidMount() {
    if (this.props.common.complianceStatus.length <= 0) {
      this.props.commonActions.fetchComplianceStatus();
    }
  }

  send = (values) => {
    const { setLoading } = this.props.commonActions;
    const { postProjectInsured } = this.props.projectInsuredsActions;
    const payload = {
      projectInsuredId: this.props.projectInsured ? this.props.projectInsured.ProjectInsuredID : undefined,
      projectId: this.props.projectId,
      insuredId: values.insured.value,
      complianceStatusId: (this.props.projectInsured) ? values.status : 6 // Non-Compliant Status
    }

    setLoading(true);
    postProjectInsured(payload, (success) => {
      setLoading(false);
      if (success) this.props.close();
    });
  };

  hideModal = () => {
    const { onHide, close } = this.props;
    if (onHide) onHide();
    else close();
  }

  render() {
    const {
      title,
      titleEdit
    } = this.props.local.strings.projectInsureds.addProjectinsuredsModal;

    const text = this.props.insured ? titleEdit : title;
    
    return (
      <div className="add-item-view add-entity-form-small">
        <div className="add-item-header">
          <h1>{text}</h1>
        </div>

        <section className="white-section">
          <div className="add-item-form-subsection">
            <AddProjectInsuredForm
              projectInsured={this.props.projectInsured}
              close={this.hideModal}
              onSubmit={this.send} 
              holderId={this.props.holderId}  
            />
          </div>
        </section>
      </div>
    );
  }
};

const mapStateToProps = (state) => {
  return {
    local: state.localization,
    common: state.common,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    projectInsuredsActions: bindActionCreators(projectInsuredsActions, dispatch),
    commonActions: bindActionCreators(commonActions, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddProjectInsuredModal);
