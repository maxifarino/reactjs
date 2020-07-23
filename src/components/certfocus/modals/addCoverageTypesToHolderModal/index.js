import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import CoverageTypeAndHolerInfoForm from './form';

import * as coverageTypesActions from '../../coverage-types/actions';
import * as commonActions from '../../../common/actions';

import '../addEntityModal.css';

class AddCoverageTypesToHolder extends Component {
  send = (values) => {
    const { holderId } = this.props;

    const serializedObj = {
      coverageTypeId: values.coverage.value,
      displayOrder: values.displayOrder,
      holderId,
    };

    this.props.actions.sendCoverageTypesAndHolder(serializedObj, this.props.close);
  };

  hideModal = () => {
    const { onHide, close } = this.props;
    if (onHide) onHide();
    else close();
  }

  render() {
    const {
      title,
    } = this.props.local.strings.coverageTypes.addModal;

    return (
      <div className="add-item-view add-entity-form-small">
        <div className="add-item-header">
          <h1>{title}</h1>
        </div>

        <section className="white-section">
          <div className="add-item-form-subsection">
            <CoverageTypeAndHolerInfoForm
              close={this.hideModal}
              onSubmit={this.send}
              coverage={this.props.coverage}
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
    actions: bindActionCreators(coverageTypesActions, dispatch),
    commonActions: bindActionCreators(commonActions, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddCoverageTypesToHolder);
