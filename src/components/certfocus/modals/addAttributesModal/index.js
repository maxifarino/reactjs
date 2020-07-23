import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import AddAttributesForm from './form';
import * as actions from '../../settings/coverageTypes/actions';
import * as commonActions from '../../../common/actions';
import '../addEntityModal.css';

class AddAttributesModal extends Component {
  
  componentDidMount() {
  }

  send = (values) => {
    const { setLoading } = this.props.commonActions;
    const { coverageTypeId } = this.props;    
    const payload = {
      attributeId: this.props.attribute ? this.props.attribute.AttributeID : undefined,
      attributeName: values.attributeName,
      archived: values.archived ? 1 : 0,
      coverageTypeId: coverageTypeId,
    }
    //console.log('PAY', payload);
    setLoading(true);
    this.props.actions.postAttribute(payload, (success) => {
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
    } = this.props.local.strings.coverageTypes.attributes.addAttributeModal;

    const text = this.props.attribute ? titleEdit : title;

    return (
      <div className="add-item-view add-entity-form-small">
        <div className="add-item-header">
          <h1>{text}</h1>
        </div>
        <section className="white-section">
          <div className="add-item-form-subsection">
            <AddAttributesForm
              attribute={this.props.attribute}
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

export default connect(mapStateToProps, mapDispatchToProps)(AddAttributesModal);
