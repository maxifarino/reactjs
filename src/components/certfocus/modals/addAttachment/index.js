import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import AttachmentForm from './form';

import * as attachmentsActions from '../../attachments/actions';
import * as commonActions from '../../../common/actions';

import '../addEntityModal.css';

class AddAttachment extends Component {
  submitAttachment = (values) => {
    const { projectId, insuredId } = this.props;

    const serializedObj = {
      ...values,
      projectId: values.projectId ? values.projectId.value : undefined,
      ...(projectId && { projectId }),
      ...(insuredId && { insuredId }),
    };

    let methodAction = '';
    if (projectId) {
      methodAction = 'sendProjectAttachment';
    } else if (insuredId) {
      methodAction = 'sendInsuredAttachment';
    }

    this.props.actions[methodAction](serializedObj, (success) => {
      if (success) {
        this.props.close(true);
      }
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
    } = this.props.local.strings.attachments.list.addModal;

    return (
      <div className="add-item-view add-entity-form-small">
        <div className="add-item-header">
          <h1>{title}</h1>
        </div>

        <section className="white-section">
          <div className="add-item-form-subsection">
            <AttachmentForm
              close={this.hideModal}
              onSubmit={this.submitAttachment}
              insuredId={this.props.insuredId}
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
    actions: bindActionCreators(attachmentsActions, dispatch),
    commonActions: bindActionCreators(commonActions, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddAttachment);
