import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import TagInfoForm from './form';

import * as tagsActions from '../../holders-profile/tabs/tags/actions';
import * as commonActions from '../../../common/actions';
import '../addEntityModal.css';

class AddTagModal extends React.Component {
  send = (values) => {
    const payload = {
      CFHolderId: parseInt(this.props.holderId,10),
      tagId: this.props.tag? this.props.tag.id:undefined,
      tagName: values.name,
      CFdisplayOrder: parseInt(values.order,10),
      CFdeletedFlag: values.archived?1:0
    }

    this.props.commonActions.setLoading(true);
    this.props.actions.postTag (payload, (tag) => {
      this.props.commonActions.setLoading(false);
      if(tag){
        this.props.close();
      }
    });

  };

  hideModal = () => {
    const { onHide, close } = this.props;
    if(onHide)onHide();
    else close();
  }

  render() {
    const {
      title, titleEdit
    } = this.props.local.strings.tags.addTagModal;
    const titleText = this.props.tag? titleEdit:title;

    return (
      <div className="add-item-view add-entity-form-small">
        <div className="add-item-header">
          <h1>{titleText}</h1>
        </div>

        <section className="white-section">
          <div className="add-item-form-subsection">
            <TagInfoForm
              close={this.hideModal}
              onSubmit={this.send}
              tag={this.props.tag} />
          </div>
        </section>
      </div>
    );
  }
};

const mapStateToProps = (state, ownProps) => {
  return {
    local: state.localization,
    tags: state.tags,
    common: state.common
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(tagsActions, dispatch),
    commonActions: bindActionCreators(commonActions, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddTagModal);
