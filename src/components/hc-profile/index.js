import React from 'react';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import { Modal } from 'react-bootstrap';
import _ from 'lodash';

import * as hcProfileActions from './actions';
import * as workFlowActions from './tabs/workflow/actions';
import * as registerActions from '../register/actions';
import * as commonActions from '../common/actions';
import AddHCModal from '../hiringclients/addHCModal';

import ProfileFrame from '../common/profile';
import Tabs from './tabs';
import Utils from '../../lib/utils';

import './hcprofile.css';

class HCProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false
    }
    const { hcId } = props.match.params;
    props.actions.fetchHCProfile(hcId);
    this.props.workFlowActions.setHcId(hcId);
    this.props.commonActions.setLastHiringClient(hcId);
    this.props.registerActions.fetchResources();
    this.props.actions.fetchScListForSelectComponent(hcId);

    this.onEditProfile = this.onEditProfile.bind(this);
    this.onCloseEditProfile = this.onCloseEditProfile.bind(this);
  }

  componentWillUnmount() {
    this.props.commonActions.setHeaderTitle('');
  }

  onCloseEditProfile(update) {
    if(update){
      const { hcId } = this.props.match.params;
      this.props.actions.fetchHCProfile(hcId);
    }

    this.setState({showModal: false});
  }

  onEditProfile() {
    this.setState({showModal: true});
  }

  render() {
    const {
      name,
      registrationUrl,
      address1,
      address2,
      city,
      state,
      phone,
      zipCode,
      logo,
      AllowApplications
    } = this.props.hcprofile.profileData;

    const sidebarInfo = {
      header: {
        logo: logo ? `data:image/jpeg;base64,${logo}` : 'http://via.placeholder.com/350x170'
      },
      sections: [
        {
          sectionTitle: name,
          subsections: [
            {
              label: 'Address 1',
              value: address1
            },
            {
              label: 'Url',
              value: registrationUrl
            },
            {
              label: 'Address 2',
              value: address2
            },
            {
              label: 'Phone Number',
              value: phone && Utils.formatPhoneNumber(phone)
            },
            {
              label: 'City',
              value: city && state && `${city}, ${state}`,
            },
            {
              label: 'Postal Code',
              value: zipCode
            }
          ]
        }
      ]
    };

    if (this.props.hcprofile.errorHCProfile) {
      return this.props.hcprofile.errorHCProfile;
    } else if (_.isEmpty(this.props.hcprofile.profileData)) {
      return (
        <div style={{ width:'100%', height:'200px', display: 'flex',
          alignItems: 'center', justifyContent: 'center' }}>
          <div className="spinner-wrapper">
            <div className="spinner" />
          </div>
        </div>
      );
    }

    return (
      <ProfileFrame
        frameTitle={'Hiring Clients'}
        sidebar={sidebarInfo}
        onEditProfile={this.onEditProfile}
      >
        <Tabs {...this.props} />
        <Modal
          show={this.state.showModal}
          onHide={this.onCloseEditProfile}
          className="add-item-modal add-hc">
          <Modal.Body className="add-item-modal-body">
            <AddHCModal close={this.onCloseEditProfile} profile={this.props.hcprofile.profileData}/>
          </Modal.Body>
        </Modal>
      </ProfileFrame>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    hcprofile: state.HCProfile
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(hcProfileActions, dispatch),
    workFlowActions: bindActionCreators(workFlowActions, dispatch),
    registerActions: bindActionCreators(registerActions, dispatch),
    commonActions: bindActionCreators(commonActions, dispatch)
  }
};


export default connect(mapStateToProps, mapDispatchToProps)(HCProfile);
