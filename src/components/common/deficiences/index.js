import React from 'react';
import { connect } from 'react-redux';
import * as actions from './actions/actions';
import * as types from './actions/types';
import { bindActionCreators } from 'redux';
import * as commonActions from './../../common/actions';

import DeficiencesMinor from './components/minor';
import DeficiencesMajor from './components/major';
import DeficiencesEndorsements from './components/endorsements';
import DeficiencesAccepted from './components/accepted';
import DeficiencesWaived from './components/waive';
import WaivedModal from './components/waived-modal';
import * as certificateActions from './../../certfocus/certificates/actions';


import Swal from 'sweetalert2';


class Deficiences extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      showAll: false,
      showModalWaived: false,
      titleShowAllBtn: 'Show All'
    }

  }

  componentDidMount() {
    const { projectInsuredId } = this.props.params;
    this.props.actions.fetchDeficiences(projectInsuredId);
  }

  actionConfirmAll() {
    this.props.actions.setSelectAllConfirm();
    Swal({
      title: "Confirm!",
      showCancelButton: true,
      type: 'warning',
      text: "Are you sure you want to Confirm All ?",
      icon: "success",
      button: "OK!",
    }).then((result) => {
      if (result.value) {
        this.confirmDeficiences();
      }
      else {
        this.props.actions.setUnSelectAllConfirm();
      }

    })
  }

  confirmDeficiences() {
    this.props.commonActions.setLoading(true);
    let projectInsuredID = this.props.certificatesList[0].ProjectInsuredID;
    let deficienciesToConfirm = this.props.deficiences.filter((x) => x.ProjectInsuredDeficiencyID != null);
    let deficienciesRemaining = this.props.deficiences;
    this.props.actions.fetchConfirmDeficiences(deficienciesToConfirm, projectInsuredID, deficienciesRemaining, () => {
      this.props.certificateActions.fetchCertificates(projectInsuredID);
      this.props.actions.fetchDeficiences(projectInsuredID);
      this.props.commonActions.setLoading(false);
    });
  }

  actionWaiverAll() {
    this.props.actions.setSelectAllWaiver();
    this.setState({ showModalWaived: true });
  }

  disableBtnConfirm() {
    return this.props.deficiences && this.props.deficiences.some(element => element.DeficiencyStatusID == 0);
  }

  actionShowAll() {
    let payload = { show: !this.props.showAll };
    this.setState({ titleShowAllBtn: !payload.show ? 'Show All' : 'Hidde All' });
    this.props.actions.setShowAll(payload);
  }

  hideWaivedModal = () => {
    this.setState({ showModalWaived: false });
  }

  showWaivedModal = () => {
    this.setState({ showModalWaived: true });
  }

  render() {
    const opacityConfirm = { opacity: this.disableBtnConfirm() ? '1' : '0.2' }
    const disableBtnConfirm = this.disableBtnConfirm();

    return (
      <div className="mb-5">
        <div className="row">
          <div className="col d-flex justify-content-center">
            <span><h5>Deficiencies</h5></span>
          </div>
        </div>
        <hr></hr>
        <div className="row mt-4">
          <div className="col-4">
            <button style={opacityConfirm} className="nav-btn nav-bn"
              disabled={!disableBtnConfirm}
              onClick={() => this.actionConfirmAll()}>Confirm All</button>
          </div>
          <div className="col-4">
            <button style={opacityConfirm} className="nav-btn nav-bn"
              disabled={!disableBtnConfirm}
              onClick={() => this.actionWaiverAll()}>Waiver All</button>
          </div>
          <div className="col-4">
            <button className="nav-btn nav-bn"
              onClick={() => this.actionShowAll()}>{this.state.titleShowAllBtn}</button>
          </div>
        </div>

        <div className="row mt-4">
          <div className="col">
            <DeficiencesMajor showWaivedModal={this.showWaivedModal} toggle={this.state.showAll} data={this.props.deficiences} />
          </div>
        </div>

        <div className="row mt-2">
          <div className="col">
            <DeficiencesMinor showWaivedModal={this.showWaivedModal} data={this.props.deficiences} />
          </div>
        </div>

        {/*<div className="row mt-2">
          <div className="col">
            <DeficiencesEndorsements showWaivedModal={this.showWaivedModal}  data={this.props.deficiences} />
          </div>
        </div>*/}

        <div className="row mt-2">
          <div className="col">
            <DeficiencesAccepted data={this.props.deficiences}></DeficiencesAccepted>
          </div>
        </div>

        <div className="row mt-2">
          <div className="col">
            <DeficiencesWaived data={this.props.deficiences}></DeficiencesWaived>
          </div>
        </div>

        <WaivedModal showModalWaived={this.state.showModalWaived} closeModalWaived={this.hideWaivedModal}></WaivedModal>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    deficiences: state.deficiences.deficiencesList,
    showAll: state.deficiences.showAll,
    certificatesList: state.certificates.certificatesList
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(actions, dispatch),
    commonActions: bindActionCreators(commonActions, dispatch),
    certificateActions: bindActionCreators(certificateActions, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Deficiences);