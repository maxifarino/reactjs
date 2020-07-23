import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import RequirementSetInfoForm from './form';

import * as requirementSetActions from '../../requirement-sets/actions';
import * as commonActions from '../../../common/actions';

import '../addEntityModal.css';

class AddRequirementSet extends Component {
  send = (values) => {
    const { requirementSet, holderId } = this.props;

    const serializedObj = {
      ...values,
      archived: values.archived ? 1 : 0,
      template: values.template ? 1 : 0,
      holderId: values.holderId.value ? values.holderId.value : holderId,
      ...(requirementSet ? { requirementSetId: requirementSet.Id } : {}),
    };

    this.props.actions.sendRequirementSet(serializedObj, this.props.close);
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
    } = this.props.local.strings.holderRequirementSets.list.addModal;

    const titleText = this.props.requirementSet ? titleEdit : title;

    return (
      <div className="add-item-view add-entity-form-small">
        <div className="add-item-header">
          <h1>{titleText}</h1>
        </div>

        <section className="white-section">
          <div className="add-item-form-subsection">
            <RequirementSetInfoForm
              close={this.hideModal}
              onSubmit={this.send}
              fromHolderTab={this.props.fromHolderTab}
              holderId={this.props.holderId}
              requirementSet={this.props.requirementSet}
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
    actions: bindActionCreators(requirementSetActions, dispatch),
    commonActions: bindActionCreators(commonActions, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddRequirementSet);
