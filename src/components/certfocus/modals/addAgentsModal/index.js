import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import AddAgentsForm from './form';
import * as actions from '../../agencies/actions';
import * as commonActions from '../../../common/actions';
import '../addEntityModal.css';

class AddAgentsModal extends Component {
  
  componentDidMount() {
  }

  send = (values) => {
    const { setLoading } = this.props.commonActions;    
    const payload = {
      agentId: this.props.agent ? this.props.agent.AgentID : undefined,
      firstName: values.firstName,
      lastName: values.lastName,
      mobileNumber: values.mobileNumber,
      phoneNumber: values.phoneNumber,
      emailAddress: values.emailAddress,
      agencyId: this.props.agencyId,
    }
    console.log('PAY', payload);    
    setLoading(true);

    this.props.actions.postAgent(payload, (success) => {
      setLoading(false);
      if (success) this.props.close();
      if (success && this.props.onSave) this.props.onSave(success.agentId);
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
    } = this.props.local.strings.agencies.addAgentsModal;

    const text = this.props.agent ? titleEdit : title;

    return (
      <div className="add-item-view add-entity-form-small">
        <div className="add-item-header">
          <h1>{text}</h1>
        </div>
        <section className="white-section">
          <div className="add-item-form-subsection">
            <AddAgentsForm
              agent={this.props.agent}
              close={this.hideModal}
              onSubmit={this.send} />
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
    actions: bindActionCreators(actions, dispatch),
    commonActions: bindActionCreators(commonActions, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddAgentsModal);
