import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import DocumentQueueDefinitionForm from './form';

import * as documentQueueDefinitionsActions from '../../settings/documentQueueDefinitions/actions';
import * as commonActions from '../../../common/actions';

import '../addEntityModal.css';

class AddDocumentQueueDefinitionsModal extends Component {
  send = (values) => {
    const { documentQueueDefinition } = this.props;

    const serializedObj = {
      queueId: (documentQueueDefinition) ? documentQueueDefinition.QueueId : undefined,
      name: values.name,
      archived: values.archived ? 1 : 0,
    };

    this.props.actions.postDocumentQueueDefinitions(serializedObj, this.props.close);
  };

  hideModal = () => {
    const { onHide, close } = this.props;
    if (onHide) onHide();
    else close();
  }

  render() {
    const {
      title,
      titleEdit,
    } = this.props.local.strings.documentQueueDefinitions.addModal;
    
    const titleText = this.props.documentQueueDefinition ? titleEdit : title;

    return (
      <div className="add-item-view add-entity-form-small">
        <div className="add-item-header">
          <h1>{titleText}</h1>
        </div>

        <section className="white-section">
          <div className="add-item-form-subsection">
            <DocumentQueueDefinitionForm
              close={this.hideModal}
              onSubmit={this.send}
              documentQueueDefinition={this.props.documentQueueDefinition}
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
    actions: bindActionCreators(documentQueueDefinitionsActions, dispatch),
    commonActions: bindActionCreators(commonActions, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddDocumentQueueDefinitionsModal);
