import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Modal } from 'react-bootstrap';
import _ from 'lodash';

import Tabs from './tabs';
import EditInsuredModal from '../modals/addInsuredModal';
import AddTagsToInsuredModal from './modals/AddTagsToInsuredModal';
import InsuredInfo from './InsuredInfo';

import * as commonActions from '../../common/actions';
import * as insuredViewActions from './actions';

import './InsuredView.css';

class InsuredView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showModal: null,
    };
  }

  componentDidMount() {
    const { insuredId, holderId, holderName } = this.props.match.params;    
    this.props.actions.setHolderSelected({ 'id': holderId, 'name': holderName });
    this.props.actions.fetchInsured(insuredId);
    this.props.actions.fetchInsuredTags(insuredId);

    if (this.props.common.countries.length <= 0) {
      this.props.commonActions.fetchCountries();
    }

  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.currentTabSelected) {
      this.setState({
        currentTab: nextProps.currentTabSelected
      });
    }
  }

  onClose = () => {
    this.setState({ showModal: null });
  }

  onCloseEditAndRefresh = () => {
    const { insuredId } = this.props.match.params;

    this.props.actions.fetchInsured(insuredId);

    this.setState({ showModal: null });
  }

  deleteTag = (tag) => {
    this.props.actions.sendTag(tag, false);
  }

  openModal = (modal) => {
    this.setState({ showModal: modal });
  }

  renderModal = () => {
    const { showModal } = this.state;

    switch (showModal) {
      case 'tags':
        return <AddTagsToInsuredModal
          close={this.onClose}
        />;
      case 'edit':
        return <EditInsuredModal
          close={this.onCloseEditAndRefresh}
          onHide={this.onClose}
          profile={this.props.insuredDetails.insuredData}
        />;
      default:
        return null;
    }
  }





  render() {



    if (this.props.insuredDetails.fetching || !this.props.login.profile.Id) {
      return (
        <div className="spinner-wrapper">
          <div className="spinner mb-4" />
        </div>
      );
    }


    const modalClass = this.state.showModal === 'tags' ? 'add-item-modal add-entity-medium' : 'add-item-modal add-hc';


    return (
      <div className="insured-view">
        {/* MODAL */}
        <Modal
          show={this.state.showModal ? true : false}
          onHide={this.onClose}
          className={modalClass}>
          <Modal.Body className={this.state.showModal === 'edit' && 'add-item-modal-body mt-0'}>
            {this.renderModal()}
          </Modal.Body>
        </Modal>

        <div className="container-fluid">
          <InsuredInfo
            insuredDetails={this.props.insuredDetails}
            deleteTag={this.deleteTag}
            openModal={this.openModal}
          />

          {!_.isEmpty(this.props.insuredDetails.insuredData) &&
            <Tabs insuredData={this.props.insuredDetails.insuredData} />
          }
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    insuredDetails: state.insuredDetails,
    local: state.localization,
    login: state.login,
    common: state.common,
    currentTabSelected: state.insuredDetails.tagSelected
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(insuredViewActions, dispatch),
    commonActions: bindActionCreators(commonActions, dispatch)
  }
};


export default connect(mapStateToProps, mapDispatchToProps)(InsuredView);
