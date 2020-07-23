import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Modal } from 'react-bootstrap';
import _ from 'lodash';

import AddHolderModal from '../modals/addHolderModal';
import HolderInfo from './HolderInfo';
import Tabs from './tabs';

import * as holdersProfileActions from './actions';
import * as registerActions from '../../register/actions';
import * as commonActions from '../../common/actions';

import './holdersProfile.css';

class HoldersProfile extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showModal: false
    };
  }

  componentDidMount() {
    const { holderId } = this.props.match.params;
    this.props.actions.fetchHolderProfile(holderId);
    this.props.registerActions.fetchResources();
  }

  componentWillUnmount() {
    this.props.commonActions.setHeaderTitle('');
  }

  componentDidUpdate() {
    if (this.props.holderProfile.profileData) {
      this.setBreadcrumb();
     }
  }
  
  onCloseEditProfile = (update) => {
    if(update){
      const { holderId } = this.props.match.params;
      this.props.actions.fetchHolderProfile(holderId);
    }

    this.setState({ showModal: false });
  }

  onEditProfile = () => {
    this.setState({ showModal: true });
  }

  setBreadcrumb = () => {
    this.props.commonActions.setBreadcrumbItems([
      {
        pathName: this.props.holderProfile.profileData.name,
        hrefName: window.location.pathname
      }
    ]);
  }

  render() {
    return (
      <div className="holders-profile">
        <Modal
          show={this.state.showModal}
          onHide={this.onCloseEditProfile}
          className="add-item-modal add-hc"
        >
          <Modal.Body className="add-item-modal-body mt-0">
            <AddHolderModal
              onHide={this.onCloseEditProfile}
              close={this.onCloseEditProfile}
              profile={this.props.holderProfile.profileData}
            />
          </Modal.Body>
        </Modal>

        <div className="container-fluid">
          <HolderInfo
            holderProfile={this.props.holderProfile}
            onEditProfile={this.onEditProfile}
          />

          {!_.isEmpty(this.props.holderProfile.profileData) &&
            <Tabs />
          }
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    holderProfile: state.holdersProfile,
    local: state.localization,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(holdersProfileActions, dispatch),
    registerActions: bindActionCreators(registerActions, dispatch),
    commonActions: bindActionCreators(commonActions, dispatch)
  }
};


export default connect(mapStateToProps, mapDispatchToProps)(HoldersProfile);
