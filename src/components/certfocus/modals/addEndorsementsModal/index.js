import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import EndorsementInfoForm from './form';

import * as actions from '../../holders-profile/tabs/endorsements/actions';
import * as commonActions from '../../../common/actions';
import '../addEntityModal.css';

class AddEndorsements extends Component {
  send = (values) => {
    const { holderId, endorsement } = this.props;

    const payload = {
      holderId: holderId ? holderId : undefined,
      endorsementId: endorsement ? endorsement.Id : undefined,
      ...values,
    }

    this.props.commonActions.setLoading(true);
    this.props.actions.sendEndorsements(payload, (success) => {
      this.props.commonActions.setLoading(false);
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
      title, titleEdit
    } = this.props.local.strings.endorsements.endorsementsList.addEndorsementModal;
    const titleText = this.props.endorsement ? titleEdit : title;

    return (
      <div className="add-item-view add-entity-form-small">
        <div className="add-item-header">
          <h1>{titleText}</h1>
        </div>

        <section className="white-section">
          <div className="add-item-form-subsection">
            <EndorsementInfoForm
              close={this.hideModal}
              onSubmit={this.send}
              endorsement={this.props.endorsement} />
          </div>
        </section>
      </div>
    );
  }
};

const mapStateToProps = (state) => {
  return {
    local: state.localization,
    endorsements: state.endorsements,
    common: state.common
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(actions, dispatch),
    commonActions: bindActionCreators(commonActions, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddEndorsements);
