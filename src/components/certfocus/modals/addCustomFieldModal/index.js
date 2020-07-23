import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import CustomFieldInfoForm from './form';

import * as customFieldsActions from '../../holders-profile/tabs/custom-fields/actions';
import * as commonActions from '../../../common/actions';

import '../addEntityModal.css';

class AddCustomFieldModal extends React.Component {
  send = (values) => {
    const payload = {
      holderId: Number(this.props.holderId),
      customFieldId: this.props.customField ? this.props.customField.CustomFieldId : undefined,
      customFieldName: values.name,
      fieldTypeId: values.type,
      fieldOptions: Number(values.type) === 2 ? values.values : null,
      displayOrder: Number(values.order),
      archived: values.archived ? 1 : 0,
    }

    this.props.commonActions.setLoading(true);
    this.props.actions.postCustomField (payload, (customField) => {
      this.props.commonActions.setLoading(false);
      if(customField){
        this.props.close();
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
    } = this.props.local.strings.customFields.addCustomFieldModal;
    const titleText = this.props.customField ? titleEdit : title;

    return (
      <div className="add-item-view add-entity-form-small">
        <div className="add-item-header">
          <h1>{titleText}</h1>
        </div>

        <section className="white-section">
          <div className="add-item-form-subsection">
            <CustomFieldInfoForm
              close={this.hideModal}
              onSubmit={this.send}
              customField={this.props.customField}
            />
          </div>
        </section>
      </div>
    );
  }
};

const mapStateToProps = (state, ownProps) => {
  return {
    local: state.localization,
    customFields: state.customFields,
    common: state.common
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(customFieldsActions, dispatch),
    commonActions: bindActionCreators(commonActions, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddCustomFieldModal);
