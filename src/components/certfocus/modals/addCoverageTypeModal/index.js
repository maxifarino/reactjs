import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import CoverageTypeInfoForm from './form';

import * as coverageTypesActions from '../../settings/coverageTypes/actions';
import * as commonActions from '../../../common/actions';

import '../addEntityModal.css';

class AddCoverageType extends Component {
  send = (values) => {
    const { coverage } = this.props;

    const serializedObj = {
      ...values,
      ...(coverage ? { coverageTypeId: coverage.CoverageTypeID } : {}),
    };

    this.props.actions.sendCoverageTypes(serializedObj, this.props.close);
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
    } = this.props.local.strings.coverageTypes.addModal;

    const titleText = this.props.coverage ? titleEdit : title;

    return (
      <div className="add-item-view add-entity-form-small">
        <div className="add-item-header">
          <h1>{titleText}</h1>
        </div>

        <section className="white-section">
          <div className="add-item-form-subsection">
            <CoverageTypeInfoForm
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

export default connect(mapStateToProps, mapDispatchToProps)(AddCoverageType);
