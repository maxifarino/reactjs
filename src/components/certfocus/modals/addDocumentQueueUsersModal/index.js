import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import AddDocumentQueueUsersForm from './form';
import * as actions from '../../settings/documentQueueDefinitions/actions';
import * as commonActions from '../../../common/actions';
import '../addEntityModal.css';

class AddDocumentQueueUsersModal extends Component {
  
  componentDidMount() {
  }

  send = (values) => {
    const { setLoading } = this.props.commonActions;
    const { queueId } = this.props;    
    const payload = {
      userId: values.userId,
      queueId: queueId,
    }
    //console.log('PAY', payload);
    setLoading(true);
    this.props.actions.postDocumentQueueUser(payload, (success) => {
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
    } = this.props.local.strings.documentQueueDefinitions.documentQueueUsers.addDocumentQueueUsersModal;

    const text = title;

    return (
      <div className="add-item-view add-entity-form-small">
        <div className="add-item-header">
          <h1>{text}</h1>
        </div>
        <section className="white-section">
          <div className="add-item-form-subsection">
            <AddDocumentQueueUsersForm
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

export default connect(mapStateToProps, mapDispatchToProps)(AddDocumentQueueUsersModal);
